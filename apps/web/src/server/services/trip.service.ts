import type { MileageRateSource, Prisma, Trip, TripMileageSource } from '@prisma/client';
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
import { resolveClientProjectForTrip } from '@/server/services/client.service';
import { getOwnedVehicle } from '@/server/services/vehicle.service';
import { prisma } from '@/lib/db/prisma';
import { syncNotificationsForUser } from '@/server/services/notification.service';
import { sendTripEndedSummaryEmail } from '@/server/services/email.service';
import { resolveMileageAtEnd } from '@/server/services/gps-tracking.service';
import {
  assertCanStartTrip,
  incrementTripUsage,
} from '@/server/services/usage.service';

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
    clientId: trip.clientId,
    projectId: trip.projectId,
    clientName: trip.clientName,
    projectName: trip.projectName,
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
    trackingEnabled: trip.trackingEnabled,
    trackingStartedAt: trip.trackingStartedAt?.toISOString() ?? null,
    trackingStoppedAt: trip.trackingStoppedAt?.toISOString() ?? null,
    startLatitude: trip.startLatitude ? Number(trip.startLatitude) : null,
    startLongitude: trip.startLongitude ? Number(trip.startLongitude) : null,
    endLatitude: trip.endLatitude ? Number(trip.endLatitude) : null,
    endLongitude: trip.endLongitude ? Number(trip.endLongitude) : null,
    gpsMiles: trip.gpsMiles ? Number(trip.gpsMiles) : null,
    mileageSource: trip.mileageSource,
    mileageReviewRequired: trip.mileageReviewRequired,
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
  await assertCanStartTrip(userId);

  const clientProject = await resolveClientProjectForTrip(
    userId,
    data.businessId,
    data.clientId,
    data.projectId
  );

  const trip = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await incrementTripUsage(userId, tx);

    const created = await tx.trip.create({
      data: {
        userId,
        businessId: data.businessId,
        vehicleId: data.vehicleId,
        purpose: data.purpose,
        destination: data.destination,
        startLocation: data.startLocation,
        startOdometer: data.startOdometer,
        clientId: clientProject.clientId,
        projectId: clientProject.projectId,
        clientName: clientProject.clientName,
        projectName: clientProject.projectName,
        status: 'active',
        startedAt: new Date(),
        trackingEnabled: data.trackingEnabled ?? false,
        trackingStartedAt: data.trackingEnabled ? new Date() : null,
        startLatitude: data.startLatitude,
        startLongitude: data.startLongitude,
      },
      include: tripInclude,
    });

    if (data.trackingEnabled && data.startLatitude != null && data.startLongitude != null) {
      await tx.tripGpsPoint.create({
        data: {
          tripId: created.id,
          userId,
          latitude: data.startLatitude,
          longitude: data.startLongitude,
          recordedAt: new Date(),
          source: 'start',
        },
      });
    }

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

  if (data.endOdometer !== undefined) {
    const odometerCheck = validateOdometerRange(startOdometer, data.endOdometer);
    if (!odometerCheck.valid) {
      throw new ValidationError(odometerCheck.error);
    }
  }

  const { rate, source } = await resolveMileageRateSnapshot(
    userId,
    trip.businessId,
    trip.vehicleId
  );

  const mileage = await resolveMileageAtEnd(trip, {
    endOdometer: data.endOdometer,
    endLatitude: data.endLatitude,
    endLongitude: data.endLongitude,
  });

  const reimbursementAmount =
    mileage.miles !== null ? calculateReimbursement(mileage.miles, rate) : null;
  const expenseTotal = trip.expenseTotal ? Number(trip.expenseTotal) : 0;
  const grandTotal =
    reimbursementAmount !== null ? reimbursementAmount + expenseTotal : null;

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (data.endLatitude != null && data.endLongitude != null) {
      await tx.tripGpsPoint.create({
        data: {
          tripId: trip.id,
          userId,
          latitude: data.endLatitude,
          longitude: data.endLongitude,
          recordedAt: new Date(),
          source: 'end',
        },
      });
    }

    const completed = await tx.trip.update({
      where: { id: trip.id },
      data: {
        status: 'completed',
        endLocation: data.endLocation,
        endOdometer: data.endOdometer,
        endLatitude: data.endLatitude,
        endLongitude: data.endLongitude,
        notes: data.notes,
        endedAt: new Date(),
        trackingEnabled: false,
        trackingStoppedAt: new Date(),
        miles: mileage.miles,
        gpsMiles: mileage.gpsMiles,
        mileageSource: mileage.mileageSource as TripMileageSource | null,
        mileageReviewRequired: mileage.mileageReviewRequired,
        mileageRate: rate,
        mileageRateSource: source,
        reimbursementAmount,
        grandTotal,
      },
      include: tripInclude,
    });

    if (data.endOdometer !== undefined) {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { currentOdometer: data.endOdometer },
      });
    }

    return completed;
  });

  await emitTripEvent(userId, updated.businessId, 'trip_ended', updated.id);

  await syncNotificationsForUser(userId);

  void sendTripEndedSummaryEmail(userId, {
    tripId: updated.id,
    purpose: updated.purpose,
    miles: mileage.miles !== null ? Number(mileage.miles) : null,
    reimbursementAmount: reimbursementAmount !== null ? Number(reimbursementAmount) : null,
  }).catch((err) => console.error('Trip summary email failed:', err));

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

  let clientProjectUpdate: Awaited<ReturnType<typeof resolveClientProjectForTrip>> | null = null;
  if (data.clientId !== undefined || data.projectId !== undefined) {
    clientProjectUpdate = await resolveClientProjectForTrip(
      userId,
      trip.businessId,
      data.clientId ?? trip.clientId,
      data.projectId ?? trip.projectId
    );
  }

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
      ...(clientProjectUpdate
        ? {
            clientId: clientProjectUpdate.clientId,
            projectId: clientProjectUpdate.projectId,
            clientName: clientProjectUpdate.clientName,
            projectName: clientProjectUpdate.projectName,
          }
        : {}),
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

export async function deleteTrip(userId: string, tripId: string) {
  const trip = await getOwnedTrip(userId, tripId);

  if (trip.status === 'draft') {
    throw new ValidationError('Draft trips cannot be deleted from the app');
  }

  const unlinkedExpenses = await prisma.expense.findMany({
    where: { tripId, userId, recordStatus: 'active' },
    select: { id: true },
  });
  const unlinkedReceipts = await prisma.receipt.findMany({
    where: { tripId, userId, recordStatus: 'active' },
    select: { id: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.trip.update({
      where: { id: tripId },
      data: {
        recordStatus: 'deleted',
        status: 'deleted',
        deletedAt: new Date(),
      },
    });

    await tx.expense.updateMany({
      where: { tripId, userId, recordStatus: 'active' },
      data: { tripId: null },
    });

    await tx.receipt.updateMany({
      where: { tripId, userId, recordStatus: 'active' },
      data: { tripId: null },
    });

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'trip',
        entityId: tripId,
        action: 'delete',
        oldValues: {
          status: trip.status,
          purpose: trip.purpose,
          unlinkedExpenseIds: unlinkedExpenses.map((item) => item.id),
          unlinkedReceiptIds: unlinkedReceipts.map((item) => item.id),
        },
        source: 'web',
      },
    });
  });

  return { id: tripId, deleted: true };
}

export async function duplicateTrip(userId: string, tripId: string) {
  const source = await getOwnedTrip(userId, tripId);

  if (source.status !== 'completed') {
    throw new ValidationError('Only completed trips can be duplicated');
  }

  return startTrip(userId, {
    businessId: source.businessId,
    vehicleId: source.vehicleId,
    purpose: source.purpose,
    ...(source.destination ? { destination: source.destination } : {}),
    ...(source.startLocation ? { startLocation: source.startLocation } : {}),
    ...(source.clientId ? { clientId: source.clientId } : {}),
    ...(source.projectId ? { projectId: source.projectId } : {}),
  });
}
