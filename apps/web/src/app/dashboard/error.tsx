'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Alert, Button } from '@/components/ui';
import { captureClientException } from '@/lib/monitoring/sentry-client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureClientException(error);
  }, [error]);

  return (
    <DashboardShell title="Dashboard" description="We hit a problem loading your overview.">
      <Alert variant="error">
        Something went wrong loading the dashboard. If this is a new deploy, the database may need
        migrations (`pnpm db:migrate:deploy` with production `DIRECT_URL`).
      </Alert>
      <p className="text-caption text-muted">
        You can still open{' '}
        <Link href="/settings" className="text-primary hover:underline">
          Settings
        </Link>
        ,{' '}
        <Link href="/businesses" className="text-primary hover:underline">
          Businesses
        </Link>
        , or{' '}
        <Link href="/onboarding" className="text-primary hover:underline">
          Onboarding
        </Link>
        .
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </DashboardShell>
  );
}
