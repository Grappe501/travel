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
