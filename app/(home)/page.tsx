import { getCurrentUserEmails } from '@/actions/email';
import { authOptions } from '@/config/auth';
import { getServerSession } from 'next-auth';
import EmailClient from './components/email-client';
import { redirect } from 'next/navigation';

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const emailsData = await getCurrentUserEmails();
  const emails = emailsData?.data ?? [];

  // console.log('Emails:', emails);

  return <EmailClient emails={emails} />;
}
