import type { APIRequestContext } from '@playwright/test';

type BusinessRef = { id: string; name: string };
type VehicleRef = { id: string; businessId: string; nickname: string };

async function readData<T>(response: Awaited<ReturnType<APIRequestContext['get']>>): Promise<T> {
  const body = await response.json();
  if (!response.ok()) {
    throw new Error(body.error ?? `Request failed (${response.status()})`);
  }
  return body.data as T;
}

export async function listBusinesses(request: APIRequestContext): Promise<BusinessRef[]> {
  const response = await request.get('/api/businesses');
  return readData<BusinessRef[]>(response);
}

export async function listVehicles(request: APIRequestContext): Promise<VehicleRef[]> {
  const response = await request.get('/api/vehicles');
  return readData<VehicleRef[]>(response);
}

export async function ensureBusinessAndVehicle(
  request: APIRequestContext,
  options?: { businessName?: string; vehicleNickname?: string }
): Promise<{ businessId: string; vehicleId: string }> {
  const businessName = options?.businessName ?? `E2E Business ${Date.now()}`;
  const vehicleNickname = options?.vehicleNickname ?? `E2E Vehicle ${Date.now()}`;

  let businesses = await listBusinesses(request);
  let business = businesses.find((item) => item.name === businessName);

  if (!business) {
    const response = await request.post('/api/businesses', {
      data: { name: businessName, currency: 'USD', isDefault: businesses.length === 0 },
    });
    business = await readData<BusinessRef>(response);
  }

  let vehicles = await listVehicles(request);
  let vehicle = vehicles.find((item) => item.nickname === vehicleNickname);

  if (!vehicle) {
    const response = await request.post('/api/vehicles', {
      data: { nickname: vehicleNickname, businessId: business.id, currentOdometer: 1000 },
    });
    vehicle = await readData<VehicleRef>(response);
  }

  return { businessId: business.id, vehicleId: vehicle.id };
}

export async function endActiveTrip(request: APIRequestContext) {
  const response = await request.get('/api/trips/active');
  const trip = await readData<{ id: string; startOdometer: number | null } | null>(response);
  if (!trip) return;

  const start = trip.startOdometer ?? 1000;
  await request.post(`/api/trips/${trip.id}/end`, {
    data: { endOdometer: start + 10 },
  });
}

export async function startAndEndTrip(
  request: APIRequestContext,
  input: { businessId: string; vehicleId: string; purpose?: string; odometer?: number }
) {
  const odometer = input.odometer ?? 1000 + Math.floor(Math.random() * 10_000);
  const startResponse = await request.post('/api/trips/start', {
    data: {
      businessId: input.businessId,
      vehicleId: input.vehicleId,
      purpose: input.purpose ?? 'E2E automated trip',
      startOdometer: odometer,
    },
  });
  const trip = await readData<{ id: string }>(startResponse);

  await request.post(`/api/trips/${trip.id}/end`, {
    data: { endOdometer: odometer + 12 },
  });

  return trip.id;
}

export async function readTripsUsageCount(page: import('@playwright/test').Page): Promise<number> {
  await page.goto('/billing');
  const usageCard = page.getByRole('heading', { name: 'Usage this month' }).locator('..');
  const tripsLine = usageCard.getByText(/^Trips:/);
  const text = (await tripsLine.textContent()) ?? '';
  const match = text.match(/(\d+)\s+of\s+(\d+)/);
  return match ? Number(match[1]) : 0;
}
