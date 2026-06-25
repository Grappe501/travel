import { describe, expect, it } from 'vitest';
import { DELETE_UNDO_SECONDS, restoreEntitySchema } from './restore';

describe('restoreEntitySchema', () => {
  it('accepts supported entity types', () => {
    const result = restoreEntitySchema.safeParse({
      entityType: 'expense',
      entityId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejects unknown entity types', () => {
    const result = restoreEntitySchema.safeParse({
      entityType: 'invoice',
      entityId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(false);
  });
});

describe('DELETE_UNDO_SECONDS', () => {
  it('is five seconds', () => {
    expect(DELETE_UNDO_SECONDS).toBe(5);
  });
});
