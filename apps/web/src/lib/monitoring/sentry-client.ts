'use client';

import * as Sentry from '@sentry/nextjs';

let clientInitialized = false;

export function initSentryClient(): void {
  if (clientInitialized || typeof window === 'undefined') return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || dsn.includes('...') || dsn.includes('placeholder')) return;

  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
    sendDefaultPii: false,
  });

  clientInitialized = true;
}

export function captureClientException(error: unknown): string | undefined {
  initSentryClient();
  if (!clientInitialized) return undefined;
  return Sentry.captureException(error);
}
