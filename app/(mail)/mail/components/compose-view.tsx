'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { sendEmail } from '../../actions/email';

export function ComposeView() {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSending(true);
    try {
      const result = await sendEmail(formData);
      if (!result.success) {
        toast.error('An Error has occured, please try again.');
        return;
      }

      toast.success('Email sent successfully');
      router.push('/mail');
    } catch (error) {
      toast.error('Failed to send Email');
    } finally {
      setSending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={sending}
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Input
          name="to"
          placeholder="To (separate multiple emails with commas)"
          className="border-0 border-b px-0 focus-visible:ring-0"
          required
        />
        <Input
          name="subject"
          placeholder="Add a subject"
          className="border-0 border-b px-0 focus-visible:ring-0"
          required
        />
      </div>
      <Textarea
        name="content"
        placeholder="Type your message here..."
        className="min-h-[200px] resize-none border-0 focus-visible:ring-0"
        required
      />
    </form>
  );
}
