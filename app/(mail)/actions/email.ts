'use server';

import { authOptions } from '@/config/auth';
import { db } from '@/prisma/db';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { z } from 'zod';

const emailSchema = z.object({
  to: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: any) {
  try {
    // Getting current user's email
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return {
        data: null,
        status: 401,
        message: 'Not authenticated',
      };
    }

    console.log('Session Check Passed ✅');

    console.log('Form Data: ', formData);

    const validatedData = emailSchema.parse(formData);

    // Validate recipient emails
    const invalidEmails = validatedData.to.filter((email) => {
      return !email.endsWith('@gmail.com') && !email.endsWith('@outlook.com');
    });

    if (invalidEmails.length > 0) {
      return {
        data: null,
        status: 400,
        message: `Invalid email addresses: ${invalidEmails.join(', ')}. Only gmail.com and outlook.com addresses are accepted.`,
      };
    }
    console.log('Invalid Email Check Passed ✅');

    // Check if recipients exist in database
    const recipients = await db.user.findMany({
      where: {
        email: {
          in: validatedData.to,
        },
      },
    });

    if (recipients.length !== validatedData.to.length) {
      const existingEmails = recipients.map((r) => r.email);
      const nonExistentEmails = validatedData.to.filter(
        (email) => !existingEmails.includes(email),
      );
      return {
        data: null,
        status: 400,
        message: `The following recipients are not registered: ${nonExistentEmails.join(', ')}`,
      };
    }

    console.log('Recipients Check Passed ✅');

    // Create email in database
    const email = await db.email.create({
      data: {
        from: session.user.email,
        to: validatedData.to,
        subject: validatedData.subject,
        content: validatedData.content,
        preview: validatedData.content.slice(0, 100) + '...',
        section: 'Today',
        receivers: {
          connect: recipients.map((recipient) => ({
            id: recipient.id,
          })),
        },
      },
    });

    // Sending the actual email using Resend
    await resend.emails.send({
      from: 'Outlook Clone <email@mosespace.com>',
      to: validatedData.to,
      subject: validatedData.subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0078d4; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">New Message</h1>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <p style="color: #666;">From: ${session.user.email}</p>
            <p style="color: #666;">To: ${validatedData.to.join(', ')}</p>
            <h2 style="color: #333;">${validatedData.subject}</h2>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 15px;">
              ${validatedData.content}
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              Sent via Outlook Clone by Kisakye Moses @DESISHUB
            </p>
          </div>
        </div>
      `,
    });

    console.log('Email Created Passed ✅');

    revalidatePath('/mail');
    return {
      data: email,
      status: 201,
      message: 'Email sent successfully',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid form data' };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Something went wrong' };
  }
}

export async function getEmails(folder: 'inbox' | 'sent' | 'draft' = 'inbox') {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    const emails = await db.email.findMany({
      where:
        folder === 'sent'
          ? { from: session.user.email }
          : { to: { has: session.user.email } },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: emails,
      message: 'Email Fetched back successfully',
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch emails' };
  }
}

export async function markEmailAsRead(emailId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    await db.email.update({
      where: { id: emailId },
      data: { isRead: true },
    });

    revalidatePath('/mail');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to mark email as read' };
  }
}

export async function togglePinEmail(emailId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    const email = await db.email.findUnique({
      where: { id: emailId },
    });

    if (!email) {
      throw new Error('Email not found');
    }

    await db.email.update({
      where: { id: emailId },
      data: { isPinned: !email.isPinned },
    });

    revalidatePath('/mail');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to toggle pin status' };
  }
}

export async function deleteEmail(emailId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    await db.email.delete({
      where: { id: emailId },
    });

    revalidatePath('/mail');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete email' };
  }
}

export async function getCurrentUserEmails() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    const emails = await db.email.findMany({
      where: {
        OR: [{ from: session.user.email }, { to: { has: session.user.email } }],
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: emails,
      message: 'Emails fetched successfully',
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch emails' };
  }
}
