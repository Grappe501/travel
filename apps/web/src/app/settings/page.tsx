import { redirect } from 'next/navigation';
import { SyncStatusPanel } from '@/components/offline/SyncStatusPanel';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  SETTINGS_ACCOUNT_GROUP,
  SETTINGS_PREFERENCES_GROUP,
  SETTINGS_WORKSPACE_GROUP,
  SettingsNavList,
} from '@/components/settings/SettingsNavList';
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
        <h2 className="text-subheading font-semibold text-foreground">Account &amp; security</h2>
        <SettingsNavList items={SETTINGS_ACCOUNT_GROUP} />
      </section>

      <section className="space-y-3">
        <h2 className="text-subheading font-semibold text-foreground">Preferences</h2>
        <SettingsNavList items={SETTINGS_PREFERENCES_GROUP} />
      </section>

      <section className="space-y-3">
        <h2 className="text-subheading font-semibold text-foreground">Workspace</h2>
        <SettingsNavList items={SETTINGS_WORKSPACE_GROUP} />
      </section>
    </DashboardShell>
  );
}
