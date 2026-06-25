import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReceiptUploadForm } from '@/components/receipts/ReceiptManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ReceiptUploadPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const [businesses, trips] = await Promise.all([
    businessService.listBusinesses(user.id),
    tripService.listTrips(user.id),
  ]);

  return (
    <DashboardShell
      title="Upload receipt"
      description="Choose a photo or PDF. You will review AI-extracted fields before approval."
      actions={<ButtonLink href="/receipts" variant="secondary" size="sm">Back</ButtonLink>}
    >
      <ReceiptUploadForm businesses={businesses} trips={trips} />
    </DashboardShell>
  );
}
