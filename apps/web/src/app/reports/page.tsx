import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReportBuilder, ReportList } from '@/components/reports/ReportManager';
import { EmptyState } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as reportService from '@/server/services/report.service';
import * as vehicleService from '@/server/services/vehicle.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ReportsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const [reports, businesses, vehicles] = await Promise.all([
    reportService.listReports(user.id),
    businessService.listBusinesses(user.id),
    vehicleService.listVehicles(user.id),
  ]);

  return (
    <DashboardShell
      title="Reports"
      description="Generate mileage and expense exports for any date range."
    >
      <ReportBuilder businesses={businesses} vehicles={vehicles} />

      {reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Use the form above to generate your first PDF, CSV, or Excel export."
        />
      ) : (
        <ReportList reports={reports} />
      )}
    </DashboardShell>
  );
}
