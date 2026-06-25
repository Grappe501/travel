import { prisma } from '@/lib/db/prisma';
import { ensureSubscription, serializeSubscription } from '@/server/services/subscription.service';
import { getUsageSummary } from '@/server/services/usage.service';
import { getNotificationPreferences } from '@/server/services/notification.service';

const activeRecord = { recordStatus: 'active' as const };

function jsonValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber();
  }
  if (Array.isArray(value)) return value.map(jsonValue);
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, jsonValue(v)])
    );
  }
  return value;
}

export type AccountExportBundle = {
  exportedAt: string;
  version: string;
  profile: unknown;
  subscription: unknown;
  usage: unknown;
  notificationPreferences: unknown;
  businesses: unknown[];
  vehicles: unknown[];
  clients: unknown[];
  projects: unknown[];
  trips: unknown[];
  expenses: unknown[];
  receipts: unknown[];
  reports: unknown[];
  mileageRates: unknown[];
  note: string;
};

export async function buildAccountExport(userId: string): Promise<AccountExportBundle> {
  const [
    profile,
    subscription,
    usage,
    notificationPreferences,
    businesses,
    vehicles,
    clients,
    projects,
    trips,
    expenses,
    receipts,
    reports,
    mileageRates,
  ] = await Promise.all([
    prisma.userProfile.findUnique({ where: { id: userId } }),
    ensureSubscription(userId).then(serializeSubscription),
    getUsageSummary(userId),
    getNotificationPreferences(userId),
    prisma.business.findMany({ where: { userId, ...activeRecord } }),
    prisma.vehicle.findMany({ where: { userId, ...activeRecord } }),
    prisma.client.findMany({ where: { userId, ...activeRecord } }),
    prisma.project.findMany({ where: { userId, ...activeRecord } }),
    prisma.trip.findMany({ where: { userId, ...activeRecord }, orderBy: { createdAt: 'desc' } }),
    prisma.expense.findMany({ where: { userId, ...activeRecord }, orderBy: { expenseDate: 'desc' } }),
    prisma.receipt.findMany({
      where: { userId, ...activeRecord },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        businessId: true,
        tripId: true,
        merchant: true,
        receiptDate: true,
        subtotal: true,
        tax: true,
        total: true,
        currency: true,
        uploadStatus: true,
        reviewStatus: true,
        mimeType: true,
        fileSizeBytes: true,
        storagePath: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.report.findMany({ where: { userId, ...activeRecord }, orderBy: { createdAt: 'desc' } }),
    prisma.mileageRate.findMany({ where: { userId, ...activeRecord } }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    profile: jsonValue(profile),
    subscription: jsonValue(subscription),
    usage: jsonValue(usage),
    notificationPreferences: jsonValue(notificationPreferences),
    businesses: businesses.map(jsonValue) as unknown[],
    vehicles: vehicles.map(jsonValue) as unknown[],
    clients: clients.map(jsonValue) as unknown[],
    projects: projects.map(jsonValue) as unknown[],
    trips: trips.map(jsonValue) as unknown[],
    expenses: expenses.map(jsonValue) as unknown[],
    receipts: receipts.map(jsonValue) as unknown[],
    reports: reports.map(jsonValue) as unknown[],
    mileageRates: mileageRates.map(jsonValue) as unknown[],
    note:
      'Receipt image files are not included in this JSON export. Download individual receipts from the app or contact support for a full data request.',
  };
}
