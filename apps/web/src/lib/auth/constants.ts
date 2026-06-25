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
] as const;

export const AUTH_ROUTES = ['/login', '/signup'] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}
