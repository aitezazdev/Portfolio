import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/projects';
import { site } from '@/lib/site';

const LAST_UPDATED = new Date('2026-11-13');

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects().map((p) => ({
    url: `${site.url}/projects/${p.slug}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: site.url,
      lastModified: LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projects,
  ];
}
