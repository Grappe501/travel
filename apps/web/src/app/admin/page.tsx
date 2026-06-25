import { ShellPage } from '@/components/layout/ShellPage';
import { EmptyState } from '@/components/ui';

export default function AdminPage() {
  return (
    <ShellPage title="Admin" description="AdminOS — V1.1.">
      <EmptyState
        title="Admin tools not available"
        description="Operational admin features are planned for a post-V1 release."
      />
    </ShellPage>
  );
}
