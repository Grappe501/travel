import { describe, expect, it } from 'vitest';
import {
  DUPLICATE_SCORE_THRESHOLD,
  pickDuplicateMatches,
  scoreDuplicateReceipt,
} from '@/lib/ai/duplicate-detection';

describe('scoreDuplicateReceipt', () => {
  it('returns exact hash match with score 1', () => {
    const match = scoreDuplicateReceipt(
      { fileHash: 'abc123' },
      {
        id: 'other',
        fileHash: 'abc123',
        createdAt: new Date(),
      }
    );

    expect(match?.score).toBe(1);
    expect(match?.reason).toBe('exact_hash');
  });

  it('matches merchant, total, and date within one day', () => {
    const match = scoreDuplicateReceipt(
      {
        merchant: 'Shell',
        total: 42.18,
        receiptDate: '2026-03-12',
      },
      {
        id: 'other',
        merchant: 'shell',
        total: 42.18,
        receiptDate: '2026-03-13',
        createdAt: new Date(),
      }
    );

    expect(match?.score).toBe(0.9);
    expect(match?.reason).toBe('merchant_total_date');
  });

  it('returns null below threshold for amount-only same-day match', () => {
    const match = scoreDuplicateReceipt(
      {
        merchant: 'Different',
        total: 10,
        receiptDate: '2026-03-12',
      },
      {
        id: 'other',
        merchant: 'Other',
        total: 10,
        receiptDate: '2026-03-12',
        createdAt: new Date(),
      }
    );

    expect(match?.score).toBe(0.7);
    expect(match!.score).toBeLessThan(DUPLICATE_SCORE_THRESHOLD);
  });
});

describe('pickDuplicateMatches', () => {
  it('returns only matches at or above threshold sorted by score', () => {
    const matches = pickDuplicateMatches(
      {
        fileHash: 'hash-a',
        merchant: 'Shell',
        total: 20,
        receiptDate: '2026-03-12',
      },
      [
        {
          id: 'dup-hash',
          fileHash: 'hash-a',
          createdAt: '2026-03-01T00:00:00.000Z',
        },
        {
          id: 'dup-fuzzy',
          merchant: 'Shell',
          total: 20,
          receiptDate: '2026-03-12',
          createdAt: '2026-03-02T00:00:00.000Z',
        },
      ]
    );

    expect(matches.map((match) => match.receiptId)).toEqual(['dup-hash', 'dup-fuzzy']);
    expect(matches[0]?.score).toBe(1);
  });
});
