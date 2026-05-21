import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Mail, Clock, MapPin } from 'lucide-react';
import { Container, Button } from '../components/UI';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset:  (widgetId?: string) => void;
    };
  }
}

const BG   = '#0a1628';
const BG2  = '#060f1e';
const CARD = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';
const INPUT_BG = 'rgba(255,255,255,0.06)';
const BLUE_DIM  = 'rgba(59,130,246,0.18)';
const BLUE_FILL = 'rgba(59,130,246,0.08)';

const HUBS = [
  {
    city: 'Mexico City',
    role: 'Air Cargo DG Operations',
    services: 'Airline Coordination · Radioactive Logistics · IATA Documentation',
  },
  {
    city: 'Monterrey',
    role: 'Dangerous Goods Hub',
    services: 'Warehousing · Ground Transport · DG Training',
  },
  {
    city: 'Guadalajara',
    role: 'Western Mexico Logistics',
    services: 'Freight Coordination · Compliance Support · Cross-Border DG',
  },
  {
    city: 'Villahermosa',
    role: 'Oil & Gas Sector',
    services: 'Radioactive Material Operations · Class 7 Logistics',
  },
] as const;

const inputStyle = {
  backgroundColor: INPUT_BG,
  border: `1px solid ${BORDER}`,
  color: '#fff',
  width: '100%',
  padding: '11px 14px',
  fontSize: '13px',
  outline: 'none',
  display: 'block',
  fontFamily: 'inherit',
} as const;

const labelStyle = {
  display: 'block',
  fontSize: '10px',
  fontWeight: 900,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: 'rgba(255,255,255,0.38)',
  marginBottom: '6px',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  const turnstileSiteKey: string | undefined =
    import.meta.env.VITE_TURNSTILE_SITE_KEY || undefined;

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileContainerRef.current) return;
    const tryRender = () => {
      if (!window.turnstile || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current!, {
        sitekey:            turnstileSiteKey,
        theme:              'dark',
        callback:           (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback':   () => setTurnstileToken(''),
      });
    };
    tryRender();
    if (!window.turnstile) {
      const t = setInterval(() => { if (window.turnstile) { tryRender(); clearInterval(t); } }, 200);
      return () => clearInterval(t);
    }
    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [turnstileSiteKey]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (turnstileSiteKey && !turnstileToken) {
      setError('Please complete the security check below before submitting.');
      return;
    }

    setIsLoading(true);

    const fd = new FormData(e.currentTarget);

    try {
      const { error: fnError } = await supabase.functions.invoke('contact-inquiry', {
        body: {
          full_name:        (fd.get('name') as string).trim(),
          company:          (fd.get('company') as string | null)?.trim() || undefined,
          email:            (fd.get('email') as string).trim(),
          phone:            (fd.get('phone') as string | null)?.trim() || undefined,
          service_interest: (fd.get('service_interest') as string | null)?.trim() || undefined,
          message:          (fd.get('message') as string).trim(),
          consent:          true,
          language:         'en',
          turnstile_token:  turnstileToken || undefined,
        },
      });

      if (fnError) {
        console.error('[contact-inquiry] Function error:', fnError);
        setError("We couldn't send your message. Please try again or contact us directly.");
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('[contact-inquiry] Invocation failed:', err);
      setError("We couldn't send your message. Please try again or contact us directly.");
    } finally {
      setIsLoading(false);
    }
  };

  const focusBorder  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)');
  const blurBorder   = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = BORDER);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* ── Page wrapper: single dark background, no white breaks ── */}
      <div style={{ backgroundColor: BG, paddingTop: '88px', paddingBottom: 0 }}>

        {/* ── Hero band ─────────────────────────────────────────────────────── */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, paddingTop: '40px', paddingBottom: '40px' }}>
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ height: '1px', width: '40px', backgroundColor: '#3b82f6' }} />
              <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60a5fa' }}>
                Global Gate Mexico
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '10px' }}>
              Contact Global Gate Mexico
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', maxWidth: '480px', lineHeight: 1.65 }}>
              Not sure where to start? Send us a brief message and our team will help you identify the right logistics or compliance solution.
            </p>
          </Container>
        </div>

        {/* ── Main 2-column ─────────────────────────────────────────────────── */}
        <div style={{ paddingTop: '48px', paddingBottom: '64px' }}>
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">

              {/* ── LEFT: form card ─────────────────────────────────────────── */}
              <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, padding: '36px 32px' }}>
                {!submitted ? (
                  <>
                    <div style={{ marginBottom: '24px', paddingBottom: '18px', borderBottom: `1px solid ${BORDER}` }}>
                      <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: '6px' }}>
                        General Inquiry
                      </p>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                        Tell Us About Your Needs
                      </h2>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', marginTop: '6px', lineHeight: 1.5 }}>
                        A specialist will respond within one business day.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Field label="Full Name *">
                          <input name="name" type="text" required placeholder="John Doe"
                            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                        <Field label="Company *">
                          <input name="company" type="text" required placeholder="Your Company"
                            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Field label="Email *">
                          <input name="email" type="email" required placeholder="you@company.com"
                            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                        <Field label="Phone / WhatsApp">
                          <input name="phone" type="tel" placeholder="+52 ..."
                            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      </div>

                      <Field label="Service Interest *">
                        <select name="service_interest" required
                          style={{ ...inputStyle, backgroundColor: '#0d1e35', cursor: 'pointer' }}
                          onFocus={focusBorder} onBlur={blurBorder}
                        >
                          <option value="" style={{ backgroundColor: '#0d1e35' }}>Select a service…</option>
                          <option value="Dangerous Goods Transportation"  style={{ backgroundColor: '#0d1e35' }}>Dangerous Goods Transportation</option>
                          <option value="Radioactive Material Logistics"  style={{ backgroundColor: '#0d1e35' }}>Radioactive Material Logistics</option>
                          <option value="DG Consulting & Compliance"      style={{ backgroundColor: '#0d1e35' }}>DG Consulting &amp; Compliance</option>
                          <option value="Training"                        style={{ backgroundColor: '#0d1e35' }}>Training</option>
                          <option value="Warehousing"                     style={{ backgroundColor: '#0d1e35' }}>Warehousing</option>
                          <option value="Other / Not Sure Yet"            style={{ backgroundColor: '#0d1e35' }}>Other / Not Sure Yet</option>
                        </select>
                      </Field>

                      <Field label="Message *">
                        <textarea name="message" rows={4} required
                          placeholder="Briefly describe your shipment or inquiry…"
                          style={{ ...inputStyle, resize: 'none' }}
                          onFocus={focusBorder} onBlur={blurBorder}
                        />
                      </Field>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '2px' }}>
                        <input type="checkbox" required id="contact-consent"
                          style={{ marginTop: '2px', accentColor: '#3b82f6', flexShrink: 0 }} />
                        <label htmlFor="contact-consent"
                          style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.55, cursor: 'pointer' }}>
                          I agree to Global Gate Mexico processing my data to respond to this inquiry in accordance with applicable privacy regulations.
                        </label>
                      </div>

                      {turnstileSiteKey && (
                        <div>
                          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                            Complete the security check to enable sending.
                          </p>
                          <div ref={turnstileContainerRef} />
                        </div>
                      )}

                      {error && (
                        <p style={{ color: '#f87171', fontSize: '12px', fontWeight: 600 }}>{error}</p>
                      )}

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-full uppercase font-black tracking-widest text-[11px] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ marginTop: '4px', padding: '14px' }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Send Message <Send size={14} />
                          </span>
                        )}
                      </Button>

                    </form>
                  </>
                ) : (
                  /* ── Success ── */
                  <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" fill="none" stroke="#4ade80" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60a5fa' }}>Message Received</p>
                    <h3 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#fff', lineHeight: 1.2 }}>
                      Thank You
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: '320px' }}>
                      Our team will contact you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '8px', textAlign: 'left' }}
                    >
                      ← Send Another Message
                    </button>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Operational Coverage ─────────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Header */}
                <div>
                  <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: '8px' }}>
                    Operational Coverage
                  </p>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: '8px' }}>
                    Mexico &amp; Cross-Border Network
                  </h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '340px' }}>
                    Our specialists operate across Mexico's key logistics corridors for air, ground, and ocean transport.
                  </p>
                </div>

                {/* Hub cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {HUBS.map((hub, i) => (
                    <div
                      key={hub.city}
                      style={{
                        backgroundColor: i === 0 ? BLUE_FILL : CARD,
                        border: `1px solid ${i === 0 ? BLUE_DIM : BORDER}`,
                        padding: '16px 18px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.9)', marginBottom: '2px' }}>
                            {hub.city}
                          </p>
                          <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: i === 0 ? '#93c5fd' : '#60a5fa', opacity: i === 0 ? 1 : 0.7 }}>
                            {hub.role}
                          </p>
                        </div>
                        <div style={{
                          width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                          backgroundColor: i === 0 ? '#3b82f6' : 'rgba(59,130,246,0.35)',
                        }} />
                      </div>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                        {hub.services}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Cross-border tags */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, padding: '16px 18px' }}>
                  <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '10px' }}>
                    Cross-Border Reach
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      { label: 'Mexico',                  accent: true },
                      { label: 'USA',                     accent: true },
                      { label: 'Canada',                  accent: true },
                      { label: 'IATA Certified',          accent: false },
                      { label: 'IMDG Compliant',          accent: false },
                      { label: 'ADR Compliance Knowledge', accent: false },
                    ].map(({ label, accent }) => (
                      <span
                        key={label}
                        style={{
                          fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                          padding: '4px 10px',
                          backgroundColor: accent ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                          border: accent ? '1px solid rgba(59,130,246,0.22)' : `1px solid ${BORDER}`,
                          color: accent ? 'rgba(147,197,253,0.85)' : 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* ── Bottom contact strip ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: BG2, borderTop: `1px solid ${BORDER}`, padding: '36px 0' }}>
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <MessageSquare size={14} />, label: 'WhatsApp',      value: '+52 812 165 4040',       href: 'https://wa.me/528121654040', external: true },
              { icon: <Mail size={14} />,          label: 'Email',         value: 'ggm@globalgatemexico.com', href: 'mailto:ggm@globalgatemexico.com', external: false },
              { icon: <Clock size={14} />,         label: 'Response Time', value: 'Within 1 Business Day',  href: null, external: false },
              { icon: <MapPin size={14} />,        label: 'Office Hours',  value: 'Mon–Fri · 8:00–18:00 CST', href: null, external: false },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)',
                  color: '#60a5fa',
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)', marginBottom: '4px' }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

    </div>
  );
};
