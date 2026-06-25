import { describe, expect, it } from 'vitest';
import { FREE_RECEIPTS_PER_MONTH, FREE_TRIPS_PER_MONTH } from './config';
import { isReceiptLimitReached, isTripLimitReached } from './usage-limits';

describe('isTripLimitReached', () => {
  it('never blocks unlimited plans', () => {
    expect(isTripLimitReached(FREE_TRIPS_PER_MONTH, true)).toBe(false);
    expect(isTripLimitReached(FREE_TRIPS_PER_MONTH + 10, true)).toBe(false);
  });

  it('blocks at the free tier trip limit', () => {
    expect(isTripLimitReached(FREE_TRIPS_PER_MONTH - 1, false)).toBe(false);
    expect(isTripLimitReached(FREE_TRIPS_PER_MONTH, false)).toBe(true);
    expect(isTripLimitReached(FREE_TRIPS_PER_MONTH + 1, false)).toBe(true);
  });
});

describe('isReceiptLimitReached', () => {
  it('never blocks unlimited plans', () => {
    expect(isReceiptLimitReached(FREE_RECEIPTS_PER_MONTH, true)).toBe(false);
  });

  it('blocks at the free tier receipt limit', () => {
    expect(isReceiptLimitReached(FREE_RECEIPTS_PER_MONTH - 1, false)).toBe(false);
    expect(isReceiptLimitReached(FREE_RECEIPTS_PER_MONTH, false)).toBe(true);
    expect(isReceiptLimitReached(FREE_RECEIPTS_PER_MONTH + 1, false)).toBe(true);
  });
});

describe('FREE tier constants', () => {
  it('matches product limits', () => {
    expect(FREE_TRIPS_PER_MONTH).toBe(5);
    expect(FREE_RECEIPTS_PER_MONTH).toBe(10);
  });
});
