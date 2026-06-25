import { describe, expect, it } from 'vitest';
import { bufferMatchesReceiptMimeType } from '@/lib/receipts/magic-bytes';

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

describe('receipt magic-byte validation', () => {
  it('accepts PNG content with image/png', () => {
    expect(bufferMatchesReceiptMimeType(PNG, 'image/png')).toBe(true);
  });

  it('rejects PNG content declared as JPEG', () => {
    expect(bufferMatchesReceiptMimeType(PNG, 'image/jpeg')).toBe(false);
  });

  it('accepts PDF header for application/pdf', () => {
    expect(bufferMatchesReceiptMimeType(Buffer.from('%PDF-1.4'), 'application/pdf')).toBe(true);
  });
});
