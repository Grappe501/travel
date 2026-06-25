import { appPrefsSchema, DEFAULT_APP_PREFS, type AppPrefsUpdateInput } from '@mileage-copilot/shared';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

function parseAppPrefs(raw: unknown) {
  const parsed = appPrefsSchema.safeParse(raw);
  return parsed.success ? parsed.data : DEFAULT_APP_PREFS;
}

export async function getAppPrefs(userId: string) {
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: { id: userId },
    select: { appPrefs: true },
  });

  return parseAppPrefs(profile.appPrefs);
}

export async function updateAppPrefs(userId: string, input: AppPrefsUpdateInput) {
  const current = await getAppPrefs(userId);
  const next = { ...current, ...input };

  const profile = await prisma.userProfile.update({
    where: { id: userId },
    data: { appPrefs: next as Prisma.InputJsonValue },
    select: { appPrefs: true },
  });

  return parseAppPrefs(profile.appPrefs);
}
