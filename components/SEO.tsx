import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
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

const SEO: React.FC<SEOProps> = ({ title, description, path, image, structuredData }) => {
  useEffect(() => {
    const prevTitle = document.title;
    const url = `${SITE_URL}${path}`;
    const ogImage = image ?? `${SITE_URL}/images/Logo2.png`;

    document.title = title;
    upsertMeta('name', 'description', description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute('href') ?? null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

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
      scripts.forEach(s => s.remove());
    };
  }, [title, description, path, image, structuredData]);

  return null;
};

export default SEO;
