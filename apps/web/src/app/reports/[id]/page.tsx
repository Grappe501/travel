import { notFound, redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReportDetailCard } from '@/components/reports/ReportManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as reportService from '@/server/services/report.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = { params: Promise<{ id: string }> };

export default async function ReportDetailPage({ params }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  let report;
  try {
    report = reportService.serializeReport(await reportService.getOwnedReport(user.id, id));
  } catch {
    notFound();
  }

  return (
    <DashboardShell
      title="Report detail"
      description={`${report.reportType} · ${report.format.toUpperCase()}`}
      actions={
        <ButtonLink href="/reports" variant="secondary" size="sm">
          Back
        </ButtonLink>
      }
    >
      <ReportDetailCard report={report} />
    </DashboardShell>
  );
}
