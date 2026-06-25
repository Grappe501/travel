import { ShellPage } from '@/components/layout/ShellPage';
import { EmptyState } from '@/components/ui';

export default function SettingsPage() {
  return (
    <ShellPage title="Settings" description="Account and app preferences.">
      <EmptyState
        title="Settings coming soon"
        description="Profile, notifications, and preferences will land in a future slice."
      />
    </ShellPage>
  );
}
