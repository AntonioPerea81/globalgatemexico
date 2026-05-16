import { useEffect } from 'react';

interface HreflangEntry { lang: string; href: string; }

interface PageMetaOptions {
  title: string;
  description: string;
  canonical: string;
  hreflang?: HreflangEntry[];
  lang?: string;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string, extra?: Record<string, string>) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
  }
}

export function usePageMeta({ title, description, canonical, hreflang, lang }: PageMetaOptions) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang ?? 'en';

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setLinkTag('canonical', canonical);

    // Remove existing hreflang alternates then re-add
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    hreflang?.forEach(({ lang: hLang, href }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hLang);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    });

    return () => {
      document.title = 'Global Gate Mexico | Dangerous Goods Logistics & Compliance';
      document.documentElement.lang = 'en';
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', 'https://globalgatemexico.com');
    };
  }, [title, description, canonical]);
}
