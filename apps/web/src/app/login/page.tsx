import Link from 'next/link';
import { Suspense } from 'react';
import { AuthSetupAlert } from '@/components/auth/AuthSetupAlert';
import { ShellPage } from '@/components/layout/ShellPage';
import { LoginForm } from '@/components/auth/LoginForm';
import { Alert, LoadingState } from '@/components/ui';
import { isPublicBetaMode } from '@/lib/auth/beta';

export default function LoginPage() {
  const betaMode = isPublicBetaMode();

  return (
    <ShellPage
      title="Log in"
      description="Sign in to manage trips and receipts."
      eyebrow="Welcome back"
      auth
    >
      <AuthSetupAlert />
      {betaMode ? (
        <Alert variant="info">
          Field testers: use the{' '}
          <Link href="/beta/login" className="font-medium text-primary hover:underline">
            field test login
          </Link>{' '}
          with your email and the shared access code.
        </Alert>
      ) : null}
      <Suspense fallback={<LoadingState label="Loading form…" size="sm" />}>
        <LoginForm />
      </Suspense>
    </ShellPage>
  );
}
