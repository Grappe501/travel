import { describe, expect, it } from 'vitest';
import { aiFeedbackSchema } from './ai';

describe('aiFeedbackSchema', () => {
  it('accepts suggestionId feedback', () => {
    const parsed = aiFeedbackSchema.parse({
      suggestionId: '550e8400-e29b-41d4-a716-446655440000',
      accepted: true,
    });
    expect(parsed.accepted).toBe(true);
  });

  it('accepts entity-scoped feedback', () => {
    const parsed = aiFeedbackSchema.parse({
      interactionType: 'category',
      entityType: 'receipt',
      entityId: '550e8400-e29b-41d4-a716-446655440001',
      accepted: false,
      correction: { categorySlug: 'fuel' },
    });
    expect(parsed.interactionType).toBe('category');
  });

  it('rejects missing target', () => {
    expect(() => aiFeedbackSchema.parse({ accepted: true })).toThrow();
  });
});
