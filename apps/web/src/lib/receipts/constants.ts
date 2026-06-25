export type ReceiptDisplayStatus =
  | 'uploaded'
  | 'processing'
  | 'needs_review'
  | 'approved'
  | 'failed';

export function getReceiptDisplayStatus(
  uploadStatus: string,
  reviewStatus: string
): ReceiptDisplayStatus {
  if (uploadStatus === 'failed') return 'failed';
  if (uploadStatus === 'pending' || uploadStatus === 'processing') return 'processing';
  if (reviewStatus === 'confirmed') return 'approved';
  if (reviewStatus === 'rejected') return 'failed';
  if (uploadStatus === 'ready' && reviewStatus === 'pending') return 'uploaded';
  return 'needs_review';
}

export const ALLOWED_RECEIPT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
] as const;

export const MAX_RECEIPT_FILE_BYTES = 10 * 1024 * 1024;

export function isAllowedReceiptMimeType(mimeType: string): boolean {
  return (ALLOWED_RECEIPT_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function extensionForMimeType(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/heic':
      return 'heic';
    case 'image/heif':
      return 'heif';
    case 'application/pdf':
      return 'pdf';
    default:
      return 'bin';
  }
}
