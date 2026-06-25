'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SerializedTrip } from '@/lib/types/core';
import { Button, Card, CardContent, RemoveEntryButton } from '@/components/ui';

type TripDetailActionsProps = {
  trip: SerializedTrip;
};

export function TripDetailActions({ trip }: TripDetailActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<'duplicate' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDuplicate() {
    setLoading('duplicate');
    setError(null);

    const response = await fetch(`/api/trips/${trip.id}/duplicate`, { method: 'POST' });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not duplicate trip');
      setLoading(null);
      return;
    }

    router.push(`/trips/${result.data.id}`);
    router.refresh();
  }

  if (trip.status !== 'completed' && trip.status !== 'active') {
    return null;
  }

  const isActive = trip.status === 'active';

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <div>
          <h2 className="text-section-title text-foreground">Trip actions</h2>
          <p className="text-caption text-muted">
            {trip.status === 'completed'
              ? 'Start a new trip with the same details, or remove this record.'
              : 'Cancel if you started this trip by mistake.'}
          </p>
          {error ? <p className="mt-2 text-caption text-danger">{error}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {trip.status === 'completed' ? (
            <Button
              type="button"
              size="sm"
              disabled={loading !== null}
              onClick={() => void handleDuplicate()}
            >
              {loading === 'duplicate' ? 'Starting…' : 'Duplicate trip'}
            </Button>
          ) : null}
          <RemoveEntryButton
            apiUrl={`/api/trips/${trip.id}`}
            entityType="trip"
            entityLabel={isActive ? 'Trip' : 'Trip'}
            title={isActive ? 'Cancel this active trip?' : 'Remove this trip?'}
            description="Linked expenses and receipts stay in your account but will be unlinked from this trip."
            label={isActive ? 'Cancel trip' : 'Delete trip'}
            confirmLabel={isActive ? 'Cancel trip' : 'Remove trip'}
            redirectTo="/trips"
          />
        </div>
      </CardContent>
    </Card>
  );
}
