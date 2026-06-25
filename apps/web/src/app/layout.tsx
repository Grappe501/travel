import type { Metadata } from 'next';
import { SentryInit } from '@/components/monitoring/SentryInit';
import { env } from '@/lib/env';
import './globals.css';

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: 'Every mile. Every receipt. Every deduction.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SentryInit />
        {children}
      </body>
    </html>
  );
}
