import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/ui';

type ShellNavActionsProps = {
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
};

/** Home + optional back link so trip flows can return to the main app shell. */
export function ShellNavActions({
  backHref,
  backLabel = 'Back',
  children,
}: ShellNavActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <ButtonLink href="/dashboard" variant="secondary" size="sm">
        Home
      </ButtonLink>
      {backHref ? (
        <ButtonLink href={backHref} variant="secondary" size="sm">
          {backLabel}
        </ButtonLink>
      ) : null}
      {children}
    </div>
  );
}
