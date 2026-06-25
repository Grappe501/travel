import type { Business, Prisma } from '@prisma/client';
import { businessCreateSchema, businessUpdateSchema } from '@mileage-copilot/shared';
import type { BusinessCreateInput, BusinessUpdateInput } from '@mileage-copilot/shared';
import { NotFoundError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';

const activeBusiness = { recordStatus: 'active' as const };

export function serializeBusiness(business: Business) {
  return {
    id: business.id,
    name: business.name,
    currency: business.currency,
    defaultMileageRate: business.defaultMileageRate ? Number(business.defaultMileageRate) : null,
    isDefault: business.isDefault,
    createdAt: business.createdAt.toISOString(),
    updatedAt: business.updatedAt.toISOString(),
  };
}

export async function listBusinesses(userId: string) {
  const businesses = await prisma.business.findMany({
    where: { userId, ...activeBusiness },
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
  });

  return businesses.map(serializeBusiness);
}

export async function getOwnedBusiness(userId: string, businessId: string) {
  const business = await prisma.business.findFirst({
    where: { id: businessId, userId, ...activeBusiness },
  });

  if (!business) {
    throw new NotFoundError('Business not found');
  }

  return business;
}

async function clearDefaultBusinesses(userId: string, tx: Prisma.TransactionClient) {
  await tx.business.updateMany({
    where: { userId, ...activeBusiness },
    data: { isDefault: false },
  });
}

export async function createBusiness(userId: string, input: BusinessCreateInput) {
  const data = businessCreateSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const activeCount = await tx.business.count({ where: { userId, ...activeBusiness } });
    const isDefault = data.isDefault ?? activeCount === 0;

    if (isDefault) {
      await clearDefaultBusinesses(userId, tx);
    }

    const business = await tx.business.create({
      data: {
        userId,
        name: data.name,
        currency: data.currency ?? 'USD',
        defaultMileageRate: data.defaultMileageRate,
        isDefault,
      },
    });

    return serializeBusiness(business);
  });
}

export async function updateBusiness(
  userId: string,
  businessId: string,
  input: BusinessUpdateInput
) {
  const data = businessUpdateSchema.parse(input);
  await getOwnedBusiness(userId, businessId);

  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await clearDefaultBusinesses(userId, tx);
    }

    const business = await tx.business.update({
      where: { id: businessId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
        ...(data.defaultMileageRate !== undefined
          ? { defaultMileageRate: data.defaultMileageRate }
          : {}),
        ...(data.isDefault !== undefined ? { isDefault: data.isDefault } : {}),
      },
    });

    return serializeBusiness(business);
  });
}

export async function deleteBusiness(userId: string, businessId: string) {
  await getOwnedBusiness(userId, businessId);

  await prisma.$transaction(async (tx) => {
    const business = await tx.business.findFirst({
      where: { id: businessId, userId, ...activeBusiness },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    await tx.business.update({
      where: { id: businessId },
      data: { recordStatus: 'deleted', deletedAt: new Date(), isDefault: false },
    });

    if (business.isDefault) {
      const nextDefault = await tx.business.findFirst({
        where: { userId, ...activeBusiness, id: { not: businessId } },
        orderBy: { createdAt: 'asc' },
      });

      if (nextDefault) {
        await tx.business.update({
          where: { id: nextDefault.id },
          data: { isDefault: true },
        });
      }
    }

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'business',
        entityId: businessId,
        action: 'delete',
        oldValues: { isDefault: business.isDefault },
        source: 'web',
      },
    });
  });

  return { id: businessId, deleted: true };
}
