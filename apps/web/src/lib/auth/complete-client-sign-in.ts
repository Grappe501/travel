'use client';

export function buildAuthContinueUrl(options?: {
  redirectTo?: string | null;
  fieldTestLabel?: string | null;
}): string {
  const params = new URLSearchParams();
  const redirect = options?.redirectTo;
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    params.set('redirect', redirect);
  }
  const label = options?.fieldTestLabel?.trim();
  if (label) {
    params.set('beta_label', label);
  }
  const query = params.toString();
  return query ? `/auth/continue?${query}` : '/auth/continue';
}

/** Full navigation ensures Supabase session cookies reach middleware before profile sync. */
export function completeClientSignIn(options?: {
  redirectTo?: string | null;
  fieldTestLabel?: string | null;
}): void {
  window.location.assign(buildAuthContinueUrl(options));
}
