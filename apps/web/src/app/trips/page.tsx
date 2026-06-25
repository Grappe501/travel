import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ActiveTripBanner, TripList } from '@/components/trips/TripManager';
import { ButtonLink, EmptyState } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';

export default async function TripsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const [trips, activeTrip] = await Promise.all([
    tripService.listTrips(user.id),
    tripService.getActiveTrip(user.id),
  ]);

  const completedCount = trips.filter((t) => t.status === 'completed').length;

  return (
    <DashboardShell
      title="Trips"
      description="Track business mileage from start to finish."
      actions={
        activeTrip ? undefined : (
          <ButtonLink href="/trips/start" size="sm">
            Start trip
          </ButtonLink>
        )
      }
    >
      {activeTrip ? <ActiveTripBanner trip={activeTrip} /> : null}

      {completedCount === 0 && !activeTrip ? (
        <div className="space-y-4 text-center">
          <EmptyState
            title="No trips yet"
            description="Start your first business trip to track miles and reimbursement."
          />
          <ButtonLink href="/trips/start">Start trip</ButtonLink>
        </div>
      ) : (
        <TripList trips={trips} />
      )}

      {!activeTrip && completedCount > 0 ? (
        <p className="text-center">
          <Link href="/trips/start" className="text-body font-medium text-primary hover:underline">
            Start another trip
          </Link>
        </p>
      ) : null}
    </DashboardShell>
  );
}
