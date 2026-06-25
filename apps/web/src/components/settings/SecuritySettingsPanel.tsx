'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Alert,
  Badge,
  Button,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui';
import { signOut } from '@/lib/auth/actions';
import type { SerializedSecuritySummary } from '@/server/services/settings.service';

type SecuritySettingsPanelProps = {
  summary: SerializedSecuritySummary;
};

export function SecuritySettingsPanel({ summary }: SecuritySettingsPanelProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const response = await fetch('/api/settings/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not update password');
      setLoading(false);
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('Password updated successfully.');
    setLoading(false);
  }

  async function handleResendVerification() {
    setError(null);
    setMessage(null);
    setResendLoading(true);

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: summary.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (resendError) {
      setError(resendError.message);
      setResendLoading(false);
      return;
    }

    setMessage('Verification email sent.');
    setResendLoading(false);
  }

  return (
    <div className="space-y-6">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Email verification</CardTitle>
          <CardDescription>Confirm your email to unlock all features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-body text-foreground">{summary.email}</p>
            <Badge variant={summary.emailVerified ? 'success' : 'warning'}>
              {summary.emailVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          {!summary.emailVerified ? (
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={handleResendVerification} disabled={resendLoading}>
                {resendLoading ? 'Sending…' : 'Resend verification email'}
              </Button>
              <ButtonLink href="/auth/verify-email" variant="secondary" size="sm">
                Open verification page
              </ButtonLink>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Use a unique password with at least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current password"
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New password"
              id="newPassword"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm new password"
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </Button>
              <Link href="/auth/forgot-password" className="self-center text-caption font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>
            {summary.lastLoginAt
              ? `Last sign-in: ${new Date(summary.lastLoginAt).toLocaleString()}`
              : 'Sign-in activity will appear here after your next login.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form action={signOut}>
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
