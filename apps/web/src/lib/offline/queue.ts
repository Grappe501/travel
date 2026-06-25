import { MAX_OFFLINE_QUEUE_SIZE } from '@/lib/offline/constants';
import {
  clearLocalActiveTrip,
  getLocalActiveTrip,
  listQueueEntries,
  putQueueEntry,
  putReceiptBlob,
  setLocalActiveTrip,
} from '@/lib/offline/db';
import { createIdempotencyKey, createLocalReceiptId, createLocalTripId } from '@/lib/offline/ids';
import type {
  LocalActiveTrip,
  QueueEntry,
  ReceiptUploadMeta,
  TripEndPayload,
  TripStartPayload,
} from '@/lib/offline/types';

function nowIso() {
  return new Date().toISOString();
}

function baseEntry(id: string, operation: QueueEntry['operation']): QueueEntry {
  const timestamp = nowIso();
  return {
    id,
    operation,
    syncStatus: 'pending_sync',
    retryCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

async function assertQueueCapacity() {
  const entries = await listQueueEntries();
  const active = entries.filter((entry) => entry.syncStatus !== 'synced');
  if (active.length >= MAX_OFFLINE_QUEUE_SIZE) {
    throw new Error('Offline queue is full — connect to sync before saving more');
  }
}

export async function enqueueOfflineTripStart(
  payload: TripStartPayload,
  context: { businessName: string; vehicleNickname: string }
): Promise<LocalActiveTrip> {
  await assertQueueCapacity();

  const localId = createLocalTripId();
  const entry = baseEntry(`queue-trip-start-${localId}`, {
    type: 'trip_start',
    localTripId: localId,
    idempotencyKey: createIdempotencyKey(),
    payload,
  });

  const activeTrip: LocalActiveTrip = {
    localId,
    purpose: payload.purpose,
    businessId: payload.businessId,
    vehicleId: payload.vehicleId,
    businessName: context.businessName,
    vehicleNickname: context.vehicleNickname,
    startOdometer: payload.startOdometer ?? null,
    destination: payload.destination ?? null,
    startLocation: payload.startLocation ?? null,
    startedAt: nowIso(),
  };

  await putQueueEntry(entry);
  await setLocalActiveTrip(activeTrip);
  return activeTrip;
}

export async function enqueueOfflineTripEnd(localTripId: string, payload: TripEndPayload) {
  await assertQueueCapacity();

  const entry = baseEntry(`queue-trip-end-${localTripId}`, {
    type: 'trip_end',
    localTripId,
    idempotencyKey: createIdempotencyKey(),
    payload,
  });

  await putQueueEntry(entry);
  await clearLocalActiveTrip();
}

export async function enqueueOfflineReceiptUpload(file: File, meta: Omit<ReceiptUploadMeta, 'fileName' | 'mimeType'>) {
  await assertQueueCapacity();

  const localReceiptId = createLocalReceiptId();
  const entry = baseEntry(`queue-receipt-${localReceiptId}`, {
    type: 'receipt_upload',
    localReceiptId,
    idempotencyKey: createIdempotencyKey(),
    meta: {
      ...meta,
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
    },
  });

  await putReceiptBlob(localReceiptId, file);
  await putQueueEntry(entry);
  return localReceiptId;
}

export async function getOfflineActiveTrip() {
  return getLocalActiveTrip();
}

export function sortQueueForSync(entries: QueueEntry[]): QueueEntry[] {
  const typeOrder = { trip_start: 0, trip_end: 1, receipt_upload: 2 } as const;

  return [...entries].sort((a, b) => {
    const orderDiff = typeOrder[a.operation.type] - typeOrder[b.operation.type];
    if (orderDiff !== 0) return orderDiff;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function resolveServerTripId(entries: QueueEntry[], localTripId: string): string | undefined {
  for (const entry of entries) {
    if (entry.operation.type === 'trip_start' && entry.operation.localTripId === localTripId) {
      return entry.operation.serverTripId;
    }
  }
  return undefined;
}

export function countSyncIssues(entries: QueueEntry[]) {
  const pending = entries.filter(
    (entry) => entry.syncStatus === 'pending_sync' || entry.syncStatus === 'syncing'
  ).length;
  const failed = entries.filter((entry) => entry.syncStatus === 'sync_failed').length;
  return { pending, failed };
}
