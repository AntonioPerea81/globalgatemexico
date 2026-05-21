import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Mail, Clock, MapPin } from 'lucide-react';
import { Section, Container, Button } from '../components/UI';
import { useFormSubmit } from '../hooks/useFormSubmit';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset:  (widgetId?: string) => void;
    };
  }
}

const HUBS = [
  {
    city: 'Mexico City',
    role: 'Air Cargo DG Operations',
    services: ['Airline Coordination', 'Radioactive Logistics', 'IATA Documentation'],
  },
  {
    city: 'Monterrey',
    role: 'Dangerous Goods Hub',
    services: ['Warehousing', 'Ground Transport', 'DG Training'],
  },
  {
    city: 'Guadalajara',
    role: 'Western Mexico Logistics',
    services: ['Freight Coordination', 'Compliance Support', 'Cross-Border DG'],
  },
  {
    city: 'Villahermosa',
    role: 'Oil & Gas Sector',
    services: ['Radioactive Material Operations', 'Class 7 Logistics'],
  },
] as const;

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const { isLoading, error, submit } = useFormSubmit();

  const turnstileSiteKey: string | undefined =
    import.meta.env.VITE_TURNSTILE_SITE_KEY || undefined;

  useEffect(() => {
    if (!turnstileSiteKey) return;
    if (!turnstileContainerRef.current) return;

    const tryRender = () => {
      if (!window.turnstile) return;
      if (turnstileWidgetId.current) return;
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
      const interval = setInterval(() => {
        if (window.turnstile) { tryRender(); clearInterval(interval); }
      }, 200);
      return () => clearInterval(interval);
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
    const formData = new FormData(e.currentTarget);

    const step1 = {
      name:        formData.get('name') as string,
      company:     formData.get('company') as string,
      email:       formData.get('email') as string,
      phone:       formData.get('phone') as string,
      merchandise: formData.get('service_interest') as string,
    };

    const step2 = new FormData();
    step2.set('origin',      '');
    step2.set('destination', '');
    step2.set('transport',   '');
    step2.set('dims',        '');
    step2.set('quantity',    formData.get('message') as string);

    const ok = await submit(step1, step2, turnstileToken);
    if (ok) setSubmitted(true);
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: '#0b1320', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        className="pt-28 pb-14"
      >
        <Container>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-blue-500" />
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-blue-400">
              Global Gate Mexico
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Contact Global Gate Mexico
          </h1>
          <p className="text-white/50 text-[15px] max-w-lg leading-relaxed">
            Not sure where to start? Send us a brief message and our team will help you identify the right logistics or compliance solution.
          </p>
        </Container>
      </section>

      {/* ── Main 2-col ───────────────────────────────────────────────────────── */}
      <Section
        noPadding
        style={{ backgroundColor: '#0b1320' } as React.CSSProperties}
        className="py-16 md:py-20"
      >
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-20">

            {/* LEFT — inquiry form */}
            <div>
              {!submitted ? (
                <>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">
                    General Inquiry
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">
                          Full Name *
                        </label>
                        <input
                          name="name" type="text" required
                          placeholder="John Doe"
                          className="w-full px-4 py-3 text-[13px] outline-none transition-colors text-white placeholder-white/20"
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                          onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">
                          Company *
                        </label>
                        <input
                          name="company" type="text" required
                          placeholder="Your Company"
                          className="w-full px-4 py-3 text-[13px] outline-none transition-colors text-white placeholder-white/20"
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                          onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">
                          Email *
                        </label>
                        <input
                          name="email" type="email" required
                          placeholder="you@company.com"
                          className="w-full px-4 py-3 text-[13px] outline-none transition-colors text-white placeholder-white/20"
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                          onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">
                          Phone / WhatsApp
                        </label>
                        <input
                          name="phone" type="tel"
                          placeholder="+52 ..."
                          className="w-full px-4 py-3 text-[13px] outline-none transition-colors text-white placeholder-white/20"
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                          onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">
                        Service Interest *
                      </label>
                      <select
                        name="service_interest" required
                        className="w-full px-4 py-3 text-[13px] outline-none transition-colors text-white"
                        style={{ backgroundColor: '#111d2e', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                        onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                      >
                        <option value="" style={{ backgroundColor: '#111d2e' }}>Select a service…</option>
                        <option value="Dangerous Goods Transportation"   style={{ backgroundColor: '#111d2e' }}>Dangerous Goods Transportation</option>
                        <option value="Radioactive Material Logistics"   style={{ backgroundColor: '#111d2e' }}>Radioactive Material Logistics</option>
                        <option value="DG Consulting & Compliance"       style={{ backgroundColor: '#111d2e' }}>DG Consulting &amp; Compliance</option>
                        <option value="Training"                         style={{ backgroundColor: '#111d2e' }}>Training</option>
                        <option value="Warehousing"                      style={{ backgroundColor: '#111d2e' }}>Warehousing</option>
                        <option value="Other / Not Sure Yet"             style={{ backgroundColor: '#111d2e' }}>Other / Not Sure Yet</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">
                        Message
                      </label>
                      <textarea
                        name="message" rows={4}
                        placeholder="Briefly describe your shipment or inquiry…"
                        className="w-full px-4 py-3 text-[13px] outline-none transition-colors resize-none text-white placeholder-white/20"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                        onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox" required id="contact-consent"
                        className="mt-0.5 accent-blue-500 shrink-0"
                      />
                      <label htmlFor="contact-consent" className="text-[11px] text-white/40 leading-snug cursor-pointer">
                        I agree to Global Gate Mexico processing my data to respond to this inquiry in accordance with applicable privacy regulations.
                      </label>
                    </div>

                    {turnstileSiteKey && (
                      <div ref={turnstileContainerRef} className="mt-1" />
                    )}

                    {error && (
                      <p className="text-red-400 text-[12px] font-semibold">{error}</p>
                    )}

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-full py-4 uppercase font-black tracking-widest text-[11px] mt-2"
                      disabled={isLoading || (!!turnstileSiteKey && !turnstileToken)}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending…
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
                /* ── Success state ── */
                <div className="py-10 space-y-5">
                  <div
                    className="w-11 h-11 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                    Message Received
                  </p>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
                    Thank You —<br />We'll Be In Touch
                  </h3>
                  <p className="text-white/50 text-[13px] leading-relaxed max-w-sm">
                    A member of our dangerous goods team will review your inquiry and respond within one business day.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[11px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    ← Send Another Message
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT — Operational Coverage */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">
                  Operational Coverage
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2">
                  Mexico & Cross-Border Network
                </h2>
                <p className="text-white/40 text-[13px] leading-relaxed max-w-sm">
                  Our specialists operate across Mexico's key logistics corridors, handling dangerous goods for air, ground, and ocean transport.
                </p>
              </div>

              {/* Hub cards */}
              <div className="space-y-3">
                {HUBS.map((hub, i) => (
                  <div
                    key={hub.city}
                    style={{
                      backgroundColor: i === 0 ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.03)',
                      border: i === 0 ? '1px solid rgba(59,130,246,0.18)' : '1px solid rgba(255,255,255,0.06)',
                    }}
                    className="px-5 py-4"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="text-white/90 text-[13px] font-black uppercase tracking-wide">
                          {hub.city}
                        </p>
                        <p className="text-blue-400/80 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                          {hub.role}
                        </p>
                      </div>
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                        style={{ backgroundColor: i === 0 ? '#3b82f6' : 'rgba(59,130,246,0.4)' }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {hub.services.map(s => (
                        <span key={s} className="text-white/35 text-[10.5px]">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Abstract network visual */}
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '18px 20px',
                }}
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-3">
                  Cross-Border Reach
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Mexico', 'USA', 'Canada', 'IATA Certified', 'IMDG Compliant', 'ADR Ready'].map((tag, i) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1"
                      style={{
                        backgroundColor: i < 3 ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.04)',
                        border: i < 3 ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(255,255,255,0.07)',
                        color: i < 3 ? 'rgba(147,197,253,0.8)' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* ── Bottom strip ─────────────────────────────────────────────────────── */}
      <div
        style={{ backgroundColor: '#060d18', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        className="py-10"
      >
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <MessageSquare size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">WhatsApp</p>
                <a
                  href="https://wa.me/528121654040"
                  target="_blank" rel="noopener noreferrer"
                  className="text-white/70 text-[13px] font-bold hover:text-white transition-colors"
                >
                  +52 812 165 4040
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <Mail size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Email</p>
                <a
                  href="mailto:ggm@globalgatemexico.com"
                  className="text-white/70 text-[13px] font-bold hover:text-white transition-colors"
                >
                  ggm@globalgatemexico.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <Clock size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Response Time</p>
                <p className="text-white/70 text-[13px] font-bold">Within 1 Business Day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <MapPin size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Office Hours</p>
                <p className="text-white/70 text-[13px] font-bold">Mon–Fri · 8:00–18:00 CST</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
