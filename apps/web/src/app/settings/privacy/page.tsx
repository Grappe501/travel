import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AccountExportPanel } from '@/components/settings/DataPrivacyPanel';
import { ButtonLink, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function DataPrivacySettingsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardShell
      title="Data & privacy"
      description="Export your records and review legal policies."
      actions={
        <ButtonLink href="/settings" variant="secondary" size="sm">
          All settings
        </ButtonLink>
      }
    >
      <AccountExportPanel />

      <Card>
        <CardHeader>
          <CardTitle>Legal</CardTitle>
          <CardDescription>Policies that govern use of the service.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 pt-0">
          <Link href="/legal/privacy" className="text-body font-medium text-primary hover:underline">
            Privacy policy →
          </Link>
          <Link href="/legal/terms" className="text-body font-medium text-primary hover:underline">
            Terms of service →
          </Link>
          <Link href="/legal/refunds" className="text-body font-medium text-primary hover:underline">
            Refund policy →
          </Link>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
