export const OFFLINE_TRIP_PREFIX = 'offline-';

export type SyncStatus =
  | 'local_only'
  | 'pending_sync'
  | 'syncing'
  | 'synced'
  | 'sync_failed';

export type TripStartPayload = {
  businessId: string;
  vehicleId: string;
  purpose: string;
  destination?: string;
  startLocation?: string;
  startOdometer?: number;
  clientId?: string;
  projectId?: string;
};

export type TripEndPayload = {
  endOdometer: number;
  endLocation?: string;
  notes?: string;
};

export type ReceiptUploadMeta = {
  businessId?: string;
  tripId?: string;
  fileName: string;
  mimeType: string;
};

export type QueueOperation =
  | {
      type: 'trip_start';
      localTripId: string;
      idempotencyKey: string;
      payload: TripStartPayload;
      serverTripId?: string;
    }
  | {
      type: 'trip_end';
      localTripId: string;
      idempotencyKey: string;
      payload: TripEndPayload;
    }
  | {
      type: 'receipt_upload';
      localReceiptId: string;
      idempotencyKey: string;
      meta: ReceiptUploadMeta;
    };

export type QueueEntry = {
  id: string;
  operation: QueueOperation;
  syncStatus: SyncStatus;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  lastError?: string;
};

export type LocalActiveTrip = {
  localId: string;
  purpose: string;
  businessId: string;
  vehicleId: string;
  businessName: string;
  vehicleNickname: string;
  startOdometer: number | null;
  destination: string | null;
  startLocation: string | null;
  startedAt: string;
};

export type OfflineSnapshot = {
  isOnline: boolean;
  pendingCount: number;
  failedCount: number;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  hasLocalActiveTrip: boolean;
};
