const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

let loaded = false;

function loadScript() {
  if (loaded || !GA_ID) return;
  loaded = true;
  window.gtag = gtag;
  gtag('js', new Date());
  // Default-deny before consent
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
  });
  gtag('config', GA_ID, { send_page_view: false });
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);
}

export function initAnalytics(granted: boolean) {
  if (!GA_ID) return;
  loadScript();
  gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
  if (granted) gtag('event', 'page_view');
}

export function trackPageView(path: string) {
  if (!GA_ID || !loaded) return;
  gtag('event', 'page_view', { page_path: path });
}
