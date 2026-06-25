import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { EmptyState } from '@/components/ui';
import { VehicleForm, VehicleList } from '@/components/vehicles/VehicleManager';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as vehicleService from '@/server/services/vehicle.service';

export const dynamic = 'force-dynamic';

export default async function VehiclesPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const [vehicles, businesses] = await Promise.all([
    vehicleService.listVehicles(user.id),
    businessService.listBusinesses(user.id),
  ]);

  return (
    <DashboardShell
      title="Vehicles"
      description="Add vehicles and record starting odometer readings."
    >
      <VehicleForm businesses={businesses} />
      {vehicles.length === 0 ? (
        <EmptyState
          title="No vehicles yet"
          description="Add your first vehicle using the form above."
        />
      ) : (
        <VehicleList vehicles={vehicles} businesses={businesses} />
      )}
    </DashboardShell>
  );
}
