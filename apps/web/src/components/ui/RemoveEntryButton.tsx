'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert } from './Alert';
import { Button, type ButtonSize, type ButtonVariant } from './Button';

type RemoveEntryButtonProps = {
  apiUrl: string;
  confirmMessage: string;
  label?: string;
  redirectTo?: string;
  onRemoved?: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  errorDisplay?: 'inline' | 'alert';
};

export function RemoveEntryButton({
  apiUrl,
  confirmMessage,
  label = 'Remove',
  redirectTo,
  onRemoved,
  size = 'sm',
  variant = 'secondary',
  className,
  errorDisplay = 'inline',
}: RemoveEntryButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!window.confirm(confirmMessage)) {
      return;
    }

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

    onRemoved?.();

    if (redirectTo) {
      router.push(redirectTo);
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <div className={className}>
      {error && errorDisplay === 'inline' ? <Alert variant="error">{error}</Alert> : null}
      <Button type="button" size={size} variant={variant} disabled={loading} onClick={handleClick}>
        {loading ? 'Removing…' : label}
      </Button>
    </div>
  );
}
