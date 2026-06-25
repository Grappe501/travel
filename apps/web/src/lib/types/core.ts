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
