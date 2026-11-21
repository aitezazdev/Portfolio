import { ImageResponse } from 'next/og';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';
import { site } from '@/lib/site';

export const alt = 'Project preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const title = project?.title ?? 'Project';
  const type = project?.type ?? '';
  const tech = (project?.tech ?? []).slice(0, 5).join('  ·  ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#11100E',
          color: '#F3EEE5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, color: '#FF4D2E', textTransform: 'uppercase' }}>
          {type}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 28, color: '#A59D90' }}>{tech}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>{site.name}</div>
          <div style={{ display: 'flex', color: '#FF4D2E' }}>{site.brand}</div>
        </div>
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 10, background: '#FF4D2E', display: 'flex' }} />
      </div>
    ),
    size,
  );
}
