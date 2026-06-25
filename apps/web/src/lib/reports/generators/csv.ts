import type { ReportData } from '@/lib/reports/types';
import { formatCurrency, formatReportDate } from '@/lib/reports/types';

function escapeCsv(value: string | number | null | undefined) {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function row(cells: Array<string | number | null | undefined>) {
  return cells.map(escapeCsv).join(',');
}

export function generateReportCsv(data: ReportData): Buffer {
  const lines: string[] = [];

  lines.push(row(['Mileage & Expense Copilot Report']));
  lines.push(row(['Type', data.reportType]));
  lines.push(row(['Period', `${data.dateRangeStart} to ${data.dateRangeEnd}`]));
  if (data.businessName) lines.push(row(['Business', data.businessName]));
  if (data.vehicleNickname) lines.push(row(['Vehicle', data.vehicleNickname]));
  lines.push(row(['Generated', data.generatedAt]));
  lines.push('');

  lines.push(row(['Summary']));
  lines.push(row(['Total miles', data.summary.totalMiles.toFixed(1)]));
  lines.push(row(['Mileage reimbursement', data.summary.totalReimbursement.toFixed(2)]));
  lines.push(row(['Total expenses', data.summary.totalExpenses.toFixed(2)]));
  lines.push(row(['Grand total', data.summary.grandTotal.toFixed(2)]));
  lines.push('');

  if (data.reportType === 'mileage' || data.reportType === 'combined') {
    lines.push(row(['Mileage detail']));
    lines.push(row(['Date', 'Purpose', 'Destination', 'Business', 'Vehicle', 'Miles', 'Rate', 'Reimbursement']));
    for (const trip of data.trips) {
      lines.push(
        row([
          trip.date,
          trip.purpose,
          trip.destination,
          trip.businessName,
          trip.vehicleNickname,
          trip.miles?.toFixed(1) ?? '',
          trip.mileageRate?.toFixed(4) ?? '',
          trip.reimbursementAmount?.toFixed(2) ?? '',
        ])
      );
    }
    lines.push('');
  }

  if (data.reportType === 'expense' || data.reportType === 'combined') {
    lines.push(row(['Expense detail']));
    lines.push(row(['Date', 'Merchant', 'Category', 'Business', 'Amount', 'Tax', 'Currency']));
    for (const expense of data.expenses) {
      lines.push(
        row([
          expense.date,
          expense.merchant,
          expense.categorySlug,
          expense.businessName,
          expense.amount.toFixed(2),
          expense.taxAmount?.toFixed(2) ?? '',
          expense.currency,
        ])
      );
    }
  }

  return Buffer.from(lines.join('\n'), 'utf-8');
}

export { formatCurrency, formatReportDate };
