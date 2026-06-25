import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { TripDetailCard } from '@/components/trips/TripManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
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
  try {
    trip = tripService.serializeTrip(await tripService.getOwnedTrip(user.id, id));
  } catch {
    notFound();
  }

  return (
    <DashboardShell
      title="Trip detail"
      description={trip.purpose}
      actions={
        <div className="flex gap-2">
          <ButtonLink href="/trips" variant="secondary" size="sm">
            Back
          </ButtonLink>
          {trip.status === 'active' ? (
            <ButtonLink href={`/trips/${trip.id}/end`} size="sm">
              End trip
            </ButtonLink>
          ) : null}
          {trip.status === 'completed' ? (
            <ButtonLink href={`/trips/${trip.id}/edit`} variant="secondary" size="sm">
              Edit
            </ButtonLink>
          ) : null}
        </div>
      }
    >
      <TripDetailCard trip={trip} />
    </DashboardShell>
  );
}
