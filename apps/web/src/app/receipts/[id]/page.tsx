import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReceiptAttachForm } from '@/components/expenses/ExpenseManager';
import { ReceiptDetailCard } from '@/components/receipts/ReceiptManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as ocrService from '@/server/services/ocr.service';
import * as receiptService from '@/server/services/receipt.service';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = { params: Promise<{ id: string }> };

export default async function ReceiptDetailPage({ params }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  let receipt;
  try {
    receipt = await ocrService.getReceiptForReview(user.id, id);
  } catch {
    notFound();
  }

  let signedUrl: string | null = null;
  try {
    const signed = await receiptService.getReceiptSignedUrl(user.id, id);
    signedUrl = signed.signedUrl;
  } catch {
    signedUrl = null;
  }

  const [businesses, trips] = await Promise.all([
    businessService.listBusinesses(user.id),
    tripService.listTrips(user.id),
  ]);

  return (
    <DashboardShell
      title="Receipt detail"
      description={receipt.merchant ?? 'Uploaded receipt'}
      actions={
        <div className="flex flex-wrap gap-2">
          {receipt.reviewStatus !== 'confirmed' ? (
            <ButtonLink href={`/receipts/${receipt.id}/review`} size="sm">
              Review
            </ButtonLink>
          ) : null}
          <ButtonLink href="/receipts" variant="secondary" size="sm">
            Back
          </ButtonLink>
        </div>
      }
    >
      <ReceiptDetailCard receipt={receipt} signedUrl={signedUrl} />
      {businesses.length > 0 && trips.length > 0 ? (
        <ReceiptAttachForm
          receiptId={receipt.id}
          businessId={receipt.businessId}
          currentTripId={receipt.tripId}
          businesses={businesses}
          trips={trips}
        />
      ) : null}
    </DashboardShell>
  );
}
