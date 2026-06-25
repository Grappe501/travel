'use client';

import { useState } from 'react';
import { Alert, Badge, Button } from '@/components/ui';
import type { TripGpsTrackerState } from '@/lib/location/tracker';

type ActiveTripGpsBannerProps = {
  tripId: string;
  trackingEnabled: boolean;
  trackerState: TripGpsTrackerState;
  onTrackingChange: (enabled: boolean) => Promise<void>;
};

export function ActiveTripGpsBanner({
  tripId,
  trackingEnabled,
  trackerState,
  onTrackingChange,
}: ActiveTripGpsBannerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleTracking() {
    setLoading(true);
    setError(null);
    try {
      await onTrackingChange(!trackingEnabled);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update tracking');
    } finally {
      setLoading(false);
    }
  }

  if (!trackingEnabled && !trackerState.active) {
    return (
      <div className="rounded-lg border border-dashed border-border p-4">
        <p className="text-caption text-muted">GPS tracking is off for this trip.</p>
        <Button type="button" variant="secondary" size="sm" className="mt-2" disabled={loading} onClick={toggleTracking}>
          Enable GPS tracking
        </Button>
        {error ? (
          <Alert variant="error" className="mt-2">
            {error}
          </Alert>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-primary/25 bg-primary/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">GPS tracking {trackerState.paused ? 'paused' : 'ON'}</Badge>
          {trackerState.estimatedMiles != null ? (
            <span className="text-body font-medium text-foreground">
              ~{trackerState.estimatedMiles.toLocaleString()} mi est.
            </span>
          ) : null}
        </div>
        <Button type="button" variant="secondary" size="sm" disabled={loading} onClick={toggleTracking}>
          {trackingEnabled ? 'Pause tracking' : 'Resume tracking'}
        </Button>
      </div>
      <p className="text-caption text-muted">
        Keep the app open while driving. {trackerState.pointCount} point
        {trackerState.pointCount === 1 ? '' : 's'} recorded.
      </p>
      {trackerState.paused ? (
        <Alert variant="warning">Tracking paused — return to the app to resume.</Alert>
      ) : null}
      {trackerState.error ? <Alert variant="warning">{trackerState.error}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}
      <input type="hidden" name="gps-trip-id" value={tripId} />
    </div>
  );
}
