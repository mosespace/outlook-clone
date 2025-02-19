import { Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';

export default async function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-[#f5f5f5] mx-auto">
      {/* Small Screen Message */}
      <div className="md:hidden">
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 text-center">
          <Smartphone className="w-20 h-20 mb-6 animate-bounce" />
          <h1 className="text-4xl font-bold mb-4">Desktop View Required</h1>
          <p className="text-xl mb-6 font-light">
            Our email client requires a larger screen for optimal functionality.
          </p>
          <div className="space-y-2 text-gray-100">
            <p className="text-lg">📱 Currently viewing on a mobile device</p>
            <p className="text-lg">💻 Please switch to a desktop or tablet</p>
          </div>
          <div className="mt-8 text-sm text-blue-200">
            Recommended minimum screen width: 768px
          </div>
        </div>
      </div>

      {/* Content for medium and large screens */}
      <div className="hidden md:block">{children}</div>
    </div>
  );
}
