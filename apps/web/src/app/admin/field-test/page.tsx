import { DashboardShell } from '@/components/layout/DashboardShell';
import { FieldTestDashboard } from '@/components/admin/FieldTestDashboard';
import { AdminNavLinks } from '@/components/admin/AdminManager';
import { Alert, ButtonLink } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function AdminFieldTestPage() {
  return (
    <DashboardShell
      wide
      title="Field test dashboard"
      description="Track beta tester activity, mileage, receipts, and expenses across the program."
      eyebrow="Admin"
      actions={
        <ButtonLink href="/admin" variant="secondary" size="sm">
          Admin home
        </ButtonLink>
      }
    >
      <Alert variant="info">
        Each tester signs in with their own email and the shared field test access code. Data stays
        isolated per account for accurate feedback.
      </Alert>
      <FieldTestDashboard />
      <AdminNavLinks />
    </DashboardShell>
  );
}
