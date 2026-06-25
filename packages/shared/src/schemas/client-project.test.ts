import { describe, expect, it } from 'vitest';
import { clientCreateSchema, projectCreateSchema } from './client-project';

describe('clientCreateSchema', () => {
  it('accepts minimal client', () => {
    const parsed = clientCreateSchema.parse({ name: 'Acme Corp' });
    expect(parsed.name).toBe('Acme Corp');
  });

  it('rejects empty name', () => {
    expect(() => clientCreateSchema.parse({ name: '' })).toThrow();
  });
});

describe('projectCreateSchema', () => {
  it('requires businessId', () => {
    expect(() =>
      projectCreateSchema.parse({ name: 'Phase 1', businessId: 'not-a-uuid' })
    ).toThrow();
  });
});
