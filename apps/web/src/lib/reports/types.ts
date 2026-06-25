export type ReportTripRow = {
  id: string;
  date: string;
  purpose: string;
  destination: string | null;
  businessName: string;
  vehicleNickname: string;
  miles: number | null;
  mileageRate: number | null;
  reimbursementAmount: number | null;
};

export type ReportExpenseRow = {
  id: string;
  date: string;
  merchant: string | null;
  categorySlug: string;
  businessName: string;
  amount: number;
  taxAmount: number | null;
  currency: string;
};

export type ReportData = {
  reportType: 'mileage' | 'expense' | 'combined';
  dateRangeStart: string;
  dateRangeEnd: string;
  businessName: string | null;
  vehicleNickname: string | null;
  generatedAt: string;
  trips: ReportTripRow[];
  expenses: ReportExpenseRow[];
  summary: {
    totalMiles: number;
    totalReimbursement: number;
    totalExpenses: number;
    grandTotal: number;
    tripCount: number;
    expenseCount: number;
  };
};

export function buildReportSummary(trips: ReportTripRow[], expenses: ReportExpenseRow[]) {
  const totalMiles = trips.reduce((sum, t) => sum + (t.miles ?? 0), 0);
  const totalReimbursement = trips.reduce((sum, t) => sum + (t.reimbursementAmount ?? 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return {
    totalMiles,
    totalReimbursement,
    totalExpenses,
    grandTotal: totalReimbursement + totalExpenses,
    tripCount: trips.length,
    expenseCount: expenses.length,
  };
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatReportDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00.000Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
