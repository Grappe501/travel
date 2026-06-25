'use client';

import type { AppearancePreference } from '@mileage-copilot/shared';
import { useEffect, useState } from 'react';
import { Alert, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { APPEARANCE_OPTIONS, persistAppearance, readStoredAppearance } from '@/lib/theme/appearance';
import { cn } from '@/lib/utils/cn';

export function AppearanceSettingsForm() {
  const [preference, setPreference] = useState<AppearancePreference>('system');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPreference(readStoredAppearance());
  }, []);

  function handleSelect(next: AppearancePreference) {
    setPreference(next);
    persistAppearance(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      {saved ? <Alert variant="success">Appearance updated.</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose how Mileage & Expense Copilot looks on this device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {APPEARANCE_OPTIONS.map((option) => {
            const active = preference === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'surface-card-interactive flex w-full items-center justify-between gap-4 p-4 text-left',
                  active && 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
                )}
                aria-pressed={active}
              >
                <span>
                  <span className="block font-semibold text-foreground">{option.label}</span>
                  <span className="block text-caption text-muted">{option.description}</span>
                </span>
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                    active ? 'border-primary bg-primary' : 'border-border'
                  )}
                  aria-hidden
                >
                  {active ? <span className="h-2 w-2 rounded-full bg-primary-foreground" /> : null}
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
