import { accountSettingsSchema } from '@mileage-copilot/shared';
import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as settingsService from '@/server/services/settings.service';

export async function GET() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await settingsService.getAccountSettings(user.id);
    return jsonData(settings);
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
    const parsed = accountSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const settings = await settingsService.updateAccountSettings(user.id, parsed.data);
    return jsonData(settings);
  } catch (error) {
    return jsonError(error);
  }
}
