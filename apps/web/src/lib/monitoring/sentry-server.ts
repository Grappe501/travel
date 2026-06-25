import * as Sentry from '@sentry/nextjs';
import { getSentryDsn, getSentryEnvironment, isSentryEnabled } from '@/lib/monitoring/config';

let serverInitialized = false;

export function initSentryServer(): void {
  if (serverInitialized || typeof window !== 'undefined') return;

  const dsn = getSentryDsn();
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: getSentryEnvironment(),
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers.cookie;
        delete event.request.headers.authorization;
      }
      return event;
    },
  });

  serverInitialized = true;
}

export function captureException(error: unknown, context?: Record<string, string>): string | undefined {
  if (!isSentryEnabled()) return undefined;

  initSentryServer();
  return Sentry.captureException(error, context ? { extra: context } : undefined);
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): string | undefined {
  if (!isSentryEnabled()) return undefined;

  initSentryServer();
  return Sentry.captureMessage(message, level);
}
