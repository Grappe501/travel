'use client';

import { finalizeSignInAction } from '@/lib/auth/actions';
import { isRedirectError } from '@/lib/auth/is-redirect-error';

/** After onboarding completes, re-sync session and route through auth/continue. */
export async function navigateAfterOnboarding() {
  try {
    await finalizeSignInAction('/dashboard');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    window.location.assign('/dashboard');
  }
}
