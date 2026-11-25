import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { CASE_STUDIES } from '@/lib/case-studies';

/*
    Sitemap das rotas públicas.
    `lastModified` usa a data do build: as páginas são estáticas, então a data do build
    é de fato a última vez que o conteúdo mudou.
*/
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    // Um estudo de caso por projeto de destaque: páginas com conteúdo próprio e indexável.
    ...CASE_STUDIES.map((study) => ({
      url: `${SITE_URL}/projects/${study.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
  ];
}
