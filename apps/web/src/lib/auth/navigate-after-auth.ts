'use client';

import { completeClientSignIn } from '@/lib/auth/complete-client-sign-in';

/** After onboarding completes, route through auth/continue with a fresh session read. */
export function navigateAfterOnboarding() {
  completeClientSignIn({ redirectTo: '/dashboard' });
}
