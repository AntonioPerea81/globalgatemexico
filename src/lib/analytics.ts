const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const GOOGLE_ADS_ID =
  (import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined) || 'AW-1024571678';
const GOOGLE_ADS_PURCHASE_SEND_TO =
  (import.meta.env.VITE_GOOGLE_ADS_PURCHASE_SEND_TO as string | undefined) ||
  'AW-1024571678/0pCuCKe81qIdEJ7yxugD';
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;
const LINKEDIN_PARTNER_ID = (import.meta.env.VITE_LINKEDIN_PARTNER_ID as string | undefined) || '2904172';
const LINKEDIN_PURCHASE_CONVERSION_ID = Number(
  (import.meta.env.VITE_LINKEDIN_PURCHASE_CONVERSION_ID as string | undefined) || '29858508',
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    dataLayer: any[];
    gtag: (...args: unknown[]) => void;
    _linkedin_data_partner_ids?: string[];
    lintrk?: ((action: string, data?: { conversion_id: number }) => void) & { q?: unknown[][] };
  }
}

let loaded = false;

function loadScript() {
  const tagId = GA_ID || GOOGLE_ADS_ID;
  if (loaded || !tagId) return;
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
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
  window.gtag('js', new Date());
  if (GA_ID) window.gtag('config', GA_ID, { send_page_view: false });
  if (GOOGLE_ADS_ID) window.gtag('config', GOOGLE_ADS_ID);

  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
  s.async = true;
  document.head.appendChild(s);

  console.log('[GGM Analytics] script injected, ids:', { ga: GA_ID, ads: GOOGLE_ADS_ID });
}

export function initAnalytics(granted: boolean) {
  if (granted) loadLinkedInInsightTag();

  if (!GA_ID && !GOOGLE_ADS_ID) {
    console.warn('[GGM Analytics] no Google measurement IDs set — Google tags disabled');
    return;
  }
  console.log('[GGM Analytics] initAnalytics called, granted:', granted);
  loadScript();
  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  });
  if (granted) {
    window.gtag('event', 'page_view');
    console.log('[GGM Analytics] consent granted, page_view fired');
    loadClarity();
  }
}

let linkedinLoaded = false;

function loadLinkedInInsightTag() {
  if (linkedinLoaded || !LINKEDIN_PARTNER_ID) return;
  linkedinLoaded = true;

  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  if (!window._linkedin_data_partner_ids.includes(LINKEDIN_PARTNER_ID)) {
    window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID);
  }

  window.lintrk = window.lintrk || function lintrk(action: string, data?: { conversion_id: number }) {
    window.lintrk!.q = window.lintrk!.q || [];
    window.lintrk!.q.push([action, data]);
  };

  const s = document.createElement('script');
  s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
  s.async = true;
  document.head.appendChild(s);

  console.log('[GGM Analytics] LinkedIn Insight Tag injected');
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

export function trackPurchase({
  transactionId,
  value,
  currency,
  itemId,
  quantity,
}: {
  transactionId: string;
  value: number;
  currency: string;
  itemId: string;
  quantity: number;
}) {
  if (!transactionId || value <= 0) return;

  if (GA_ID && loaded) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value,
      currency,
      items: [{ item_id: itemId, item_name: itemId, price: value / Math.max(quantity, 1), quantity }],
    });
  }

  if (GOOGLE_ADS_PURCHASE_SEND_TO && loaded) {
    const dedupeKey = `ggm_google_ads_purchase_${transactionId}`;
    if (!sessionStorage.getItem(dedupeKey)) {
      window.gtag('event', 'conversion', {
        send_to: GOOGLE_ADS_PURCHASE_SEND_TO,
        value,
        currency,
        transaction_id: transactionId,
      });
      sessionStorage.setItem(dedupeKey, 'sent');
    }
  }

  if (linkedinLoaded && window.lintrk && LINKEDIN_PURCHASE_CONVERSION_ID > 0) {
    const dedupeKey = `ggm_linkedin_purchase_${transactionId}`;
    if (!sessionStorage.getItem(dedupeKey)) {
      window.lintrk('track', { conversion_id: LINKEDIN_PURCHASE_CONVERSION_ID });
      sessionStorage.setItem(dedupeKey, 'sent');
    }
  }
}
