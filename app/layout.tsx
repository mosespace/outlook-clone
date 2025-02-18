import type { Metadata } from 'next';
import { Rethink_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';
import { authOptions } from '@/config/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
// import FooterBanner from "@/components/Footer";
const inter = Rethink_Sans({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Ronix Fit Savers',
  description: 'Join Ronix Savings Group',
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await getServerSession(authOptions);
  // if (sessionData) {
  //   redirect('/mail');
  // }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
