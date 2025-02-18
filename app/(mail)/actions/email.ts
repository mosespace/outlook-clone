'use server';

import { authOptions } from '@/config/auth';
import { db } from '@/prisma/db';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const emailSchema = z.object({
  to: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
});

export async function sendEmail(formData: FormData) {
  try {
    // Getting current user's email
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Not authenticated');
    }

    const rawData = {
      to: formData
        .get('to')
        ?.toString()
        .split(',')
        .map((email) => email.trim()),
      subject: formData.get('subject')?.toString(),
      content: formData.get('content')?.toString(),
    };

    const validatedData = emailSchema.parse(rawData);

    // Validate recipient emails
    const invalidEmails = validatedData.to.filter((email) => {
      return !email.endsWith('@gmail.com') && !email.endsWith('@outlook.com');
    });

    if (invalidEmails.length > 0) {
      throw new Error(
        `Invalid email addresses: ${invalidEmails.join(', ')}. Only gmail.com and outlook.com addresses are accepted.`,
      );
    }

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
      throw new Error(
        `The following recipients are not registered: ${nonExistentEmails.join(', ')}`,
      );
    }

    // Create email in database
    const email = await db.email.create({
      data: {
        from: session.user.email,
        to: validatedData.to,
        subject: validatedData.subject,
        content: validatedData.content,
        preview: validatedData.content.slice(0, 100) + '...',
        section: 'Today',
        sender: {
          connect: {
            email: session.user.email as any,
          },
        },
        receivers: {
          connect: recipients.map((recipient) => ({
            id: recipient.id,
          })),
        },
      },
    });

    revalidatePath('/mail');
    return { success: true, email };
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

    return { success: true, emails };
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
