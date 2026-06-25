import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ShellNavActions } from '@/components/layout/ShellNavActions';
import { TripDetailCard } from '@/components/trips/TripManager';
import { TripDetailActions } from '@/components/trips/TripEndChecklist';
import { TripExpenseLinkPanel, TripExpensesList } from '@/components/expenses/ExpenseManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as expenseService from '@/server/services/expense.service';
import * as receiptService from '@/server/services/receipt.service';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function TripDetailPage({ params }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

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

  const canLinkExpenses = trip.status === 'active' || trip.status === 'completed';
  const uploadHref = `/receipts/upload?tripId=${trip.id}&businessId=${trip.businessId}`;
  const addExpenseHref = `/expenses/new?tripId=${trip.id}`;

  return (
    <DashboardShell
      title={trip.status === 'active' ? 'Active trip' : 'Trip detail'}
      description={trip.purpose}
      actions={
        <ShellNavActions backHref="/trips" backLabel="All trips">
          {trip.status === 'active' ? (
            <>
              <ButtonLink href={uploadHref} variant="secondary" size="sm">
                Upload receipt
              </ButtonLink>
              <ButtonLink href={addExpenseHref} variant="secondary" size="sm">
                Add expense
              </ButtonLink>
              <ButtonLink href={`/trips/${trip.id}/end`} size="sm">
                End trip
              </ButtonLink>
            </>
          ) : null}
          {trip.status === 'completed' ? (
            <ButtonLink href={`/trips/${trip.id}/edit`} variant="secondary" size="sm">
              Edit
            </ButtonLink>
          ) : null}
        </ShellNavActions>
      }
    >
      {canLinkExpenses ? (
        <TripExpenseLinkPanel
          trip={trip}
          unlinkedExpenses={unlinkedExpenses}
          unlinkedReceipts={unlinkedReceipts}
        />
      ) : null}
      <div className={canLinkExpenses ? 'mt-6' : undefined}>
        <TripDetailCard trip={trip} />
      </div>
      <div className="mt-6 space-y-2">
        <h2 className="text-section-title text-foreground">Linked expenses</h2>
        <TripExpensesList expenses={tripExpenses} />
      </div>
      {canLinkExpenses ? (
        <div className="mt-6">
          <TripDetailActions trip={trip} />
        </div>
      ) : null}
    </DashboardShell>
  );
}
