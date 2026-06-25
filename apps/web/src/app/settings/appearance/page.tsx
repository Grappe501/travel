import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AppearanceSettingsForm } from '@/components/settings/AppearanceSettingsForm';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function AppearanceSettingsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardShell
      title="Appearance"
      description="Choose light, dark, or system theme on this device."
      eyebrow="Settings"
      actions={
        <ButtonLink href="/settings" variant="secondary" size="sm">
          All settings
        </ButtonLink>
      }
    >
      <AppearanceSettingsForm />
      <p className="text-caption text-muted">
        Theme preference is stored locally in your browser and does not sync across devices yet.
      </p>
      <p className="text-body">
        <Link href="/settings" className="font-medium text-primary hover:underline">
          ← All settings
        </Link>
      </p>
    </DashboardShell>
  );
}
