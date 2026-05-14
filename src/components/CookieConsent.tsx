import { useEffect, useState } from 'react';
import { initAnalytics } from '../lib/analytics';

const STORAGE_KEY = 'ggm_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('[GGM Analytics] stored consent:', stored);
    if (stored === 'accepted') {
      initAnalytics(true);
    } else if (stored === 'declined') {
      initAnalytics(false);
    } else {
      setVisible(true);
    }
  }, []);

  function accept() {
    console.log('[GGM Analytics] user accepted cookies');
    localStorage.setItem(STORAGE_KEY, 'accepted');
    initAnalytics(true);
    setVisible(false);
  }

  function decline() {
    console.log('[GGM Analytics] user declined cookies');
    localStorage.setItem(STORAGE_KEY, 'declined');
    initAnalytics(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 bg-dark text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-lg"
    >
      <p className="text-[13px] leading-relaxed flex-1 text-secondary">
        We use analytics cookies to understand how visitors interact with our site. You can accept or decline.{' '}
        <a href="/privacy" className="underline text-white/80 hover:text-white">
          Privacy Policy
        </a>
      </p>
      <div className="flex gap-3 shrink-0">
        <button
          onClick={decline}
          className="px-5 py-2 text-[11px] uppercase tracking-widest font-bold border border-white/20 text-white/70 hover:border-white/50 hover:text-white transition-colors"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="px-5 py-2 text-[11px] uppercase tracking-widest font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
