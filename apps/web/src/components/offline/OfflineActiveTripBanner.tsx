'use client';

import { Card, CardContent, Badge, ButtonLink } from '@/components/ui';
import { useOffline } from '@/components/offline/OfflineProvider';

export function OfflineActiveTripBanner() {
  const { localActiveTrip } = useOffline();

  if (!localActiveTrip) return null;

  return (
    <Card className="border-warning/40 bg-warning/10">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="warning">Offline active trip</Badge>
            <span className="text-card-title text-foreground">{localActiveTrip.purpose}</span>
          </div>
          <p className="text-caption text-muted">
            {localActiveTrip.vehicleNickname} · {localActiveTrip.businessName}
            {localActiveTrip.startOdometer !== null
              ? ` · ${localActiveTrip.startOdometer.toLocaleString()} mi start`
              : ''}
            {' · Saved on device — will sync when online'}
          </p>
        </div>
        <ButtonLink href={`/trips/${localActiveTrip.localId}/end`}>End trip</ButtonLink>
      </CardContent>
    </Card>
  );
}
