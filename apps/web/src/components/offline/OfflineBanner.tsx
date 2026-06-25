'use client';

import { Alert, Button } from '@/components/ui';
import { useOffline } from '@/components/offline/OfflineProvider';

export function OfflineBanner() {
  const { snapshot, syncNow, dbReady } = useOffline();

  if (!dbReady) return null;

  if (!snapshot.isOnline) {
    return (
      <Alert variant="warning" title="You're offline">
        Changes save on this device and sync when you reconnect.
      </Alert>
    );
  }

  if (snapshot.isSyncing) {
    return (
      <Alert variant="info" title="Syncing">
        Uploading saved trips and receipts…
      </Alert>
    );
  }

  if (snapshot.failedCount > 0) {
    return (
      <Alert variant="error" title="Sync issues">
        {snapshot.failedCount} item{snapshot.failedCount === 1 ? '' : 's'} failed to sync.{' '}
        <Button type="button" variant="secondary" size="sm" className="ml-2 inline-flex" onClick={() => void syncNow()}>
          Retry sync
        </Button>
      </Alert>
    );
  }

  if (snapshot.pendingCount > 0) {
    return (
      <Alert variant="info" title="Sync pending">
        {snapshot.pendingCount} item{snapshot.pendingCount === 1 ? '' : 's'} waiting to sync.{' '}
        <Button type="button" variant="secondary" size="sm" className="ml-2 inline-flex" onClick={() => void syncNow()}>
          Sync now
        </Button>
      </Alert>
    );
  }

  return null;
}
