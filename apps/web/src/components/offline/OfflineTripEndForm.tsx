'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useOffline } from '@/components/offline/OfflineProvider';
import { Alert, Button, Card, CardContent, Input } from '@/components/ui';
import { enqueueOfflineTripEnd } from '@/lib/offline/queue';
import { isBrowserOnline } from '@/lib/offline/connectivity';
import type { LocalActiveTrip } from '@/lib/offline/types';

type OfflineTripEndFormProps = {
  trip: LocalActiveTrip;
};

export function OfflineTripEndForm({ trip }: OfflineTripEndFormProps) {
  const router = useRouter();
  const { refresh, syncNow } = useOffline();
  const [endLocation, setEndLocation] = useState('');
  const [endOdometer, setEndOdometer] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await enqueueOfflineTripEnd(trip.localId, {
        endOdometer: Number(endOdometer),
        ...(endLocation ? { endLocation } : {}),
        ...(notes ? { notes } : {}),
      });
      await refresh();
      if (isBrowserOnline()) {
        await syncNow();
      }
      router.push('/trips');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save trip locally');
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <Alert variant="info">This trip end is saved on your device and will sync when you are back online.</Alert>
        <p className="text-caption text-muted">
          {trip.purpose} · {trip.vehicleNickname}
          {trip.startOdometer !== null ? ` · started at ${trip.startOdometer.toLocaleString()} mi` : ''}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <Input
            label="Ending odometer"
            id="offline-trip-end-odometer"
            type="number"
            step="0.1"
            min={trip.startOdometer ?? 0}
            required
            value={endOdometer}
            onChange={(e) => setEndOdometer(e.target.value)}
          />

          <Input
            label="End location (optional)"
            id="offline-trip-end-location"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            maxLength={500}
          />

          <Input
            label="Notes (optional)"
            id="offline-trip-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={2000}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Saving…' : 'Complete trip offline'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
