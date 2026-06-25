import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ShellNavActions } from '@/components/layout/ShellNavActions';
import { ReceiptUploadForm } from '@/components/receipts/ReceiptManager';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = {
  searchParams: Promise<{ tripId?: string; businessId?: string }>;
};

export default async function ReceiptUploadPage({ searchParams }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { tripId: tripIdFromQuery, businessId: businessIdFromQuery } = await searchParams;

  const [businesses, trips, activeTrip] = await Promise.all([
    businessService.listBusinesses(user.id),
    tripService.listTrips(user.id),
    tripIdFromQuery ? Promise.resolve(null) : tripService.getActiveTrip(user.id),
  ]);

  const linkedTripId = tripIdFromQuery ?? activeTrip?.id;
  const linkedTrip = linkedTripId ? trips.find((trip) => trip.id === linkedTripId) : undefined;
  const lockedToTrip = Boolean(tripIdFromQuery && linkedTrip);

  return (
    <DashboardShell
      title="Upload receipt"
      description={
        linkedTrip
          ? lockedToTrip
            ? `Upload a receipt for ${linkedTrip.purpose}. You will review AI-extracted fields before approval.`
            : `Adding to your active trip: ${linkedTrip.purpose}. You will review AI-extracted fields before approval.`
          : 'Choose a photo or PDF. You will review AI-extracted fields before approval.'
      }
      actions={
        <ShellNavActions
          backHref={linkedTrip ? `/trips/${linkedTrip.id}` : '/receipts'}
          backLabel={linkedTrip ? 'Active trip' : 'Receipts'}
        />
      }
    >
      <ReceiptUploadForm
        businesses={businesses}
        trips={trips}
        defaultTripId={linkedTrip?.id}
        defaultBusinessId={businessIdFromQuery ?? linkedTrip?.businessId}
        lockTrip={lockedToTrip}
      />
    </DashboardShell>
  );
}
