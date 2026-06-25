import type { Metadata } from 'next';
import { OfflineProvider } from '@/components/offline/OfflineProvider';
import { SentryInit } from '@/components/monitoring/SentryInit';
import { env } from '@/lib/env';
import { fontSans } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: 'Every mile. Every receipt. Every deduction.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body className={fontSans.className}>
        <SentryInit />
        <OfflineProvider>{children}</OfflineProvider>
      </body>
    </html>
  );
}
