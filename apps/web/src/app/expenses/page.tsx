import { ShellPage } from '@/components/layout/ShellPage';
import { EmptyState } from '@/components/ui';

export default function ExpensesPage() {
  return (
    <ShellPage title="Expenses" description="Expense engine — post-V1 slice.">
      <EmptyState
        title="No expenses yet"
        description="Expense tracking will connect to trips and receipts in a future slice."
      />
    </ShellPage>
  );
}
