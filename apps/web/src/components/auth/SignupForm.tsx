'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signUpAction } from '@/lib/auth/actions';
import { navigateAfterAuth } from '@/lib/auth/navigate-after-auth';
import { Alert, Button, Input } from '@/components/ui';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const result = await signUpAction({ email, password, confirmPassword });

      if ('error' in result) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if ('redirectTo' in result) {
        navigateAfterAuth(result.redirectTo);
        return;
      }

      if ('message' in result) {
        setMessage(result.message);
        setLoading(false);
      }
    } catch {
      setError('Sign up failed unexpectedly. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <Input
        label="Email"
        id="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        label="Confirm password"
        id="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-caption text-muted">
        By creating an account you agree to our{' '}
        <Link href="/legal/terms" className="font-medium text-primary hover:underline">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/legal/privacy" className="font-medium text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center text-caption text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
