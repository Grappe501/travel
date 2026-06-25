'use client';

import { useCallback, useEffect, useState } from 'react';
import { TripRouteMap } from '@/components/trips/TripRouteMap';
import { TripGpsTimeline } from '@/components/trips/TripGpsTimeline';
import { Alert, Badge, Card, CardContent } from '@/components/ui';
import type { SerializedTrip } from '@/lib/types/core';

type RouteSummary = {
  pointCount: number;
  gpsMiles: number | null;
  odometerMiles: number | null;
  mileageReviewRequired: boolean;
  points: Array<{
    recordedAt: string;
    latitude: number;
    longitude: number;
    source: string;
  }>;
};

type TripRouteSectionProps = {
  trip: SerializedTrip;
};

export function TripRouteSection({ trip }: TripRouteSectionProps) {
  const [summary, setSummary] = useState<RouteSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/trips/${trip.id}/route-summary`);
      if (!response.ok) return;
      const result = await response.json();
      setSummary(result.data as RouteSummary);
    } finally {
      setLoading(false);
    }
  }, [trip.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <p className="text-caption text-muted">Loading route…</p>;
  }

  if (!summary || summary.pointCount === 0) {
    if (!trip.trackingEnabled && trip.gpsMiles == null) return null;
    return (
      <Card>
        <CardContent className="pt-4 text-caption text-muted">No GPS route recorded for this trip.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-section-title text-foreground">Route</h2>
          {trip.mileageReviewRequired ? (
            <Badge variant="warning">Review mileage</Badge>
          ) : null}
        </div>

        <TripRouteMap points={summary.points} />

        <p className="text-caption text-muted">
          {summary.gpsMiles != null ? `GPS distance: ${summary.gpsMiles.toLocaleString()} mi` : null}
          {summary.odometerMiles != null
            ? `${summary.gpsMiles != null ? ' · ' : ''}Odometer: ${summary.odometerMiles.toLocaleString()} mi`
            : null}
          {trip.mileageReviewRequired
            ? ' · Odometer and GPS differ by more than 10%'
            : summary.gpsMiles != null && summary.odometerMiles != null
              ? ' · Odometer is authoritative'
              : null}
        </p>

        {trip.mileageReviewRequired ? (
          <Alert variant="warning">
            GPS and odometer mileage differ significantly. Verify before submitting for reimbursement.
          </Alert>
        ) : null}

        <TripGpsTimeline points={summary.points} />
      </CardContent>
    </Card>
  );
}
