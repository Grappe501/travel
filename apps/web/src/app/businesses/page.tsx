import { ShellPage } from '@/components/layout/ShellPage';
import { EmptyState } from '@/components/ui';

export default function BusinessesPage() {
  return (
    <ShellPage title="Businesses" description="Business profiles — MEC-V1-S005.">
      <EmptyState
        title="No businesses yet"
        description="Create business profiles to organize trips, rates, and reports."
      />
    </ShellPage>
  );
}
