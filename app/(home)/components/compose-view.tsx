'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { toast } from 'sonner';
import { sendEmail } from '@/actions/email';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ComposeView() {
  const [recipients, setRecipients] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  function removeRecipient(index: number): void {
    setRecipients(recipients.filter((_, i) => i !== index));
  }

  function addRecipient(value: string) {
    if (value.trim()) {
      setRecipients([...recipients, value.trim()]);
    }
  }

  const router = useRouter();

  const handleSend = async () => {
    // Send email
    const formData = {
      to: recipients,
      subject: subject,
      content: message,
    };
    console.log('Form Data:', formData);

    if (formData.to.length === 0) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setLoading(true);
      const req = await sendEmail(formData);

      if (req.status === 201) {
        toast.success(`${req.message}`);
        // router.refresh();
      } else {
        toast.error(`${req.message}`);
      }
    } catch (error) {
      toast.error(`Something went wrong, check your internet connectivity`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Button
            disabled={loading}
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Send later</DropdownMenuItem>
              <DropdownMenuItem>Schedule send</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </form>
      </div>
      <div className="space-y-2">
        {/* Email Recipients Input */}
        <div className="flex flex-wrap gap-2 border-0 border-b px-0 py-2">
          {recipients.map((recipient, index) => (
            <div
              key={index}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1"
            >
              <span>{recipient}</span>
              <button
                onClick={() => removeRecipient(index)}
                className="text-blue-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <input
            type="email"
            placeholder="To"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue) {
                addRecipient(inputValue);
                setInputValue('');
              }
            }}
            className="flex-1 border-0 focus:ring-0 focus:outline-none bg-transparent outline-none"
          />
        </div>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Add a subject"
          className="flex-1 border-0 focus:ring-0 focus:outline-none bg-transparent outline-none"
        />
      </div>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="min-h-[200px] resize-none border-0 focus-visible:ring-0"
      />
    </div>
  );
}
