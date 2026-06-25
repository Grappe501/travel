/**
 * GPS path distance and FR-500 mileage precedence.
 */

export type GpsCoordinate = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Haversine distance between two WGS84 points in miles. */
export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

/** Sum segment distances along an ordered path; returns null if fewer than 2 points. */
export function sumPathMiles(points: GpsCoordinate[]): number | null {
  if (points.length < 2) {
    return null;
  }

  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    total += haversineMiles(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
  }

  return Math.round(total * 10) / 10;
}

export type MileageResolutionInput = {
  startOdometer?: number | null;
  endOdometer?: number | null;
  gpsPoints?: GpsCoordinate[];
  startCoordinate?: GpsCoordinate | null;
  endCoordinate?: GpsCoordinate | null;
};

export type MileageResolution = {
  miles: number | null;
  gpsMiles: number | null;
  mileageSource: 'odometer' | 'gps' | 'hybrid' | null;
  mileageReviewRequired: boolean;
};

const MILEAGE_DIVERGENCE_THRESHOLD = 0.1;

export function resolveTripMileage(input: MileageResolutionInput): MileageResolution {
  const odometerMiles =
    input.startOdometer != null && input.endOdometer != null
      ? Math.round((input.endOdometer - input.startOdometer) * 10) / 10
      : null;

  const pathPoints: GpsCoordinate[] = [];
  if (input.gpsPoints?.length) {
    pathPoints.push(...input.gpsPoints);
  } else {
    if (input.startCoordinate) pathPoints.push(input.startCoordinate);
    if (input.endCoordinate) pathPoints.push(input.endCoordinate);
  }

  const gpsMiles = sumPathMiles(pathPoints);

  if (odometerMiles !== null && gpsMiles !== null) {
    const reviewRequired =
      odometerMiles > 0 &&
      Math.abs(odometerMiles - gpsMiles) / odometerMiles > MILEAGE_DIVERGENCE_THRESHOLD;

    return {
      miles: odometerMiles,
      gpsMiles,
      mileageSource: 'hybrid',
      mileageReviewRequired: reviewRequired,
    };
  }

  if (odometerMiles !== null) {
    return {
      miles: odometerMiles,
      gpsMiles: null,
      mileageSource: 'odometer',
      mileageReviewRequired: false,
    };
  }

  if (gpsMiles !== null) {
    return {
      miles: gpsMiles,
      gpsMiles,
      mileageSource: 'gps',
      mileageReviewRequired: false,
    };
  }

  return {
    miles: null,
    gpsMiles: null,
    mileageSource: null,
    mileageReviewRequired: false,
  };
}
