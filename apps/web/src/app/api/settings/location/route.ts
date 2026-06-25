import { appPrefsUpdateSchema } from '@mileage-copilot/shared';
import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as appPrefsService from '@/server/services/app-prefs.service';

export async function GET() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prefs = await appPrefsService.getAppPrefs(user.id);
    return jsonData(prefs);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = appPrefsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const prefs = await appPrefsService.updateAppPrefs(user.id, parsed.data);
    return jsonData(prefs);
  } catch (error) {
    return jsonError(error);
  }
}
