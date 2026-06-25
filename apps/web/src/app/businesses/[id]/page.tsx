import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { BusinessForm } from '@/components/businesses/BusinessManager';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as businessService from '@/server/services/business.service';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function BusinessEditPage({ params }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  let business;
  try {
    business = businessService.serializeBusiness(
      await businessService.getOwnedBusiness(user.id, id)
    );
  } catch {
    notFound();
  }

  return (
    <DashboardShell
      title="Edit business"
      description={business.name}
      actions={<ButtonLink href="/businesses" variant="secondary" size="sm">Back</ButtonLink>}
    >
      <BusinessForm initial={business} />
      <p className="text-caption text-muted">
        <Link href="/settings/mileage" className="text-primary hover:underline">
          Configure mileage rates
        </Link>
      </p>
    </DashboardShell>
  );
}
