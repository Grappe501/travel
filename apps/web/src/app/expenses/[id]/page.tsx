import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ExpenseDetailCard } from '@/components/expenses/ExpenseManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as expenseService from '@/server/services/expense.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = { params: Promise<{ id: string }> };

export default async function ExpenseDetailPage({ params }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  let expense;
  try {
    expense = expenseService.serializeExpense(await expenseService.getOwnedExpense(user.id, id));
  } catch {
    notFound();
  }

  return (
    <DashboardShell
      title="Expense detail"
      description={expense.merchant ?? formatCategory(expense.categorySlug)}
      actions={
        <ButtonLink href="/expenses" variant="secondary" size="sm">
          Back
        </ButtonLink>
      }
    >
      <ExpenseDetailCard expense={expense} />
    </DashboardShell>
  );
}

function formatCategory(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
