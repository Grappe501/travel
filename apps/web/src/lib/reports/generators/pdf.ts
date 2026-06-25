import PDFDocument from 'pdfkit';
import type { ReportData } from '@/lib/reports/types';
import { formatCurrency, formatReportDate } from '@/lib/reports/types';

const MARGIN = 50;
const PAGE_WIDTH = 612;

function drawTableHeader(
  doc: InstanceType<typeof PDFDocument>,
  y: number,
  columns: Array<{ label: string; width: number }>
) {
  let x = MARGIN;
  doc.fontSize(9).fillColor('#444444').font('Helvetica-Bold');
  for (const col of columns) {
    doc.text(col.label, x, y, { width: col.width, lineBreak: false });
    x += col.width;
  }
  doc.moveTo(MARGIN, y + 14).lineTo(PAGE_WIDTH - MARGIN, y + 14).strokeColor('#cccccc').stroke();
}

export function generateReportPdf(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: MARGIN, size: 'LETTER' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).fillColor('#111111').font('Helvetica-Bold').text('Mileage & Expense Copilot');
    doc.fontSize(11).fillColor('#666666').font('Helvetica').text('Business travel report', { lineGap: 4 });
    doc.moveDown(0.5);

    const typeLabel =
      data.reportType === 'combined'
        ? 'Combined mileage & expense'
        : data.reportType === 'mileage'
          ? 'Mileage report'
          : 'Expense report';

    doc.fontSize(14).fillColor('#111111').font('Helvetica-Bold').text(typeLabel);
    doc.fontSize(10).fillColor('#333333').font('Helvetica');
    doc.text(
      `Period: ${formatReportDate(data.dateRangeStart)} – ${formatReportDate(data.dateRangeEnd)}`
    );
    if (data.businessName) doc.text(`Business: ${data.businessName}`);
    if (data.vehicleNickname) doc.text(`Vehicle: ${data.vehicleNickname}`);
    doc.text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`);
    doc.moveDown(1);

    doc.fontSize(12).fillColor('#111111').font('Helvetica-Bold').text('Summary');
    doc.fontSize(10).font('Helvetica');
    const summaryLines = [
      `Trips: ${data.summary.tripCount}`,
      `Expenses: ${data.summary.expenseCount}`,
      `Total miles: ${data.summary.totalMiles.toFixed(1)}`,
      `Mileage reimbursement: ${formatCurrency(data.summary.totalReimbursement)}`,
      `Total expenses: ${formatCurrency(data.summary.totalExpenses)}`,
      `Grand total: ${formatCurrency(data.summary.grandTotal)}`,
    ];
    for (const line of summaryLines) {
      doc.text(line);
    }
    doc.moveDown(1);

    if (data.reportType === 'mileage' || data.reportType === 'combined') {
      doc.fontSize(12).font('Helvetica-Bold').text('Mileage detail');
      doc.moveDown(0.3);

      const tripCols = [
        { label: 'Date', width: 70 },
        { label: 'Purpose', width: 120 },
        { label: 'Miles', width: 45 },
        { label: 'Reimb.', width: 65 },
        { label: 'Vehicle', width: 80 },
      ];
      let y = doc.y;
      drawTableHeader(doc, y, tripCols);
      y += 20;
      doc.font('Helvetica').fontSize(9).fillColor('#222222');

      for (const trip of data.trips) {
        if (y > 700) {
          doc.addPage();
          y = MARGIN;
          drawTableHeader(doc, y, tripCols);
          y += 20;
        }
        let x = MARGIN;
        const cells = [
          formatReportDate(trip.date),
          trip.purpose.slice(0, 40),
          trip.miles?.toFixed(1) ?? '—',
          trip.reimbursementAmount != null ? formatCurrency(trip.reimbursementAmount) : '—',
          trip.vehicleNickname,
        ];
        for (let i = 0; i < tripCols.length; i++) {
          doc.text(cells[i] ?? '', x, y, { width: tripCols[i].width, lineBreak: false });
          x += tripCols[i].width;
        }
        y += 16;
        doc.y = y;
      }
      doc.moveDown(1);
    }

    if (data.reportType === 'expense' || data.reportType === 'combined') {
      if (doc.y > 650) doc.addPage();

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#111111').text('Expense detail');
      doc.moveDown(0.3);

      const expCols = [
        { label: 'Date', width: 70 },
        { label: 'Merchant', width: 120 },
        { label: 'Category', width: 70 },
        { label: 'Amount', width: 65 },
      ];
      let y = doc.y;
      drawTableHeader(doc, y, expCols);
      y += 20;
      doc.font('Helvetica').fontSize(9).fillColor('#222222');

      for (const expense of data.expenses) {
        if (y > 700) {
          doc.addPage();
          y = MARGIN;
          drawTableHeader(doc, y, expCols);
          y += 20;
        }
        let x = MARGIN;
        const cells = [
          formatReportDate(expense.date),
          (expense.merchant ?? '—').slice(0, 40),
          expense.categorySlug,
          formatCurrency(expense.amount, expense.currency),
        ];
        for (let i = 0; i < expCols.length; i++) {
          doc.text(cells[i] ?? '', x, y, { width: expCols[i].width, lineBreak: false });
          x += expCols[i].width;
        }
        y += 16;
        doc.y = y;
      }
    }

    doc.end();
  });
}
