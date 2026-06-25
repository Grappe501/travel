'use client';

import { resetPasswordSchema } from '@mileage-copilot/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getPostAuthRedirect } from '@/lib/auth/actions';
import { createClient } from '@/lib/supabase/client';
import { Alert, Button, Input } from '@/components/ui';

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    const destination = await getPostAuthRedirect();
    router.push(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}

      <p className="text-caption text-muted">Choose a new password for your account.</p>

      <Input
        label="New password"
        id="reset-password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        label="Confirm password"
        id="reset-confirm-password"
        type="password"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Updating…' : 'Update password'}
      </Button>
    </form>
  );
}
