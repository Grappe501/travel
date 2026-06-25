'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  ButtonLink,
  Card,
  CardContent,
  Input,
  RemoveEntryButton,
  Select,
  Textarea,
} from '@/components/ui';
import { formatCategoryLabel, getExpenseCategoryOptions } from '@/lib/receipts/categories';
import type {
  SerializedBusiness,
  SerializedExpense,
  SerializedReceipt,
  SerializedTrip,
} from '@/lib/types/core';

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(2)}`;
}

type ExpenseListProps = {
  expenses: SerializedExpense[];
};

export function ExpenseList({ expenses: initialExpenses }: ExpenseListProps) {
  const [categorySlug, setCategorySlug] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expenses, setExpenses] = useState(initialExpenses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = useMemo(() => getExpenseCategoryOptions(), []);

  async function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (categorySlug) params.set('categorySlug', categorySlug);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);

    const response = await fetch(`/api/expenses?${params.toString()}`);
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not load expenses');
      setLoading(false);
      return;
    }

    setExpenses(result.data);
    setLoading(false);
  }

  function resetFilters() {
    setCategorySlug('');
    setDateFrom('');
    setDateTo('');
    setExpenses(initialExpenses);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-4">
          <h2 className="text-section-title text-foreground">Filter</h2>
          <form onSubmit={applyFilters} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Category"
              id="expense-filter-category"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              placeholder="All categories"
              options={categoryOptions}
            />
            <Input
              label="From"
              id="expense-filter-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              label="To"
              id="expense-filter-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Loading…' : 'Apply'}
              </Button>
              <Button type="button" variant="secondary" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </form>
          {error ? <Alert variant="error">{error}</Alert> : null}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-foreground">
                    {expense.merchant ?? 'Expense'}
                  </h3>
                  <Badge variant="outline">{formatCategoryLabel(expense.categorySlug)}</Badge>
                </div>
                <p className="text-caption text-muted">
                  {expense.expenseDate} · {expense.businessName}
                  {expense.tripPurpose ? ` · Trip: ${expense.tripPurpose}` : ''}
                </p>
                <p className="text-body font-medium">
                  {formatMoney(expense.amount, expense.currency)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ButtonLink href={`/expenses/${expense.id}`} variant="secondary" size="sm">
                  View
                </ButtonLink>
                <RemoveEntryButton
                  apiUrl={`/api/expenses/${expense.id}`}
                  confirmMessage="Remove this expense? This cannot be undone."
                  errorDisplay="alert"
                  onRemoved={() =>
                    setExpenses((items) => items.filter((item) => item.id !== expense.id))
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

type ExpenseFormProps = {
  businesses: SerializedBusiness[];
  trips: SerializedTrip[];
  initial?: SerializedExpense;
  defaultTripId?: string;
  lockTrip?: boolean;
  returnToTripId?: string;
};

export function ExpenseForm({
  businesses,
  trips,
  initial,
  defaultTripId,
  lockTrip = false,
  returnToTripId,
}: ExpenseFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const categoryOptions = getExpenseCategoryOptions();
  const today = new Date().toISOString().slice(0, 10);
  const lockedTrip =
    lockTrip && defaultTripId ? trips.find((trip) => trip.id === defaultTripId) : undefined;

  const [businessId, setBusinessId] = useState(
    initial?.businessId ?? lockedTrip?.businessId ?? businesses[0]?.id ?? ''
  );
  const [tripId, setTripId] = useState(initial?.tripId ?? defaultTripId ?? '');
  const [categorySlug, setCategorySlug] = useState(initial?.categorySlug ?? 'other');
  const [merchant, setMerchant] = useState(initial?.merchant ?? '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [taxAmount, setTaxAmount] = useState(
    initial?.taxAmount != null ? String(initial.taxAmount) : ''
  );
  const [expenseDate, setExpenseDate] = useState(initial?.expenseDate ?? today);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const tripsForBusiness = trips.filter((trip) => trip.businessId === businessId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      businessId,
      ...(tripId ? { tripId } : {}),
      categorySlug,
      merchant: merchant || undefined,
      amount: Number(amount),
      ...(taxAmount ? { taxAmount: Number(taxAmount) } : {}),
      expenseDate,
      notes: notes || undefined,
    };

    const response = await fetch(isEdit ? `/api/expenses/${initial!.id}` : '/api/expenses', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not save expense');
      setLoading(false);
      return;
    }

    if (returnToTripId) {
      router.push(`/trips/${returnToTripId}`);
    } else {
      router.push(`/expenses/${result.data.id}`);
    }
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          {lockedTrip ? (
            <p className="text-body text-muted">
              Linking to trip:{' '}
              <span className="font-medium text-foreground">{lockedTrip.purpose}</span>
            </p>
          ) : null}

          <Select
            label="Business"
            id="expense-business"
            value={businessId}
            onChange={(e) => {
              setBusinessId(e.target.value);
              if (!defaultTripId) {
                setTripId('');
              }
            }}
            required
            disabled={Boolean(lockedTrip)}
            options={businesses.map((business) => ({ value: business.id, label: business.name }))}
          />

          {!lockedTrip ? (
            <Select
              label="Trip (optional)"
              id="expense-trip"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              placeholder="No trip"
              options={tripsForBusiness.map((trip) => ({
                value: trip.id,
                label: `${trip.purpose} (${trip.status})`,
              }))}
            />
          ) : null}

          <Select
            label="Category"
            id="expense-category"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            required
            options={categoryOptions}
          />

          <Input label="Merchant" id="expense-merchant" value={merchant} onChange={(e) => setMerchant(e.target.value)} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Amount"
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              label="Tax"
              id="expense-tax"
              type="number"
              min="0"
              step="0.01"
              value={taxAmount}
              onChange={(e) => setTaxAmount(e.target.value)}
            />
          </div>

          <Input
            label="Date"
            id="expense-date"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />

          <Textarea label="Notes" id="expense-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Add expense'}
            </Button>
            <ButtonLink
              href={
                returnToTripId
                  ? `/trips/${returnToTripId}`
                  : isEdit
                    ? `/expenses/${initial!.id}`
                    : '/expenses'
              }
              variant="secondary"
            >
              Cancel
            </ButtonLink>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function ExpenseDetailCard({ expense }: { expense: SerializedExpense }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-section-title text-foreground">
              {expense.merchant ?? 'Expense'}
            </h2>
            <Badge variant="outline">{formatCategoryLabel(expense.categorySlug)}</Badge>
          </div>

          <dl className="grid gap-3 text-body sm:grid-cols-2">
            <div>
              <dt className="text-caption text-muted">Amount</dt>
              <dd className="text-card-title">{formatMoney(expense.amount, expense.currency)}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Date</dt>
              <dd>{expense.expenseDate}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Business</dt>
              <dd>{expense.businessName}</dd>
            </div>
            {expense.tripId ? (
              <div>
                <dt className="text-caption text-muted">Trip</dt>
                <dd>
                  <Link href={`/trips/${expense.tripId}`} className="text-primary hover:underline">
                    {expense.tripPurpose ?? expense.tripId}
                  </Link>
                </dd>
              </div>
            ) : null}
            {expense.receiptId ? (
              <div>
                <dt className="text-caption text-muted">Receipt</dt>
                <dd>
                  <Link
                    href={`/receipts/${expense.receiptId}`}
                    className="text-primary hover:underline"
                  >
                    {expense.receiptMerchant ?? 'View receipt'}
                  </Link>
                </dd>
              </div>
            ) : null}
            {expense.taxAmount !== null ? (
              <div>
                <dt className="text-caption text-muted">Tax</dt>
                <dd>{formatMoney(expense.taxAmount, expense.currency)}</dd>
              </div>
            ) : null}
          </dl>

          {expense.notes ? (
            <p className="text-caption text-muted">
              <span className="font-medium text-foreground">Notes:</span> {expense.notes}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/expenses/${expense.id}/edit`} size="sm">
              Edit
            </ButtonLink>
            <RemoveEntryButton
              apiUrl={`/api/expenses/${expense.id}`}
              confirmMessage="Remove this expense? This cannot be undone."
              redirectTo="/expenses"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type ReceiptAttachFormProps = {
  receiptId: string;
  businessId: string | null;
  currentTripId: string | null;
  businesses: SerializedBusiness[];
  trips: SerializedTrip[];
};

export function ReceiptAttachForm({
  receiptId,
  businessId,
  currentTripId,
  businesses,
  trips,
}: ReceiptAttachFormProps) {
  const router = useRouter();
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    businessId ?? businesses[0]?.id ?? ''
  );
  const [tripId, setTripId] = useState(currentTripId ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const tripsForBusiness = trips.filter((trip) => trip.businessId === selectedBusinessId);

  async function handleAttach(e: React.FormEvent) {
    e.preventDefault();
    if (!tripId) {
      setError('Select a trip');
      return;
    }

    setLoading(true);
    setError(null);

    const response = await fetch(`/api/receipts/${receiptId}/attach`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripId,
        businessId: selectedBusinessId,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not attach receipt');
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <h2 className="text-section-title text-foreground">Attach to trip</h2>
        {error ? <Alert variant="error">{error}</Alert> : null}
        <form onSubmit={handleAttach} className="space-y-4">
          <Select
            label="Business"
            id="attach-business"
            value={selectedBusinessId}
            onChange={(e) => {
              setSelectedBusinessId(e.target.value);
              setTripId('');
            }}
            options={businesses.map((business) => ({ value: business.id, label: business.name }))}
          />
          <Select
            label="Trip"
            id="attach-trip"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            placeholder="Select trip"
            required
            options={tripsForBusiness.map((trip) => ({
              value: trip.id,
              label: `${trip.purpose} (${trip.status})`,
            }))}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Attach receipt'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type TripExpensesListProps = {
  expenses: SerializedExpense[];
};

export function TripExpensesList({ expenses }: TripExpensesListProps) {
  if (expenses.length === 0) {
    return (
      <p className="text-caption text-muted">No expenses linked to this trip yet.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {expenses.map((expense) => (
        <li key={expense.id} className="flex items-center justify-between text-body">
          <Link href={`/expenses/${expense.id}`} className="text-primary hover:underline">
            {expense.merchant ?? formatCategoryLabel(expense.categorySlug)}
          </Link>
          <span>{formatMoney(expense.amount, expense.currency)}</span>
        </li>
      ))}
    </ul>
  );
}

type TripExpenseLinkPanelProps = {
  trip: SerializedTrip;
  unlinkedExpenses: SerializedExpense[];
  unlinkedReceipts: SerializedReceipt[];
};

export function TripExpenseLinkPanel({
  trip,
  unlinkedExpenses: initialUnlinkedExpenses,
  unlinkedReceipts: initialUnlinkedReceipts,
}: TripExpenseLinkPanelProps) {
  const router = useRouter();
  const [unlinkedExpenses, setUnlinkedExpenses] = useState(initialUnlinkedExpenses);
  const [unlinkedReceipts, setUnlinkedReceipts] = useState(initialUnlinkedReceipts);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isActiveTrip = trip.status === 'active';
  const uploadHref = `/receipts/upload?tripId=${trip.id}&businessId=${trip.businessId}`;
  const addExpenseHref = `/expenses/new?tripId=${trip.id}`;

  async function linkExpense(expenseId: string) {
    setLinkingId(expenseId);
    setError(null);

    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: trip.id }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not link expense');
      setLinkingId(null);
      return;
    }

    setUnlinkedExpenses((items) => items.filter((item) => item.id !== expenseId));
    setLinkingId(null);
    router.refresh();
  }

  async function linkReceipt(receiptId: string) {
    setLinkingId(receiptId);
    setError(null);

    const response = await fetch(`/api/receipts/${receiptId}/attach`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripId: trip.id,
        businessId: trip.businessId,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not link receipt');
      setLinkingId(null);
      return;
    }

    setUnlinkedReceipts((items) => items.filter((item) => item.id !== receiptId));
    setLinkingId(null);
    router.refresh();
  }

  const hasUnlinked = unlinkedExpenses.length > 0 || unlinkedReceipts.length > 0;

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div>
          <h2 className="text-section-title text-foreground">
            {isActiveTrip ? 'Trip expenses' : 'Link expenses'}
          </h2>
          <p className="mt-1 text-caption text-muted">
            {isActiveTrip
              ? 'Upload receipts and add expenses while your trip is in progress.'
              : 'Add new expenses or connect receipts and expenses you recorded before ending the trip.'}
          </p>
        </div>

        {error ? <Alert variant="error">{error}</Alert> : null}

        <div className="flex flex-wrap gap-2">
          <ButtonLink href={addExpenseHref} size="sm">
            Add expense
          </ButtonLink>
          <ButtonLink href={uploadHref} variant="secondary" size="sm">
            Upload receipt
          </ButtonLink>
        </div>

        {hasUnlinked ? (
          <div className="space-y-4 border-t border-border pt-4">
            {unlinkedReceipts.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-subheading text-foreground">Unlinked receipts</h3>
                <ul className="space-y-2">
                  {unlinkedReceipts.map((receipt) => (
                    <li
                      key={receipt.id}
                      className="flex flex-wrap items-center justify-between gap-2 text-body"
                    >
                      <Link href={`/receipts/${receipt.id}`} className="text-primary hover:underline">
                        {receipt.merchant ?? 'Receipt'}
                        {receipt.total !== null
                          ? ` · ${receipt.currency} ${receipt.total.toFixed(2)}`
                          : ''}
                      </Link>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={linkingId === receipt.id}
                        onClick={() => linkReceipt(receipt.id)}
                      >
                        {linkingId === receipt.id ? 'Linking…' : 'Link to trip'}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {unlinkedExpenses.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-subheading text-foreground">Unlinked expenses</h3>
                <ul className="space-y-2">
                  {unlinkedExpenses.map((expense) => (
                    <li
                      key={expense.id}
                      className="flex flex-wrap items-center justify-between gap-2 text-body"
                    >
                      <Link href={`/expenses/${expense.id}`} className="text-primary hover:underline">
                        {expense.merchant ?? formatCategoryLabel(expense.categorySlug)} ·{' '}
                        {formatMoney(expense.amount, expense.currency)}
                      </Link>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={linkingId === expense.id}
                        onClick={() => linkExpense(expense.id)}
                      >
                        {linkingId === expense.id ? 'Linking…' : 'Link to trip'}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
