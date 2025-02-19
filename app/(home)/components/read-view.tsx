import { Button } from '@/components/ui/button';
import { Reply, Trash2 } from 'lucide-react';
import { deleteEmail } from '../../actions/email';

export default function ReadView({ email }: { email: any }) {
  const handleEmailDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Preventing email selection
    try {
      await deleteEmail(email.id);
      location.reload();
    } catch (error) {
      console.error('Error updating pin status:', error);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{email.subject}</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Reply className="h-4 w-4" />
          </Button>
          <Button onClick={handleEmailDelete} variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <img
          src={email.sender.image || '/placeholder.svg'}
          alt=""
          className="h-10 w-10 rounded-full"
        />
        <div>
          <div className="font-semibold">{email.sender.name}</div>
          <div className="font-semibold">{email.from}</div>
          <div className="text-sm text-muted-foreground">{email.time}</div>
        </div>
      </div>
      <div className="whitespace-pre-wrap rounded-md bg-gray-50 p-4">
        {email.content}
      </div>
    </div>
  );
}
