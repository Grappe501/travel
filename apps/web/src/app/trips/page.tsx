import { ShellPage } from '@/components/layout/ShellPage';
import { EmptyState } from '@/components/ui';

export default function TripsPage() {
  return (
    <ShellPage title="Trips" description="Trip engine — MEC-V1-S006.">
      <EmptyState
        title="No trips yet"
        description="Start tracking business miles once the trip engine ships in a later slice."
      />
    </ShellPage>
  );
}
