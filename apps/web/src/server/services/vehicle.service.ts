import type { Prisma, Vehicle } from '@prisma/client';
import { vehicleCreateSchema, vehicleUpdateSchema } from '@mileage-copilot/shared';
import type { VehicleCreateInput, VehicleUpdateInput } from '@mileage-copilot/shared';
import { NotFoundError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';
import { getOwnedBusiness } from '@/server/services/business.service';

const activeVehicle = { recordStatus: 'active' as const };

export function serializeVehicle(vehicle: Vehicle) {
  return {
    id: vehicle.id,
    businessId: vehicle.businessId,
    nickname: vehicle.nickname,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    currentOdometer: vehicle.currentOdometer ? Number(vehicle.currentOdometer) : null,
    isDefault: vehicle.isDefault,
    createdAt: vehicle.createdAt.toISOString(),
    updatedAt: vehicle.updatedAt.toISOString(),
  };
}

async function assertBusinessAccess(userId: string, businessId: string | null | undefined) {
  if (!businessId) return;
  await getOwnedBusiness(userId, businessId);
}

export async function listVehicles(userId: string) {
  const vehicles = await prisma.vehicle.findMany({
    where: { userId, ...activeVehicle },
    orderBy: [{ isDefault: 'desc' }, { nickname: 'asc' }],
  });

  return vehicles.map(serializeVehicle);
}

export async function getOwnedVehicle(userId: string, vehicleId: string) {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId, ...activeVehicle },
  });

  if (!vehicle) {
    throw new NotFoundError('Vehicle not found');
  }

  return vehicle;
}

async function clearDefaultVehicles(userId: string, tx: Prisma.TransactionClient) {
  await tx.vehicle.updateMany({
    where: { userId, ...activeVehicle },
    data: { isDefault: false },
  });
}

export async function createVehicle(userId: string, input: VehicleCreateInput) {
  const data = vehicleCreateSchema.parse(input);
  await assertBusinessAccess(userId, data.businessId);

  return prisma.$transaction(async (tx) => {
    const activeCount = await tx.vehicle.count({ where: { userId, ...activeVehicle } });
    const isDefault = data.isDefault ?? activeCount === 0;

    if (isDefault) {
      await clearDefaultVehicles(userId, tx);
    }

    const vehicle = await tx.vehicle.create({
      data: {
        userId,
        businessId: data.businessId,
        nickname: data.nickname,
        make: data.make,
        model: data.model,
        year: data.year,
        currentOdometer: data.currentOdometer,
        isDefault,
      },
    });

    return serializeVehicle(vehicle);
  });
}

export async function updateVehicle(userId: string, vehicleId: string, input: VehicleUpdateInput) {
  const data = vehicleUpdateSchema.parse(input);
  await getOwnedVehicle(userId, vehicleId);
  await assertBusinessAccess(userId, data.businessId);

  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await clearDefaultVehicles(userId, tx);
    }

    const vehicle = await tx.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...(data.businessId !== undefined ? { businessId: data.businessId } : {}),
        ...(data.nickname !== undefined ? { nickname: data.nickname } : {}),
        ...(data.make !== undefined ? { make: data.make } : {}),
        ...(data.model !== undefined ? { model: data.model } : {}),
        ...(data.year !== undefined ? { year: data.year } : {}),
        ...(data.currentOdometer !== undefined ? { currentOdometer: data.currentOdometer } : {}),
        ...(data.isDefault !== undefined ? { isDefault: data.isDefault } : {}),
      },
    });

    return serializeVehicle(vehicle);
  });
}

export async function deleteVehicle(userId: string, vehicleId: string) {
  const vehicle = await getOwnedVehicle(userId, vehicleId);

  await prisma.$transaction(async (tx) => {
    await tx.vehicle.update({
      where: { id: vehicleId },
      data: { recordStatus: 'deleted', deletedAt: new Date(), isDefault: false },
    });

    if (vehicle.isDefault) {
      const nextDefault = await tx.vehicle.findFirst({
        where: { userId, ...activeVehicle, id: { not: vehicleId } },
        orderBy: { createdAt: 'asc' },
      });

      if (nextDefault) {
        await tx.vehicle.update({
          where: { id: nextDefault.id },
          data: { isDefault: true },
        });
      }
    }

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'vehicle',
        entityId: vehicleId,
        action: 'delete',
        oldValues: { isDefault: vehicle.isDefault },
        source: 'web',
      },
    });
  });

  return { id: vehicleId, deleted: true };
}
