import { FREE_RECEIPTS_PER_MONTH, FREE_TRIPS_PER_MONTH } from './config';

export function isTripLimitReached(tripsCount: number, unlimited: boolean): boolean {
  return !unlimited && tripsCount >= FREE_TRIPS_PER_MONTH;
}

export function isReceiptLimitReached(receiptsCount: number, unlimited: boolean): boolean {
  return !unlimited && receiptsCount >= FREE_RECEIPTS_PER_MONTH;
}
