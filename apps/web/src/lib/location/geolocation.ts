export type GeoPosition = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  recordedAt: string;
};

export type GeoPermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export function isGeolocationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

export async function queryGeoPermission(): Promise<GeoPermissionState> {
  if (!isGeolocationSupported()) return 'unsupported';
  if (!navigator.permissions?.query) return 'prompt';

  try {
    const status = await navigator.permissions.query({ name: 'geolocation' });
    return status.state as GeoPermissionState;
  } catch {
    return 'prompt';
  }
}

function mapPosition(position: GeolocationPosition): GeoPosition {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy ?? null,
    altitude: position.coords.altitude,
    speed: position.coords.speed,
    heading: position.coords.heading,
    recordedAt: new Date(position.timestamp).toISOString(),
  };
}

export function getCurrentPosition(options?: PositionOptions): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(mapPosition(position)),
      (error) => reject(error),
      {
        enableHighAccuracy: false,
        timeout: 15_000,
        maximumAge: 30_000,
        ...options,
      }
    );
  });
}

export type WatchOptions = PositionOptions & {
  onPosition: (position: GeoPosition) => void;
  onError?: (error: GeolocationPositionError) => void;
};

export function watchPosition(options: WatchOptions): () => void {
  if (!isGeolocationSupported()) {
    options.onError?.({
      code: 2,
      message: 'Geolocation unsupported',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    });
    return () => undefined;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => options.onPosition(mapPosition(position)),
    (error) => options.onError?.(error),
    {
      enableHighAccuracy: false,
      timeout: 20_000,
      maximumAge: 10_000,
      ...options,
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}
