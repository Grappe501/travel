import { redirect } from 'next/navigation';
import { BusinessForm, BusinessList } from '@/components/businesses/BusinessManager';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { EmptyState } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';

export const dynamic = 'force-dynamic';

export default async function BusinessesPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const businesses = await businessService.listBusinesses(user.id);

  return (
    <DashboardShell
      title="Businesses"
      description="Create and manage business profiles for trips and reports."
    >
      <BusinessForm />
      {businesses.length === 0 ? (
        <EmptyState
          title="No businesses yet"
          description="Add your first business using the form above."
        />
      ) : (
        <BusinessList businesses={businesses} />
      )}
    </DashboardShell>
  );
}
