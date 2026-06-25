'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { isBrowserOnline, subscribeConnectivity } from '@/lib/offline/connectivity';
import { isOfflineDbAvailable, getLastSyncedAt, listQueueEntries } from '@/lib/offline/db';
import { countSyncIssues, getOfflineActiveTrip } from '@/lib/offline/queue';
import { syncOfflineQueue } from '@/lib/offline/sync-engine';
import type { LocalActiveTrip, OfflineSnapshot } from '@/lib/offline/types';

type OfflineContextValue = {
  snapshot: OfflineSnapshot;
  localActiveTrip: LocalActiveTrip | null;
  refresh: () => Promise<void>;
  syncNow: () => Promise<void>;
  dbReady: boolean;
};

const OfflineContext = createContext<OfflineContextValue | null>(null);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [dbReady, setDbReady] = useState(false);
  const [snapshot, setSnapshot] = useState<OfflineSnapshot>({
    isOnline: true,
    pendingCount: 0,
    failedCount: 0,
    isSyncing: false,
    lastSyncedAt: null,
    hasLocalActiveTrip: false,
  });
  const [localActiveTrip, setLocalActiveTrip] = useState<LocalActiveTrip | null>(null);

  const refresh = useCallback(async () => {
    const online = isBrowserOnline();
    if (!(await isOfflineDbAvailable())) {
      setDbReady(false);
      setSnapshot((prev) => ({ ...prev, isOnline: online }));
      return;
    }

    setDbReady(true);
    const [entries, activeTrip, lastSyncedAt] = await Promise.all([
      listQueueEntries(),
      getOfflineActiveTrip(),
      getLastSyncedAt(),
    ]);
    const { pending, failed } = countSyncIssues(entries);

    setLocalActiveTrip(activeTrip);
    setSnapshot({
      isOnline: online,
      pendingCount: pending,
      failedCount: failed,
      isSyncing: false,
      lastSyncedAt,
      hasLocalActiveTrip: Boolean(activeTrip),
    });
  }, []);

  const syncNow = useCallback(async () => {
    if (!isBrowserOnline() || !(await isOfflineDbAvailable())) return;

    setSnapshot((prev) => ({ ...prev, isSyncing: true }));
    try {
      await syncOfflineQueue();
    } finally {
      await refresh();
    }
  }, [refresh]);

  useEffect(() => {
    void refresh();
    return subscribeConnectivity((online) => {
      setSnapshot((prev) => ({ ...prev, isOnline: online }));
      if (online) {
        void syncNow();
      }
    });
  }, [refresh, syncNow]);

  const value = useMemo(
    () => ({ snapshot, localActiveTrip, refresh, syncNow, dbReady }),
    [snapshot, localActiveTrip, refresh, syncNow, dbReady]
  );

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}
