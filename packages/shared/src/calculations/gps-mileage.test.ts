import { describe, expect, it } from 'vitest';
import { haversineMiles, resolveTripMileage, sumPathMiles } from './gps-mileage';

describe('haversineMiles', () => {
  it('computes NYC to LA within tolerance', () => {
    const miles = haversineMiles(40.7128, -74.006, 34.0522, -118.2437);
    expect(miles).toBeGreaterThan(2400);
    expect(miles).toBeLessThan(2500);
  });

  it('returns zero for identical points', () => {
    expect(haversineMiles(40.0, -74.0, 40.0, -74.0)).toBe(0);
  });
});

describe('sumPathMiles', () => {
  it('sums multi-segment path', () => {
    const total = sumPathMiles([
      { latitude: 40.0, longitude: -74.0 },
      { latitude: 40.01, longitude: -74.0 },
      { latitude: 40.02, longitude: -74.0 },
    ]);
    expect(total).not.toBeNull();
    expect(total!).toBeGreaterThan(0);
  });

  it('returns null for fewer than two points', () => {
    expect(sumPathMiles([{ latitude: 40, longitude: -74 }])).toBeNull();
    expect(sumPathMiles([])).toBeNull();
  });
});

describe('resolveTripMileage', () => {
  const gpsPoints = [
    { latitude: 40.0, longitude: -74.0 },
    { latitude: 40.1, longitude: -74.0 },
    { latitude: 40.2, longitude: -74.0 },
  ];

  it('prefers odometer when both odometer and GPS exist', () => {
    const result = resolveTripMileage({
      startOdometer: 1000,
      endOdometer: 1025,
      gpsPoints,
    });
    expect(result.miles).toBe(25);
    expect(result.gpsMiles).not.toBeNull();
    expect(result.mileageSource).toBe('hybrid');
  });

  it('flags review when divergence exceeds 10%', () => {
    const result = resolveTripMileage({
      startOdometer: 1000,
      endOdometer: 1100,
      gpsPoints,
    });
    expect(result.mileageReviewRequired).toBe(true);
    expect(result.miles).toBe(100);
  });

  it('uses GPS when odometer missing', () => {
    const result = resolveTripMileage({ gpsPoints });
    expect(result.miles).not.toBeNull();
    expect(result.mileageSource).toBe('gps');
  });

  it('uses odometer only when GPS missing', () => {
    const result = resolveTripMileage({ startOdometer: 100, endOdometer: 120 });
    expect(result.miles).toBe(20);
    expect(result.mileageSource).toBe('odometer');
  });
});
