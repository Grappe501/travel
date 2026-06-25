/**
 * Supabase Storage configuration — private receipt bucket (DEC-001).
 */
export function getStorageConfig() {
  const bucket = process.env.STORAGE_BUCKET ?? 'receipts';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    bucket,
    url,
    serviceRoleKey,
    isConfigured: Boolean(url && serviceRoleKey),
  };
}

export function buildReceiptStoragePath(userId: string, receiptId: string, ext: string) {
  return `${userId}/${receiptId}/original.${ext}`;
}
