import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { TripEditForm } from '@/components/trips/TripManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function TripEditPage({ params }: PageProps) {
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

  if (trip.status !== 'completed') {
    redirect(`/trips/${trip.id}`);
  }

  return (
    <DashboardShell
      title="Edit trip"
      description="Update trip details and odometer readings."
      actions={<ButtonLink href={`/trips/${trip.id}`} variant="secondary" size="sm">Back</ButtonLink>}
    >
      <TripEditForm trip={trip} />
    </DashboardShell>
  );
}
