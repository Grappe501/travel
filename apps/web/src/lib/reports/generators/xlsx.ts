import ExcelJS from 'exceljs';
import type { ReportData } from '@/lib/reports/types';

export async function generateReportXlsx(data: ReportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Mileage & Expense Copilot';
  workbook.created = new Date(data.generatedAt);

  const summary = workbook.addWorksheet('Summary');
  summary.columns = [
    { header: 'Field', key: 'field', width: 28 },
    { header: 'Value', key: 'value', width: 40 },
  ];
  summary.addRows([
    { field: 'Report type', value: data.reportType },
    { field: 'Period start', value: data.dateRangeStart },
    { field: 'Period end', value: data.dateRangeEnd },
    { field: 'Business', value: data.businessName ?? 'All' },
    { field: 'Vehicle', value: data.vehicleNickname ?? 'All' },
    { field: 'Total miles', value: data.summary.totalMiles },
    { field: 'Mileage reimbursement', value: data.summary.totalReimbursement },
    { field: 'Total expenses', value: data.summary.totalExpenses },
    { field: 'Grand total', value: data.summary.grandTotal },
    { field: 'Trip count', value: data.summary.tripCount },
    { field: 'Expense count', value: data.summary.expenseCount },
  ]);
  summary.getRow(1).font = { bold: true };

  if (data.reportType === 'mileage' || data.reportType === 'combined') {
    const trips = workbook.addWorksheet('Mileage');
    trips.columns = [
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Purpose', key: 'purpose', width: 30 },
      { header: 'Destination', key: 'destination', width: 24 },
      { header: 'Business', key: 'businessName', width: 20 },
      { header: 'Vehicle', key: 'vehicleNickname', width: 16 },
      { header: 'Miles', key: 'miles', width: 10 },
      { header: 'Rate', key: 'mileageRate', width: 10 },
      { header: 'Reimbursement', key: 'reimbursementAmount', width: 14 },
    ];
    trips.addRows(
      data.trips.map((t) => ({
        date: t.date,
        purpose: t.purpose,
        destination: t.destination ?? '',
        businessName: t.businessName,
        vehicleNickname: t.vehicleNickname,
        miles: t.miles,
        mileageRate: t.mileageRate,
        reimbursementAmount: t.reimbursementAmount,
      }))
    );
    trips.getRow(1).font = { bold: true };
  }

  if (data.reportType === 'expense' || data.reportType === 'combined') {
    const expenses = workbook.addWorksheet('Expenses');
    expenses.columns = [
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Merchant', key: 'merchant', width: 28 },
      { header: 'Category', key: 'categorySlug', width: 16 },
      { header: 'Business', key: 'businessName', width: 20 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Tax', key: 'taxAmount', width: 10 },
      { header: 'Currency', key: 'currency', width: 10 },
    ];
    expenses.addRows(
      data.expenses.map((e) => ({
        date: e.date,
        merchant: e.merchant ?? '',
        categorySlug: e.categorySlug,
        businessName: e.businessName,
        amount: e.amount,
        taxAmount: e.taxAmount,
        currency: e.currency,
      }))
    );
    expenses.getRow(1).font = { bold: true };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
