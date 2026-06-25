import { describe, expect, it } from 'vitest';
import { isOfflineTripId } from '@/lib/offline/ids';
import { resolveServerTripId, sortQueueForSync } from '@/lib/offline/queue';
import type { QueueEntry } from '@/lib/offline/types';

function entry(
  id: string,
  operation: QueueEntry['operation'],
  createdAt: string,
  syncStatus: QueueEntry['syncStatus'] = 'pending_sync'
): QueueEntry {
  return {
    id,
    operation,
    syncStatus,
    retryCount: 0,
    createdAt,
    updatedAt: createdAt,
  };
}

describe('isOfflineTripId', () => {
  it('detects offline trip ids', () => {
    expect(isOfflineTripId('offline-abc')).toBe(true);
    expect(isOfflineTripId('server-uuid')).toBe(false);
  });
});

describe('sortQueueForSync', () => {
  it('orders trip_start before trip_end and receipts', () => {
    const entries = [
      entry(
        '3',
        {
          type: 'receipt_upload',
          localReceiptId: 'r1',
          idempotencyKey: 'k3',
          meta: { fileName: 'a.jpg', mimeType: 'image/jpeg' },
        },
        '2026-01-03T00:00:00.000Z'
      ),
      entry(
        '2',
        {
          type: 'trip_end',
          localTripId: 'offline-1',
          idempotencyKey: 'k2',
          payload: { endOdometer: 120 },
        },
        '2026-01-02T00:00:00.000Z'
      ),
      entry(
        '1',
        {
          type: 'trip_start',
          localTripId: 'offline-1',
          idempotencyKey: 'k1',
          payload: { businessId: 'b', vehicleId: 'v', purpose: 'Visit' },
        },
        '2026-01-01T00:00:00.000Z'
      ),
    ];

    const sorted = sortQueueForSync(entries);
    expect(sorted.map((item) => item.operation.type)).toEqual([
      'trip_start',
      'trip_end',
      'receipt_upload',
    ]);
  });
});

describe('resolveServerTripId', () => {
  it('returns mapped server id from synced trip_start entry', () => {
    const entries = [
      entry(
        '1',
        {
          type: 'trip_start',
          localTripId: 'offline-1',
          idempotencyKey: 'k1',
          payload: { businessId: 'b', vehicleId: 'v', purpose: 'Visit' },
          serverTripId: 'trip-server-1',
        },
        '2026-01-01T00:00:00.000Z',
        'synced'
      ),
    ];

    expect(resolveServerTripId(entries, 'offline-1')).toBe('trip-server-1');
    expect(resolveServerTripId(entries, 'offline-2')).toBeUndefined();
  });
});
