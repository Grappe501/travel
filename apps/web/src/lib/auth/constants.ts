/** Routes that require an authenticated session */
export const PROTECTED_ROUTE_PREFIXES = [
  '/dashboard',
  '/trips',
  '/receipts',
  '/expenses',
  '/reports',
  '/vehicles',
  '/businesses',
  '/billing',
  '/settings',
  '/admin',
  '/onboarding',
  '/clients',
  '/ai',
  '/search',
  '/notifications',
] as const;

export const AUTH_ROUTES = ['/login', '/signup', '/beta/login'] as const;

/** Auth helper routes — not redirected away when logged in (handled per-route). */
export const AUTH_FLOW_ROUTES = [
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/callback',
  '/auth/continue',
] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}

export function isAuthFlowPath(pathname: string): boolean {
  return AUTH_FLOW_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
