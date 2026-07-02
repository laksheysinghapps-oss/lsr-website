import React, { useEffect } from 'react';

interface ArticleMeta {
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  section: string;
  tags?: string[];
}

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  ogType?: 'website' | 'article';
  articleMeta?: ArticleMeta;
  noIndex?: boolean;
  structuredData?: object | object[];
}

const SITE_URL = 'https://lsrrealty.com';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.remove();
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  image,
  ogType = 'website',
  articleMeta,
  noIndex = false,
  structuredData,
}) => {
  useEffect(() => {
    const prevTitle = document.title;
    const url = `${SITE_URL}${path}`;
    const ogImage = image ?? `${SITE_URL}/images/Logo2.png`;

    document.title = title;
    upsertMeta('name', 'description', description);

    // Canonical
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute('href') ?? null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Robots
    let robotsMeta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prevRobots = robotsMeta?.getAttribute('content') ?? null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:site_name', 'LSR Realty');
    upsertMeta('property', 'og:locale', 'en_IN');

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    // Article-specific meta (only when ogType === 'article')
    const articleProps: Array<[string, string]> = [];
    if (ogType === 'article' && articleMeta) {
      const entries: Array<[string, string]> = [
        ['article:published_time', articleMeta.publishedTime],
        ['article:author', articleMeta.author],
        ['article:section', articleMeta.section],
        ...(articleMeta.modifiedTime ? [['article:modified_time', articleMeta.modifiedTime] as [string, string]] : []),
        ...(articleMeta.tags ?? []).map(tag => ['article:tag', tag] as [string, string]),
      ];
      for (const [prop, content] of entries) {
        upsertMeta('property', prop, content);
        articleProps.push([prop, content]);
      }
    }

    // JSON-LD
    const scripts: HTMLScriptElement[] = [];
    if (structuredData) {
      const items = Array.isArray(structuredData) ? structuredData : [structuredData];
      for (const item of items) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(item);
        script.dataset.seoInjected = 'true';
        document.head.appendChild(script);
        scripts.push(script);
      }
    }

    return () => {
      document.title = prevTitle;
      if (prevCanonical) canonical!.setAttribute('href', prevCanonical);
      if (prevRobots !== null) robotsMeta!.setAttribute('content', prevRobots);
      else robotsMeta?.remove();
      for (const [prop] of articleProps) removeMeta('property', prop);
      scripts.forEach(s => s.remove());
    };
  }, [title, description, path, image, ogType, articleMeta, noIndex, structuredData]);

  return null;
};

export default SEO;
