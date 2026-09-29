import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Full Stack Developer`,
    short_name: site.name,
    description: site.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0F0D',
    theme_color: '#34D399',
    icons: [
      {
        src: '/logo.webp',
        sizes: 'any',
        type: 'image/webp',
      },
    ],
  };
}
