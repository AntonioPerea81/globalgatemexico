import { useEffect } from 'react';
import { collectServerPageMeta } from '../lib/serverPageMeta';

export interface HreflangEntry { lang: string; href: string; }

export interface PageMetaOptions {
  title?: string;
  description?: string;
  canonical?: string;
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
  if (typeof document === 'undefined') {
    collectServerPageMeta({ title, description, canonical, hreflang, lang });
  }

  useEffect(() => {
    if (title) document.title = title;
    document.documentElement.lang = lang ?? 'en';

    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
    }
    if (title) setMetaTag('property', 'og:title', title);
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
