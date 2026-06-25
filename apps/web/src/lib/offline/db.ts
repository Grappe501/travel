import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import {
  OFFLINE_DB_NAME,
  OFFLINE_DB_VERSION,
} from '@/lib/offline/constants';
import type { LocalActiveTrip, QueueEntry } from '@/lib/offline/types';

type OfflineDb = {
  queue: {
    key: string;
    value: QueueEntry;
    indexes: { byStatus: SyncStatusIndex; byCreated: string };
  };
  blobs: {
    key: string;
    value: Blob;
  };
  meta: {
    key: string;
    value: unknown;
  };
};

type SyncStatusIndex = QueueEntry['syncStatus'];

interface OfflineDBSchema extends DBSchema {
  queue: OfflineDb['queue'];
  blobs: OfflineDb['blobs'];
  meta: OfflineDb['meta'];
}

const META_ACTIVE_TRIP = 'activeTrip';
const META_LAST_SYNCED = 'lastSyncedAt';

let dbPromise: Promise<IDBPDatabase<OfflineDBSchema>> | null = null;

function getDb() {
  if (typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available');
  }

  if (!dbPromise) {
    dbPromise = openDB<OfflineDBSchema>(OFFLINE_DB_NAME, OFFLINE_DB_VERSION, {
      upgrade(db) {
        const queue = db.createObjectStore('queue', { keyPath: 'id' });
        queue.createIndex('byStatus', 'syncStatus');
        queue.createIndex('byCreated', 'createdAt');
        db.createObjectStore('blobs');
        db.createObjectStore('meta');
      },
    });
  }

  return dbPromise;
}

export async function putQueueEntry(entry: QueueEntry) {
  const db = await getDb();
  await db.put('queue', entry);
}

export async function getQueueEntry(id: string) {
  const db = await getDb();
  return db.get('queue', id);
}

export async function listQueueEntries() {
  const db = await getDb();
  const entries = await db.getAllFromIndex('queue', 'byCreated');
  return entries.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function countPendingQueueEntries() {
  const entries = await listQueueEntries();
  return entries.filter((entry) => entry.syncStatus === 'pending_sync' || entry.syncStatus === 'sync_failed').length;
}

export async function putReceiptBlob(localReceiptId: string, blob: Blob) {
  const db = await getDb();
  await db.put('blobs', blob, localReceiptId);
}

export async function getReceiptBlob(localReceiptId: string) {
  const db = await getDb();
  return db.get('blobs', localReceiptId);
}

export async function deleteReceiptBlob(localReceiptId: string) {
  const db = await getDb();
  await db.delete('blobs', localReceiptId);
}

export async function getLocalActiveTrip(): Promise<LocalActiveTrip | null> {
  const db = await getDb();
  const value = await db.get('meta', META_ACTIVE_TRIP);
  if (!value || typeof value !== 'object') return null;
  return value as LocalActiveTrip;
}

export async function setLocalActiveTrip(trip: LocalActiveTrip) {
  const db = await getDb();
  await db.put('meta', trip, META_ACTIVE_TRIP);
}

export async function clearLocalActiveTrip() {
  const db = await getDb();
  await db.delete('meta', META_ACTIVE_TRIP);
}

export async function getLastSyncedAt(): Promise<string | null> {
  const db = await getDb();
  const value = await db.get('meta', META_LAST_SYNCED);
  return typeof value === 'string' ? value : null;
}

export async function setLastSyncedAt(iso: string) {
  const db = await getDb();
  await db.put('meta', iso, META_LAST_SYNCED);
}

export async function isOfflineDbAvailable(): Promise<boolean> {
  if (typeof indexedDB === 'undefined') return false;
  try {
    await getDb();
    return true;
  } catch {
    return false;
  }
}

export async function resetOfflineDbForTests() {
  if (typeof indexedDB === 'undefined') return;
  dbPromise = null;
  indexedDB.deleteDatabase(OFFLINE_DB_NAME);
}
