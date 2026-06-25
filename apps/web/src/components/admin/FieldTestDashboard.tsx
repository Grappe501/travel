'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Alert, ButtonLink, Card, StatCard } from '@/components/ui';
import type { FieldTestOverview } from '@/server/services/field-test.service';

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export function FieldTestDashboard() {
  const [overview, setOverview] = useState<FieldTestOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/field-test');
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? 'Could not load field test data');
        return;
      }
      setOverview(result.data as FieldTestOverview);
    } catch {
      setError('Could not load field test data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (loading && !overview) {
    return <p className="text-caption text-muted">Loading field test dashboard…</p>;
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!overview) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-muted">
          Updated {new Date(overview.generatedAt).toLocaleString()} · {overview.testerCount} tester
          {overview.testerCount === 1 ? '' : 's'}
        </p>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/api/admin/field-test?format=csv" variant="secondary" size="sm">
            Export CSV
          </ButtonLink>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-caption font-medium text-foreground hover:bg-hover"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Testers" value={overview.testerCount} tone="primary" />
        <StatCard label="Trips" value={overview.totals.trips} />
        <StatCard label="Completed" value={overview.totals.completedTrips} />
        <StatCard label="GPS trips" value={overview.totals.gpsTrips} tone="accent" />
        <StatCard label="Total miles" value={overview.totals.miles.toLocaleString()} />
        <StatCard label="Receipts" value={overview.totals.receipts} />
        <StatCard label="Expenses" value={`$${overview.totals.expenseAmount.toFixed(0)}`} />
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-caption">
            <thead className="border-b border-border bg-surface-muted/80 text-micro uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Tester</th>
                <th className="px-4 py-3 font-semibold">Last login</th>
                <th className="px-4 py-3 font-semibold">Onboarding</th>
                <th className="px-4 py-3 font-semibold">Trips</th>
                <th className="px-4 py-3 font-semibold">GPS</th>
                <th className="px-4 py-3 font-semibold">Miles</th>
                <th className="px-4 py-3 font-semibold">Receipts</th>
                <th className="px-4 py-3 font-semibold">Expenses</th>
                <th className="px-4 py-3 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {overview.testers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted">
                    No field testers yet. Share the beta login link and access code.
                  </td>
                </tr>
              ) : (
                overview.testers.map((row) => (
                  <tr key={row.id} className="border-b border-border/60 hover:bg-hover/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{row.email}</p>
                      <p className="text-muted">
                        {row.fieldTestLabel || row.displayName || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted">{formatDate(row.lastLoginAt)}</td>
                    <td className="px-4 py-3">{row.onboardingCompleted ? 'Done' : 'Pending'}</td>
                    <td className="px-4 py-3">
                      {row.tripsTotal}
                      {row.tripsActive > 0 ? ` (${row.tripsActive} active)` : ''}
                    </td>
                    <td className="px-4 py-3">{row.gpsTrips}</td>
                    <td className="px-4 py-3">{row.totalMiles.toLocaleString()}</td>
                    <td className="px-4 py-3">{row.receiptsTotal}</td>
                    <td className="px-4 py-3">
                      {row.expensesTotal}
                      {row.expenseAmount > 0 ? ` · $${row.expenseAmount.toFixed(0)}` : ''}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/users/${row.id}`} className="font-medium text-primary hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
