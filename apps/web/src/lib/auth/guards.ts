import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/server/services/auth.service';
import { getOnboardingStatus } from '@/server/services/onboarding.service';

type GuardOptions = {
  /** Allow access when onboarding is not finished (e.g. /onboarding). */
  allowIncompleteOnboarding?: boolean;
  /** Allow access when email is not verified (e.g. /auth/verify-email). */
  allowUnverifiedEmail?: boolean;
};

export async function requireAuthenticatedUser(options: GuardOptions = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect('/login');
  }

  await ensureUserProfile({
    id: user.id,
    email: user.email,
    emailVerified: Boolean(user.email_confirmed_at),
  });

  if (!options.allowUnverifiedEmail && !user.email_confirmed_at) {
    redirect('/auth/verify-email');
  }

  const onboarding = await getOnboardingStatus(user.id);

  if (!options.allowIncompleteOnboarding && onboarding.needsOnboarding) {
    redirect('/onboarding');
  }

  return { user, onboarding };
}

export async function requireOnboardingAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect('/login');
  }

  await ensureUserProfile({
    id: user.id,
    email: user.email,
    emailVerified: Boolean(user.email_confirmed_at),
  });

  if (!user.email_confirmed_at) {
    redirect('/auth/verify-email');
  }

  const onboarding = await getOnboardingStatus(user.id);

  if (!onboarding.needsOnboarding) {
    redirect('/dashboard');
  }

  return { user, onboarding };
}

export async function resolvePostAuthPath(redirectTo?: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return '/login';
  }

  if (!user.email_confirmed_at) {
    return '/auth/verify-email';
  }

  const onboarding = await getOnboardingStatus(user.id);

  if (onboarding.needsOnboarding) {
    return '/onboarding';
  }

  if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
    return redirectTo;
  }

  return '/dashboard';
}
