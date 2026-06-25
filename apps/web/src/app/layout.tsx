import type { Metadata } from 'next';
import { OfflineProvider } from '@/components/offline/OfflineProvider';
import { SentryInit } from '@/components/monitoring/SentryInit';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { env } from '@/lib/env';
import { fontSans } from '@/lib/fonts';
import { THEME_STORAGE_KEY } from '@/lib/theme/appearance';
import './globals.css';

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: 'Every mile. Every receipt. Every deduction.',
};

const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var v=t==='light'||t==='dark'||t==='system'?t:'system';document.documentElement.setAttribute('data-theme',v);}catch(e){document.documentElement.setAttribute('data-theme','system');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={fontSans.className}>
        <SentryInit />
        <ThemeProvider>
          <OfflineProvider>{children}</OfflineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
