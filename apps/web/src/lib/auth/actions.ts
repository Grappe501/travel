'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { resolvePostAuthPath } from '@/lib/auth/guards';
import { ensureUserProfile } from '@/server/services/auth.service';

export async function syncUserProfileAfterAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  return ensureUserProfile({
    id: user.id,
    email: user.email,
    emailVerified: Boolean(user.email_confirmed_at),
  });
}

export async function getPostAuthRedirect(redirectTo?: string | null) {
  return resolvePostAuthPath(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
