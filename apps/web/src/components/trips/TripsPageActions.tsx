'use client';

import { useOffline } from '@/components/offline/OfflineProvider';
import { ButtonLink } from '@/components/ui';

type TripsPageActionsProps = {
  hasServerActiveTrip: boolean;
};

export function TripsPageActions({ hasServerActiveTrip }: TripsPageActionsProps) {
  const { localActiveTrip } = useOffline();

  if (hasServerActiveTrip || localActiveTrip) {
    return null;
  }

  return (
    <ButtonLink href="/trips/start" size="sm">
      Start trip
    </ButtonLink>
  );
}
