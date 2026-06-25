import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { NotificationPreferencesForm } from '@/components/notifications/NotificationManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as notificationService from '@/server/services/notification.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function NotificationSettingsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const prefs = await notificationService.getNotificationPreferences(user.id);

  return (
    <DashboardShell
      title="Notification preferences"
      description="Choose which in-app reminders and emails you receive."
      actions={
        <ButtonLink href="/notifications" variant="secondary" size="sm">
          Back to notifications
        </ButtonLink>
      }
    >
      <NotificationPreferencesForm initial={prefs} />
      <p className="text-caption text-muted">
        Transactional emails require <code className="font-mono text-micro">RESEND_API_KEY</code> on
        the server. Security alerts will always be available in-app.
      </p>
      <p className="text-body">
        <Link href="/settings" className="font-medium text-primary hover:underline">
          ← All settings
        </Link>
      </p>
    </DashboardShell>
  );
}
