'use client';

import { Badge, ButtonLink, Card, CardContent } from '@/components/ui';
import type { SerializedTrip } from '@/server/services/trip.service';

export function ActiveTripBanner({ trip }: { trip: SerializedTrip }) {
  return (
    <Card className="border-primary/30 bg-selected">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary">Active trip</Badge>
            <span className="text-card-title text-foreground">{trip.purpose}</span>
          </div>
          <p className="text-caption text-muted">
            {trip.vehicleNickname} · {trip.businessName}
            {trip.clientName ? ` · ${trip.clientName}` : ''}
            {trip.projectName ? ` / ${trip.projectName}` : ''}
            {trip.startOdometer !== null ? ` · ${trip.startOdometer.toLocaleString()} mi start` : ''}
          </p>
        </div>
        <ButtonLink href={`/trips/${trip.id}/end`}>End trip</ButtonLink>
      </CardContent>
    </Card>
  );
}
