'use client';

import { createClient } from '@/lib/supabase/client';

export type ClientSignInResult = { ok: true } | { error: string };

export async function signInOnClient(email: string, password: string): Promise<ClientSignInResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return {
      error: 'Sign-in succeeded but the session was not saved. Check cookies are enabled and try again.',
    };
  }

  return { ok: true };
}
