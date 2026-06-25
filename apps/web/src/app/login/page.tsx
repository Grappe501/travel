import { Suspense } from 'react';
import { ShellPage } from '@/components/layout/ShellPage';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <ShellPage title="Log in" description="Sign in to manage trips and receipts.">
      <Suspense fallback={<p className="mt-8 text-sm text-slate-500">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </ShellPage>
  );
}
