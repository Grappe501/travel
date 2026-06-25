import { ShellPage } from '@/components/layout/ShellPage';
import { EmptyState } from '@/components/ui';

export default function BillingPage() {
  return (
    <ShellPage title="Billing" description="Stripe billing — MEC-V1-S010.">
      <EmptyState
        title="No subscription yet"
        description="Plans and usage limits arrive with the billing slice."
      />
    </ShellPage>
  );
}
