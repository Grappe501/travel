import { NextResponse } from 'next/server';
import { captureException, isSentryEnabled } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';

/**
 * Sends a test error to Sentry when SENTRY_TEST_ENABLED=1 and SENTRY_DSN is set.
 * Use in staging only — disable in production unless verifying a new DSN.
 */
export async function POST() {
  if (process.env.SENTRY_TEST_ENABLED !== '1') {
    return NextResponse.json({ error: 'Sentry test route disabled' }, { status: 404 });
  }

  if (!isSentryEnabled()) {
    return NextResponse.json({ error: 'SENTRY_DSN not configured' }, { status: 503 });
  }

  const error = new Error('Sentry test error (MEC-V1-S018 / STEP-050)');
  const eventId = captureException(error, { source: 'health/sentry-test' });

  return NextResponse.json({
    sent: true,
    eventId: eventId ?? null,
    message: 'Check Sentry dashboard for the test error',
  });
}
