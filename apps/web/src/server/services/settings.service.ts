import { accountSettingsSchema, type AccountSettingsInput } from '@mileage-copilot/shared';
import { prisma } from '@/lib/db/prisma';

export type SerializedAccountSettings = {
  email: string;
  emailVerified: boolean;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  timezone: string;
  currency: string;
  taxYear: number;
  lastLoginAt: string | null;
};

export type SerializedSecuritySummary = {
  email: string;
  emailVerified: boolean;
  lastLoginAt: string | null;
  accountStatus: string;
};

function normalizeOptionalString(value: string | null | undefined) {
  if (value === undefined) return undefined;
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function getAccountSettings(userId: string): Promise<SerializedAccountSettings> {
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: { id: userId },
  });

  return {
    email: profile.email,
    emailVerified: profile.emailVerified,
    displayName: profile.displayName,
    firstName: profile.firstName,
    lastName: profile.lastName,
    timezone: profile.timezone,
    currency: profile.currency,
    taxYear: profile.taxYear,
    lastLoginAt: profile.lastLoginAt?.toISOString() ?? null,
  };
}

export async function updateAccountSettings(userId: string, input: AccountSettingsInput) {
  const data = accountSettingsSchema.parse(input);

  const profile = await prisma.userProfile.update({
    where: { id: userId },
    data: {
      displayName: normalizeOptionalString(data.displayName),
      firstName: normalizeOptionalString(data.firstName),
      lastName: normalizeOptionalString(data.lastName),
      timezone: data.timezone,
      currency: data.currency.toUpperCase(),
      taxYear: data.taxYear,
    },
  });

  return {
    email: profile.email,
    emailVerified: profile.emailVerified,
    displayName: profile.displayName,
    firstName: profile.firstName,
    lastName: profile.lastName,
    timezone: profile.timezone,
    currency: profile.currency,
    taxYear: profile.taxYear,
    lastLoginAt: profile.lastLoginAt?.toISOString() ?? null,
  };
}

export async function getSecuritySummary(userId: string): Promise<SerializedSecuritySummary> {
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: { id: userId },
  });

  return {
    email: profile.email,
    emailVerified: profile.emailVerified,
    lastLoginAt: profile.lastLoginAt?.toISOString() ?? null,
    accountStatus: profile.accountStatus,
  };
}
