import React from 'react';
import { getCurrentUserEmails, getEmails } from '../actions/email';
import EmailClient from './components/email-client';

export default async function page() {
  const emailsData = await getCurrentUserEmails();
  const emails = emailsData?.data ?? [];

  // console.log('Emails:', emails);

  return <EmailClient emails={emails} />;
}
