import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { get } from '@vercel/blob';
import { buildPortraitMap } from '@/lib/portraitMap';

export const runtime = 'nodejs';

async function loadSource(): Promise<Buffer | null> {
  try {
    const result = await get(process.env.PORTRAIT_BLOB_PATH || 'photo.webp', {
      access: 'private',
    });
    if (result && result.statusCode === 200) {
      return Buffer.from(await new Response(result.stream).arrayBuffer());
    }
  } catch {}
  try {
    return await readFile(path.join(process.cwd(), 'portrait', 'photo.webp'));
  } catch {
    return null;
  }
}

export async function GET() {
  const source = await loadSource();
  if (!source) return new Response('Not found', { status: 404 });

  try {
    const map = await buildPortraitMap(source);
    if (!map.data) return new Response('Not found', { status: 404 });
    return Response.json(map, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
