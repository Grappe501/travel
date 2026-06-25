'use client';

import { useState } from 'react';
import { ActiveTripGpsBanner } from '@/components/trips/ActiveTripGpsBanner';
import { useTripGpsTracker } from '@/lib/location/use-trip-gps-tracker';
import type { SerializedTrip } from '@/lib/types/core';

type TripActiveTrackingProps = {
  trip: SerializedTrip;
};

export function TripActiveTracking({ trip }: TripActiveTrackingProps) {
  const [trackingEnabled, setTrackingEnabled] = useState(trip.trackingEnabled);
  const trackerState = useTripGpsTracker(
    trip.id,
    trackingEnabled,
    trip.status === 'active'
  );

  async function onTrackingChange(enabled: boolean) {
    const response = await fetch(`/api/trips/${trip.id}/tracking`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingEnabled: enabled }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error ?? 'Could not update tracking');
    }
    setTrackingEnabled(enabled);
  }

  if (trip.status !== 'active') return null;

  return (
    <ActiveTripGpsBanner
      tripId={trip.id}
      trackingEnabled={trackingEnabled}
      trackerState={trackerState}
      onTrackingChange={onTrackingChange}
    />
  );
}
