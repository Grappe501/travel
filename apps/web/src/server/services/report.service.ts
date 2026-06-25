import { createHash, randomUUID } from 'crypto';
import type { Prisma, Report } from '@prisma/client';
import { reportGenerateSchema, type ReportGenerateInput } from '@mileage-copilot/shared';
import { NotFoundError, ValidationError } from '@/lib/api/response';
import { generateReportCsv } from '@/lib/reports/generators/csv';
import { generateReportPdf } from '@/lib/reports/generators/pdf';
import { generateReportXlsx } from '@/lib/reports/generators/xlsx';
import {
  buildReportSummary,
  type ReportData,
  type ReportExpenseRow,
  type ReportTripRow,
} from '@/lib/reports/types';
import { buildReportStoragePath, getStorageConfig } from '@/lib/storage/config';
import { getSupabaseAdmin } from '@/lib/storage/server';
import { prisma } from '@/lib/db/prisma';
import { getOwnedBusiness } from '@/server/services/business.service';
import { getOwnedVehicle } from '@/server/services/vehicle.service';

function hashBuffer(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function endOfDayUtc(value: string): Date {
  return new Date(`${value}T23:59:59.999Z`);
}

function tripActivityDate(trip: {
  endedAt: Date | null;
  startedAt: Date | null;
  createdAt: Date;
}): Date {
  return trip.endedAt ?? trip.startedAt ?? trip.createdAt;
}

export function serializeReport(report: Report) {
  return {
    id: report.id,
    businessId: report.businessId,
    reportType: report.reportType,
    format: report.format,
    dateRangeStart: report.dateRangeStart.toISOString().slice(0, 10),
    dateRangeEnd: report.dateRangeEnd.toISOString().slice(0, 10),
    filters: report.filters,
    status: report.status,
    fileSizeBytes: report.fileSizeBytes,
    errorMessage: report.errorMessage,
    generatedAt: report.generatedAt?.toISOString() ?? null,
    expiresAt: report.expiresAt?.toISOString() ?? null,
    createdAt: report.createdAt.toISOString(),
  };
}

export type SerializedReport = ReturnType<typeof serializeReport>;

async function fetchReportData(
  userId: string,
  input: ReportGenerateInput
): Promise<ReportData> {
  const rangeStart = parseDateOnly(input.dateRangeStart);
  const rangeEnd = endOfDayUtc(input.dateRangeEnd);

  let businessName: string | null = null;
  if (input.businessId) {
    const business = await getOwnedBusiness(userId, input.businessId);
    businessName = business.name;
  }

  let vehicleNickname: string | null = null;
  if (input.vehicleId) {
    const vehicle = await getOwnedVehicle(userId, input.vehicleId);
    vehicleNickname = vehicle.nickname;
  }

  const includeTrips = input.reportType === 'mileage' || input.reportType === 'combined';
  const includeExpenses = input.reportType === 'expense' || input.reportType === 'combined';

  let trips: ReportTripRow[] = [];
  let expenses: ReportExpenseRow[] = [];

  if (includeTrips) {
    const tripRows = await prisma.trip.findMany({
      where: {
        userId,
        recordStatus: 'active',
        status: 'completed',
        ...(input.businessId ? { businessId: input.businessId } : {}),
        ...(input.vehicleId ? { vehicleId: input.vehicleId } : {}),
      },
      include: {
        business: { select: { name: true } },
        vehicle: { select: { nickname: true } },
      },
      orderBy: { endedAt: 'asc' },
    });

    trips = tripRows
      .filter((trip) => {
        const d = tripActivityDate(trip);
        return d >= rangeStart && d <= rangeEnd;
      })
      .map((trip) => ({
        id: trip.id,
        date: tripActivityDate(trip).toISOString().slice(0, 10),
        purpose: trip.purpose,
        destination: trip.destination,
        businessName: trip.business.name,
        vehicleNickname: trip.vehicle.nickname,
        miles: trip.miles ? Number(trip.miles) : null,
        mileageRate: trip.mileageRate ? Number(trip.mileageRate) : null,
        reimbursementAmount: trip.reimbursementAmount ? Number(trip.reimbursementAmount) : null,
      }));
  }

  if (includeExpenses) {
    const expenseRows = await prisma.expense.findMany({
      where: {
        userId,
        recordStatus: 'active',
        expenseDate: {
          gte: rangeStart,
          lte: rangeEnd,
        },
        ...(input.businessId ? { businessId: input.businessId } : {}),
      },
      include: {
        business: { select: { name: true } },
      },
      orderBy: { expenseDate: 'asc' },
    });

    expenses = expenseRows.map((expense) => ({
      id: expense.id,
      date: expense.expenseDate.toISOString().slice(0, 10),
      merchant: expense.merchant,
      categorySlug: expense.categorySlug,
      businessName: expense.business.name,
      amount: Number(expense.amount),
      taxAmount: expense.taxAmount ? Number(expense.taxAmount) : null,
      currency: expense.currency,
    }));
  }

  const generatedAt = new Date().toISOString();

  return {
    reportType: input.reportType,
    dateRangeStart: input.dateRangeStart,
    dateRangeEnd: input.dateRangeEnd,
    businessName,
    vehicleNickname,
    generatedAt,
    trips,
    expenses,
    summary: buildReportSummary(trips, expenses),
  };
}

async function buildReportFile(data: ReportData, format: ReportGenerateInput['format']) {
  switch (format) {
    case 'pdf':
      return {
        buffer: await generateReportPdf(data),
        mimeType: 'application/pdf',
        extension: 'pdf',
      };
    case 'csv':
      return {
        buffer: generateReportCsv(data),
        mimeType: 'text/csv',
        extension: 'csv',
      };
    case 'xlsx':
      return {
        buffer: await generateReportXlsx(data),
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx',
      };
    default:
      throw new ValidationError('Unsupported report format');
  }
}

export async function listReports(userId: string) {
  const reports = await prisma.report.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return reports.map(serializeReport);
}

export async function getOwnedReport(userId: string, reportId: string) {
  const report = await prisma.report.findFirst({
    where: { id: reportId, userId },
  });
  if (!report) {
    throw new NotFoundError('Report not found');
  }
  return report;
}

export async function generateReport(userId: string, input: ReportGenerateInput) {
  const data = reportGenerateSchema.parse(input);

  if (data.businessId) {
    await getOwnedBusiness(userId, data.businessId);
  }
  if (data.vehicleId) {
    await getOwnedVehicle(userId, data.vehicleId);
  }

  const reportId = randomUUID();
  const reportData = await fetchReportData(userId, data);

  const pending = await prisma.report.create({
    data: {
      id: reportId,
      userId,
      businessId: data.businessId,
      reportType: data.reportType,
      dateRangeStart: parseDateOnly(data.dateRangeStart),
      dateRangeEnd: parseDateOnly(data.dateRangeEnd),
      format: data.format,
      filters: {
        vehicleId: data.vehicleId ?? null,
      } as Prisma.InputJsonValue,
      status: 'pending',
    },
  });

  try {
    const { buffer, mimeType, extension } = await buildReportFile(reportData, data.format);
    const fileHash = hashBuffer(buffer);
    const fileSizeBytes = buffer.length;
    const storagePath = buildReportStoragePath(userId, reportId, extension);

    const { bucket, isConfigured } = getStorageConfig();
    if (isConfigured) {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: true,
      });
      if (error) {
        throw new ValidationError(`Report storage upload failed: ${error.message}`);
      }
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const ready = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.report.update({
        where: { id: pending.id },
        data: {
          status: 'ready',
          storagePath: isConfigured ? storagePath : null,
          fileHash,
          fileSizeBytes,
          generatedAt: new Date(),
          expiresAt,
        },
      });

      if (isConfigured) {
        await tx.fileAsset.create({
          data: {
            userId,
            kind: 'export',
            storagePath,
            mimeType,
            fileSizeBytes,
            fileHash,
            entityType: 'report',
            entityId: reportId,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId,
          entityType: 'report',
          entityId: reportId,
          action: 'create',
          newValues: {
            reportType: data.reportType,
            format: data.format,
            dateRangeStart: data.dateRangeStart,
            dateRangeEnd: data.dateRangeEnd,
            tripCount: reportData.summary.tripCount,
            expenseCount: reportData.summary.expenseCount,
          },
          source: 'web',
        },
      });

      await tx.businessEvent.create({
        data: {
          userId,
          businessId: data.businessId,
          eventType: 'report.generated',
          entityType: 'report',
          entityId: reportId,
          payload: {
            format: data.format,
            reportType: data.reportType,
          },
          occurredAt: new Date(),
        },
      });

      return updated;
    });

    return serializeReport(ready);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Report generation failed';
    await prisma.report.update({
      where: { id: pending.id },
      data: { status: 'failed', errorMessage: message },
    });
    throw error;
  }
}

export async function getReportDownload(
  userId: string,
  reportId: string
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  const report = await getOwnedReport(userId, reportId);

  if (report.status !== 'ready') {
    throw new ValidationError(
      report.status === 'failed'
        ? (report.errorMessage ?? 'Report generation failed')
        : 'Report is not ready for download'
    );
  }

  const ext = report.format === 'pdf' ? 'pdf' : report.format === 'csv' ? 'csv' : 'xlsx';
  const mimeType =
    report.format === 'pdf'
      ? 'application/pdf'
      : report.format === 'csv'
        ? 'text/csv'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const filename = `report-${report.reportType}-${report.dateRangeStart.toISOString().slice(0, 10)}.${ext}`;

  const { bucket, isConfigured } = getStorageConfig();
  if (isConfigured && report.storagePath) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(bucket).download(report.storagePath);
    if (error || !data) {
      throw new ValidationError(error?.message ?? 'Could not download report file');
    }
    const buffer = Buffer.from(await data.arrayBuffer());
    return { buffer, mimeType, filename };
  }

  const filters = (report.filters ?? {}) as { vehicleId?: string | null };
  if (!['mileage', 'expense', 'combined'].includes(report.reportType)) {
    throw new ValidationError('Unsupported report type');
  }
  const reportData = await fetchReportData(userId, {
    reportType: report.reportType as 'mileage' | 'expense' | 'combined',
    format: report.format,
    dateRangeStart: report.dateRangeStart.toISOString().slice(0, 10),
    dateRangeEnd: report.dateRangeEnd.toISOString().slice(0, 10),
    businessId: report.businessId ?? undefined,
    vehicleId: filters.vehicleId ?? undefined,
  });

  const { buffer } = await buildReportFile(reportData, report.format);
  return { buffer, mimeType, filename };
}
