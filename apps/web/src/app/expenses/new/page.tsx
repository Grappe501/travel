import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ShellNavActions } from '@/components/layout/ShellNavActions';
import { ExpenseForm } from '@/components/expenses/ExpenseManager';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = { searchParams: Promise<{ tripId?: string }> };

export default async function NewExpensePage({ searchParams }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { tripId: tripIdFromQuery } = await searchParams;

  const [businesses, trips, activeTrip] = await Promise.all([
    businessService.listBusinesses(user.id),
    tripService.listTrips(user.id),
    tripIdFromQuery ? Promise.resolve(null) : tripService.getActiveTrip(user.id),
  ]);

  if (businesses.length === 0) {
    redirect('/businesses');
  }

  const linkedTripId = tripIdFromQuery ?? activeTrip?.id;
  const linkedTrip = linkedTripId ? trips.find((trip) => trip.id === linkedTripId) : undefined;
  const lockedToTrip = Boolean(tripIdFromQuery && linkedTrip);

  return (
    <DashboardShell
      title="Add expense"
      description={
        linkedTrip
          ? lockedToTrip
            ? `Record an expense for ${linkedTrip.purpose}.`
            : `Adding to your active trip: ${linkedTrip.purpose}.`
          : 'Record a business expense without a receipt.'
      }
      actions={
        linkedTrip ? (
          <ShellNavActions backHref={`/trips/${linkedTrip.id}`} backLabel="Active trip" />
        ) : (
          <ShellNavActions backHref="/expenses" backLabel="Expenses" />
        )
      }
    >
      <ExpenseForm
        businesses={businesses}
        trips={trips}
        defaultTripId={linkedTrip?.id}
        lockTrip={lockedToTrip}
        returnToTripId={linkedTrip?.id}
      />
    </DashboardShell>
  );
}
