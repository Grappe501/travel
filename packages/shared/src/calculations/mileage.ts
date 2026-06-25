/**
 * Trip mileage and reimbursement calculations (Volume 3 / SM-TRIP).
 */

export function calculateTripMiles(
  startOdometer: number | null | undefined,
  endOdometer: number | null | undefined
): number | null {
  if (startOdometer == null || endOdometer == null) {
    return null;
  }

  const miles = endOdometer - startOdometer;
  return Math.round(miles * 10) / 10;
}

export function calculateReimbursement(miles: number, ratePerMile: number): number {
  return Math.round(miles * ratePerMile * 100) / 100;
}

export function validateOdometerRange(
  startOdometer: number | null | undefined,
  endOdometer: number
): { valid: true } | { valid: false; error: string } {
  if (startOdometer == null) {
    return { valid: true };
  }

  if (endOdometer < startOdometer) {
    return {
      valid: false,
      error: 'Ending odometer must be greater than or equal to starting odometer',
    };
  }

  return { valid: true };
}

export const FINANCIAL_TRIP_FIELDS = [
  'startOdometer',
  'endOdometer',
  'miles',
  'mileageRate',
  'reimbursementAmount',
  'expenseTotal',
  'grandTotal',
] as const;
