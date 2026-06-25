import { ShellPage } from '@/components/layout/ShellPage';
import { EmptyState } from '@/components/ui';

export default function VehiclesPage() {
  return (
    <ShellPage title="Vehicles" description="Vehicle management — MEC-V1-S005.">
      <EmptyState
        title="No vehicles yet"
        description="Add vehicles and odometer readings in the business & vehicle slice."
      />
    </ShellPage>
  );
}
