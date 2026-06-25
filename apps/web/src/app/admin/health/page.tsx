import Link from 'next/link';
import { AdminHealthPanel } from '@/components/admin/AdminUserSummary';
import { DashboardShell } from '@/components/layout/DashboardShell';
import * as adminService from '@/server/services/admin.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminHealthPage() {
  const health = await adminService.getAdminSystemHealth();

  return (
    <DashboardShell
      title="System health"
      description="Dependency configuration flags and database connectivity (no secrets)."
      actions={
        <Link href="/admin" className="text-body font-medium text-primary hover:underline">
          Back to admin
        </Link>
      }
    >
      <AdminHealthPanel health={health} />
    </DashboardShell>
  );
}
