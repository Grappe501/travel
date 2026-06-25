'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, CardContent, Input, Select } from '@/components/ui';
import { getExpenseCategoryOptions } from '@/lib/receipts/categories';
import type { SerializedBusiness, SerializedReceiptWithOcr } from '@/lib/types/core';

type ReceiptReviewPanelProps = {
  receipt: SerializedReceiptWithOcr;
  signedUrl: string | null;
  businesses: SerializedBusiness[];
};

export function ReceiptReviewPanel({ receipt, signedUrl, businesses }: ReceiptReviewPanelProps) {
  const router = useRouter();
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState(receipt);

  const [merchant, setMerchant] = useState(receipt.merchant ?? receipt.ocrResult?.merchant ?? '');
  const [receiptDate, setReceiptDate] = useState(
    receipt.receiptDate ?? receipt.ocrResult?.receiptDate ?? new Date().toISOString().slice(0, 10)
  );
  const [subtotal, setSubtotal] = useState(
    String(receipt.subtotal ?? receipt.ocrResult?.subtotal ?? '')
  );
  const [tax, setTax] = useState(String(receipt.tax ?? receipt.ocrResult?.tax ?? ''));
  const [total, setTotal] = useState(String(receipt.total ?? receipt.ocrResult?.total ?? ''));
  const [categorySlug, setCategorySlug] = useState(
    receipt.ocrResult?.suggestedCategorySlug ?? 'other'
  );
  const [businessId, setBusinessId] = useState(
    receipt.businessId ?? businesses.find((b) => b.isDefault)?.id ?? businesses[0]?.id ?? ''
  );

  const isApproved = current.reviewStatus === 'confirmed';
  const isImage = current.mimeType?.startsWith('image/');

  const runOcr = useCallback(async () => {
    setOcrRunning(true);
    setOcrError(null);

    const response = await fetch(`/api/receipts/${current.id}/ocr`, { method: 'POST' });
    const result = await response.json();

    if (!response.ok) {
      setOcrError(result.error ?? 'OCR failed');
      setOcrRunning(false);
      return;
    }

    const updated = result.data as SerializedReceiptWithOcr;
    setCurrent(updated);
    setMerchant(updated.merchant ?? updated.ocrResult?.merchant ?? '');
    setReceiptDate(
      updated.receiptDate ?? updated.ocrResult?.receiptDate ?? new Date().toISOString().slice(0, 10)
    );
    setSubtotal(String(updated.subtotal ?? updated.ocrResult?.subtotal ?? ''));
    setTax(String(updated.tax ?? updated.ocrResult?.tax ?? ''));
    setTotal(String(updated.total ?? updated.ocrResult?.total ?? ''));
    setCategorySlug(updated.ocrResult?.suggestedCategorySlug ?? 'other');
    setOcrRunning(false);
    router.refresh();
  }, [current.id, router]);

  useEffect(() => {
    if (
      isApproved ||
      current.ocrResult ||
      current.uploadStatus === 'processing' ||
      ocrRunning ||
      ocrError
    ) {
      return;
    }

    if (current.mimeType?.startsWith('image/') && current.uploadStatus === 'ready') {
      void runOcr();
    }
  }, [current, isApproved, ocrError, ocrRunning, runOcr]);

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!businessId) {
      setSubmitError('Select a business for this expense');
      return;
    }

    const totalNum = Number(total);
    if (!merchant.trim() || !receiptDate || !Number.isFinite(totalNum) || totalNum <= 0) {
      setSubmitError('Merchant, date, and total are required');
      return;
    }

    setSubmitting(true);

    const response = await fetch(`/api/receipts/${current.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant: merchant.trim(),
        receiptDate,
        subtotal: subtotal ? Number(subtotal) : undefined,
        tax: tax ? Number(tax) : undefined,
        total: totalNum,
        categorySlug,
        businessId,
        tripId: current.tripId ?? undefined,
        currency: current.currency,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setSubmitError(result.error ?? 'Approval failed');
      setSubmitting(false);
      return;
    }

    router.push(`/receipts/${current.id}`);
    router.refresh();
  }

  const categoryOptions = getExpenseCategoryOptions();

  return (
    <div className="space-y-6">
      {isApproved ? (
        <Alert variant="success">
          This receipt is approved
          {current.expenseId ? ` — expense ${current.expenseId.slice(0, 8)}…` : ''}.
        </Alert>
      ) : null}

      {ocrError ? (
        <Alert variant="error">
          {ocrError}
          {current.mimeType?.startsWith('image/') ? (
            <span className="mt-2 block">
              <Button type="button" variant="secondary" size="sm" onClick={() => void runOcr()}>
                Retry OCR
              </Button>
            </span>
          ) : null}
        </Alert>
      ) : null}

      {ocrRunning || current.uploadStatus === 'processing' ? (
        <Alert variant="info">Scanning receipt with AI…</Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {signedUrl && isImage ? (
          <Card>
            <CardContent className="pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signedUrl}
                alt="Receipt"
                className="mx-auto max-h-[28rem] rounded-lg object-contain"
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-4 text-body text-muted">
              {current.mimeType === 'application/pdf'
                ? 'PDF preview unavailable — enter details manually below.'
                : 'Receipt preview unavailable.'}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-section-title text-foreground">Review extracted fields</h2>
              {current.ocrResult ? (
                <Badge variant="outline">AI suggestion — edit before approving</Badge>
              ) : null}
            </div>

            {current.ocrResult?.confidenceScores ? (
              <p className="text-caption text-muted">
                OCR confidence (total):{' '}
                {current.ocrResult.confidenceScores.total != null
                  ? `${Math.round(current.ocrResult.confidenceScores.total * 100)}%`
                  : '—'}
              </p>
            ) : null}

            <form onSubmit={handleApprove} className="space-y-4">
              {submitError ? <Alert variant="error">{submitError}</Alert> : null}

              <Input
                label="Merchant"
                id="review-merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                required
                disabled={isApproved}
              />

              <Input
                label="Receipt date"
                id="review-date"
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                required
                disabled={isApproved}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Subtotal"
                  id="review-subtotal"
                  type="number"
                  step="0.01"
                  min="0"
                  value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)}
                  disabled={isApproved}
                />
                <Input
                  label="Tax"
                  id="review-tax"
                  type="number"
                  step="0.01"
                  min="0"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  disabled={isApproved}
                />
                <Input
                  label="Total"
                  id="review-total"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  required
                  disabled={isApproved}
                />
              </div>

              <Select
                label="Category (suggestion only until you approve)"
                id="review-category"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                options={categoryOptions}
                disabled={isApproved}
              />

              {businesses.length > 0 ? (
                <Select
                  label="Business"
                  id="review-business"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  options={businesses.map((b) => ({ value: b.id, label: b.name }))}
                  disabled={isApproved}
                />
              ) : (
                <Alert variant="warning">
                  Create a business in Settings before approving this receipt.
                </Alert>
              )}

              {!isApproved ? (
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={submitting || ocrRunning || !businesses.length}>
                    {submitting ? 'Approving…' : 'Approve & create expense'}
                  </Button>
                  {current.mimeType?.startsWith('image/') ? (
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={ocrRunning}
                      onClick={() => void runOcr()}
                    >
                      Re-run OCR
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
