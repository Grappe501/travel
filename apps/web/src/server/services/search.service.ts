import type { Prisma } from '@prisma/client';
import {
  appliedFiltersFromQuery,
  parseSearchQuery,
  searchQuerySchema,
  type SearchQueryInput,
  type SearchResultItem,
  type UnifiedSearchResults,
} from '@mileage-copilot/shared';
import { ValidationError } from '@/lib/api/response';
import { formatCategoryLabel } from '@/lib/receipts/categories';
import { prisma } from '@/lib/db/prisma';

const activeRecord = { recordStatus: 'active' as const };

function contains(text: string) {
  return { contains: text, mode: 'insensitive' as const };
}

function perGroupLimit(limit?: number) {
  return limit ?? 8;
}

function tripSubtitle(trip: {
  status: string;
  miles: unknown;
  endedAt: Date | null;
  business: { name: string };
  vehicle: { nickname: string };
}) {
  const miles = trip.miles ? `${Number(trip.miles).toLocaleString()} mi` : null;
  const date = trip.endedAt?.toLocaleDateString() ?? 'Active';
  return [trip.business.name, trip.vehicle.nickname, miles, date].filter(Boolean).join(' · ');
}

function dateBounds(from?: string, to?: string) {
  if (!from && !to) return null;

  return {
    ...(from ? { gte: new Date(`${from}T00:00:00.000Z`) } : {}),
    ...(to ? { lte: new Date(`${to}T23:59:59.999Z`) } : {}),
  };
}

function tripDateFilter(from?: string, to?: string): Prisma.TripWhereInput | undefined {
  const bounds = dateBounds(from, to);
  if (!bounds) return undefined;

  return {
    OR: [{ startedAt: bounds }, { endedAt: bounds }],
  };
}

function expenseDateFilter(from?: string, to?: string): Prisma.DateTimeFilter | undefined {
  return dateBounds(from, to) ?? undefined;
}

function receiptDateFilter(from?: string, to?: string): Prisma.ReceiptWhereInput | undefined {
  const bounds = dateBounds(from, to);
  if (!bounds) return undefined;

  return {
    OR: [{ receiptDate: bounds }, { receiptDate: null, createdAt: bounds }],
  };
}

function amountFilter(
  min?: number,
  max?: number,
  exact?: number | null
): Prisma.DecimalFilter | undefined {
  if (exact !== null && exact !== undefined) {
    return { equals: exact };
  }

  if (min === undefined && max === undefined) return undefined;

  return {
    ...(min !== undefined ? { gte: min } : {}),
    ...(max !== undefined ? { lte: max } : {}),
  };
}

function shouldSearchKind(kind: SearchQueryInput['kind'], target: SearchResultItem['kind']) {
  return !kind || kind === target;
}

export async function unifiedSearch(
  userId: string,
  input: SearchQueryInput
): Promise<UnifiedSearchResults> {
  const query = searchQuerySchema.parse(input);
  const parsed = parseSearchQuery(query.q ?? '');
  const take = perGroupLimit(query.limit);
  const filters = appliedFiltersFromQuery(query);

  const hasText = Boolean(parsed.text);
  const hasExactAmount = parsed.amount !== null;
  const hasDate = Boolean(query.from || query.to);
  const hasAmountRange = query.amountMin !== undefined || query.amountMax !== undefined;

  if (!hasText && !hasExactAmount && !hasDate && !hasAmountRange) {
    throw new ValidationError('Enter a search term or apply filters');
  }

  const text = parsed.text;
  const expenseAmount = amountFilter(query.amountMin, query.amountMax, parsed.amount);
  const receiptAmount = amountFilter(query.amountMin, query.amountMax, parsed.amount);

  const searchTrips =
    shouldSearchKind(query.kind, 'trip') &&
    (hasText || hasDate) &&
    !hasExactAmount &&
    query.amountMin === undefined &&
    query.amountMax === undefined &&
    !query.category;

  const searchExpenses =
    shouldSearchKind(query.kind, 'expense') &&
    (hasText || hasDate || hasExactAmount || hasAmountRange || query.category);

  const searchReceipts =
    shouldSearchKind(query.kind, 'receipt') &&
    (hasText || hasDate || hasExactAmount || hasAmountRange) &&
    !query.category;

  const searchClients =
    shouldSearchKind(query.kind, 'client') &&
    hasText &&
    !hasDate &&
    !hasExactAmount &&
    !hasAmountRange &&
    !query.category;

  const searchBusinesses =
    shouldSearchKind(query.kind, 'business') &&
    hasText &&
    !hasDate &&
    !hasExactAmount &&
    !hasAmountRange &&
    !query.category;

  const searchVehicles =
    shouldSearchKind(query.kind, 'vehicle') &&
    hasText &&
    !hasDate &&
    !hasExactAmount &&
    !hasAmountRange &&
    !query.category;

  const [trips, expenses, receipts, clients, businesses, vehicles] = await Promise.all([
    searchTrips
      ? prisma.trip.findMany({
          where: {
            userId,
            ...activeRecord,
            status: { in: ['active', 'completed'] },
            ...(text
              ? {
                  OR: [
                    { purpose: contains(text) },
                    { destination: contains(text) },
                    { startLocation: contains(text) },
                    { endLocation: contains(text) },
                    { notes: contains(text) },
                    { clientName: contains(text) },
                    { projectName: contains(text) },
                  ],
                }
              : {}),
            ...(tripDateFilter(query.from, query.to) ?? {}),
          },
          include: {
            business: { select: { name: true } },
            vehicle: { select: { nickname: true } },
          },
          orderBy: [{ startedAt: 'desc' }, { createdAt: 'desc' }],
          take,
        })
      : Promise.resolve([]),
    searchExpenses
      ? prisma.expense.findMany({
          where: {
            userId,
            ...activeRecord,
            ...(text
              ? {
                  OR: [
                    { merchant: contains(text) },
                    { notes: contains(text) },
                    { categorySlug: contains(text) },
                  ],
                }
              : {}),
            ...(expenseDateFilter(query.from, query.to)
              ? { expenseDate: expenseDateFilter(query.from, query.to) }
              : {}),
            ...(expenseAmount ? { amount: expenseAmount } : {}),
            ...(query.category ? { categorySlug: query.category } : {}),
          },
          include: { business: { select: { name: true } } },
          orderBy: [{ expenseDate: 'desc' }, { createdAt: 'desc' }],
          take,
        })
      : Promise.resolve([]),
    searchReceipts
      ? prisma.receipt.findMany({
          where: {
            userId,
            ...activeRecord,
            ...(text ? { merchant: contains(text) } : {}),
            ...(receiptDateFilter(query.from, query.to) ?? {}),
            ...(receiptAmount ? { total: receiptAmount } : {}),
          },
          orderBy: { createdAt: 'desc' },
          take,
        })
      : Promise.resolve([]),
    searchClients
      ? prisma.client.findMany({
          where: {
            userId,
            ...activeRecord,
            OR: [{ name: contains(text!) }, { email: contains(text!) }, { notes: contains(text!) }],
          },
          orderBy: { name: 'asc' },
          take,
        })
      : Promise.resolve([]),
    searchBusinesses
      ? prisma.business.findMany({
          where: {
            userId,
            ...activeRecord,
            name: contains(text!),
          },
          orderBy: { name: 'asc' },
          take,
        })
      : Promise.resolve([]),
    searchVehicles
      ? prisma.vehicle.findMany({
          where: {
            userId,
            ...activeRecord,
            OR: [
              { nickname: contains(text!) },
              { make: contains(text!) },
              { model: contains(text!) },
              { licensePlate: contains(text!) },
            ],
          },
          orderBy: { nickname: 'asc' },
          take,
        })
      : Promise.resolve([]),
  ]);

  const tripItems: SearchResultItem[] = trips.map((trip) => ({
    id: trip.id,
    kind: 'trip',
    title: trip.purpose,
    subtitle: tripSubtitle(trip),
    href: `/trips/${trip.id}`,
  }));

  const expenseItems: SearchResultItem[] = expenses.map((expense) => ({
    id: expense.id,
    kind: 'expense',
    title: expense.merchant ?? formatCategoryLabel(expense.categorySlug),
    subtitle: `${expense.business.name} · ${expense.currency} ${Number(expense.amount).toFixed(2)} · ${expense.expenseDate.toISOString().slice(0, 10)}`,
    href: `/expenses/${expense.id}`,
  }));

  const receiptItems: SearchResultItem[] = receipts.map((receipt) => ({
    id: receipt.id,
    kind: 'receipt',
    title: receipt.merchant ?? 'Receipt',
    subtitle:
      receipt.total !== null
        ? `${receipt.currency} ${Number(receipt.total).toFixed(2)} · ${(receipt.receiptDate ?? receipt.createdAt).toLocaleDateString()}`
        : receipt.createdAt.toLocaleDateString(),
    href: `/receipts/${receipt.id}`,
  }));

  const clientItems: SearchResultItem[] = clients.map((client) => ({
    id: client.id,
    kind: 'client',
    title: client.name,
    subtitle: client.email ?? client.phone,
    href: `/clients/${client.id}`,
  }));

  const businessItems: SearchResultItem[] = businesses.map((business) => ({
    id: business.id,
    kind: 'business',
    title: business.name,
    subtitle: business.isDefault ? 'Default business' : null,
    href: `/businesses/${business.id}`,
  }));

  const vehicleItems: SearchResultItem[] = vehicles.map((vehicle) => ({
    id: vehicle.id,
    kind: 'vehicle',
    title: vehicle.nickname,
    subtitle: [vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(' ') || null,
    href: `/vehicles/${vehicle.id}`,
  }));

  const groups = {
    trips: tripItems,
    expenses: expenseItems,
    receipts: receiptItems,
    clients: clientItems,
    businesses: businessItems,
    vehicles: vehicleItems,
  };

  return {
    query: query.q ?? '',
    filters,
    ...groups,
    totalCount: Object.values(groups).reduce((sum, items) => sum + items.length, 0),
  };
}
