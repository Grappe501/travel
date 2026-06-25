import fs from 'node:fs';
import path from 'node:path';

const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

export function receiptFixturePath(): string {
  const fixturePath = path.join(__dirname, '../fixtures/sample-receipt.png');
  if (!fs.existsSync(fixturePath)) {
    fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
    fs.writeFileSync(fixturePath, Buffer.from(PNG_BASE64, 'base64'));
  }
  return fixturePath;
}
