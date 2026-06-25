'use client';

import { useEffect } from 'react';
import { captureClientException } from '@/lib/monitoring/sentry-client';

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-foreground">
        <h1 className="text-page-title">Something went wrong</h1>
        <p className="max-w-md text-center text-body text-muted">
          We logged the error. Try again, or contact support if the problem continues.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
