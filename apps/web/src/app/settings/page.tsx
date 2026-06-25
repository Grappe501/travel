import { redirect } from 'next/navigation';
import { SyncStatusPanel } from '@/components/offline/SyncStatusPanel';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  SETTINGS_ACCOUNT_GROUP,
  SETTINGS_PREFERENCES_GROUP,
  SETTINGS_WORKSPACE_GROUP,
  SettingsNavList,
} from '@/components/settings/SettingsNavList';
import { SectionHeader } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardShell
      title="Settings"
      description="Account, preferences, and workspace configuration."
      eyebrow="Preferences"
    >
      <SyncStatusPanel />

      <section className="space-y-3">
        <SectionHeader title="Account & security" />
        <SettingsNavList items={SETTINGS_ACCOUNT_GROUP} />
      </section>

      <section className="space-y-3">
        <SectionHeader title="Preferences" />
        <SettingsNavList items={SETTINGS_PREFERENCES_GROUP} />
      </section>

      <section className="space-y-3">
        <SectionHeader title="Workspace" />
        <SettingsNavList items={SETTINGS_WORKSPACE_GROUP} />
      </section>
    </DashboardShell>
  );
}
