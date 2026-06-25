import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SyncStatusPanel } from '@/components/offline/SyncStatusPanel';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardShell title="Settings" description="Account and app preferences.">
      <SyncStatusPanel />

      <Card>
        <CardHeader>
          <CardTitle>Mileage</CardTitle>
          <CardDescription>IRS, company, or custom reimbursement rates.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Link href="/settings/mileage" className="text-body font-medium text-primary hover:underline">
            Configure mileage rates →
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI & suggestions</CardTitle>
          <CardDescription>Review past OCR runs and suggestion outcomes.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Link href="/ai/history" className="text-body font-medium text-primary hover:underline">
            AI history →
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Businesses & vehicles</CardTitle>
          <CardDescription>Manage profiles used for trips and reports.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 pt-0">
          <Link href="/businesses" className="text-body font-medium text-primary hover:underline">
            Businesses →
          </Link>
          <Link href="/vehicles" className="text-body font-medium text-primary hover:underline">
            Vehicles →
          </Link>
          <Link href="/clients" className="text-body font-medium text-primary hover:underline">
            Clients & projects →
          </Link>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
