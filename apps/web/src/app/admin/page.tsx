import { AdminNavLinks, AdminUserSearch } from '@/components/admin/AdminManager';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Alert } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function AdminPage() {
  return (
    <DashboardShell
      title="Admin"
      description="Read-only customer lookup and system health for support staff."
    >
      <Alert variant="info">
        Admin access is read-only. Lookups are recorded in the audit log.
      </Alert>
      <div className="flex flex-wrap gap-3">
        <a href="/admin/field-test" className="text-body font-medium text-primary hover:underline">
          Field test dashboard →
        </a>
      </div>
      <AdminUserSearch />
      <AdminNavLinks />
    </DashboardShell>
  );
}
