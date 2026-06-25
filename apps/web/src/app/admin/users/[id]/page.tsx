import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminUserSummaryCard } from '@/components/admin/AdminUserSummary';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AppError } from '@/lib/api/response';
import * as adminService from '@/server/services/admin.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type AdminUserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { id } = await params;

  let summary;
  try {
    summary = await adminService.getUserSummary(id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <DashboardShell
      title="Customer summary"
      description={summary.email}
      actions={
        <Link href="/admin" className="text-body font-medium text-primary hover:underline">
          Back to admin
        </Link>
      }
    >
      <AdminUserSummaryCard summary={summary} />
    </DashboardShell>
  );
}
