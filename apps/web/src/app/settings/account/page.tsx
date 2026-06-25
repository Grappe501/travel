import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AccountSettingsForm } from '@/components/settings/AccountSettingsForm';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as settingsService from '@/server/services/settings.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AccountSettingsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const settings = await settingsService.getAccountSettings(user.id);

  return (
    <DashboardShell
      title="Account"
      description="Profile details used across trips, expenses, and reports."
      eyebrow="Settings"
      actions={
        <ButtonLink href="/settings" variant="secondary" size="sm">
          All settings
        </ButtonLink>
      }
    >
      <AccountSettingsForm settings={settings} />
      <p className="text-body">
        <Link href="/settings/security" className="font-medium text-primary hover:underline">
          Security settings →
        </Link>
      </p>
    </DashboardShell>
  );
}
