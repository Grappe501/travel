'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { finalizeSignInAction, prepareBetaTesterAction } from '@/lib/auth/actions';
import { signInOnClient } from '@/lib/auth/client-sign-in';
import { isRedirectError } from '@/lib/auth/is-redirect-error';
import { Alert, Button, Input } from '@/components/ui';

export function BetaLoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [fieldTestLabel, setFieldTestLabel] = useState('');
  const [betaPassword, setBetaPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const label = fieldTestLabel.trim();
    const payload = {
      email,
      betaPassword,
      ...(label ? { fieldTestLabel: label } : {}),
    };

    try {
      let signIn = await signInOnClient(email, betaPassword);

      if ('error' in signIn) {
        const prepared = await prepareBetaTesterAction(payload);
        if ('error' in prepared) {
          setError(prepared.error);
          setLoading(false);
          return;
        }

        signIn = await signInOnClient(email, betaPassword);
        if ('error' in signIn) {
          setError(signIn.error);
          setLoading(false);
          return;
        }
      }

      await finalizeSignInAction(redirectTo, label || null);
    } catch (caught) {
      if (isRedirectError(caught)) {
        throw caught;
      }
      setError('Sign in failed unexpectedly. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}

      <Alert variant="info">
        Use your own email so your trips and receipts stay separate. Everyone shares the same field
        test access code from your coordinator.
      </Alert>

      <Input
        label="Your email"
        id="beta-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        hint="Use a personal or work email you can access on your phone."
      />

      <Input
        label="Your name (optional)"
        id="beta-label"
        value={fieldTestLabel}
        onChange={(e) => setFieldTestLabel(e.target.value)}
        maxLength={100}
        hint="Helps admins identify you in the field test dashboard."
      />

      <Input
        label="Field test access code"
        id="beta-password"
        type="password"
        autoComplete="current-password"
        required
        value={betaPassword}
        onChange={(e) => setBetaPassword(e.target.value)}
      />

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Signing in…' : 'Enter field test'}
      </Button>

      <p className="text-center text-caption text-muted">
        Admin?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Standard login
        </Link>
      </p>
    </form>
  );
}
