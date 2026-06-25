'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type NavSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Wider sheet on desktop when opened from top nav */
  className?: string;
};

export function NavSheet({ open, onClose, title, description, children, className }: NavSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 m-0 max-h-[85vh] w-full max-w-lg rounded-t-2xl border border-border bg-surface-elevated p-0 text-foreground shadow-lg backdrop:bg-foreground/40 md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl',
        className
      )}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-labelledby="nav-sheet-title"
    >
      <div className="max-h-[85vh] overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border md:hidden" aria-hidden />
        <div className="space-y-1">
          <h2 id="nav-sheet-title" className="text-section-title">
            {title}
          </h2>
          {description ? <p className="text-caption text-muted">{description}</p> : null}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}
