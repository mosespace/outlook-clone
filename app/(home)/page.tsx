import React from 'react';
import EmailClient from './components/email-client';
import { getCurrentUserEmails } from '@/actions/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';
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
