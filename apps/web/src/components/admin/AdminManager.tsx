'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Button, Card, CardContent, Input } from '@/components/ui';

export function AdminUserSearch() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch(`/api/admin/users?email=${encodeURIComponent(email.trim())}`);
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Lookup failed');
      setLoading(false);
      return;
    }

    router.push(`/admin/users/${result.data.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}
          <Input
            label="Customer email"
            id="admin-user-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hint="Exact email match (case-insensitive). Read-only lookup."
          />
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Searching…' : 'Look up customer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AdminNavLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/admin/field-test" className="text-body font-medium text-primary hover:underline">
        Field test dashboard
      </Link>
      <Link href="/admin/health" className="text-body font-medium text-primary hover:underline">
        System health
      </Link>
      <Link href="/dashboard" className="text-body text-muted hover:text-foreground">
        Back to app
      </Link>
    </div>
  );
}
