import sharp from 'sharp';

const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64));

const COLUMNS = 150;

export interface PortraitMap {
  cols: number;
  rows: number;
  data: string;
}

export async function buildPortraitMap(source: Buffer): Promise<PortraitMap> {
  const meta = await sharp(source).metadata();
  const aspect = (meta.height ?? 1) / (meta.width ?? 1);
  const cols = COLUMNS;
  const rows = Math.max(1, Math.round(cols * aspect));

  const { data } = await sharp(source)
    .resize(cols, rows, { fit: 'fill', kernel: 'lanczos3' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const lumas: number[] = [];
  for (let k = 0; k < data.length; k += 4) {
    if (data[k + 3] >= 128) {
      lumas.push(0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2]);
    }
  }
  if (!lumas.length) return { cols, rows, data: '' };
  lumas.sort((a, b) => a - b);
  const lo = lumas[Math.floor(lumas.length * 0.02)];
  const hi = lumas[Math.floor(lumas.length * 0.98)];
  const span = Math.max(1, hi - lo);

  const bits = new Uint8Array(Math.ceil((cols * rows) / 8));
  for (let j = 0; j < rows; j++) {
    const fade = Math.pow(Math.min(1, Math.max(0, 1 - (j / rows - 0.62) / 0.3)), 1.6);
    for (let i = 0; i < cols; i++) {
      const k = (j * cols + i) * 4;
      if (data[k + 3] < 128) continue;
      const luma = 0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2];
      const norm = Math.min(1, Math.max(0, (luma - lo) / span));
      const light = 0.4 + 0.8 / (1 + Math.exp((i / cols - 0.47) * 7));
      const v = (Math.pow(norm, 1.9) * light * (0.05 + 0.95 * fade) * 1.5 - 0.03) / 0.78;
      if (v > BAYER[j % 8][i % 8]) {
        const n = j * cols + i;
        bits[n >> 3] |= 1 << (n & 7);
      }
    }
  }
  return { cols, rows, data: Buffer.from(bits).toString('base64') };
}
