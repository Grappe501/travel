'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

type ConfirmDeleteDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  confirmLabel = 'Remove',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDeleteDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" size="sm" disabled={loading} onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" size="sm" disabled={loading} onClick={onConfirm}>
            {loading ? 'Removing…' : confirmLabel}
          </Button>
        </>
      }
    />
  );
}
