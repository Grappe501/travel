import { describe, expect, it } from 'vitest';
import {
  FINANCIAL_TRIP_FIELDS,
  calculateReimbursement,
  calculateTripMiles,
  validateOdometerRange,
} from './mileage';

describe('calculateTripMiles', () => {
  it('returns null when either odometer is missing', () => {
    expect(calculateTripMiles(null, 100)).toBeNull();
    expect(calculateTripMiles(100, null)).toBeNull();
    expect(calculateTripMiles(undefined, undefined)).toBeNull();
  });

  it('calculates miles rounded to one decimal', () => {
    expect(calculateTripMiles(1000, 1005.44)).toBe(5.4);
    expect(calculateTripMiles(100, 100)).toBe(0);
  });
});

describe('calculateReimbursement', () => {
  it('rounds to two decimal places', () => {
    expect(calculateReimbursement(10, 0.655)).toBe(6.55);
    expect(calculateReimbursement(12.5, 0.7)).toBe(8.75);
  });
});

describe('validateOdometerRange', () => {
  it('allows missing start odometer', () => {
    expect(validateOdometerRange(null, 100)).toEqual({ valid: true });
  });

  it('rejects end before start', () => {
    expect(validateOdometerRange(200, 150)).toEqual({
      valid: false,
      error: 'Ending odometer must be greater than or equal to starting odometer',
    });
  });

  it('accepts equal or greater end odometer', () => {
    expect(validateOdometerRange(200, 200)).toEqual({ valid: true });
    expect(validateOdometerRange(200, 250)).toEqual({ valid: true });
  });
});

describe('FINANCIAL_TRIP_FIELDS', () => {
  it('lists audited financial trip fields', () => {
    expect(FINANCIAL_TRIP_FIELDS).toContain('miles');
    expect(FINANCIAL_TRIP_FIELDS).toHaveLength(7);
  });
});
