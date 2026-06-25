import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReceiptReviewPanel } from '@/components/receipts/ReceiptReviewPanel';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as ocrService from '@/server/services/ocr.service';
import * as receiptService from '@/server/services/receipt.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = { params: Promise<{ id: string }> };

export default async function ReceiptReviewPage({ params }: PageProps) {
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

  if (receipt.reviewStatus === 'confirmed') {
    redirect(`/receipts/${id}`);
  }

  const [businesses, signed] = await Promise.all([
    businessService.listBusinesses(user.id),
    receiptService.getReceiptSignedUrl(user.id, id).catch(() => null),
  ]);

  return (
    <DashboardShell
      title="Review receipt"
      description="Verify AI-extracted fields before creating an expense."
      actions={
        <ButtonLink href={`/receipts/${id}`} variant="secondary" size="sm">
          Back
        </ButtonLink>
      }
    >
      <ReceiptReviewPanel
        receipt={receipt}
        signedUrl={signed?.signedUrl ?? null}
        businesses={businesses}
      />
    </DashboardShell>
  );
}
