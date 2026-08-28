import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/*
    /api/* fica fora do índice: são endpoints de dados (README, repos, CV), não páginas.
    Indexá-los desperdiça crawl budget e polui os resultados com JSON cru.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
