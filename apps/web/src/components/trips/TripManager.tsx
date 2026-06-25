'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Badge, Button, ButtonLink, Card, CardContent, Input, Select } from '@/components/ui';
import type { SerializedBusiness, SerializedTrip, SerializedVehicle } from '@/lib/types/core';

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
            {trip.startOdometer !== null ? ` · ${trip.startOdometer.toLocaleString()} mi start` : ''}
          </p>
        </div>
        <ButtonLink href={`/trips/${trip.id}/end`}>End trip</ButtonLink>
      </CardContent>
    </Card>
  );
}

type TripStartFormProps = {
  businesses: SerializedBusiness[];
  vehicles: SerializedVehicle[];
  hasActiveTrip: boolean;
};

export function TripStartForm({ businesses, vehicles, hasActiveTrip }: TripStartFormProps) {
  const router = useRouter();
  const defaultBusiness = businesses.find((b) => b.isDefault)?.id ?? businesses[0]?.id ?? '';
  const defaultVehicle = vehicles.find((v) => v.isDefault)?.id ?? vehicles[0]?.id ?? '';

  const [businessId, setBusinessId] = useState(defaultBusiness);
  const [vehicleId, setVehicleId] = useState(defaultVehicle);
  const [purpose, setPurpose] = useState('');
  const [destination, setDestination] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [startOdometer, setStartOdometer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      businessId,
      vehicleId,
      purpose,
      ...(destination ? { destination } : {}),
      ...(startLocation ? { startLocation } : {}),
      ...(startOdometer ? { startOdometer: Number(startOdometer) } : {}),
    };

    const response = await fetch('/api/trips/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not start trip');
      setLoading(false);
      return;
    }

    router.push('/trips');
    router.refresh();
  }

  if (businesses.length === 0 || vehicles.length === 0) {
    return (
      <Alert variant="warning">
        Add a{' '}
        <Link href="/businesses" className="font-medium underline">
          business
        </Link>{' '}
        and{' '}
        <Link href="/vehicles" className="font-medium underline">
          vehicle
        </Link>{' '}
        before starting a trip.
      </Alert>
    );
  }

  if (hasActiveTrip) {
    return (
      <Alert variant="info">
        You already have an active trip. End it before starting another.
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <Select
            label="Business"
            id="trip-business"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            required
            options={businesses.map((b) => ({ value: b.id, label: b.name }))}
          />

          <Select
            label="Vehicle"
            id="trip-vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
            options={vehicles.map((v) => ({
              value: v.id,
              label: `${v.nickname}${v.currentOdometer !== null ? ` (${v.currentOdometer.toLocaleString()} mi)` : ''}`,
            }))}
          />

          <Input
            label="Purpose"
            id="trip-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            maxLength={500}
            hint="Why are you driving? e.g. Client site visit"
          />

          <Input
            label="Destination (optional)"
            id="trip-destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            maxLength={500}
          />

          <Input
            label="Start location (optional)"
            id="trip-start-location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            maxLength={500}
          />

          <Input
            label="Starting odometer (optional)"
            id="trip-start-odometer"
            type="number"
            step="0.1"
            min="0"
            value={startOdometer}
            onChange={(e) => setStartOdometer(e.target.value)}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Starting…' : 'Start trip'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type TripEndFormProps = {
  trip: SerializedTrip;
};

export function TripEndForm({ trip }: TripEndFormProps) {
  const router = useRouter();
  const [endLocation, setEndLocation] = useState('');
  const [endOdometer, setEndOdometer] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch(`/api/trips/${trip.id}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endOdometer: Number(endOdometer),
        ...(endLocation ? { endLocation } : {}),
        ...(notes ? { notes } : {}),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not end trip');
      setLoading(false);
      return;
    }

    router.push(`/trips/${trip.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <p className="text-caption text-muted">
          {trip.purpose} · {trip.vehicleNickname}
          {trip.startOdometer !== null
            ? ` · started at ${trip.startOdometer.toLocaleString()} mi`
            : ''}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <Input
            label="Ending odometer"
            id="trip-end-odometer"
            type="number"
            step="0.1"
            min={trip.startOdometer ?? 0}
            required
            value={endOdometer}
            onChange={(e) => setEndOdometer(e.target.value)}
            hint={
              trip.startOdometer !== null
                ? `Must be ≥ ${trip.startOdometer.toLocaleString()} mi`
                : undefined
            }
          />

          <Input
            label="End location (optional)"
            id="trip-end-location"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            maxLength={500}
          />

          <Input
            label="Notes (optional)"
            id="trip-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={2000}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Completing…' : 'Complete trip'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type TripEditFormProps = {
  trip: SerializedTrip;
};

export function TripEditForm({ trip }: TripEditFormProps) {
  const router = useRouter();
  const [purpose, setPurpose] = useState(trip.purpose);
  const [destination, setDestination] = useState(trip.destination ?? '');
  const [startOdometer, setStartOdometer] = useState(trip.startOdometer?.toString() ?? '');
  const [endOdometer, setEndOdometer] = useState(trip.endOdometer?.toString() ?? '');
  const [notes, setNotes] = useState(trip.notes ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      purpose,
      destination: destination || undefined,
      notes: notes || undefined,
      ...(startOdometer ? { startOdometer: Number(startOdometer) } : {}),
      ...(endOdometer ? { endOdometer: Number(endOdometer) } : {}),
    };

    const response = await fetch(`/api/trips/${trip.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not update trip');
      setLoading(false);
      return;
    }

    router.push(`/trips/${trip.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <Input
            label="Purpose"
            id="edit-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />

          <Input
            label="Destination"
            id="edit-destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Start odometer"
              id="edit-start-odometer"
              type="number"
              step="0.1"
              min="0"
              value={startOdometer}
              onChange={(e) => setStartOdometer(e.target.value)}
            />
            <Input
              label="End odometer"
              id="edit-end-odometer"
              type="number"
              step="0.1"
              min="0"
              value={endOdometer}
              onChange={(e) => setEndOdometer(e.target.value)}
            />
          </div>

          <Input label="Notes" id="edit-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <p className="text-caption text-muted">
            Editing odometer readings recalculates mileage and reimbursement. Changes are audit-logged.
          </p>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type TripListProps = {
  trips: SerializedTrip[];
};

function statusBadge(status: string) {
  if (status === 'active') return <Badge variant="primary">Active</Badge>;
  if (status === 'completed') return <Badge variant="success">Completed</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export function TripList({ trips }: TripListProps) {
  const completed = trips.filter((t) => t.status === 'completed');

  if (completed.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-section-title text-foreground">Trip history</h2>
      {completed.map((trip) => (
        <Card key={trip.id}>
          <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {statusBadge(trip.status)}
                <Link href={`/trips/${trip.id}`} className="text-card-title text-foreground hover:underline">
                  {trip.purpose}
                </Link>
              </div>
              <p className="text-caption text-muted">
                {trip.endedAt
                  ? new Date(trip.endedAt).toLocaleDateString()
                  : new Date(trip.createdAt).toLocaleDateString()}
                {' · '}
                {trip.vehicleNickname}
                {trip.miles !== null ? ` · ${trip.miles.toLocaleString()} mi` : ''}
                {trip.reimbursementAmount !== null
                  ? ` · $${trip.reimbursementAmount.toFixed(2)}`
                  : ''}
              </p>
            </div>
            <ButtonLink href={`/trips/${trip.id}`} variant="secondary" size="sm">
              View
            </ButtonLink>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TripDetailCard({ trip }: { trip: SerializedTrip }) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {statusBadge(trip.status)}
          <h2 className="text-section-title text-foreground">{trip.purpose}</h2>
        </div>

        <dl className="grid gap-3 text-body sm:grid-cols-2">
          <div>
            <dt className="text-caption text-muted">Business</dt>
            <dd>{trip.businessName}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Vehicle</dt>
            <dd>{trip.vehicleNickname}</dd>
          </div>
          {trip.destination ? (
            <div>
              <dt className="text-caption text-muted">Destination</dt>
              <dd>{trip.destination}</dd>
            </div>
          ) : null}
          {trip.startOdometer !== null ? (
            <div>
              <dt className="text-caption text-muted">Start odometer</dt>
              <dd>{trip.startOdometer.toLocaleString()} mi</dd>
            </div>
          ) : null}
          {trip.endOdometer !== null ? (
            <div>
              <dt className="text-caption text-muted">End odometer</dt>
              <dd>{trip.endOdometer.toLocaleString()} mi</dd>
            </div>
          ) : null}
          {trip.miles !== null ? (
            <div>
              <dt className="text-caption text-muted">Miles</dt>
              <dd>{trip.miles.toLocaleString()} mi</dd>
            </div>
          ) : null}
          {trip.mileageRate !== null ? (
            <div>
              <dt className="text-caption text-muted">Rate</dt>
              <dd>
                ${trip.mileageRate.toFixed(4)}/mi ({trip.mileageRateSource})
              </dd>
            </div>
          ) : null}
          {trip.reimbursementAmount !== null ? (
            <div>
              <dt className="text-caption text-muted">Reimbursement</dt>
              <dd className="text-card-title">${trip.reimbursementAmount.toFixed(2)}</dd>
            </div>
          ) : null}
          {trip.expenseTotal !== null && trip.expenseTotal > 0 ? (
            <div>
              <dt className="text-caption text-muted">Expenses</dt>
              <dd>${trip.expenseTotal.toFixed(2)}</dd>
            </div>
          ) : null}
          {trip.grandTotal !== null ? (
            <div>
              <dt className="text-caption text-muted">Grand total</dt>
              <dd className="text-card-title">${trip.grandTotal.toFixed(2)}</dd>
            </div>
          ) : null}
        </dl>

        {trip.notes ? (
          <p className="text-caption text-muted">
            <span className="font-medium text-foreground">Notes:</span> {trip.notes}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
