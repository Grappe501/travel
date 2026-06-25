import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { TripStartForm } from '@/components/trips/TripManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as tripService from '@/server/services/trip.service';
import * as vehicleService from '@/server/services/vehicle.service';

export const dynamic = 'force-dynamic';

export default async function TripStartPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const [businesses, vehicles, activeTrip] = await Promise.all([
    businessService.listBusinesses(user.id),
    vehicleService.listVehicles(user.id),
    tripService.getActiveTrip(user.id),
  ]);

  return (
    <DashboardShell
      title="Start trip"
      description="Record purpose, vehicle, and optional starting odometer."
      actions={<ButtonLink href="/trips" variant="secondary" size="sm">Back</ButtonLink>}
    >
      <TripStartForm
        businesses={businesses}
        vehicles={vehicles}
        activeTrip={activeTrip}
      />
    </DashboardShell>
  );
}
