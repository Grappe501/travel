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
      <AdminUserSearch />
      <AdminNavLinks />
    </DashboardShell>
  );
}
