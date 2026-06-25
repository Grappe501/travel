import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ExpenseForm } from '@/components/expenses/ExpenseManager';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';
import * as tripService from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function NewExpensePage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const [businesses, trips] = await Promise.all([
    businessService.listBusinesses(user.id),
    tripService.listTrips(user.id),
  ]);

  if (businesses.length === 0) {
    redirect('/businesses');
  }

  return (
    <DashboardShell title="Add expense" description="Record a business expense without a receipt.">
      <ExpenseForm businesses={businesses} trips={trips} />
    </DashboardShell>
  );
}
