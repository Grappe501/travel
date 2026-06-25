'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Badge, Button, Card, CardContent, Select } from '@/components/ui';
import { nativeFieldClassName } from '@/lib/a11y/form-styles';
import type { SerializedBusiness, SerializedReport, SerializedVehicle } from '@/lib/types/core';

const REPORT_TYPES = [
  { value: 'mileage', label: 'Mileage only' },
  { value: 'expense', label: 'Expenses only' },
  { value: 'combined', label: 'Combined' },
];

const REPORT_FORMATS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
];

function defaultDateRange() {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 30);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function statusBadge(status: string) {
  switch (status) {
    case 'ready':
      return <Badge variant="success">Ready</Badge>;
    case 'pending':
      return <Badge variant="warning">Generating</Badge>;
    case 'failed':
      return <Badge variant="danger">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

type ReportBuilderProps = {
  businesses: SerializedBusiness[];
  vehicles: SerializedVehicle[];
};

export function ReportBuilder({ businesses, vehicles }: ReportBuilderProps) {
  const router = useRouter();
  const defaults = defaultDateRange();
  const [reportType, setReportType] = useState('combined');
  const [format, setFormat] = useState('pdf');
  const [dateRangeStart, setDateRangeStart] = useState(defaults.start);
  const [dateRangeEnd, setDateRangeEnd] = useState(defaults.end);
  const [businessId, setBusinessId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportType,
        format,
        dateRangeStart,
        dateRangeEnd,
        ...(businessId ? { businessId } : {}),
        ...(vehicleId ? { vehicleId } : {}),
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not generate report');
      setLoading(false);
      return;
    }

    router.push(`/reports/${result.data.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <Select
            label="Report type"
            id="report-type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={REPORT_TYPES}
          />

          <Select
            label="Export format"
            id="report-format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={REPORT_FORMATS}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="range-start" className="block text-subheading text-foreground">
                Start date
              </label>
              <input
                id="range-start"
                type="date"
                required
                value={dateRangeStart}
                onChange={(e) => setDateRangeStart(e.target.value)}
                aria-describedby="report-range-hint"
                className={nativeFieldClassName}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="range-end" className="block text-subheading text-foreground">
                End date
              </label>
              <input
                id="range-end"
                type="date"
                required
                value={dateRangeEnd}
                onChange={(e) => setDateRangeEnd(e.target.value)}
                aria-describedby="report-range-hint"
                className={nativeFieldClassName}
              />
            </div>
          </div>
          <p id="report-range-hint" className="text-caption text-muted">Maximum range: 366 days</p>

          {businesses.length > 0 ? (
            <Select
              label="Business (optional)"
              id="report-business"
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
              placeholder="All businesses"
              options={businesses.map((b) => ({ value: b.id, label: b.name }))}
            />
          ) : null}

          {vehicles.length > 0 && (reportType === 'mileage' || reportType === 'combined') ? (
            <Select
              label="Vehicle (optional)"
              id="report-vehicle"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              placeholder="All vehicles"
              options={vehicles.map((v) => ({ value: v.id, label: v.nickname }))}
            />
          ) : null}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Generating…' : 'Generate report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type ReportListProps = {
  reports: SerializedReport[];
};

export function ReportList({ reports }: ReportListProps) {
  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-section-title text-foreground">Recent reports</h2>
      {reports.map((report) => (
        <Card key={report.id}>
          <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {statusBadge(report.status)}
                <Link href={`/reports/${report.id}`} className="text-card-title hover:underline">
                  {report.reportType} · {report.format.toUpperCase()}
                </Link>
              </div>
              <p className="text-caption text-muted">
                {report.dateRangeStart} → {report.dateRangeEnd}
                {report.generatedAt
                  ? ` · ${new Date(report.generatedAt).toLocaleString()}`
                  : ''}
              </p>
            </div>
            {report.status === 'ready' ? (
              <a
                href={`/api/reports/${report.id}/download`}
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-body font-medium text-primary-foreground hover:opacity-90"
              >
                Download
              </a>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type ReportDetailProps = {
  report: SerializedReport;
};

export function ReportDetailCard({ report }: ReportDetailProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {statusBadge(report.status)}
          <h2 className="text-section-title text-foreground">
            {report.reportType} report ({report.format.toUpperCase()})
          </h2>
        </div>

        <dl className="grid gap-3 text-body sm:grid-cols-2">
          <div>
            <dt className="text-caption text-muted">Period</dt>
            <dd>
              {report.dateRangeStart} → {report.dateRangeEnd}
            </dd>
          </div>
          <div>
            <dt className="text-caption text-muted">Status</dt>
            <dd>{report.status}</dd>
          </div>
          {report.fileSizeBytes ? (
            <div>
              <dt className="text-caption text-muted">File size</dt>
              <dd>{(report.fileSizeBytes / 1024).toFixed(1)} KB</dd>
            </div>
          ) : null}
          {report.generatedAt ? (
            <div>
              <dt className="text-caption text-muted">Generated</dt>
              <dd>{new Date(report.generatedAt).toLocaleString()}</dd>
            </div>
          ) : null}
        </dl>

        {report.status === 'failed' && report.errorMessage ? (
          <Alert variant="error">{report.errorMessage}</Alert>
        ) : null}

        {report.status === 'ready' ? (
          <a
            href={`/api/reports/${report.id}/download`}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-body font-medium text-primary-foreground hover:opacity-90"
          >
            Download {report.format.toUpperCase()}
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}
