import { ShellPage } from '@/components/layout/ShellPage';
import { EmptyState } from '@/components/ui';

export default function ReceiptsPage() {
  return (
    <ShellPage title="Receipts" description="Receipt capture — MEC-V1-S007.">
      <EmptyState
        title="No receipts yet"
        description="Upload and review receipts once the capture slice is built."
      />
    </ShellPage>
  );
}
