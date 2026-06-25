'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import {
  isIosSafari,
  isStandaloneDisplay,
  subscribeToInstallPrompt,
  triggerInstallPrompt,
  type BeforeInstallPromptEvent,
} from '@/lib/pwa/install';

type InstallAppPromptProps = {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
};

export function InstallAppPrompt({ variant = 'card', className }: InstallAppPromptProps) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setInstalled(isStandaloneDisplay());
    return subscribeToInstallPrompt((event) => {
      setInstallEvent(event);
      setDismissed(false);
      setMessage(null);
    });
  }, []);

  if (installed || dismissed) {
    return null;
  }

  const ios = isIosSafari();
  const canInstall = Boolean(installEvent) || ios;

  if (!canInstall) {
    return null;
  }

  async function handleInstall() {
    if (ios && !installEvent) {
      setShowIosHint((value) => !value);
      return;
    }

    if (!installEvent) return;

    const outcome = await triggerInstallPrompt(installEvent);
    setInstallEvent(null);

    if (outcome === 'accepted') {
      setInstalled(true);
      setMessage('App installed — open it from your home screen.');
    } else if (outcome === 'dismissed') {
      setMessage('Install dismissed. You can add the app anytime from Settings.');
    }
  }

  const content = (
    <>
      <div className="flex items-start gap-4">
        <Image
          src="/icons/icon-192.png"
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-2xl shadow-md"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-semibold text-foreground">Install on your phone</p>
          <p className="text-caption text-muted">
            Add Mileage & Expense Copilot to your home screen. Log trips and capture receipts offline
            — they sync when you&apos;re back online.
          </p>
        </div>
      </div>

      {message ? <p className="text-caption text-primary">{message}</p> : null}

      {showIosHint ? (
        <p className="rounded-xl bg-primary/10 px-3 py-2 text-caption text-foreground">
          Tap <strong>Share</strong> in Safari, then <strong>Add to Home Screen</strong>.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => void handleInstall()}>
          {ios && !installEvent ? 'How to install' : 'Install app'}
        </Button>
        {variant === 'banner' ? (
          <Button type="button" size="sm" variant="ghost" onClick={() => setDismissed(true)}>
            Not now
          </Button>
        ) : null}
      </div>
    </>
  );

  if (variant === 'inline') {
    return <div className={cn('space-y-3', className)}>{content}</div>;
  }

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'surface-card border-primary/20 bg-gradient-to-r from-primary/10 via-surface to-surface p-4',
          className
        )}
      >
        <div className="space-y-3">{content}</div>
      </div>
    );
  }

  return <div className={cn('surface-card space-y-4 p-4', className)}>{content}</div>;
}
