#!/usr/bin/env node
/**
 * Regenerate PWA icons at manifest-declared dimensions (STEP-069 fix).
 */
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/icons');
const src = path.join(dir, 'icon-source.png');

if (!existsSync(src)) {
  copyFileSync(path.join(dir, 'icon-512.png'), src);
}

const meta = await sharp(src).metadata();
const side = Math.min(meta.width, meta.height);
const left = Math.floor((meta.width - side) / 2);
const top = Math.floor((meta.height - side) / 2);

async function writeSquare(name, size, padding = 0) {
  let img = sharp(src).extract({ left, top, width: side, height: side });
  if (padding > 0) {
    const inner = Math.round(size * (1 - padding * 2));
    img = img.resize(inner, inner).extend({
      top: Math.round(size * padding),
      bottom: Math.round(size * padding),
      left: Math.round(size * padding),
      right: Math.round(size * padding),
      background: { r: 45, g: 143, b: 127, alpha: 1 },
    });
  } else {
    img = img.resize(size, size);
  }
  const outPath = path.join(dir, name);
  await img.png({ compressionLevel: 9 }).toFile(outPath);
  const out = readFileSync(outPath);
  console.log(`${name}: ${out.readUInt32BE(16)}x${out.readUInt32BE(20)} (${out.length} bytes)`);
}

await writeSquare('icon-192.png', 192);
await writeSquare('icon-512.png', 512);
await writeSquare('apple-touch-icon.png', 180);
await writeSquare('icon-maskable-512.png', 512, 0.1);
