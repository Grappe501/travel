import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { NotificationList } from '@/components/notifications/NotificationManager';
import { ButtonLink } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import * as notificationService from '@/server/services/notification.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function NotificationsPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const notifications = await notificationService.listNotifications(user.id);
  const unreadCount = await notificationService.countUnreadNotifications(user.id, { skipSync: true });

  return (
    <DashboardShell
      title="Notifications"
      description="Trip reminders, receipt reviews, and expense checklists."
      actions={
        <div className="flex gap-2">
          <ButtonLink href="/settings/notifications" variant="secondary" size="sm">
            Preferences
          </ButtonLink>
          <ButtonLink href="/dashboard" variant="secondary" size="sm">
            Home
          </ButtonLink>
        </div>
      }
    >
      <NotificationList initialNotifications={notifications} initialUnreadCount={unreadCount} />
      <p className="text-center text-caption text-muted">
        <Link href="/settings/notifications" className="text-primary hover:underline">
          Manage notification preferences
        </Link>
      </p>
    </DashboardShell>
  );
}
