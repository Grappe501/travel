'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Badge, Button, Card, CardContent, Input, RemoveEntryButton } from '@/components/ui';
import type { SerializedBusiness } from '@/lib/types/core';

type BusinessFormProps = {
  initial?: SerializedBusiness;
  onSuccess?: () => void;
};

export function BusinessForm({ initial, onSuccess }: BusinessFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [currency, setCurrency] = useState(initial?.currency ?? 'USD');
  const [defaultMileageRate, setDefaultMileageRate] = useState(
    initial?.defaultMileageRate?.toString() ?? ''
  );
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      currency: currency.toUpperCase(),
      isDefault,
      ...(defaultMileageRate ? { defaultMileageRate: Number(defaultMileageRate) } : {}),
    };

    const response = await fetch(initial ? `/api/businesses/${initial.id}` : '/api/businesses', {
      method: initial ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not save business');
      setLoading(false);
      return;
    }

    onSuccess?.();
    router.refresh();
    if (!initial) {
      setName('');
      setDefaultMileageRate('');
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
            label="Business name"
            id="business-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />

          <Input
            label="Currency"
            id="business-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            maxLength={3}
            hint="3-letter code, e.g. USD"
          />

          <Input
            label="Default mileage rate (optional)"
            id="business-mileage-rate"
            type="number"
            step="0.0001"
            min="0"
            value={defaultMileageRate}
            onChange={(e) => setDefaultMileageRate(e.target.value)}
            hint="Per-mile rate override for this business"
          />

          <label className="flex items-center gap-2 text-body">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none"
            />
            Set as default business
          </label>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : initial ? 'Update business' : 'Add business'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type BusinessListProps = {
  businesses: SerializedBusiness[];
};

export function BusinessList({ businesses }: BusinessListProps) {
  const router = useRouter();

  if (businesses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {businesses.map((business) => (
        <Card key={business.id}>
          <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-card-title text-foreground">{business.name}</h3>
                {business.isDefault ? <Badge variant="primary">Default</Badge> : null}
              </div>
              <p className="text-caption text-muted">
                {business.currency}
                {business.defaultMileageRate
                  ? ` · $${business.defaultMileageRate.toFixed(4)}/mi`
                  : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/businesses/${business.id}`)}
              >
                Edit
              </Button>
              <RemoveEntryButton
                apiUrl={`/api/businesses/${business.id}`}
                entityType="business"
                entityLabel="Business"
                title="Delete this business?"
                description="Existing trips and expenses keep their data. You can undo for a few seconds."
                label="Delete"
                confirmLabel="Delete"
                variant="destructive"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
