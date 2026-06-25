'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getPostAuthRedirect } from '@/lib/auth/actions';
import { createClient } from '@/lib/supabase/client';
import { Alert, Button } from '@/components/ui';

type VerifyEmailPanelProps = {
  email: string;
};

export function VerifyEmailPanel({ email }: VerifyEmailPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (resendError) {
      setError(resendError.message);
      setLoading(false);
      return;
    }

    setMessage('Verification email sent. Check your inbox.');
    setLoading(false);
  }

  async function handleRefresh() {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      setError(refreshError.message);
      setLoading(false);
      return;
    }

    if (data.user?.email_confirmed_at) {
      const destination = await getPostAuthRedirect();
      router.push(destination);
      router.refresh();
      return;
    }

    setMessage('Still waiting for verification. Check your email and try again.');
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <p className="text-body text-foreground">
        We sent a confirmation link to <strong>{email}</strong>. Verify your email to continue.
      </p>

      <div className="flex flex-col gap-3">
        <Button type="button" onClick={handleResend} disabled={loading}>
          {loading ? 'Working…' : 'Resend verification email'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleRefresh} disabled={loading}>
          I&apos;ve verified — continue
        </Button>
      </div>

      <p className="text-center text-caption text-muted">
        Wrong account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in with a different email
        </Link>
      </p>
    </div>
  );
}
