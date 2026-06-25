import { OFFLINE_TRIP_PREFIX } from '@/lib/offline/types';

export function createLocalTripId(): string {
  return `${OFFLINE_TRIP_PREFIX}${crypto.randomUUID()}`;
}

export function createLocalReceiptId(): string {
  return `offline-receipt-${crypto.randomUUID()}`;
}

export function isOfflineTripId(id: string): boolean {
  return id.startsWith(OFFLINE_TRIP_PREFIX);
}

export function createIdempotencyKey(): string {
  return crypto.randomUUID();
}
