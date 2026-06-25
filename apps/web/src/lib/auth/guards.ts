import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/server/services/auth.service';
import { getOnboardingStatus } from '@/server/services/onboarding.service';
import type { OnboardingStatus } from '@/lib/types/core';

type GuardOptions = {
  /** Allow access when onboarding is not finished (e.g. /onboarding). */
  allowIncompleteOnboarding?: boolean;
  /** Allow access when email is not verified (e.g. /auth/verify-email). */
  allowUnverifiedEmail?: boolean;
};

function safeRedirectPath(redirectTo: string | null | undefined, fallback: string) {
  if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
    return redirectTo;
  }
  return fallback;
}

const defaultOnboardingStatus: OnboardingStatus = {
  onboardingCompleted: false,
  hasBusiness: false,
  hasVehicle: false,
  needsOnboarding: true,
  currentStep: 'business',
};

async function syncProfileSafe(user: {
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
}) {
  if (!user.email) return;
  try {
    await ensureUserProfile({
      id: user.id,
      email: user.email,
      emailVerified: Boolean(user.email_confirmed_at),
    });
  } catch (error) {
    console.error('[auth] profile sync failed', error);
  }
}

async function readOnboardingSafe(userId: string): Promise<OnboardingStatus> {
  try {
    return await getOnboardingStatus(userId);
  } catch (error) {
    console.error('[auth] onboarding status failed', error);
    return defaultOnboardingStatus;
  }
}

export async function requireAuthenticatedUser(options: GuardOptions = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect('/login');
  }

  await syncProfileSafe(user);

  if (!options.allowUnverifiedEmail && !user.email_confirmed_at) {
    redirect('/auth/verify-email');
  }

  const onboarding = await readOnboardingSafe(user.id);

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

  await syncProfileSafe(user);

  if (!user.email_confirmed_at) {
    redirect('/auth/verify-email');
  }

  const onboarding = await readOnboardingSafe(user.id);

  if (!onboarding.needsOnboarding) {
    redirect('/dashboard');
  }

  return { user, onboarding };
}

export async function resolvePostAuthPath(redirectTo?: string | null) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return '/login';
    }

    await syncProfileSafe(user);

    if (!user.email_confirmed_at) {
      return '/auth/verify-email';
    }

    const onboarding = await readOnboardingSafe(user.id);
    if (onboarding.needsOnboarding) {
      return '/onboarding';
    }

    return safeRedirectPath(redirectTo, '/dashboard');
  } catch {
    return '/login';
  }
}
