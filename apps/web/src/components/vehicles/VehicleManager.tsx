'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Badge, Button, Card, CardContent, Input, Select } from '@/components/ui';
import type { SerializedBusiness, SerializedVehicle } from '@/lib/types/core';

type VehicleFormProps = {
  businesses: SerializedBusiness[];
  initial?: SerializedVehicle;
  onSuccess?: () => void;
};

export function VehicleForm({ businesses, initial, onSuccess }: VehicleFormProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState(initial?.nickname ?? '');
  const [businessId, setBusinessId] = useState(initial?.businessId ?? '');
  const [make, setMake] = useState(initial?.make ?? '');
  const [model, setModel] = useState(initial?.model ?? '');
  const [year, setYear] = useState(initial?.year?.toString() ?? '');
  const [currentOdometer, setCurrentOdometer] = useState(
    initial?.currentOdometer?.toString() ?? ''
  );
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      nickname,
      isDefault,
      ...(businessId ? { businessId } : {}),
      ...(make ? { make } : {}),
      ...(model ? { model } : {}),
      ...(year ? { year: Number(year) } : {}),
      ...(currentOdometer ? { currentOdometer: Number(currentOdometer) } : {}),
    };

    const response = await fetch(initial ? `/api/vehicles/${initial.id}` : '/api/vehicles', {
      method: initial ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not save vehicle');
      setLoading(false);
      return;
    }

    onSuccess?.();
    router.refresh();
    if (!initial) {
      setNickname('');
      setMake('');
      setModel('');
      setYear('');
      setCurrentOdometer('');
      setIsDefault(false);
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <Input
            label="Nickname"
            id="vehicle-nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            maxLength={100}
            hint='e.g. "Work SUV"'
          />

          <Select
            label="Business (optional)"
            id="vehicle-business"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            placeholder="No business"
            options={businesses.map((b) => ({ value: b.id, label: b.name }))}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Make" id="vehicle-make" value={make} onChange={(e) => setMake(e.target.value)} />
            <Input
              label="Model"
              id="vehicle-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Year"
              id="vehicle-year"
              type="number"
              min={1900}
              max={2100}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <Input
              label="Starting odometer"
              id="vehicle-odometer"
              type="number"
              step="0.1"
              min="0"
              value={currentOdometer}
              onChange={(e) => setCurrentOdometer(e.target.value)}
              hint="Miles on the odometer today"
            />
          </div>

          <label className="flex items-center gap-2 text-body">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none"
            />
            Set as default vehicle
          </label>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : initial ? 'Update vehicle' : 'Add vehicle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type VehicleListProps = {
  vehicles: SerializedVehicle[];
  businesses: SerializedBusiness[];
};

export function VehicleList({ vehicles, businesses }: VehicleListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const businessName = (id: string | null) =>
    businesses.find((b) => b.id === id)?.name ?? null;

  async function handleDelete(id: string) {
    if (!confirm('Delete this vehicle?')) return;

    setDeletingId(id);
    setError(null);

    const response = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not delete vehicle');
      setDeletingId(null);
      return;
    }

    router.refresh();
    setDeletingId(null);
  }

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id}>
          <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-card-title text-foreground">{vehicle.nickname}</h3>
                {vehicle.isDefault ? <Badge variant="primary">Default</Badge> : null}
              </div>
              <p className="text-caption text-muted">
                {[vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(' ') || 'No make/model'}
                {vehicle.currentOdometer !== null
                  ? ` · ${vehicle.currentOdometer.toLocaleString()} mi`
                  : ''}
                {businessName(vehicle.businessId)
                  ? ` · ${businessName(vehicle.businessId)}`
                  : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/vehicles/${vehicle.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deletingId === vehicle.id}
                onClick={() => handleDelete(vehicle.id)}
              >
                {deletingId === vehicle.id ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
