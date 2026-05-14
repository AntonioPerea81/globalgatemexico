const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { dataLayer: any[]; gtag: (...args: unknown[]) => void; }
}

let loaded = false;

function loadScript() {
  if (loaded || !GA_ID) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  // Must be a plain function (not arrow/rest) so `arguments` is an IArguments
  // object — gtag.js checks the entry type when processing the dataLayer queue.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  // consent/default MUST be the first dataLayer command per consent mode v2 spec.
  // wait_for_update tells gtag.js to pause 500 ms for a consent update before
  // firing any hit — critical for returning visitors who have already accepted.
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    wait_for_update: 500,
  });
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });

  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);

  console.log('[GGM Analytics] script injected, id:', GA_ID);
}

export function initAnalytics(granted: boolean) {
  if (!GA_ID) {
    console.warn('[GGM Analytics] VITE_GA_MEASUREMENT_ID not set — analytics disabled');
    return;
  }
  console.log('[GGM Analytics] initAnalytics called, granted:', granted);
  loadScript();
  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
  if (granted) {
    window.gtag('event', 'page_view');
    console.log('[GGM Analytics] consent granted, page_view fired');
    loadClarity();
  }
}

let clarityLoaded = false;

function loadClarity() {
  if (clarityLoaded) return;
  if (!CLARITY_ID) {
    console.warn('[GGM Analytics] VITE_CLARITY_PROJECT_ID not set — Clarity disabled');
    return;
  }
  clarityLoaded = true;
  // Official Clarity init pattern — sets up the queue before the script loads.
  (function (c: Window, l: Document, a: string, r: string, i: string) {
    type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
    const w = c as Window & { [key: string]: ClarityFn };
    w[a] = w[a] || function (...args: unknown[]) { (w[a].q = w[a].q || []).push(args); };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
  console.log('[GGM Analytics] clarity script injected, id:', CLARITY_ID);
}

export function trackPageView(path: string) {
  if (!GA_ID || !loaded) return;
  window.gtag('event', 'page_view', { page_path: path });
}
