import { sumPathMiles } from '@mileage-copilot/shared';
import type { GeoPosition } from '@/lib/location/geolocation';
import { getCurrentPosition, watchPosition } from '@/lib/location/geolocation';
import { enqueueGpsPointsBatch } from '@/lib/offline/queue';
import { isBrowserOnline } from '@/lib/offline/connectivity';

const MOVING_INTERVAL_MS = 20_000;
const STATIONARY_INTERVAL_MS = 90_000;
const MIN_DISTANCE_M = 30;
const MAX_ACCURACY_M = 150;
const BATCH_SIZE = 20;

type TrackerPoint = GeoPosition & { source: 'live' | 'start' | 'end' };

export type TripGpsTrackerState = {
  active: boolean;
  paused: boolean;
  estimatedMiles: number | null;
  lastPoint: TrackerPoint | null;
  pointCount: number;
  error: string | null;
};

type TripGpsTrackerOptions = {
  tripId: string;
  highAccuracy?: boolean;
  onStateChange?: (state: TripGpsTrackerState) => void;
};

export class TripGpsTracker {
  private tripId: string;
  private highAccuracy: boolean;
  private onStateChange?: (state: TripGpsTrackerState) => void;
  private points: TrackerPoint[] = [];
  private pendingUpload: TrackerPoint[] = [];
  private stopWatch: (() => void) | null = null;
  private lastSampleAt = 0;
  private lastPosition: TrackerPoint | null = null;
  private paused = false;
  private active = false;
  private error: string | null = null;
  private visibilityHandler: (() => void) | null = null;

  constructor(options: TripGpsTrackerOptions) {
    this.tripId = options.tripId;
    this.highAccuracy = options.highAccuracy ?? false;
    this.onStateChange = options.onStateChange;
  }

  getState(): TripGpsTrackerState {
    const coords = this.points.map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
    return {
      active: this.active,
      paused: this.paused,
      estimatedMiles: sumPathMiles(coords),
      lastPoint: this.lastPosition,
      pointCount: this.points.length,
      error: this.error,
    };
  }

  private emit() {
    this.onStateChange?.(this.getState());
  }

  async start() {
    if (this.active) return;
    this.active = true;
    this.paused = false;
    this.error = null;

    try {
      const startPoint = await getCurrentPosition({ enableHighAccuracy: this.highAccuracy });
      this.recordPoint({ ...startPoint, source: 'live' });
    } catch {
      this.error = 'Could not get initial location';
    }

    this.stopWatch = watchPosition({
      enableHighAccuracy: this.highAccuracy,
      onPosition: (position) => this.handlePosition(position),
      onError: () => {
        this.error = 'Location unavailable';
        this.emit();
      },
    });

    this.visibilityHandler = () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
    this.emit();
  }

  stop() {
    this.active = false;
    this.stopWatch?.();
    this.stopWatch = null;
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    void this.flushUpload();
    this.emit();
  }

  pause() {
    if (!this.active || this.paused) return;
    this.paused = true;
    this.stopWatch?.();
    this.stopWatch = null;
    this.emit();
  }

  resume() {
    if (!this.active || !this.paused) return;
    this.paused = false;
    this.stopWatch = watchPosition({
      enableHighAccuracy: this.highAccuracy,
      onPosition: (position) => this.handlePosition(position),
      onError: () => {
        this.error = 'Location unavailable';
        this.emit();
      },
    });
    this.emit();
  }

  private handlePosition(position: GeoPosition) {
    if (this.paused) return;

    const now = Date.now();
    const interval = this.isMoving(position) ? MOVING_INTERVAL_MS : STATIONARY_INTERVAL_MS;

    if (now - this.lastSampleAt < interval) return;
    if (position.accuracy != null && position.accuracy > MAX_ACCURACY_M) return;

    if (this.lastPosition) {
      const moved = distanceMeters(
        this.lastPosition.latitude,
        this.lastPosition.longitude,
        position.latitude,
        position.longitude
      );
      if (moved < MIN_DISTANCE_M && now - this.lastSampleAt < STATIONARY_INTERVAL_MS) return;
    }

    this.recordPoint({ ...position, source: 'live' });
    this.lastSampleAt = now;
  }

  private isMoving(position: GeoPosition): boolean {
    if (position.speed != null && position.speed > 2) return true;
    if (!this.lastPosition) return false;
    return (
      distanceMeters(
        this.lastPosition.latitude,
        this.lastPosition.longitude,
        position.latitude,
        position.longitude
      ) > MIN_DISTANCE_M
    );
  }

  private recordPoint(point: TrackerPoint) {
    this.points.push(point);
    this.lastPosition = point;
    this.pendingUpload.push(point);
    this.error = null;

    if (this.pendingUpload.length >= BATCH_SIZE) {
      void this.flushUpload();
    }

    this.emit();
  }

  private async flushUpload() {
    if (this.pendingUpload.length === 0) return;

    const batch = this.pendingUpload.splice(0, BATCH_SIZE);
    const payload = {
      points: batch.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
        ...(point.accuracy != null ? { accuracyM: point.accuracy } : {}),
        ...(point.altitude != null ? { altitudeM: point.altitude } : {}),
        ...(point.speed != null ? { speedMps: point.speed } : {}),
        ...(point.heading != null ? { heading: point.heading } : {}),
        recordedAt: point.recordedAt,
        source: point.source,
      })),
    };

    if (!isBrowserOnline()) {
      await enqueueGpsPointsBatch(this.tripId, payload.points);
      return;
    }

    try {
      const response = await fetch(`/api/trips/${this.tripId}/gps-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error ?? 'GPS upload failed');
      }
    } catch {
      await enqueueGpsPointsBatch(this.tripId, payload.points);
    }
  }
}

function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
