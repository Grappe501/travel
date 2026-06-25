export type OnboardingStep = 'business' | 'vehicle' | 'rate' | 'complete';

export type OnboardingStatus = {
  onboardingCompleted: boolean;
  hasBusiness: boolean;
  hasVehicle: boolean;
  needsOnboarding: boolean;
  currentStep: OnboardingStep;
};

export type SerializedBusiness = {
  id: string;
  name: string;
  currency: string;
  defaultMileageRate: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SerializedVehicle = {
  id: string;
  businessId: string | null;
  nickname: string;
  make: string | null;
  model: string | null;
  year: number | null;
  currentOdometer: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MileageSettings = {
  mileageRateType: 'irs' | 'company' | 'custom';
  customMileageRate: number | null;
  irsStandardRate: number;
  effectiveRate: number;
  rates: Array<{
    id: string;
    name: string;
    rate: number;
    source: string;
    effectiveFrom: string;
    effectiveTo: string | null;
    businessId: string | null;
  }>;
};

export type SerializedTrip = {
  id: string;
  businessId: string;
  businessName: string;
  vehicleId: string;
  vehicleNickname: string;
  status: string;
  purpose: string;
  destination: string | null;
  startLocation: string | null;
  endLocation: string | null;
  startOdometer: number | null;
  endOdometer: number | null;
  miles: number | null;
  mileageRate: number | null;
  mileageRateSource: string | null;
  reimbursementAmount: number | null;
  expenseTotal: number | null;
  grandTotal: number | null;
  notes: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SerializedReceipt = {
  id: string;
  businessId: string | null;
  tripId: string | null;
  storagePath: string;
  fileSizeBytes: number | null;
  mimeType: string | null;
  merchant: string | null;
  receiptDate: string | null;
  total: number | null;
  currency: string;
  uploadStatus: string;
  reviewStatus: string;
  displayStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type SerializedOcrResult = {
  id: string;
  merchant: string | null;
  receiptDate: string | null;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  suggestedCategorySlug: string | null;
  confidenceScores: Record<string, number> | null;
  processingEngine: string | null;
  modelVersion: string | null;
  processedAt: string | null;
};

export type SerializedReceiptWithOcr = SerializedReceipt & {
  subtotal: number | null;
  tax: number | null;
  ocrConfidence: number | null;
  ocrResult: SerializedOcrResult | null;
  expenseId: string | null;
};

export type SerializedReport = {
  id: string;
  businessId: string | null;
  reportType: string;
  format: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  filters: unknown;
  status: string;
  fileSizeBytes: number | null;
  errorMessage: string | null;
  generatedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export type SerializedExpense = {
  id: string;
  businessId: string;
  businessName: string;
  tripId: string | null;
  tripPurpose: string | null;
  receiptId: string | null;
  receiptMerchant: string | null;
  categorySlug: string;
  merchant: string | null;
  amount: number;
  taxAmount: number | null;
  currency: string;
  expenseDate: string;
  paymentMethod: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SerializedBillingSummary = {
  subscription: {
    plan: string;
    status: string;
    billingCycle: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    canceledAt: string | null;
    trialEndsAt: string | null;
    hasStripeCustomer: boolean;
    hasStripeSubscription: boolean;
  };
  usage: {
    periodMonth: string;
    resetsAt: string;
    tripsCount: number;
    tripsLimit: number | null;
    receiptsCount: number;
    receiptsLimit: number | null;
    unlimited: boolean;
  };
  stripeConfigured: boolean;
};
