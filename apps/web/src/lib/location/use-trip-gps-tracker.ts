'use client';

import { useEffect, useRef, useState } from 'react';
import { TripGpsTracker, type TripGpsTrackerState } from '@/lib/location/tracker';

const initialState: TripGpsTrackerState = {
  active: false,
  paused: false,
  estimatedMiles: null,
  lastPoint: null,
  pointCount: 0,
  error: null,
};

export function useTripGpsTracker(tripId: string, trackingEnabled: boolean, isActive: boolean) {
  const trackerRef = useRef<TripGpsTracker | null>(null);
  const [state, setState] = useState<TripGpsTrackerState>(initialState);

  useEffect(() => {
    if (!isActive || !trackingEnabled) {
      trackerRef.current?.stop();
      trackerRef.current = null;
      setState(initialState);
      return;
    }

    const tracker = new TripGpsTracker({
      tripId,
      onStateChange: setState,
    });
    trackerRef.current = tracker;
    void tracker.start();

    return () => {
      tracker.stop();
      trackerRef.current = null;
    };
  }, [tripId, trackingEnabled, isActive]);

  return state;
}

export async function captureCurrentCoordinate(highAccuracy = false) {
  const { getCurrentPosition } = await import('@/lib/location/geolocation');
  const position = await getCurrentPosition({ enableHighAccuracy: highAccuracy });
  return {
    latitude: position.latitude,
    longitude: position.longitude,
  };
}
