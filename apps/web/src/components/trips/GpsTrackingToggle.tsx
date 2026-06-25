'use client';

import { Alert } from '@/components/ui';

type GpsTrackingToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function GpsTrackingToggle({ checked, onChange, disabled }: GpsTrackingToggleProps) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface-muted/50 p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          <span className="text-body font-medium text-foreground">Track mileage with GPS</span>
          <span className="mt-1 block text-caption text-muted">
            Samples your location while this app stays open. Odometer readings take precedence when
            both are provided.
          </span>
        </span>
      </label>
      {checked ? (
        <Alert variant="info">
          Keep the app open while driving for best GPS tracking. Background tracking is not
          supported on all devices.
        </Alert>
      ) : null}
    </div>
  );
}
