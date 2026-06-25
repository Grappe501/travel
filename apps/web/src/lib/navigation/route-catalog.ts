import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  ADD_NAV_ACTIONS,
  BOTTOM_NAV_ITEMS,
  DESKTOP_TOP_NAV_ITEMS,
  MORE_NAV_ITEMS,
} from '@/lib/navigation/app-nav';
import {
  SETTINGS_ACCOUNT_GROUP,
  SETTINGS_PREFERENCES_GROUP,
  SETTINGS_WORKSPACE_GROUP,
} from '@/components/settings/SettingsNavList';

/** Static app routes with a page.tsx (no dynamic segments). */
export const STATIC_APP_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/health',
  '/dashboard',
  '/trips',
  '/trips/start',
  '/receipts',
  '/receipts/upload',
  '/expenses',
  '/expenses/new',
  '/reports',
  '/search',
  '/notifications',
  '/billing',
  '/settings',
  '/settings/account',
  '/settings/appearance',
  '/settings/security',
  '/settings/notifications',
  '/settings/mileage',
  '/settings/privacy',
  '/businesses',
  '/vehicles',
  '/clients',
  '/ai/history',
  '/onboarding',
  '/admin',
  '/admin/health',
  '/legal/privacy',
  '/legal/terms',
  '/legal/refunds',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
] as const;

/** Auth handler routes implemented as route.ts. */
export const AUTH_HANDLER_ROUTES = ['/auth/continue', '/auth/callback'] as const;

const APP_ROOT = join(process.cwd(), 'src', 'app');

export function routePageExists(route: string): boolean {
  if (route === '/') {
    return existsSync(join(APP_ROOT, 'page.tsx'));
  }

  const segments = route.replace(/^\//, '').split('/');
  const dir = join(APP_ROOT, ...segments);
  return existsSync(join(dir, 'page.tsx')) || existsSync(join(dir, 'route.ts'));
}

/** Routes reachable from primary navigation and settings hub. */
export function collectNavHrefs(): string[] {
  const hrefs = new Set<string>();

  for (const item of BOTTOM_NAV_ITEMS) {
    if (item.kind === 'link') hrefs.add(item.href);
  }
  for (const item of DESKTOP_TOP_NAV_ITEMS) {
    hrefs.add(item.href);
  }
  for (const item of MORE_NAV_ITEMS) {
    hrefs.add(item.href);
  }
  for (const item of ADD_NAV_ACTIONS) {
    hrefs.add(item.href);
  }
  for (const item of [
    ...SETTINGS_ACCOUNT_GROUP,
    ...SETTINGS_PREFERENCES_GROUP,
    ...SETTINGS_WORKSPACE_GROUP,
  ]) {
    hrefs.add(item.href);
  }

  hrefs.add('/login');
  hrefs.add('/signup');
  hrefs.add('/health');
  hrefs.add('/legal/privacy');
  hrefs.add('/legal/terms');
  hrefs.add('/legal/refunds');

  return [...hrefs].sort();
}

export function allCatalogRoutesExist(): { missing: string[] } {
  const routes = [...STATIC_APP_ROUTES, ...AUTH_HANDLER_ROUTES];
  const missing = routes.filter((route) => !routePageExists(route));
  return { missing };
}
