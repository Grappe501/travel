import { describe, expect, it } from 'vitest';
import {
  allCatalogRoutesExist,
  collectNavHrefs,
  routePageExists,
} from '@/lib/navigation/route-catalog';
import { PROTECTED_ROUTE_PREFIXES } from '@/lib/auth/constants';

describe('route catalog', () => {
  it('every catalog route has a page or route handler', () => {
    const { missing } = allCatalogRoutesExist();
    expect(missing, `Missing routes: ${missing.join(', ')}`).toEqual([]);
  });

  it('every nav/settings href resolves to a page', () => {
    const missing = collectNavHrefs().filter((route) => !routePageExists(route));
    expect(missing, `Broken nav links: ${missing.join(', ')}`).toEqual([]);
  });

  it('protected auth prefixes cover search and notifications', () => {
    expect(PROTECTED_ROUTE_PREFIXES).toContain('/search');
    expect(PROTECTED_ROUTE_PREFIXES).toContain('/notifications');
  });
});
