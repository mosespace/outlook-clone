import Providers from '@/components/Providers';
import { authOptions } from '@/config/auth';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Rethink_Sans } from 'next/font/google';
import { redirect } from 'next/navigation';
import './globals.css';

const inter = Rethink_Sans({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Outlook Clone',
  description: 'crafted with love by Kisakye Moses',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
