'use client';

import { type LoginInput } from '@mileage-copilot/shared';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { signInAction } from '@/lib/auth/actions';
import { navigateAfterAuth } from '@/lib/auth/navigate-after-auth';
import { Alert, Button, Input } from '@/components/ui';

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/dashboard';

  const [form, setForm] = useState<LoginInput>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signInAction(form, redirectTo);

      if ('error' in result) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if ('redirectTo' in result) {
        navigateAfterAuth(result.redirectTo);
        return;
      }
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
