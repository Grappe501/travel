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
  Select,
  Textarea,
} from '@/components/ui';
import { formatCategoryLabel, getExpenseCategoryOptions } from '@/lib/receipts/categories';
import type {
  SerializedBusiness,
  SerializedExpense,
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
              <ButtonLink href={`/expenses/${expense.id}`} variant="secondary" size="sm">
                View
              </ButtonLink>
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
};

export function ExpenseForm({ businesses, trips, initial }: ExpenseFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const categoryOptions = getExpenseCategoryOptions();
  const today = new Date().toISOString().slice(0, 10);

  const [businessId, setBusinessId] = useState(initial?.businessId ?? businesses[0]?.id ?? '');
  const [tripId, setTripId] = useState(initial?.tripId ?? '');
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

    router.push(`/expenses/${result.data.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <Select
            label="Business"
            id="expense-business"
            value={businessId}
            onChange={(e) => {
              setBusinessId(e.target.value);
              setTripId('');
            }}
            required
            options={businesses.map((business) => ({ value: business.id, label: business.name }))}
          />

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
            <ButtonLink href={isEdit ? `/expenses/${initial!.id}` : '/expenses'} variant="secondary">
              Cancel
            </ButtonLink>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function ExpenseDetailCard({ expense }: { expense: SerializedExpense }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm('Delete this expense? This cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError(null);

    const response = await fetch(`/api/expenses/${expense.id}`, { method: 'DELETE' });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not delete expense');
      setDeleting(false);
      return;
    }

    router.push('/expenses');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error ? <Alert variant="error">{error}</Alert> : null}
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
            <Button type="button" variant="secondary" size="sm" disabled={deleting} onClick={handleDelete}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
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
