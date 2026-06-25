import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReceiptList } from '@/components/receipts/ReceiptManager';
import { ButtonLink, EmptyState } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as receiptService from '@/server/services/receipt.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ReceiptsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const receipts = await receiptService.listReceipts(user.id);

  return (
    <DashboardShell
      title="Receipts"
      description="Upload and track receipt images securely."
      actions={
        <ButtonLink href="/receipts/upload" size="sm">
          Upload receipt
        </ButtonLink>
      }
    >
      {receipts.length === 0 ? (
        <div className="space-y-4 text-center">
          <EmptyState
            title="No receipts yet"
            description="Upload a photo or PDF — files are stored in your private Supabase bucket."
          />
          <ButtonLink href="/receipts/upload">Upload receipt</ButtonLink>
        </div>
      ) : (
        <ReceiptList receipts={receipts} />
      )}

      {receipts.length > 0 ? (
        <p className="text-center">
          <Link href="/receipts/upload" className="text-body font-medium text-primary hover:underline">
            Upload another receipt
          </Link>
        </p>
      ) : null}
    </DashboardShell>
  );
}
