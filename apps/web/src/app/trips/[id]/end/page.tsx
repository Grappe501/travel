import { notFound, redirect } from 'next/navigation';
import { OfflineTripEndShell } from '@/components/offline/OfflineTripEndShell';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ShellNavActions } from '@/components/layout/ShellNavActions';
import { TripEndChecklist } from '@/components/trips/TripEndChecklist';
import { TripEndForm } from '@/components/trips/TripManager';
import { isOfflineTripId } from '@/lib/offline/ids';
import { requireSessionUser } from '@/lib/auth/server';
import * as expenseService from '@/server/services/expense.service';
import * as receiptService from '@/server/services/receipt.service';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function TripEndPage({ params }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  if (isOfflineTripId(id)) {
    return <OfflineTripEndShell localId={id} />;
  }

  let trip;
  let tripExpenses;
  let unlinkedExpenses;
  let unlinkedReceipts;
  try {
    trip = tripService.serializeTrip(await tripService.getOwnedTrip(user.id, id));
    [tripExpenses, unlinkedExpenses, unlinkedReceipts] = await Promise.all([
      expenseService.listExpensesForTrip(user.id, id),
      expenseService.listUnlinkedExpensesForBusiness(user.id, trip.businessId),
      receiptService.listUnlinkedReceiptsForBusiness(user.id, trip.businessId),
    ]);
  } catch {
    notFound();
  }

  if (trip.status !== 'active') {
    redirect(`/trips/${trip.id}`);
  }

  return (
    <DashboardShell
      title="End trip"
      description="Review expenses, then enter your ending odometer."
      actions={<ShellNavActions backHref={`/trips/${trip.id}`} backLabel="Active trip" />}
    >
      <div className="space-y-6">
        <TripEndChecklist
          trip={trip}
          unlinkedExpenses={unlinkedExpenses}
          unlinkedReceipts={unlinkedReceipts}
          tripExpenseCount={tripExpenses.length}
        />
        <TripEndForm trip={trip} />
      </div>
    </DashboardShell>
  );
}
