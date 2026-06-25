import { Suspense } from 'react';
import { ShellPage } from '@/components/layout/ShellPage';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoadingState } from '@/components/ui';

export default function LoginPage() {
  return (
    <ShellPage title="Log in" description="Sign in to manage trips and receipts.">
      <Suspense fallback={<LoadingState label="Loading form…" size="sm" />}>
        <LoginForm />
      </Suspense>
    </ShellPage>
  );
}
