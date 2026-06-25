import {
  deleteReceiptBlob,
  getReceiptBlob,
  listQueueEntries,
  putQueueEntry,
  setLastSyncedAt,
} from '@/lib/offline/db';
import { resolveServerTripId, sortQueueForSync } from '@/lib/offline/queue';
import { MAX_SYNC_RETRIES } from '@/lib/offline/constants';
import type { QueueEntry } from '@/lib/offline/types';

async function syncTripStart(entry: QueueEntry): Promise<string> {
  if (entry.operation.type !== 'trip_start') {
    throw new Error('Invalid operation');
  }

  const response = await fetch('/api/trips/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': entry.operation.idempotencyKey,
    },
    body: JSON.stringify(entry.operation.payload),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error ?? 'Trip start sync failed');
  }

  return result.data.id as string;
}

async function syncTripEnd(entry: QueueEntry, entries: QueueEntry[]) {
  if (entry.operation.type !== 'trip_end') {
    throw new Error('Invalid operation');
  }

  const serverTripId = resolveServerTripId(entries, entry.operation.localTripId);
  if (!serverTripId) {
    throw new Error('Waiting for trip start to sync');
  }

  const response = await fetch(`/api/trips/${serverTripId}/end`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': entry.operation.idempotencyKey,
    },
    body: JSON.stringify(entry.operation.payload),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error ?? 'Trip end sync failed');
  }
}

async function syncReceiptUpload(entry: QueueEntry) {
  if (entry.operation.type !== 'receipt_upload') {
    throw new Error('Invalid operation');
  }

  const blob = await getReceiptBlob(entry.operation.localReceiptId);
  if (!blob) {
    throw new Error('Receipt file missing from local storage');
  }

  const formData = new FormData();
  formData.append('file', blob, entry.operation.meta.fileName);
  if (entry.operation.meta.businessId) {
    formData.append('businessId', entry.operation.meta.businessId);
  }
  if (entry.operation.meta.tripId) {
    formData.append('tripId', entry.operation.meta.tripId);
  }
  formData.append('idempotencyKey', entry.operation.idempotencyKey);

  const response = await fetch('/api/receipts/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error ?? 'Receipt upload sync failed');
  }

  await deleteReceiptBlob(entry.operation.localReceiptId);
}

async function markEntry(entry: QueueEntry, patch: Partial<QueueEntry>) {
  const updated: QueueEntry = {
    ...entry,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await putQueueEntry(updated);
  return updated;
}

export type SyncResult = {
  synced: number;
  failed: number;
  deferred: number;
};

export async function syncOfflineQueue(): Promise<SyncResult> {
  let entries = await listQueueEntries();
  const result: SyncResult = { synced: 0, failed: 0, deferred: 0 };

  const pending = sortQueueForSync(
    entries.filter((entry) => entry.syncStatus === 'pending_sync' || entry.syncStatus === 'sync_failed')
  );

  for (const entry of pending) {
    if (entry.retryCount >= MAX_SYNC_RETRIES) {
      result.failed += 1;
      continue;
    }

    if (entry.operation.type === 'trip_end' && !resolveServerTripId(entries, entry.operation.localTripId)) {
      result.deferred += 1;
      continue;
    }

    await markEntry(entry, { syncStatus: 'syncing' });

    try {
      if (entry.operation.type === 'trip_start') {
        const serverTripId = await syncTripStart(entry);
        const updatedOperation = { ...entry.operation, serverTripId };
        await markEntry({ ...entry, operation: updatedOperation }, { syncStatus: 'synced' });
        entries = entries.map((item) =>
          item.id === entry.id
            ? { ...item, operation: updatedOperation, syncStatus: 'synced' as const }
            : item
        );
      } else if (entry.operation.type === 'trip_end') {
        await syncTripEnd(entry, entries);
        await markEntry(entry, { syncStatus: 'synced' });
      } else {
        await syncReceiptUpload(entry);
        await markEntry(entry, { syncStatus: 'synced' });
      }

      result.synced += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sync failed';
      const isDeferred = message.includes('Waiting for trip start');
      await markEntry(entry, {
        syncStatus: isDeferred ? 'pending_sync' : 'sync_failed',
        retryCount: isDeferred ? entry.retryCount : entry.retryCount + 1,
        lastError: message,
      });
      if (isDeferred) {
        result.deferred += 1;
      } else {
        result.failed += 1;
      }
    }
  }

  if (result.synced > 0) {
    await setLastSyncedAt(new Date().toISOString());
  }

  return result;
}
