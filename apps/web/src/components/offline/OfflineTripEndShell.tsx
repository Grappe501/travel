'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { OfflineTripEndForm } from '@/components/offline/OfflineTripEndForm';
import { ButtonLink, LoadingState } from '@/components/ui';
import { getOfflineActiveTrip } from '@/lib/offline/queue';
import { isOfflineTripId } from '@/lib/offline/ids';
import type { LocalActiveTrip } from '@/lib/offline/types';

type OfflineTripEndShellProps = {
  localId: string;
};

export function OfflineTripEndShell({ localId }: OfflineTripEndShellProps) {
  const [trip, setTrip] = useState<LocalActiveTrip | null | undefined>(undefined);

  useEffect(() => {
    if (!isOfflineTripId(localId)) {
      setTrip(null);
      return;
    }

    void getOfflineActiveTrip().then((active) => {
      if (!active || active.localId !== localId) {
        setTrip(null);
        return;
      }
      setTrip(active);
    });
  }, [localId]);

  if (trip === undefined) {
    return (
      <DashboardShell title="End trip" description="Loading offline trip…">
        <LoadingState label="Loading trip…" />
      </DashboardShell>
    );
  }

  if (!trip) {
    notFound();
  }

  return (
    <DashboardShell
      title="End trip"
      description="Enter ending odometer — saved locally until sync."
      actions={
        <ButtonLink href="/trips" variant="secondary" size="sm">
          Back
        </ButtonLink>
      }
    >
      <OfflineTripEndForm trip={trip} />
    </DashboardShell>
  );
}
