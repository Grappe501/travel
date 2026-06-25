'use client';

import { Badge, ButtonLink, Card, CardContent } from '@/components/ui';
import type { SerializedTrip } from '@/server/services/trip.service';

export function ActiveTripBanner({ trip }: { trip: SerializedTrip }) {
  const uploadHref = `/receipts/upload?tripId=${trip.id}&businessId=${trip.businessId}`;
  const addExpenseHref = `/expenses/new?tripId=${trip.id}`;

  return (
    <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-surface">
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Active trip</Badge>
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
            </div>
            <p className="text-card-title text-foreground">{trip.purpose}</p>
            <p className="text-caption text-muted">
              {trip.vehicleNickname} · {trip.businessName}
              {trip.clientName ? ` · ${trip.clientName}` : ''}
              {trip.projectName ? ` / ${trip.projectName}` : ''}
              {trip.startOdometer !== null ? ` · ${trip.startOdometer.toLocaleString()} mi start` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/trips/${trip.id}`} size="sm">
            View trip
          </ButtonLink>
          <ButtonLink href={uploadHref} variant="secondary" size="sm">
            Upload receipt
          </ButtonLink>
          <ButtonLink href={addExpenseHref} variant="secondary" size="sm">
            Add expense
          </ButtonLink>
          <ButtonLink href={`/trips/${trip.id}/end`} variant="secondary" size="sm">
            End trip
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  );
}
