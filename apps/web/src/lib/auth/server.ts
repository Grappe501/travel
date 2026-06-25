import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/server/services/auth.service';

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  return user;
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user?.email) {
    return null;
  }

  try {
    await ensureUserProfile({
      id: user.id,
      email: user.email,
      emailVerified: Boolean(user.email_confirmed_at),
    });
  } catch (error) {
    console.error('[auth] profile sync failed', error);
  }

  return user;
}
