import ForgotPasswordForm from '@/components/Forms/ForgotPasswordForm';
import { GridBackground } from '@/components/reusable-ui/grid-background';
import { authOptions } from '@/config/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/');
  }
  return (
    <GridBackground>
      <div className="px-4">
        <ForgotPasswordForm />
      </div>
    </GridBackground>
  );
}
