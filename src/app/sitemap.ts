import { MetadataRoute } from 'next';
import { storiesData } from '@/lib/stories-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://wisdomis.fun';

  // Static pages
  const staticRoutes = [
    '',
    '/pricing',
    '/stories',
    '/roadmap',
    '/developer',
    '/business',
    '/invitation',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic story pages
  const storyRoutes = storiesData.map((story) => ({
    url: `${siteUrl}/stories/${story.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...storyRoutes];
}
