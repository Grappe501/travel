'use client';

import { useState } from 'react';
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export function AccountExportPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleExport() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/export/account', { method: 'POST' });
      if (!response.ok) {
        const result = await response.json();
        setError(result.error ?? 'Export failed');
        setLoading(false);
        return;
      }

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? 'account-export.json';
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch {
      setError('Export failed unexpectedly');
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download your data</CardTitle>
        <CardDescription>
          Export trips, expenses, receipts metadata, and account settings as JSON (API-EXP-010).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {error ? <Alert variant="error">{error}</Alert> : null}
        {success ? (
          <Alert variant="success">Export downloaded. Receipt images are not included — open each receipt in the app to save files.</Alert>
        ) : null}
        <p className="text-caption text-muted">
          Limited to 3 exports per hour. For a full archive including receipt files, contact support.
        </p>
        <Button type="button" disabled={loading} onClick={handleExport}>
          {loading ? 'Preparing export…' : 'Export account data'}
        </Button>
      </CardContent>
    </Card>
  );
}
