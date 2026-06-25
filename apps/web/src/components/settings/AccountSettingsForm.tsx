'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Badge, Button, Card, CardContent, Input, Select } from '@/components/ui';
import type { SerializedAccountSettings } from '@/server/services/settings.service';

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern (US)' },
  { value: 'America/Chicago', label: 'Central (US)' },
  { value: 'America/Denver', label: 'Mountain (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific (US)' },
  { value: 'America/Phoenix', label: 'Arizona (US)' },
  { value: 'America/Anchorage', label: 'Alaska (US)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii (US)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
];

const TAX_YEAR_OPTIONS = [2024, 2025, 2026, 2027].map((year) => ({
  value: String(year),
  label: String(year),
}));

type AccountSettingsFormProps = {
  settings: SerializedAccountSettings;
};

export function AccountSettingsForm({ settings }: AccountSettingsFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(settings.displayName ?? '');
  const [firstName, setFirstName] = useState(settings.firstName ?? '');
  const [lastName, setLastName] = useState(settings.lastName ?? '');
  const [timezone, setTimezone] = useState(settings.timezone);
  const [currency, setCurrency] = useState(settings.currency);
  const [taxYear, setTaxYear] = useState(String(settings.taxYear));
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const response = await fetch('/api/settings/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: displayName || null,
        firstName: firstName || null,
        lastName: lastName || null,
        timezone,
        currency,
        taxYear: Number(taxYear),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not save account settings');
      setLoading(false);
      return;
    }

    setMessage('Account settings saved.');
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? <Alert variant="error">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-subheading text-foreground">Sign-in email</p>
            <Badge variant={settings.emailVerified ? 'success' : 'warning'}>
              {settings.emailVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          <p className="text-body text-muted">{settings.email}</p>
          <p className="text-caption text-muted">
            Email changes are managed through your authentication provider. Update password and verification
            under Security.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <Input
            label="Display name"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            hint="Shown in greetings and reports"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First name"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last name"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Select
            label="Timezone"
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={TIMEZONE_OPTIONS}
          />
          <Select
            label="Currency"
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={CURRENCY_OPTIONS}
          />
          <Select
            label="Tax year"
            id="taxYear"
            value={taxYear}
            onChange={(e) => setTaxYear(e.target.value)}
            options={TAX_YEAR_OPTIONS}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save account settings'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
