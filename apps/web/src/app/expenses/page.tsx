import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ExpenseList } from '@/components/expenses/ExpenseManager';
import { ButtonLink, EmptyState } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as expenseService from '@/server/services/expense.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ExpensesPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const expenses = await expenseService.listExpenses(user.id);

  return (
    <DashboardShell
      title="Expenses"
      description="Track manual expenses and receipt-linked costs."
      actions={
        <ButtonLink href="/expenses/new" size="sm">
          Add expense
        </ButtonLink>
      }
    >
      {expenses.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            title="No expenses yet"
            description="Add a manual expense or approve a receipt to create one automatically."
          />
          <div className="flex justify-center">
            <ButtonLink href="/expenses/new" size="sm">
              Add expense
            </ButtonLink>
          </div>
        </div>
      ) : (
        <ExpenseList expenses={expenses} />
      )}
    </DashboardShell>
  );
}
