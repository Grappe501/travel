import type { MileageRateSource, Prisma, Trip } from '@prisma/client';
import {
  calculateReimbursement,
  calculateTripMiles,
  tripEndSchema,
  tripStartSchema,
  tripUpdateSchema,
  validateOdometerRange,
} from '@mileage-copilot/shared';
import type { TripEndInput, TripStartInput, TripUpdateInput } from '@mileage-copilot/shared';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/api/response';
import { resolveEffectiveRate } from '@/server/services/mileage.service';
import { getOwnedBusiness } from '@/server/services/business.service';
import { getOwnedVehicle } from '@/server/services/vehicle.service';
import { prisma } from '@/lib/db/prisma';

const activeTripRecord = { recordStatus: 'active' as const };

type TripWithRelations = Trip & {
  business: { id: string; name: string };
  vehicle: { id: string; nickname: string };
};

export function serializeTrip(trip: TripWithRelations) {
  return {
    id: trip.id,
    businessId: trip.businessId,
    businessName: trip.business.name,
    vehicleId: trip.vehicleId,
    vehicleNickname: trip.vehicle.nickname,
    status: trip.status,
    purpose: trip.purpose,
    destination: trip.destination,
    startLocation: trip.startLocation,
    endLocation: trip.endLocation,
    startOdometer: trip.startOdometer ? Number(trip.startOdometer) : null,
    endOdometer: trip.endOdometer ? Number(trip.endOdometer) : null,
    miles: trip.miles ? Number(trip.miles) : null,
    mileageRate: trip.mileageRate ? Number(trip.mileageRate) : null,
    mileageRateSource: trip.mileageRateSource,
    reimbursementAmount: trip.reimbursementAmount ? Number(trip.reimbursementAmount) : null,
    expenseTotal: trip.expenseTotal ? Number(trip.expenseTotal) : null,
    grandTotal: trip.grandTotal ? Number(trip.grandTotal) : null,
    notes: trip.notes,
    startedAt: trip.startedAt?.toISOString() ?? null,
    endedAt: trip.endedAt?.toISOString() ?? null,
    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
  };
}

export type SerializedTrip = ReturnType<typeof serializeTrip>;

const tripInclude = {
  business: { select: { id: true, name: true } },
  vehicle: { select: { id: true, nickname: true } },
} as const;

async function resolveMileageRateSnapshot(
  userId: string,
  businessId: string,
  vehicleId: string
): Promise<{ rate: number; source: MileageRateSource }> {
  const [business, vehicle, profile] = await Promise.all([
    prisma.business.findFirst({
      where: { id: businessId, userId, recordStatus: 'active' },
    }),
    prisma.vehicle.findFirst({
      where: { id: vehicleId, userId, recordStatus: 'active' },
    }),
    prisma.userProfile.findUnique({ where: { id: userId } }),
  ]);

  if (business?.defaultMileageRate) {
    return { rate: Number(business.defaultMileageRate), source: 'business' };
  }

  if (vehicle?.defaultMileageRate) {
    return { rate: Number(vehicle.defaultMileageRate), source: 'vehicle' };
  }

  if (!profile) {
    throw new NotFoundError('Profile not found');
  }

  const rate = resolveEffectiveRate(profile);
  const source: MileageRateSource =
    profile.mileageRateType === 'custom' ? 'custom' : 'irs';

  return { rate, source };
}

async function emitTripEvent(
  userId: string,
  businessId: string,
  eventType: 'trip_started' | 'trip_ended',
  tripId: string
) {
  await prisma.businessEvent.create({
    data: {
      userId,
      businessId,
      eventType,
      entityType: 'trip',
      entityId: tripId,
      occurredAt: new Date(),
      payload: { tripId },
    },
  });
}

function pickFinancialSnapshot(trip: Trip) {
  return {
    startOdometer: trip.startOdometer ? Number(trip.startOdometer) : null,
    endOdometer: trip.endOdometer ? Number(trip.endOdometer) : null,
    miles: trip.miles ? Number(trip.miles) : null,
    mileageRate: trip.mileageRate ? Number(trip.mileageRate) : null,
    reimbursementAmount: trip.reimbursementAmount ? Number(trip.reimbursementAmount) : null,
    grandTotal: trip.grandTotal ? Number(trip.grandTotal) : null,
  };
}

function financialFieldsChanged(before: ReturnType<typeof pickFinancialSnapshot>, after: ReturnType<typeof pickFinancialSnapshot>) {
  return (Object.keys(before) as Array<keyof typeof before>).some(
    (key) => before[key] !== after[key]
  );
}

export async function getActiveTrip(userId: string) {
  const trip = await prisma.trip.findFirst({
    where: { userId, status: 'active', ...activeTripRecord },
    include: tripInclude,
  });

  return trip ? serializeTrip(trip) : null;
}

export async function listTrips(userId: string) {
  const trips = await prisma.trip.findMany({
    where: {
      userId,
      ...activeTripRecord,
      status: { in: ['active', 'completed'] },
    },
    include: tripInclude,
    orderBy: [{ startedAt: 'desc' }, { createdAt: 'desc' }],
  });

  return trips.map(serializeTrip);
}

export async function getOwnedTrip(userId: string, tripId: string) {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId, ...activeTripRecord },
    include: tripInclude,
  });

  if (!trip) {
    throw new NotFoundError('Trip not found');
  }

  return trip;
}

export async function startTrip(userId: string, input: TripStartInput) {
  const data = tripStartSchema.parse(input);

  const existingActive = await prisma.trip.findFirst({
    where: { userId, status: 'active', ...activeTripRecord },
  });

  if (existingActive) {
    throw new ConflictError('You already have an active trip. End it before starting another.');
  }

  await getOwnedBusiness(userId, data.businessId);
  await getOwnedVehicle(userId, data.vehicleId);

  const trip = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const created = await tx.trip.create({
      data: {
        userId,
        businessId: data.businessId,
        vehicleId: data.vehicleId,
        purpose: data.purpose,
        destination: data.destination,
        startLocation: data.startLocation,
        startOdometer: data.startOdometer,
        status: 'active',
        startedAt: new Date(),
      },
      include: tripInclude,
    });

    if (data.startOdometer !== undefined) {
      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: { currentOdometer: data.startOdometer },
      });
    }

    return created;
  });

  await emitTripEvent(userId, trip.businessId, 'trip_started', trip.id);

  return serializeTrip(trip);
}

export async function endTrip(userId: string, input: TripEndInput) {
  const data = tripEndSchema.parse(input);
  const trip = await getOwnedTrip(userId, data.tripId);

  if (trip.status !== 'active') {
    throw new ValidationError('Only active trips can be ended');
  }

  const startOdometer = trip.startOdometer ? Number(trip.startOdometer) : null;
  const odometerCheck = validateOdometerRange(startOdometer, data.endOdometer);

  if (!odometerCheck.valid) {
    throw new ValidationError(odometerCheck.error);
  }

  const { rate, source } = await resolveMileageRateSnapshot(
    userId,
    trip.businessId,
    trip.vehicleId
  );

  const miles = calculateTripMiles(startOdometer, data.endOdometer);
  const reimbursementAmount =
    miles !== null ? calculateReimbursement(miles, rate) : null;
  const expenseTotal = trip.expenseTotal ? Number(trip.expenseTotal) : 0;
  const grandTotal =
    reimbursementAmount !== null ? reimbursementAmount + expenseTotal : null;

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const completed = await tx.trip.update({
      where: { id: trip.id },
      data: {
        status: 'completed',
        endLocation: data.endLocation,
        endOdometer: data.endOdometer,
        notes: data.notes,
        endedAt: new Date(),
        miles,
        mileageRate: rate,
        mileageRateSource: source,
        reimbursementAmount,
        grandTotal,
      },
      include: tripInclude,
    });

    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { currentOdometer: data.endOdometer },
    });

    return completed;
  });

  await emitTripEvent(userId, updated.businessId, 'trip_ended', updated.id);

  return serializeTrip(updated);
}

export async function updateTrip(userId: string, tripId: string, input: TripUpdateInput) {
  const data = tripUpdateSchema.parse(input);
  const trip = await getOwnedTrip(userId, tripId);

  if (trip.status !== 'completed') {
    throw new ValidationError('Only completed trips can be edited');
  }

  const nextStart =
    data.startOdometer !== undefined
      ? data.startOdometer
      : trip.startOdometer
        ? Number(trip.startOdometer)
        : null;
  const nextEnd =
    data.endOdometer !== undefined
      ? data.endOdometer
      : trip.endOdometer
        ? Number(trip.endOdometer)
        : null;

  if (nextEnd !== null) {
    const odometerCheck = validateOdometerRange(nextStart, nextEnd);
    if (!odometerCheck.valid) {
      throw new ValidationError(odometerCheck.error);
    }
  }

  const rate = trip.mileageRate ? Number(trip.mileageRate) : 0;
  const miles =
    nextStart !== null && nextEnd !== null
      ? calculateTripMiles(nextStart, nextEnd)
      : null;
  const reimbursementAmount =
    miles !== null && rate > 0 ? calculateReimbursement(miles, rate) : null;
  const expenseTotal = trip.expenseTotal ? Number(trip.expenseTotal) : 0;
  const grandTotal =
    reimbursementAmount !== null ? reimbursementAmount + expenseTotal : null;

  const beforeFinancial = pickFinancialSnapshot(trip);

  const updated = await prisma.trip.update({
    where: { id: tripId },
    data: {
      ...(data.purpose !== undefined ? { purpose: data.purpose } : {}),
      ...(data.destination !== undefined ? { destination: data.destination } : {}),
      ...(data.startLocation !== undefined ? { startLocation: data.startLocation } : {}),
      ...(data.endLocation !== undefined ? { endLocation: data.endLocation } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
      ...(data.startOdometer !== undefined ? { startOdometer: data.startOdometer } : {}),
      ...(data.endOdometer !== undefined ? { endOdometer: data.endOdometer } : {}),
      miles,
      reimbursementAmount,
      grandTotal,
    },
    include: tripInclude,
  });

  const afterFinancial = pickFinancialSnapshot(updated);

  if (financialFieldsChanged(beforeFinancial, afterFinancial)) {
    await prisma.auditLog.create({
      data: {
        userId,
        entityType: 'trip',
        entityId: tripId,
        action: 'update',
        oldValues: beforeFinancial,
        newValues: afterFinancial,
        source: 'web',
      },
    });
  }

  return serializeTrip(updated);
}
