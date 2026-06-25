'use client';

import { loginSchema, type LoginInput } from '@mileage-copilot/shared';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { syncUserProfileAfterAuth } from '@/lib/auth/actions';
import { createClient } from '@/lib/supabase/client';
import { Alert, Button, Input } from '@/components/ui';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/dashboard';

  const [form, setForm] = useState<LoginInput>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    try {
      await syncUserProfileAfterAuth();
    } catch {
      setError('Signed in but could not sync profile. Check DATABASE_URL.');
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
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
