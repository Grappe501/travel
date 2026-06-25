import { ShellPage } from '@/components/layout/ShellPage';
import { EmptyState } from '@/components/ui';

export default function ReportsPage() {
  return (
    <ShellPage title="Reports" description="Reports & export — MEC-V1-S009.">
      <EmptyState
        title="No reports yet"
        description="Generate mileage and expense reports once the reporting slice ships."
      />
    </ShellPage>
  );
}
