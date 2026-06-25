import { describe, expect, it } from 'vitest';
import {
  BOTTOM_NAV_ITEMS,
  getContextualQuickNav,
  isAppNavActive,
  isMoreNavActive,
  MORE_NAV_ITEMS,
} from './app-nav';

describe('isAppNavActive', () => {
  it('matches dashboard exactly', () => {
    expect(isAppNavActive('/dashboard', '/dashboard')).toBe(true);
    expect(isAppNavActive('/dashboard/extra', '/dashboard')).toBe(false);
  });

  it('matches nested routes', () => {
    expect(isAppNavActive('/trips/abc/end', '/trips')).toBe(true);
    expect(isAppNavActive('/search', '/search')).toBe(true);
  });
});

describe('isMoreNavActive', () => {
  it('is true for more-menu destinations', () => {
    expect(isMoreNavActive('/clients/1')).toBe(true);
    expect(isMoreNavActive('/notifications')).toBe(true);
    expect(isMoreNavActive('/billing')).toBe(true);
  });

  it('is false for primary bottom-nav destinations', () => {
    expect(isMoreNavActive('/dashboard')).toBe(false);
    expect(isMoreNavActive('/trips')).toBe(false);
    expect(isMoreNavActive('/reports')).toBe(false);
  });
});

describe('getContextualQuickNav', () => {
  it('returns trip detail actions', () => {
    const links = getContextualQuickNav('/trips/trip-1');
    expect(links.map((l) => l.label)).toEqual(['Upload receipt', 'Add expense', 'End trip']);
    expect(links[0]?.href).toContain('tripId=trip-1');
  });

  it('returns trip list shortcuts', () => {
    expect(getContextualQuickNav('/trips')[0]?.href).toBe('/trips/start');
  });
});

describe('nav structure', () => {
  it('bottom nav has five slots with add and more actions', () => {
    expect(BOTTOM_NAV_ITEMS).toHaveLength(5);
    expect(BOTTOM_NAV_ITEMS.filter((item) => item.kind === 'action').map((item) => item.id)).toEqual([
      'add',
      'more',
    ]);
  });

  it('more menu includes search and notifications', () => {
    const hrefs = MORE_NAV_ITEMS.map((item) => item.href);
    expect(hrefs).toContain('/search');
    expect(hrefs).toContain('/notifications');
  });
});
