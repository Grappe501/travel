import { env } from '@/lib/env';

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return value.includes('...') || value.includes('your-') || value.includes('example.com');
}

export function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ??
    `${env.NEXT_PUBLIC_APP_NAME} <onboarding@resend.dev>`;

  return {
    apiKey: apiKey ?? '',
    from,
    appName: env.NEXT_PUBLIC_APP_NAME,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    isConfigured: Boolean(apiKey && !isPlaceholder(apiKey)),
  };
}
