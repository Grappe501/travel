import type { Notification, Prisma } from '@prisma/client';
import {
  DEFAULT_NOTIFICATION_PREFS,
  notificationListQuerySchema,
  notificationMarkReadSchema,
  notificationPrefsSchema,
  notificationPrefsUpdateSchema,
  type NotificationListQuery,
  type NotificationMarkReadInput,
  type NotificationPayload,
  type NotificationPrefs,
  type NotificationPrefsUpdateInput,
} from '@mileage-copilot/shared';
import { NotFoundError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';

const DEDUPE_TTL_MS = 24 * 60 * 60 * 1000;
const FORGOT_END_TRIP_MS = 24 * 60 * 60 * 1000;

function parsePrefs(raw: unknown): NotificationPrefs {
  const parsed = notificationPrefsSchema.safeParse(raw);
  return parsed.success ? parsed.data : DEFAULT_NOTIFICATION_PREFS;
}

export function serializeNotification(notification: Notification) {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    payload: notification.payload as NotificationPayload | null,
    deliveryMethod: notification.deliveryMethod,
    readAt: notification.readAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
    updatedAt: notification.updatedAt.toISOString(),
  };
}

export type SerializedNotification = ReturnType<typeof serializeNotification>;

async function getProfilePrefs(userId: string): Promise<NotificationPrefs> {
  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
    select: { notificationPrefs: true },
  });

  return parsePrefs(profile?.notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS);
}

async function upsertInAppNotification(
  userId: string,
  input: {
    type: string;
    title: string;
    body: string;
    dedupeKey: string;
    payload: NotificationPayload;
  }
) {
  const existing = await prisma.notification.findUnique({
    where: {
      userId_dedupeKey: { userId, dedupeKey: input.dedupeKey },
    },
  });

  const now = new Date();

  if (existing) {
    const ageMs = now.getTime() - existing.createdAt.getTime();
    if (ageMs < DEDUPE_TTL_MS) {
      return existing;
    }

    return prisma.notification.update({
      where: { id: existing.id },
      data: {
        type: input.type,
        title: input.title,
        body: input.body,
        payload: input.payload as Prisma.InputJsonValue,
        readAt: null,
        deliveredAt: now,
      },
    });
  }

  return prisma.notification.create({
    data: {
      userId,
      type: input.type,
      title: input.title,
      body: input.body,
      payload: input.payload as Prisma.InputJsonValue,
      dedupeKey: input.dedupeKey,
      deliveredAt: now,
    },
  });
}

async function clearStaleNotification(userId: string, dedupeKey: string) {
  await prisma.notification.deleteMany({
    where: { userId, dedupeKey, readAt: { not: null } },
  });
}

export async function syncNotificationsForUser(userId: string) {
  const prefs = await getProfilePrefs(userId);
  if (!prefs.inApp) {
    return;
  }

  const activeTrip = await prisma.trip.findFirst({
    where: { userId, status: 'active', recordStatus: 'active' },
    include: {
      _count: { select: { expenses: { where: { recordStatus: 'active' } } } },
    },
  });

  if (activeTrip && prefs.tripReminders) {
    const startedAt = activeTrip.startedAt ?? activeTrip.createdAt;
    const ageMs = Date.now() - startedAt.getTime();

    if (activeTrip._count.expenses === 0) {
      await upsertInAppNotification(userId, {
        type: 'trip_active_expenses',
        title: 'Add trip expenses',
        body: `Your active trip "${activeTrip.purpose}" has no linked expenses yet.`,
        dedupeKey: `trip_active_expenses:${activeTrip.id}`,
        payload: { href: `/trips/${activeTrip.id}`, tripId: activeTrip.id },
      });
    } else {
      await prisma.notification.deleteMany({
        where: {
          userId,
          dedupeKey: `trip_active_expenses:${activeTrip.id}`,
          readAt: null,
        },
      });
    }

    if (ageMs >= FORGOT_END_TRIP_MS) {
      await upsertInAppNotification(userId, {
        type: 'trip_forgot_end',
        title: 'Still on a trip?',
        body: `You started "${activeTrip.purpose}" over 24 hours ago. End the trip when you're done driving.`,
        dedupeKey: `trip_forgot_end:${activeTrip.id}`,
        payload: { href: `/trips/${activeTrip.id}/end`, tripId: activeTrip.id },
      });
    }
  } else if (prefs.tripReminders) {
    await prisma.notification.deleteMany({
      where: {
        userId,
        type: { in: ['trip_active_expenses', 'trip_forgot_end'] },
        readAt: null,
      },
    });
  }

  if (prefs.receiptReminders) {
    const pendingReviewCount = await prisma.receipt.count({
      where: {
        userId,
        recordStatus: 'active',
        reviewStatus: { not: 'confirmed' },
      },
    });

    if (pendingReviewCount > 0) {
      await upsertInAppNotification(userId, {
        type: 'receipt_review_pending',
        title: 'Receipts need review',
        body: `${pendingReviewCount} receipt${pendingReviewCount === 1 ? '' : 's'} waiting for your review.`,
        dedupeKey: 'receipt_review_pending',
        payload: {
          href: '/receipts',
          count: pendingReviewCount,
        },
      });
    } else {
      await clearStaleNotification(userId, 'receipt_review_pending');
      await prisma.notification.deleteMany({
        where: { userId, dedupeKey: 'receipt_review_pending', readAt: null },
      });
    }
  }

  if (prefs.tripEndChecklist) {
    const recentTrips = await prisma.trip.findMany({
      where: {
        userId,
        status: 'completed',
        recordStatus: 'active',
        endedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        OR: [{ expenseTotal: null }, { expenseTotal: 0 }],
      },
      select: {
        id: true,
        purpose: true,
      },
      orderBy: { endedAt: 'desc' },
      take: 5,
    });

    for (const trip of recentTrips) {
      await upsertInAppNotification(userId, {
        type: 'trip_end_checklist',
        title: 'Link trip expenses',
        body: `Finished "${trip.purpose}" — add or link receipts and expenses you may have missed.`,
        dedupeKey: `trip_end_checklist:${trip.id}`,
        payload: { href: `/trips/${trip.id}`, tripId: trip.id },
      });
    }
  }
}

export async function listNotifications(userId: string, queryInput: NotificationListQuery = {}) {
  const query = notificationListQuerySchema.parse(queryInput);

  await syncNotificationsForUser(userId);

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      deliveryMethod: 'in_app',
      ...(query.unreadOnly ? { readAt: null } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: query.limit ?? 50,
  });

  return notifications
    .sort((a, b) => {
      if (!a.readAt && b.readAt) return -1;
      if (a.readAt && !b.readAt) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .map(serializeNotification);
}

export async function countUnreadNotifications(userId: string, options: { skipSync?: boolean } = {}) {
  if (!options.skipSync) {
    await syncNotificationsForUser(userId);
  }

  return prisma.notification.count({
    where: { userId, deliveryMethod: 'in_app', readAt: null },
  });
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
  input: NotificationMarkReadInput = { read: true }
) {
  const data = notificationMarkReadSchema.parse(input);

  const existing = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Notification not found');
  }

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: data.read ? new Date() : null },
  });

  return serializeNotification(updated);
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });

  return { updated: true };
}

export async function getNotificationPreferences(userId: string) {
  return getProfilePrefs(userId);
}

export async function updateNotificationPreferences(
  userId: string,
  input: NotificationPrefsUpdateInput
) {
  const patch = notificationPrefsUpdateSchema.parse(input);
  const current = await getProfilePrefs(userId);
  const next = { ...current, ...patch };

  await prisma.userProfile.update({
    where: { id: userId },
    data: { notificationPrefs: next as Prisma.InputJsonValue },
  });

  await syncNotificationsForUser(userId);

  return next;
}
