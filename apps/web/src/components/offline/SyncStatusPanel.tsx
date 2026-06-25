'use client';

import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { useOffline } from '@/components/offline/OfflineProvider';

export function SyncStatusPanel() {
  const { snapshot, syncNow, dbReady } = useOffline();

  if (!dbReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sync status</CardTitle>
          <CardDescription>Offline storage is unavailable in this browser.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync status</CardTitle>
        <CardDescription>Offline trips and receipts queue on this device.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-body">
        <p>
          <span className="text-muted">Connection:</span>{' '}
          {snapshot.isOnline ? 'Online' : 'Offline'}
        </p>
        <p>
          <span className="text-muted">Pending:</span> {snapshot.pendingCount}
        </p>
        <p>
          <span className="text-muted">Failed:</span> {snapshot.failedCount}
        </p>
        <p>
          <span className="text-muted">Last synced:</span>{' '}
          {snapshot.lastSyncedAt ? new Date(snapshot.lastSyncedAt).toLocaleString() : 'Never'}
        </p>

        {snapshot.failedCount > 0 ? (
          <Alert variant="error">Some items could not sync. Try again when online.</Alert>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          disabled={!snapshot.isOnline || snapshot.isSyncing || snapshot.pendingCount === 0}
          onClick={() => void syncNow()}
        >
          {snapshot.isSyncing ? 'Syncing…' : 'Sync now'}
        </Button>
      </CardContent>
    </Card>
  );
}
