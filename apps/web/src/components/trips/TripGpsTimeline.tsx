'use client';

type TimelinePoint = {
  recordedAt: string;
  latitude: number;
  longitude: number;
  source: string;
};

type TripGpsTimelineProps = {
  points: TimelinePoint[];
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function labelForSource(source: string, index: number, total: number) {
  if (source === 'start' || index === 0) return 'Departed';
  if (source === 'end' || index === total - 1) return 'Arrived';
  return 'Route point';
}

export function TripGpsTimeline({ points }: TripGpsTimelineProps) {
  if (points.length === 0) return null;

  const display = [
    points[0],
    ...(points.length > 2 ? [points[Math.floor(points.length / 2)]!] : []),
    ...(points.length > 1 ? [points[points.length - 1]!] : []),
  ].filter((point, index, arr) => arr.findIndex((p) => p.recordedAt === point.recordedAt) === index);

  return (
    <div className="space-y-3">
      <h3 className="text-body font-medium text-foreground">Timeline</h3>
      <ol className="space-y-2 border-l border-border pl-4">
        {display.map((point, index) => (
          <li key={`${point.recordedAt}-${index}`} className="relative text-caption text-muted">
            <span className="absolute -left-[1.35rem] top-1.5 h-2 w-2 rounded-full bg-primary" />
            <span className="font-medium text-foreground">{formatTime(point.recordedAt)}</span>
            {' · '}
            {labelForSource(point.source, index, display.length)}
            {' · '}
            {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
          </li>
        ))}
      </ol>
    </div>
  );
}
