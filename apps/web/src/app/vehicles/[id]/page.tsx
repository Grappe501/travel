import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ButtonLink } from '@/components/ui';
import { VehicleForm } from '@/components/vehicles/VehicleManager';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as vehicleService from '@/server/services/vehicle.service';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function VehicleEditPage({ params }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const businesses = await businessService.listBusinesses(user.id);

  let vehicle;
  try {
    vehicle = vehicleService.serializeVehicle(await vehicleService.getOwnedVehicle(user.id, id));
  } catch {
    notFound();
  }

  return (
    <DashboardShell
      title="Edit vehicle"
      description={vehicle.nickname}
      actions={<ButtonLink href="/vehicles" variant="secondary" size="sm">Back</ButtonLink>}
    >
      <VehicleForm businesses={businesses} initial={vehicle} />
    </DashboardShell>
  );
}
