'use client';

import { Button } from '@/components/ui/button';
import { convertIsoToDateString } from '@/lib/convertISODateToNorma';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { markEmailAsRead, togglePinEmail } from '../../actions/email';

export default function EmailItem({
  email,
  selected,
  onSelect,
}: {
  email: any;
  selected: boolean;
  onSelect: () => void;
}) {
  const [isPinned, setIsPinned] = useState(email.isPinned);

  const handleEmailClick = async () => {
    onSelect();
    if (!email.isRead) {
      try {
        await markEmailAsRead(email.id);
      } catch (error) {
        console.error('Error updating email:', error);
      }
    }
  };

  const handlePinClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Preventing email selection
    try {
      await togglePinEmail(email.id);
      setIsPinned(!isPinned);
    } catch (error) {
      console.error('Error updating pin status:', error);
    }
  };

  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(convertIsoToDateString(email?.createdAt));
  }, [email?.createdAt]);

  return (
    <div
      onClick={handleEmailClick}
      className={`flex cursor-pointer w-full gap-4 border-b p-3 text-left transition-colors hover:bg-gray-50 ${
        selected ? 'bg-blue-50' : ''
      }`}
    >
      <img
        src={email?.sender.image || '/placeholder.svg'}
        alt=""
        className="h-10 w-10 rounded-full"
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className={`${email.isRead ? 'font-semibold' : ''}`}>
            {email.sender.name}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePinClick}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Star
                className={`h-4 w-4 ${
                  isPinned ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                }`}
              />
            </button>
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
        </div>
        {/* Rest of the component remains the same */}
        <div className={`${email.isRead ? 'font-semibold' : ''}`}>
          {email.subject}
        </div>
        {email?.labels?.length > 0 && (
          <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
            {email.labels}
          </span>
        )}
        <div className="text-sm text-muted-foreground">{email.preview}</div>
        {email.calendar && (
          <div className="mt-2 flex items-center justify-between rounded border p-2 text-sm">
            <span>{email.calendar.date}</span>
            <Button variant="link" className="h-auto p-0 text-blue-600">
              {email.calendar.action}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
