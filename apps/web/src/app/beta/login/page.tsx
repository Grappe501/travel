import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { BetaLoginForm } from '@/components/auth/BetaLoginForm';
import { ShellPage } from '@/components/layout/ShellPage';
import { LoadingState } from '@/components/ui';
import { isBetaLoginConfigured } from '@/lib/auth/beta';

export const dynamic = 'force-dynamic';

export default function BetaLoginPage() {
  if (!isBetaLoginConfigured()) {
    redirect('/login');
  }

  return (
    <ShellPage
      title="Field test login"
      description="Sign in with your email and the shared access code from your coordinator."
      eyebrow="Beta program"
      auth
    >
      <Suspense fallback={<LoadingState label="Loading…" size="sm" />}>
        <BetaLoginForm />
      </Suspense>
    </ShellPage>
  );
}
