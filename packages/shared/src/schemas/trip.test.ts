import { describe, expect, it } from 'vitest';
import { tripEndSchema, tripStartSchema, tripUpdateSchema } from './index';

const businessId = '550e8400-e29b-41d4-a716-446655440000';
const vehicleId = '550e8400-e29b-41d4-a716-446655440001';
const tripId = '550e8400-e29b-41d4-a716-446655440002';

describe('tripStartSchema', () => {
  it('accepts a valid start payload', () => {
    const result = tripStartSchema.safeParse({
      businessId,
      vehicleId,
      purpose: 'Client visit',
      startOdometer: 1000,
    });
    expect(result.success).toBe(true);
  });

  it('requires purpose', () => {
    const result = tripStartSchema.safeParse({
      businessId,
      vehicleId,
      purpose: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('tripEndSchema', () => {
  it('requires end odometer and trip id', () => {
    const result = tripEndSchema.safeParse({
      tripId,
      endOdometer: 1050,
    });
    expect(result.success).toBe(true);
  });
});

describe('tripUpdateSchema', () => {
  it('rejects end odometer below start odometer', () => {
    const result = tripUpdateSchema.safeParse({
      startOdometer: 200,
      endOdometer: 150,
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid odometer range', () => {
    const result = tripUpdateSchema.safeParse({
      startOdometer: 200,
      endOdometer: 250,
    });
    expect(result.success).toBe(true);
  });
});
