'use client';

type RoutePoint = {
  latitude: number;
  longitude: number;
};

type TripRouteMapProps = {
  points: RoutePoint[];
  className?: string;
};

export function TripRouteMap({ points, className }: TripRouteMapProps) {
  if (points.length < 2) {
    return (
      <div
        className={`flex h-40 items-center justify-center rounded-lg border border-border bg-surface-muted text-caption text-muted ${className ?? ''}`}
      >
        Not enough GPS points for a route map
      </div>
    );
  }

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const pad = 0.1;
  const latSpan = Math.max(maxLat - minLat, 0.001);
  const lngSpan = Math.max(maxLng - minLng, 0.001);
  const viewMinLat = minLat - latSpan * pad;
  const viewMaxLat = maxLat + latSpan * pad;
  const viewMinLng = minLng - lngSpan * pad;
  const viewMaxLng = maxLng + lngSpan * pad;

  const width = 400;
  const height = 160;

  const project = (point: RoutePoint) => {
    const x = ((point.longitude - viewMinLng) / (viewMaxLng - viewMinLng)) * width;
    const y = height - ((point.latitude - viewMinLat) / (viewMaxLat - viewMinLat)) * height;
    return { x, y };
  };

  const polyline = points
    .map((point) => {
      const { x, y } = project(point);
      return `${x},${y}`;
    })
    .join(' ');

  const start = project(points[0]!);
  const end = project(points[points.length - 1]!);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`h-40 w-full rounded-lg border border-border bg-surface-muted ${className ?? ''}`}
      role="img"
      aria-label="Trip route map"
    >
      <polyline
        points={polyline}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-primary"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={start.x} cy={start.y} r="4" className="fill-success" />
      <circle cx={end.x} cy={end.y} r="4" className="fill-primary" />
    </svg>
  );
}
