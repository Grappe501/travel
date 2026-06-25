'use client';

import { type LoginInput } from '@mileage-copilot/shared';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { completeClientSignIn } from '@/lib/auth/complete-client-sign-in';
import { signInOnClient } from '@/lib/auth/client-sign-in';
import { Alert, Button, Input } from '@/components/ui';

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/dashboard';
  const sessionError = searchParams.get('error') === 'session_missing';

  const [form, setForm] = useState<LoginInput>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(
    sessionError ? 'Your session was not saved. Please sign in again.' : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const signIn = await signInOnClient(form.email, form.password);
      if ('error' in signIn) {
        setError(signIn.error);
        setLoading(false);
        return;
      }

      completeClientSignIn({ redirectTo });
    } catch {
      setError('Sign in failed unexpectedly. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}

      <Input
        label="Email"
        id="email"
        type="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        autoComplete="current-password"
        required
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
      />

      <p className="text-right text-caption">
        <Link href="/auth/forgot-password" className="font-medium text-primary hover:underline">
          Forgot password?
        </Link>
      </p>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Signing in…' : 'Log in'}
      </Button>

      <p className="text-center text-caption text-muted">
        No account?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
