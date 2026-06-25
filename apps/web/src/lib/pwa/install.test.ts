import { describe, expect, it } from 'vitest';
import { PWA_CACHE_BUST, PWA_SW_PATH } from './install';

describe('PWA install helpers', () => {
  it('uses versioned service worker path for cache busting', () => {
    expect(PWA_SW_PATH).toBe('/sw.js');
    expect(PWA_CACHE_BUST).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
