import { redirect } from 'next/navigation';
import { AIHistoryPanel } from '@/components/ai/AIHistoryPanel';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { requireSessionUser } from '@/lib/auth/server';
import * as aiFeedbackService from '@/server/services/ai-feedback.service';

export const dynamic = 'force-dynamic';

export default async function AIHistoryPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const history = await aiFeedbackService.listAIHistory(user.id);

  return (
    <DashboardShell
      title="AI history"
      description="Review past AI suggestions, OCR runs, and your feedback."
    >
      <AIHistoryPanel timeline={history.timeline} stats={history.stats} />
    </DashboardShell>
  );
}
