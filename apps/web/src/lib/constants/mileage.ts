/** IRS standard business mileage rate — update annually (2026 placeholder). */
export const IRS_STANDARD_MILEAGE_RATE = 0.7;

export const MILEAGE_RATE_TYPE_OPTIONS = [
  { value: 'irs', label: 'IRS standard rate' },
  { value: 'company', label: 'Company rate' },
  { value: 'custom', label: 'Custom rate' },
] as const;
