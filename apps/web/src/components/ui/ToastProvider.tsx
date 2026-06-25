'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DELETE_UNDO_SECONDS } from '@mileage-copilot/shared';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

type ToastAction = {
  id: string;
  message: string;
  undoLabel?: string;
  onUndo?: () => Promise<void> | void;
};

type ToastContextValue = {
  showUndoToast: (message: string, onUndo: () => Promise<void> | void) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function parseEntityId(apiUrl: string): string | null {
  const match = apiUrl.match(/\/api\/[^/]+\/([^/?]+)/);
  return match?.[1] ?? null;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastAction | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearToast = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showUndoToast = useCallback(
    (message: string, onUndo: () => Promise<void> | void) => {
      clearToast();
      const id = crypto.randomUUID();
      setToast({ id, message, undoLabel: 'Undo', onUndo });

      timeoutRef.current = window.setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
        timeoutRef.current = null;
      }, DELETE_UNDO_SECONDS * 1000);
    },
    [clearToast]
  );

  const value = useMemo(() => ({ showUndoToast }), [showUndoToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          className={cn(
            'pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:bottom-6'
          )}
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-xl border border-border bg-surface-elevated px-4 py-3 shadow-lg">
            <p className="min-w-0 flex-1 text-body text-foreground">{toast.message}</p>
            {toast.onUndo ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  void toast.onUndo?.();
                  clearToast();
                }}
              >
                {toast.undoLabel ?? 'Undo'}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export { parseEntityId };
