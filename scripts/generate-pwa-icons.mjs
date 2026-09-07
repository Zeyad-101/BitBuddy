/**
 * Generate placeholder PWA icons (192x192 and 512x512) using only Node built-ins.
 * Solid deep-purple background with a single cream pixel-block "BB" silhouette
 * to keep the BitBuddy brand visible.
 *
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { Buffer } from 'node:buffer';

const OUT_DIR = 'public';

function crc32(buf) {
  let c;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function makePng(size, drawPixel) {
  const w = size;
  const h = size;
  // RGBA pixel rows, prefixed with a filter byte (0 = none)
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = drawPixel(x, y, w, h);
      const off = y * (stride + 1) + 1 + x * 4;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
      raw[off + 3] = a;
    }
  }
  const idat = deflateSync(raw);

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const BG = [13, 10, 38, 255]; // deep navy
const CREAM = [244, 232, 193, 255]; // pixel cream
const PINK = [255, 126, 182, 255]; // pixel pink
const YELLOW = [255, 216, 107, 255]; // pixel yellow

function pixel(x, y, w, h) {
  // Solid background
  let c = BG;

  // Centered cream block — the "pet" placeholder
  const cx = w / 2;
  const cy = h / 2;
  const halfW = w * 0.32;
  const halfH = h * 0.32;

  if (x >= cx - halfW && x < cx + halfW && y >= cy - halfH && y < cy + halfH) {
    c = CREAM;
  }

  // Two pixel "ears"
  const earW = w * 0.08;
  const earH = h * 0.12;
  if (
    (x >= cx - halfW - earW && x < cx - halfW && y >= cy - halfH && y < cy - halfH + earH) ||
    (x >= cx + halfW && x < cx + halfW + earW && y >= cy - halfH && y < cy - halfH + earH)
  ) {
    c = PINK;
  }

  // Heart in the middle (simple cross)
  const heartSize = Math.max(4, Math.floor(w * 0.04));
  const heartX = Math.floor(cx - heartSize / 2);
  const heartY = Math.floor(cy - heartSize / 2);
  if (x >= heartX && x < heartX + heartSize && y >= heartY && y < heartY + heartSize) {
    // Hollow square outline
    const onEdge =
      x === heartX ||
      x === heartX + heartSize - 1 ||
      y === heartY ||
      y === heartY + heartSize - 1;
    if (onEdge) c = YELLOW;
  }

  return c;
}

writeFileSync(`${OUT_DIR}/pwa-192.png`, makePng(192, pixel));
writeFileSync(`${OUT_DIR}/pwa-512.png`, makePng(512, pixel));
console.log('Wrote public/pwa-192.png and public/pwa-512.png');
