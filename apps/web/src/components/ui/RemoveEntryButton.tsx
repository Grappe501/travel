'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { RestorableEntityType } from '@mileage-copilot/shared';
import { DELETE_UNDO_SECONDS } from '@mileage-copilot/shared';
import { Alert } from './Alert';
import { Button, type ButtonSize, type ButtonVariant } from './Button';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { parseEntityId, useToast } from './ToastProvider';

type RemoveEntryButtonProps = {
  apiUrl: string;
  entityType: RestorableEntityType;
  title?: string;
  description?: string;
  entityLabel?: string;
  label?: string;
  confirmLabel?: string;
  redirectTo?: string;
  onRemoved?: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  errorDisplay?: 'inline' | 'alert';
  undoEnabled?: boolean;
  /** @deprecated Use title and description */
  confirmMessage?: string;
};

export function RemoveEntryButton({
  apiUrl,
  title,
  description,
  entityType,
  entityLabel,
  label = 'Remove',
  confirmLabel = 'Remove',
  redirectTo,
  onRemoved,
  size = 'sm',
  variant = 'secondary',
  className,
  errorDisplay = 'inline',
  undoEnabled = true,
  confirmMessage,
}: RemoveEntryButtonProps) {
  const router = useRouter();
  const { showUndoToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dialogTitle = title ?? (confirmMessage?.endsWith('?') ? confirmMessage : 'Remove entry?');
  const dialogDescription =
    description ??
    (confirmMessage && !confirmMessage.endsWith('?')
      ? confirmMessage
      : `Linked records stay in your account. You can undo for ${DELETE_UNDO_SECONDS} seconds.`);

  async function performDelete() {
    setLoading(true);
    setError(null);

    const response = await fetch(apiUrl, { method: 'DELETE' });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = (result as { error?: string }).error ?? 'Could not remove entry';
      if (errorDisplay === 'alert') {
        window.alert(message);
      } else {
        setError(message);
      }
      setLoading(false);
      return;
    }

    setOpen(false);
    onRemoved?.();

    const entityId = parseEntityId(apiUrl);
    const toastLabel = entityLabel ?? 'Entry';

    if (undoEnabled && entityId) {
      showUndoToast(`${toastLabel} removed`, async () => {
        const restoreResponse = await fetch('/api/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entityType, entityId }),
        });

        if (!restoreResponse.ok) {
          const restoreResult = await restoreResponse.json().catch(() => ({}));
          window.alert((restoreResult as { error?: string }).error ?? 'Could not undo removal');
          return;
        }

        router.refresh();
      });
    }

    if (redirectTo) {
      router.push(redirectTo);
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className={className}>
      {error && errorDisplay === 'inline' ? <Alert variant="error">{error}</Alert> : null}
      <Button type="button" size={size} variant={variant} disabled={loading} onClick={() => setOpen(true)}>
        {loading ? 'Removing…' : label}
      </Button>

      <ConfirmDeleteDialog
        open={open}
        title={dialogTitle}
        description={dialogDescription}
        confirmLabel={confirmLabel}
        loading={loading}
        onConfirm={() => void performDelete()}
        onClose={() => {
          if (!loading) setOpen(false);
        }}
      />
    </div>
  );
}
