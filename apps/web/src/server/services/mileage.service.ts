import { mileageRateCreateSchema, mileageSettingsSchema } from '@mileage-copilot/shared';
import type { MileageRateCreateInput, MileageSettingsInput } from '@mileage-copilot/shared';
import { NotFoundError } from '@/lib/api/response';
import { IRS_STANDARD_MILEAGE_RATE } from '@/lib/constants/mileage';
import { prisma } from '@/lib/db/prisma';

export function resolveEffectiveRate(profile: {
  mileageRateType: string;
  customMileageRate: { toString(): string } | null;
}) {
  if (profile.mileageRateType === 'custom' && profile.customMileageRate) {
    return Number(profile.customMileageRate);
  }

  if (profile.mileageRateType === 'company') {
    return IRS_STANDARD_MILEAGE_RATE;
  }

  return IRS_STANDARD_MILEAGE_RATE;
}

export async function getMileageSettings(userId: string) {
  const profile = await prisma.userProfile.findUnique({ where: { id: userId } });

  if (!profile) {
    throw new NotFoundError('Profile not found');
  }

  const rates = await prisma.mileageRate.findMany({
    where: { userId },
    orderBy: { effectiveFrom: 'desc' },
    take: 10,
  });

  return {
    mileageRateType: profile.mileageRateType,
    customMileageRate: profile.customMileageRate ? Number(profile.customMileageRate) : null,
    irsStandardRate: IRS_STANDARD_MILEAGE_RATE,
    effectiveRate: resolveEffectiveRate(profile),
    rates: rates.map((rate) => ({
      id: rate.id,
      name: rate.name,
      rate: Number(rate.rate),
      source: rate.source,
      effectiveFrom: rate.effectiveFrom.toISOString().slice(0, 10),
      effectiveTo: rate.effectiveTo?.toISOString().slice(0, 10) ?? null,
      businessId: rate.businessId,
    })),
  };
}

export async function updateMileageSettings(userId: string, input: MileageSettingsInput) {
  const data = mileageSettingsSchema.parse(input);

  const profile = await prisma.userProfile.update({
    where: { id: userId },
    data: {
      mileageRateType: data.mileageRateType,
      customMileageRate:
        data.mileageRateType === 'custom' ? data.customMileageRate : null,
    },
  });

  if (data.mileageRateType === 'custom' && data.customMileageRate) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.mileageRate.create({
      data: {
        userId,
        name: 'Custom profile rate',
        rate: data.customMileageRate,
        source: 'custom',
        effectiveFrom: today,
      },
    });
  }

  return {
    mileageRateType: profile.mileageRateType,
    customMileageRate: profile.customMileageRate ? Number(profile.customMileageRate) : null,
    effectiveRate: resolveEffectiveRate(profile),
  };
}

export async function createMileageRate(userId: string, input: MileageRateCreateInput) {
  const data = mileageRateCreateSchema.parse(input);

  if (data.businessId) {
    const business = await prisma.business.findFirst({
      where: { id: data.businessId, userId, recordStatus: 'active' },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }
  }

  const rate = await prisma.mileageRate.create({
    data: {
      userId,
      businessId: data.businessId,
      name: data.name,
      rate: data.rate,
      source: data.source,
      effectiveFrom: new Date(data.effectiveFrom),
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
    },
  });

  return {
    id: rate.id,
    name: rate.name,
    rate: Number(rate.rate),
    source: rate.source,
    effectiveFrom: rate.effectiveFrom.toISOString().slice(0, 10),
    effectiveTo: rate.effectiveTo?.toISOString().slice(0, 10) ?? null,
    businessId: rate.businessId,
  };
}
