import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ExpenseForm } from '@/components/expenses/ExpenseManager';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as expenseService from '@/server/services/expense.service';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditExpensePage({ params }: PageProps) {
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

  const [businesses, trips] = await Promise.all([
    businessService.listBusinesses(user.id),
    tripService.listTrips(user.id),
  ]);

  return (
    <DashboardShell title="Edit expense" description={expense.merchant ?? 'Update expense details'}>
      <ExpenseForm businesses={businesses} trips={trips} initial={expense} />
    </DashboardShell>
  );
}
