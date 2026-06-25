import { describe, expect, it } from 'vitest';
import { PWA_CACHE_BUST, PWA_SW_PATH } from './install';

describe('PWA install helpers', () => {
  it('registers service worker at stable path', () => {
    expect(PWA_SW_PATH).toBe('/sw.js');
    expect(PWA_CACHE_BUST).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
