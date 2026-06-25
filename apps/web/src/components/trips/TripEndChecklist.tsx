'use client';

import Link from 'next/link';
import { formatCategoryLabel } from '@/lib/receipts/categories';
import type { SerializedExpense, SerializedReceipt, SerializedTrip } from '@/lib/types/core';
import { Alert, ButtonLink, Card, CardContent } from '@/components/ui';

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(2)}`;
}

type TripEndChecklistProps = {
  trip: SerializedTrip;
  unlinkedExpenses: SerializedExpense[];
  unlinkedReceipts: SerializedReceipt[];
  tripExpenseCount: number;
};

export function TripEndChecklist({
  trip,
  unlinkedExpenses,
  unlinkedReceipts,
  tripExpenseCount,
}: TripEndChecklistProps) {
  const uploadHref = `/receipts/upload?tripId=${trip.id}&businessId=${trip.businessId}`;
  const addExpenseHref = `/expenses/new?tripId=${trip.id}`;
  const hasUnlinked = unlinkedExpenses.length > 0 || unlinkedReceipts.length > 0;
  const hasNoTripExpenses = tripExpenseCount === 0;

  if (!hasUnlinked && !hasNoTripExpenses) {
    return null;
  }

  return (
    <Card className="border-warning/40 bg-warning/5">
      <CardContent className="space-y-4 pt-4">
        <div>
          <h2 className="text-section-title text-foreground">Forgot something?</h2>
          <p className="mt-1 text-caption text-muted">
            Link receipts and expenses to this trip before you complete it, or finish now and add
            them later from the trip page.
          </p>
        </div>

        {hasNoTripExpenses ? (
          <Alert variant="warning">No expenses are linked to this trip yet.</Alert>
        ) : null}

        {unlinkedReceipts.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-subheading text-foreground">Unlinked receipts</h3>
            <ul className="space-y-2">
              {unlinkedReceipts.slice(0, 5).map((receipt) => (
                <li key={receipt.id} className="flex flex-wrap items-center justify-between gap-2 text-body">
                  <Link href={`/receipts/${receipt.id}`} className="text-primary hover:underline">
                    {receipt.merchant ?? 'Receipt'}
                  </Link>
                  <ButtonLink href={`/receipts/${receipt.id}`} size="sm" variant="secondary">
                    Review & link
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {unlinkedExpenses.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-subheading text-foreground">Unlinked expenses</h3>
            <ul className="space-y-2">
              {unlinkedExpenses.slice(0, 5).map((expense) => (
                <li key={expense.id} className="flex flex-wrap items-center justify-between gap-2 text-body">
                  <Link href={`/expenses/${expense.id}`} className="text-primary hover:underline">
                    {expense.merchant ?? formatCategoryLabel(expense.categorySlug)} ·{' '}
                    {formatMoney(expense.amount, expense.currency)}
                  </Link>
                  <ButtonLink href={`/expenses/${expense.id}/edit`} size="sm" variant="secondary">
                    Link
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <ButtonLink href={uploadHref} size="sm">
            Upload receipt
          </ButtonLink>
          <ButtonLink href={addExpenseHref} variant="secondary" size="sm">
            Add expense
          </ButtonLink>
          <ButtonLink href={`/trips/${trip.id}`} variant="secondary" size="sm">
            Link on trip page
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  );
}
