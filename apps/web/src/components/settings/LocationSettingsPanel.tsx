'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Select } from '@/components/ui';

type LocationPrefs = {
  gpsTrackingDefault: 'off' | 'ask' | 'on';
  gpsHighAccuracy: boolean;
};

export function LocationSettingsPanel() {
  const [prefs, setPrefs] = useState<LocationPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch('/api/settings/location')
      .then((r) => r.json())
      .then((result) => {
        setPrefs(result.data as LocationPrefs);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(next: Partial<LocationPrefs>) {
    if (!prefs) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    const response = await fetch('/api/settings/location', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not save settings');
      setSaving(false);
      return;
    }

    setPrefs(result.data as LocationPrefs);
    setMessage('Location preferences saved');
    setSaving(false);
  }

  if (loading || !prefs) {
    return <p className="text-caption text-muted">Loading location settings…</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location & GPS</CardTitle>
        <CardDescription>
          GPS data is stored with your trips for mileage reimbursement. We do not sell or share your
          location.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {message ? <Alert variant="success">{message}</Alert> : null}
        {error ? <Alert variant="error">{error}</Alert> : null}

        <Select
          label="Default GPS tracking on new trips"
          id="gps-tracking-default"
          value={prefs.gpsTrackingDefault}
          onChange={(e) =>
            void save({ gpsTrackingDefault: e.target.value as LocationPrefs['gpsTrackingDefault'] })
          }
          options={[
            { value: 'ask', label: 'Ask each time' },
            { value: 'on', label: 'On by default' },
            { value: 'off', label: 'Off by default' },
          ]}
        />

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border text-primary"
            checked={prefs.gpsHighAccuracy}
            onChange={(e) => void save({ gpsHighAccuracy: e.target.checked })}
          />
          <span>
            <span className="text-body font-medium text-foreground">High-accuracy GPS</span>
            <span className="mt-1 block text-caption text-muted">
              Uses more battery but may improve accuracy in open areas.
            </span>
          </span>
        </label>

        <Button type="button" disabled={saving} onClick={() => void save({})}>
          {saving ? 'Saving…' : 'Refresh'}
        </Button>
      </CardContent>
    </Card>
  );
}
