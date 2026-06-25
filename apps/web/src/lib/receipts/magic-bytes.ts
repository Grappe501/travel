function hasFtypBrand(buffer: Buffer, brands: string[]): boolean {
  if (buffer.length < 12) return false;
  if (buffer.subarray(4, 8).toString('ascii') !== 'ftyp') return false;
  const brand = buffer.subarray(8, 12).toString('ascii');
  return brands.includes(brand);
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function bufferMatchesReceiptMimeType(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length === 0) return false;

  switch (mimeType) {
    case 'image/jpeg':
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return buffer.length >= PNG_SIGNATURE.length && buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
    case 'image/webp':
      return (
        buffer.length >= 12 &&
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    case 'application/pdf':
      return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
    case 'image/heic':
      return hasFtypBrand(buffer, ['heic', 'heix', 'hevc', 'hevx', 'mif1']);
    case 'image/heif':
      return hasFtypBrand(buffer, ['heif', 'mif1']);
    default:
      return false;
  }
}
