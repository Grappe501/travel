'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, CardContent } from '@/components/ui';
import type { NotificationPrefs } from '@mileage-copilot/shared';

export type SerializedNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  payload: { href: string; tripId?: string; count?: number } | null;
  readAt: string | null;
  createdAt: string;
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString();
}

type NotificationListProps = {
  initialNotifications: SerializedNotification[];
  initialUnreadCount: number;
};

export function NotificationList({
  initialNotifications,
  initialUnreadCount,
}: NotificationListProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function markRead(id: string) {
    setLoading(id);
    setError(null);

    const response = await fetch(`/api/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not update notification');
      setLoading(null);
      return;
    }

    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, readAt: result.data.readAt } : item))
    );
    setUnreadCount((count) => Math.max(0, count - 1));
    setLoading(null);
  }

  async function markAllRead() {
    setLoading('all');
    setError(null);

    const response = await fetch('/api/notifications', {
      method: 'PATCH',
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? 'Could not mark all read');
      setLoading(null);
      return;
    }

    setNotifications((items) =>
      items.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() }))
    );
    setUnreadCount(0);
    setLoading(null);
    router.refresh();
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-body text-muted">
          No notifications yet. Reminders about trips and receipts will appear here.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}

      {unreadCount > 0 ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={loading === 'all'}
            onClick={markAllRead}
          >
            {loading === 'all' ? 'Updating…' : 'Mark all read'}
          </Button>
        </div>
      ) : null}

      <ul className="space-y-3">
        {notifications.map((notification) => {
          const href = notification.payload?.href ?? '/dashboard';
          const unread = !notification.readAt;

          return (
            <li key={notification.id}>
              <Card className={unread ? 'border-primary/30 bg-selected/40' : undefined}>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-subheading text-foreground">{notification.title}</h2>
                        {unread ? <Badge variant="primary">New</Badge> : null}
                      </div>
                      <p className="text-body text-muted">{notification.body}</p>
                      <p className="text-caption text-muted">{formatWhen(notification.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={href}
                      className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-caption font-medium text-primary-foreground hover:opacity-90"
                      onClick={() => {
                        if (unread) {
                          void markRead(notification.id);
                        }
                      }}
                    >
                      Open
                    </Link>
                    {unread ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={loading === notification.id}
                        onClick={() => markRead(notification.id)}
                      >
                        {loading === notification.id ? 'Saving…' : 'Mark read'}
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function NotificationBellLink() {
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    const response = await fetch('/api/notifications?unreadOnly=true&limit=1');
    if (!response.ok) return;
    const result = await response.json();
    setUnreadCount(result.data?.unreadCount ?? 0);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <Link
      href="/notifications"
      className="relative inline-flex items-center rounded-lg px-2 py-1.5 text-caption text-muted hover:bg-surface-elevated hover:text-foreground"
      aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
    >
      <span aria-hidden className="text-base leading-none">
        🔔
      </span>
      {unreadCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}

type NotificationPreferencesFormProps = {
  initial: NotificationPrefs;
};

export function NotificationPreferencesForm({ initial }: NotificationPreferencesFormProps) {
  const router = useRouter();
  const [prefs, setPrefs] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const response = await fetch('/api/notifications/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not save preferences');
      setLoading(false);
      return;
    }

    setPrefs(result.data);
    setSaved(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}
          {saved ? <Alert variant="success">Preferences saved.</Alert> : null}

          <label className="flex items-center gap-2 text-body">
            <input
              type="checkbox"
              checked={prefs.inApp}
              onChange={(e) => setPrefs((p) => ({ ...p, inApp: e.target.checked }))}
            />
            In-app notifications
          </label>
          <label className="flex items-center gap-2 text-body">
            <input
              type="checkbox"
              checked={prefs.tripReminders}
              onChange={(e) => setPrefs((p) => ({ ...p, tripReminders: e.target.checked }))}
            />
            Trip reminders (active trip, forgot to end)
          </label>
          <label className="flex items-center gap-2 text-body">
            <input
              type="checkbox"
              checked={prefs.receiptReminders}
              onChange={(e) => setPrefs((p) => ({ ...p, receiptReminders: e.target.checked }))}
            />
            Receipt review reminders
          </label>
          <label className="flex items-center gap-2 text-body">
            <input
              type="checkbox"
              checked={prefs.tripEndChecklist}
              onChange={(e) => setPrefs((p) => ({ ...p, tripEndChecklist: e.target.checked }))}
            />
            Post-trip expense checklist
          </label>
          <label className="flex items-center gap-2 text-body">
            <input
              type="checkbox"
              checked={prefs.emailTripSummary}
              onChange={(e) => setPrefs((p) => ({ ...p, emailTripSummary: e.target.checked }))}
            />
            Email when a trip ends
          </label>
          <label className="flex items-center gap-2 text-body">
            <input
              type="checkbox"
              checked={prefs.emailReceiptProcessed}
              onChange={(e) => setPrefs((p) => ({ ...p, emailReceiptProcessed: e.target.checked }))}
            />
            Email when a receipt is scanned
          </label>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
