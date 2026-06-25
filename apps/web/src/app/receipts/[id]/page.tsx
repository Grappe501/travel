import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReceiptDetailCard } from '@/components/receipts/ReceiptManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as ocrService from '@/server/services/ocr.service';
import * as receiptService from '@/server/services/receipt.service';

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
    </DashboardShell>
  );
}
