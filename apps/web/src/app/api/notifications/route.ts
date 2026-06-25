import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as notificationService from '@/server/services/notification.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnlyParam = searchParams.get('unreadOnly');
    const limitParam = searchParams.get('limit');

    const notifications = await notificationService.listNotifications(user.id, {
      ...(unreadOnlyParam === 'true' ? { unreadOnly: true } : {}),
      ...(limitParam ? { limit: Number(limitParam) } : {}),
    });
    const unreadCount = await notificationService.countUnreadNotifications(user.id, {
      skipSync: true,
    });

    return jsonData({ notifications, unreadCount });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await notificationService.markAllNotificationsRead(user.id);
    return jsonData({ updated: true });
  } catch (error) {
    return jsonError(error);
  }
}
