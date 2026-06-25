import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';
import { createExpense, getOwnedExpense } from '@/server/services/expense.service';
import { getOwnedReceipt } from '@/server/services/receipt.service';
import { endTrip, getOwnedTrip, startTrip } from '@/server/services/trip.service';
import {
  createTestUserContext,
  deleteTestUser,
  integrationDbReady,
  type TestUserContext,
} from '@/test/integration/helpers';

describe.skipIf(!integrationDbReady())('cross-user IDOR boundaries', () => {
  let owner: TestUserContext;
  let other: TestUserContext;
  let ownerTripId: string;
  let ownerReceiptId: string;
  let ownerExpenseId: string;

  beforeAll(async () => {
    owner = await createTestUserContext();
    other = await createTestUserContext();

    const started = await startTrip(owner.userId, {
      businessId: owner.businessId,
      vehicleId: owner.vehicleId,
      purpose: 'Owner trip',
      startOdometer: 100,
    });
    const ended = await endTrip(owner.userId, { tripId: started.id, endOdometer: 120 });
    ownerTripId = ended.id;

    ownerReceiptId = randomUUID();
    await prisma.receipt.create({
      data: {
        id: ownerReceiptId,
        userId: owner.userId,
        businessId: owner.businessId,
        storagePath: `${owner.userId}/${ownerReceiptId}/original.jpg`,
        mimeType: 'image/jpeg',
        uploadStatus: 'ready',
        reviewStatus: 'pending',
      },
    });

    const expense = await createExpense(owner.userId, {
      businessId: owner.businessId,
      tripId: ownerTripId,
      categorySlug: 'fuel',
      merchant: 'Owner fuel stop',
      amount: 30,
      expenseDate: new Date().toISOString().slice(0, 10),
    });
    ownerExpenseId = expense.id;
  });

  afterAll(async () => {
    await deleteTestUser(owner.userId);
    await deleteTestUser(other.userId);
  });

  it('returns 404 when another user reads a trip', async () => {
    await expect(getOwnedTrip(other.userId, ownerTripId)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('returns 404 when another user reads a receipt', async () => {
    await expect(getOwnedReceipt(other.userId, ownerReceiptId)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it('returns 404 when another user reads an expense', async () => {
    await expect(getOwnedExpense(other.userId, ownerExpenseId)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});

describe('Stripe webhook signature enforcement', () => {
  it('rejects requests without stripe-signature', async () => {
    vi.resetModules();
    vi.doMock('@/lib/billing/config', () => ({
      getStripeConfig: () => ({ webhookSecret: 'whsec_test' }),
    }));

    const { POST } = await import('@/app/api/stripe/webhook/route');
    const response = await POST(
      new Request('http://localhost/api/stripe/webhook', {
        method: 'POST',
        body: '{}',
      })
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/stripe-signature/i);
  });

  it('rejects requests with an invalid signature', async () => {
    vi.resetModules();
    vi.doMock('@/lib/billing/config', () => ({
      getStripeConfig: () => ({ webhookSecret: 'whsec_test' }),
    }));
    vi.doMock('@/lib/billing/stripe', () => ({
      getStripeClient: () => ({
        webhooks: {
          constructEvent: () => {
            throw new Error('No signatures found matching the expected signature');
          },
        },
      }),
    }));

    const { POST } = await import('@/app/api/stripe/webhook/route');
    const response = await POST(
      new Request('http://localhost/api/stripe/webhook', {
        method: 'POST',
        headers: { 'stripe-signature': 'invalid' },
        body: '{}',
      })
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/signature/i);
  });
});
