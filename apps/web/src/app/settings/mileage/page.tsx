import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MileageSettingsForm } from '@/components/settings/MileageSettingsForm';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as mileageService from '@/server/services/mileage.service';

export const dynamic = 'force-dynamic';

export default async function MileageSettingsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const settings = await mileageService.getMileageSettings(user.id);

  return (
    <DashboardShell
      title="Mileage rates"
      description="Choose how business miles are reimbursed."
      actions={<ButtonLink href="/settings" variant="secondary" size="sm">Settings</ButtonLink>}
    >
      <MileageSettingsForm settings={settings} />
      <p className="text-caption text-muted">
        Business-specific rates can be set on each{' '}
        <Link href="/businesses" className="text-primary hover:underline">
          business profile
        </Link>
        .
      </p>
    </DashboardShell>
  );
}
