import React from 'react';
import EmailClient from './components/email-client';
import { getCurrentUserEmails } from '@/actions/email';

export default async function page() {
  const emailsData = await getCurrentUserEmails();
  const emails = emailsData?.data ?? [];

  // console.log('Emails:', emails);

  return <EmailClient emails={emails} />;
}
