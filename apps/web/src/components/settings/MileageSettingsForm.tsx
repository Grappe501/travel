'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Button, Card, CardContent, Input, Select } from '@/components/ui';
import { MILEAGE_RATE_TYPE_OPTIONS } from '@/lib/constants/mileage';
import type { MileageSettings } from '@/lib/types/core';

type MileageSettingsFormProps = {
  settings: MileageSettings;
};

export function MileageSettingsForm({ settings }: MileageSettingsFormProps) {
  const router = useRouter();
  const [mileageRateType, setMileageRateType] = useState(settings.mileageRateType);
  const [customMileageRate, setCustomMileageRate] = useState(
    settings.customMileageRate?.toString() ?? ''
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const payload = {
      mileageRateType,
      ...(mileageRateType === 'custom' && customMileageRate
        ? { customMileageRate: Number(customMileageRate) }
        : {}),
    };

    const response = await fetch('/api/settings/mileage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not save mileage settings');
      setLoading(false);
      return;
    }

    setMessage(`Effective rate: $${result.data.effectiveRate.toFixed(4)}/mi`);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-4">
          <p className="text-caption text-muted">
            IRS standard rate: ${settings.irsStandardRate.toFixed(2)}/mi · Current effective:{' '}
            <strong>${settings.effectiveRate.toFixed(4)}/mi</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? <Alert variant="error">{error}</Alert> : null}
            {message ? <Alert variant="success">{message}</Alert> : null}

            <Select
              label="Mileage rate type"
              id="mileage-rate-type"
              value={mileageRateType}
              onChange={(e) =>
                setMileageRateType(e.target.value as MileageSettings['mileageRateType'])
              }
              options={MILEAGE_RATE_TYPE_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />

            {mileageRateType === 'custom' ? (
              <Input
                label="Custom rate per mile"
                id="custom-mileage-rate"
                type="number"
                step="0.0001"
                min="0"
                required
                value={customMileageRate}
                onChange={(e) => setCustomMileageRate(e.target.value)}
              />
            ) : null}

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save mileage settings'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {settings.rates.length > 0 ? (
        <Card>
          <CardContent className="space-y-3 pt-4">
            <h3 className="text-card-title text-foreground">Rate history</h3>
            <ul className="divide-y divide-border">
              {settings.rates.map((rate) => (
                <li key={rate.id} className="flex justify-between py-2 text-caption">
                  <span>
                    {rate.name} <span className="text-muted">({rate.source})</span>
                  </span>
                  <span>
                    ${rate.rate.toFixed(4)}/mi · {rate.effectiveFrom}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
