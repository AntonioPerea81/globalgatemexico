import { useEffect } from 'react';
import { collectServerPageMeta } from '../lib/serverPageMeta';

export interface HreflangEntry { lang: string; href: string; }

export interface PageMetaOptions {
  title?: string;
  description?: string;
  canonical?: string;
  hreflang?: HreflangEntry[];
  lang?: string;
  noindex?: boolean;
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

export function usePageMeta({ title, description, canonical, hreflang, lang, noindex }: PageMetaOptions) {
  if (typeof document === 'undefined') {
    collectServerPageMeta({ title, description, canonical, hreflang, lang });
  }

  useEffect(() => {
    if (noindex) setMetaTag('name', 'robots', 'noindex,nofollow');
    if (title) document.title = title;
    document.documentElement.lang = lang ?? 'en';

    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }
    if (title) {
      setMetaTag('property', 'og:title', title);
      setMetaTag('name', 'twitter:title', title);
    }
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'Global Gate Mexico');
    setMetaTag('property', 'og:locale', (lang ?? 'en') === 'es' ? 'es_MX' : 'en_US');
    setMetaTag('property', 'og:image', 'https://www.globalgatemexico.com/images/dg-transport/dg-hero-main.jpg');
    setMetaTag('property', 'og:image:alt', 'Global Gate Mexico dangerous goods logistics and training');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:image', 'https://www.globalgatemexico.com/images/dg-transport/dg-hero-main.jpg');
    if (canonical) {
      setLinkTag('canonical', canonical);
      setMetaTag('property', 'og:url', canonical);
    }

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
      if (canonical) canonical.setAttribute('href', 'https://www.globalgatemexico.com');
    };
  }, [title, description, canonical, hreflang, lang]);
}
