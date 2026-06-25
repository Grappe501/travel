'use server';

import { loginSchema, signupSchema, type LoginInput, type SignupInput } from '@mileage-copilot/shared';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { resolvePostAuthPath } from '@/lib/auth/guards';
import { createClient } from '@/lib/supabase/server';
import { getPublicSupabaseConfig } from '@/lib/supabase/config';
import { ensureUserProfile } from '@/server/services/auth.service';

export type AuthActionResult =
  | { error: string }
  | { message: string }
  | { redirectTo: string };

function authNotConfiguredError(): AuthActionResult {
  return {
    error:
      'Authentication is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in Netlify, then redeploy.',
  };
}

async function syncProfileFromSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error('No session');
  }

  return ensureUserProfile({
    id: user.id,
    email: user.email,
    emailVerified: Boolean(user.email_confirmed_at),
  });
}

/** @deprecated Prefer signInAction — kept for callers that already have a server session. */
export async function syncUserProfileAfterAuth() {
  try {
    return await syncProfileFromSession();
  } catch {
    return null;
  }
}

export async function getPostAuthRedirect(redirectTo?: string | null) {
  return resolvePostAuthPath(redirectTo);
}

async function finishAuthRedirect(redirectTo?: string | null): Promise<AuthActionResult> {
  const destination = await resolvePostAuthPath(redirectTo);

  if (destination === '/login') {
    return {
      error:
        'Signed in with Supabase but the app session was not saved. Refresh the page and try again.',
    };
  }

  revalidatePath('/', 'layout');
  return { redirectTo: destination };
}

export async function signInAction(
  input: LoginInput,
  redirectTo?: string | null
): Promise<AuthActionResult> {
  if (!getPublicSupabaseConfig().isConfigured) {
    return authNotConfiguredError();
  }

  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid input' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: error.message };
  }

  try {
    await syncProfileFromSession();
  } catch {
    return {
      error: 'Signed in but could not sync profile. Check DATABASE_URL and run migrations.',
    };
  }

  return finishAuthRedirect(redirectTo);
}

export async function signUpAction(input: SignupInput): Promise<AuthActionResult> {
  if (!getPublicSupabaseConfig().isConfigured) {
    return authNotConfiguredError();
  }

  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid input' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: appUrl
      ? { emailRedirectTo: `${appUrl}/auth/callback` }
      : undefined,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    try {
      await syncProfileFromSession();
    } catch {
      return {
        error: 'Account created but profile sync failed. Check DATABASE_URL and run migrations.',
      };
    }
    return finishAuthRedirect();
  }

  return {
    message: 'Check your email to confirm your account, then continue from the link in the email.',
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
