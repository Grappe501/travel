import type { Prisma, TripGpsPoint, TripGpsPointSource } from '@prisma/client';
import {
  gpsPointsBatchSchema,
  resolveTripMileage,
  sumPathMiles,
  type GpsCoordinate,
  type GpsPointInput,
  type GpsPointsBatchInput,
} from '@mileage-copilot/shared';
import { ValidationError } from '@/lib/api/response';
import { getOwnedTrip } from '@/server/services/trip.service';
import { prisma } from '@/lib/db/prisma';

const MAX_POINTS_PER_TRIP = 2000;

export function serializeGpsPoint(point: TripGpsPoint) {
  return {
    id: point.id,
    tripId: point.tripId,
    latitude: Number(point.latitude),
    longitude: Number(point.longitude),
    accuracyM: point.accuracyM ? Number(point.accuracyM) : null,
    altitudeM: point.altitudeM ? Number(point.altitudeM) : null,
    speedMps: point.speedMps ? Number(point.speedMps) : null,
    heading: point.heading ? Number(point.heading) : null,
    recordedAt: point.recordedAt.toISOString(),
    source: point.source,
    createdAt: point.createdAt.toISOString(),
  };
}

export type SerializedGpsPoint = ReturnType<typeof serializeGpsPoint>;

function toCoordinate(point: TripGpsPoint): GpsCoordinate {
  return {
    latitude: Number(point.latitude),
    longitude: Number(point.longitude),
  };
}

export async function listTripGpsPoints(userId: string, tripId: string, limit = 500) {
  await getOwnedTrip(userId, tripId);

  const points = await prisma.tripGpsPoint.findMany({
    where: { tripId, userId },
    orderBy: { recordedAt: 'asc' },
    take: Math.min(limit, 500),
  });

  return points.map(serializeGpsPoint);
}

export async function insertGpsPoints(
  userId: string,
  tripId: string,
  input: GpsPointsBatchInput
) {
  const data = gpsPointsBatchSchema.parse(input);
  const trip = await getOwnedTrip(userId, tripId);

  if (trip.status !== 'active') {
    throw new ValidationError('GPS points can only be added to active trips');
  }

  const existingCount = await prisma.tripGpsPoint.count({ where: { tripId } });
  if (existingCount >= MAX_POINTS_PER_TRIP) {
    throw new ValidationError('Maximum GPS points reached for this trip');
  }

  const allowed = MAX_POINTS_PER_TRIP - existingCount;
  const batch = data.points.slice(0, allowed);

  await prisma.tripGpsPoint.createMany({
    data: batch.map((point) => mapPointToRow(userId, tripId, point)),
  });

  return { inserted: batch.length, skipped: data.points.length - batch.length };
}

function mapPointToRow(userId: string, tripId: string, point: GpsPointInput) {
  return {
    tripId,
    userId,
    latitude: point.latitude,
    longitude: point.longitude,
    accuracyM: point.accuracyM,
    altitudeM: point.altitudeM,
    speedMps: point.speedMps,
    heading: point.heading,
    recordedAt: new Date(point.recordedAt),
    source: point.source as TripGpsPointSource,
  };
}

export async function setTripTracking(userId: string, tripId: string, trackingEnabled: boolean) {
  const trip = await getOwnedTrip(userId, tripId);

  if (trip.status !== 'active') {
    throw new ValidationError('Tracking can only be changed on active trips');
  }

  const now = new Date();
  const updated = await prisma.trip.update({
    where: { id: tripId },
    data: {
      trackingEnabled,
      ...(trackingEnabled
        ? { trackingStartedAt: trip.trackingStartedAt ?? now, trackingStoppedAt: null }
        : { trackingStoppedAt: now }),
    },
    include: {
      business: { select: { id: true, name: true } },
      vehicle: { select: { id: true, nickname: true } },
    },
  });

  return updated;
}

export async function computeGpsMilesForTrip(tripId: string): Promise<number | null> {
  const points = await prisma.tripGpsPoint.findMany({
    where: { tripId },
    orderBy: { recordedAt: 'asc' },
  });

  return sumPathMiles(points.map(toCoordinate));
}

export async function getRouteSummary(userId: string, tripId: string) {
  const trip = await getOwnedTrip(userId, tripId);
  const points = await prisma.tripGpsPoint.findMany({
    where: { tripId, userId },
    orderBy: { recordedAt: 'asc' },
  });

  const coordinates = points.map(toCoordinate);
  const gpsMiles =
    trip.gpsMiles != null
      ? Number(trip.gpsMiles)
      : sumPathMiles(coordinates);

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const point of coordinates) {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  }

  const hasBounds = coordinates.length > 0 && Number.isFinite(minLat);

  return {
    tripId,
    pointCount: points.length,
    gpsMiles,
    odometerMiles: trip.miles ? Number(trip.miles) : null,
    mileageSource: trip.mileageSource,
    mileageReviewRequired: trip.mileageReviewRequired,
    trackingEnabled: trip.trackingEnabled,
    startedAt: trip.startedAt?.toISOString() ?? null,
    endedAt: trip.endedAt?.toISOString() ?? null,
    bounds: hasBounds
      ? { minLat, maxLat, minLng, maxLng }
      : null,
    points: points.map(serializeGpsPoint),
  };
}

export async function resolveMileageAtEnd(
  trip: Prisma.TripGetPayload<object>,
  options?: {
    endOdometer?: number;
    endLatitude?: number;
    endLongitude?: number;
  }
) {
  const points = await prisma.tripGpsPoint.findMany({
    where: { tripId: trip.id },
    orderBy: { recordedAt: 'asc' },
  });

  const startOdometer = trip.startOdometer ? Number(trip.startOdometer) : null;
  const endOdometer =
    options?.endOdometer ??
    (trip.endOdometer ? Number(trip.endOdometer) : null);

  const startCoordinate =
    trip.startLatitude != null && trip.startLongitude != null
      ? { latitude: Number(trip.startLatitude), longitude: Number(trip.startLongitude) }
      : null;

  const endCoordinate =
    options?.endLatitude != null && options?.endLongitude != null
      ? { latitude: options.endLatitude, longitude: options.endLongitude }
      : trip.endLatitude != null && trip.endLongitude != null
        ? { latitude: Number(trip.endLatitude), longitude: Number(trip.endLongitude) }
        : null;

  const pathCoordinates = points.map(toCoordinate);
  if (endCoordinate) {
    const last = pathCoordinates[pathCoordinates.length - 1];
    if (
      !last ||
      last.latitude !== endCoordinate.latitude ||
      last.longitude !== endCoordinate.longitude
    ) {
      pathCoordinates.push(endCoordinate);
    }
  } else if (pathCoordinates.length === 0) {
    if (startCoordinate) pathCoordinates.push(startCoordinate);
    if (endCoordinate) pathCoordinates.push(endCoordinate);
  }

  const resolution = resolveTripMileage({
    startOdometer,
    endOdometer,
    gpsPoints: pathCoordinates,
  });

  if (resolution.miles === null) {
    throw new ValidationError(
      'Enter ending odometer or enable GPS tracking with at least two location points'
    );
  }

  return resolution;
}
