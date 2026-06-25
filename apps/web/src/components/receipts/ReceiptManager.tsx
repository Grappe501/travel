'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useOffline } from '@/components/offline/OfflineProvider';
import { Alert, Badge, Button, ButtonLink, Card, CardContent, Select } from '@/components/ui';
import { nativeFieldClassName } from '@/lib/a11y/form-styles';
import { isBrowserOnline } from '@/lib/offline/connectivity';
import { enqueueOfflineReceiptUpload } from '@/lib/offline/queue';
import { cn } from '@/lib/utils/cn';
import { MAX_RECEIPT_FILE_BYTES } from '@/lib/receipts/constants';
import type { SerializedBusiness, SerializedReceipt, SerializedTrip } from '@/lib/types/core';

function receiptStatusBadge(status: string) {
  switch (status) {
    case 'uploaded':
      return <Badge variant="success">Uploaded</Badge>;
    case 'processing':
      return <Badge variant="warning">Processing</Badge>;
    case 'needs_review':
      return <Badge variant="warning">Needs review</Badge>;
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'failed':
      return <Badge variant="danger">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatFileSize(bytes: number | null) {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type ReceiptUploadFormProps = {
  businesses: SerializedBusiness[];
  trips: SerializedTrip[];
};

export function ReceiptUploadForm({ businesses, trips }: ReceiptUploadFormProps) {
  const router = useRouter();
  const { refresh, syncNow } = useOffline();
  const inputRef = useRef<HTMLInputElement>(null);
  const [businessId, setBusinessId] = useState('');
  const [tripId, setTripId] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(file: File | null) {
    setError(null);
    setSelectedFile(file);

    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }

    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setError('Choose a receipt image or PDF');
      return;
    }

    if (selectedFile.size > MAX_RECEIPT_FILE_BYTES) {
      setError('File must be 10 MB or smaller');
      return;
    }

    setLoading(true);
    setError(null);

    if (!isBrowserOnline()) {
      try {
        await enqueueOfflineReceiptUpload(selectedFile, {
          ...(businessId ? { businessId } : {}),
          ...(tripId ? { tripId } : {}),
        });
        await refresh();
        router.push('/receipts');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save receipt offline');
        setLoading(false);
      }
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (businessId) formData.append('businessId', businessId);
    if (tripId) formData.append('tripId', tripId);
    formData.append('idempotencyKey', crypto.randomUUID());

    const response = await fetch('/api/receipts/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Upload failed');
      setLoading(false);
      return;
    }

    await refresh();
    await syncNow();
    router.push(`/receipts/${result.data.id}/review`);
    router.refresh();
  }

  const completedTrips = trips.filter((t) => t.status === 'completed');

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <div className="space-y-2">
            <label htmlFor="receipt-file" className="block text-subheading text-foreground">
              Receipt file
            </label>
            <input
              ref={inputRef}
              id="receipt-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf"
              capture="environment"
              aria-describedby="receipt-file-hint"
              className={cn(
                nativeFieldClassName,
                'file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground'
              )}
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            <p id="receipt-file-hint" className="text-caption text-muted">
              JPEG, PNG, WebP, HEIC, or PDF · max 10 MB · stored privately
            </p>
          </div>

          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Receipt preview"
              className="max-h-64 rounded-lg border border-border object-contain"
            />
          ) : null}

          {businesses.length > 0 ? (
            <Select
              label="Business (optional)"
              id="receipt-business"
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
              placeholder="No business"
              options={businesses.map((b) => ({ value: b.id, label: b.name }))}
            />
          ) : null}

          {completedTrips.length > 0 ? (
            <Select
              label="Trip (optional)"
              id="receipt-trip"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              placeholder="No trip"
              options={completedTrips.map((t) => ({
                value: t.id,
                label: `${t.purpose} (${t.miles ?? 0} mi)`,
              }))}
            />
          ) : null}

          <Button type="submit" fullWidth disabled={loading || !selectedFile}>
            {loading ? 'Uploading…' : 'Upload receipt'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type ReceiptListProps = {
  receipts: SerializedReceipt[];
};

export function ReceiptList({ receipts }: ReceiptListProps) {
  if (receipts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-section-title text-foreground">Recent receipts</h2>
      {receipts.map((receipt) => (
        <Card key={receipt.id}>
          <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {receiptStatusBadge(receipt.displayStatus)}
                <Link
                  href={`/receipts/${receipt.id}`}
                  className="text-card-title text-foreground hover:underline"
                >
                  {receipt.merchant ?? 'Receipt'}
                </Link>
              </div>
              <p className="text-caption text-muted">
                {new Date(receipt.createdAt).toLocaleString()} · {formatFileSize(receipt.fileSizeBytes)}
                {receipt.mimeType ? ` · ${receipt.mimeType}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {receipt.reviewStatus !== 'confirmed' ? (
                <ButtonLink href={`/receipts/${receipt.id}/review`} size="sm">
                  Review
                </ButtonLink>
              ) : null}
              <ButtonLink href={`/receipts/${receipt.id}`} variant="secondary" size="sm">
                View
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type ReceiptDetailProps = {
  receipt: SerializedReceipt & {
    subtotal?: number | null;
    tax?: number | null;
    expenseId?: string | null;
  };
  signedUrl: string | null;
};

export function ReceiptDetailCard({ receipt, signedUrl }: ReceiptDetailProps) {
  const isImage = receipt.mimeType?.startsWith('image/');

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {receiptStatusBadge(receipt.displayStatus)}
            <h2 className="text-section-title text-foreground">
              {receipt.merchant ?? 'Receipt'}
            </h2>
          </div>

          <dl className="grid gap-3 text-body sm:grid-cols-2">
            <div>
              <dt className="text-caption text-muted">Uploaded</dt>
              <dd>{new Date(receipt.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">File size</dt>
              <dd>{formatFileSize(receipt.fileSizeBytes)}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Type</dt>
              <dd>{receipt.mimeType ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Upload status</dt>
              <dd>{receipt.uploadStatus}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Review status</dt>
              <dd>{receipt.reviewStatus}</dd>
            </div>
            {receipt.total !== null ? (
              <div>
                <dt className="text-caption text-muted">Total</dt>
                <dd>
                  {receipt.currency} {receipt.total.toFixed(2)}
                </dd>
              </div>
            ) : null}
            {'expenseId' in receipt && receipt.expenseId ? (
              <div>
                <dt className="text-caption text-muted">Expense</dt>
                <dd>
                  <Link href={`/expenses/${receipt.expenseId}`} className="text-primary hover:underline">
                    View expense
                  </Link>
                </dd>
              </div>
            ) : null}
            {receipt.tripId ? (
              <div>
                <dt className="text-caption text-muted">Trip</dt>
                <dd>
                  <Link href={`/trips/${receipt.tripId}`} className="text-primary hover:underline">
                    View trip
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </CardContent>
      </Card>

      {signedUrl && isImage ? (
        <Card>
          <CardContent className="pt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={signedUrl}
              alt="Receipt"
              className="mx-auto max-h-[32rem] rounded-lg object-contain"
            />
          </CardContent>
        </Card>
      ) : null}

      {signedUrl && receipt.mimeType === 'application/pdf' ? (
        <Card>
          <CardContent className="pt-4">
            <a
              href={signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body font-medium text-primary hover:underline"
            >
              Open PDF receipt
            </a>
          </CardContent>
        </Card>
      ) : null}

      {!signedUrl ? (
        <Alert variant="warning">
          Preview unavailable — configure Supabase Storage and the private receipts bucket.
        </Alert>
      ) : null}
    </div>
  );
}

export { receiptStatusBadge };
