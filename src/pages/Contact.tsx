import { useState, useEffect, useRef, FC } from 'react';
import { motion } from 'motion/react';
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

// ─── Mexico Operations Map ─────────────────────────────────────────────────────

const OPERATIONS = [
  {
    id: 'monterrey',
    name: 'Monterrey',
    x: 360, y: 115,
    ops: 'Dangerous Goods Operations',
    services: 'Warehousing · Ground Transport · Training',
    flipCard: true,
  },
  {
    id: 'cdmx',
    name: 'Mexico City',
    x: 285, y: 252,
    ops: 'Air Cargo DG Operations',
    services: 'Airline Coordination · Radioactive Logistics',
    flipCard: false,
  },
  {
    id: 'guadalajara',
    name: 'Guadalajara',
    x: 212, y: 225,
    ops: 'Western Mexico Logistics Support',
    services: 'Freight Coordination · Compliance Support',
    flipCard: false,
  },
  {
    id: 'villahermosa',
    name: 'Villahermosa',
    x: 450, y: 265,
    ops: 'Oil & Gas Sector Support',
    services: 'Radioactive Material Operations',
    flipCard: true,
  },
] as const;

const NETWORK_PATHS = [
  'M 360,115 Q 322,183 285,252',
  'M 285,252 L 212,225',
  'M 285,252 Q 368,258 450,265',
  'M 360,115 Q 408,190 450,265',
];

const MEXICO_MAINLAND = 'M 92,75 L 96,62 L 170,56 L 240,60 L 285,65 L 335,68 L 375,75 L 405,82 L 422,90 L 438,107 L 444,132 L 447,162 L 451,193 L 448,222 L 451,248 L 462,265 L 478,268 L 502,258 L 525,248 L 540,234 L 547,255 L 538,278 L 523,296 L 508,310 L 490,323 L 470,332 L 448,338 L 422,332 L 400,320 L 373,310 L 350,303 L 325,296 L 298,288 L 272,278 L 248,270 L 225,260 L 205,248 L 185,236 L 168,226 L 155,218 L 140,215 L 122,218 L 108,204 L 98,187 L 90,168 L 84,148 L 80,128 L 82,104 L 87,82 Z';
const MEXICO_BAJA    = 'M 80,75 L 74,62 L 65,70 L 58,103 L 52,138 L 47,173 L 45,208 L 46,243 L 50,278 L 55,308 L 62,333 L 68,353 L 74,366 L 79,370 L 83,360 L 87,338 L 91,303 L 93,268 L 92,233 L 88,198 L 84,163 L 81,128 L 79,98 L 78,78 Z';

const MexicoMap: FC = () => {
  const [activeCity, setActiveCity] = useState<string | null>(null);

  return (
    <div className="relative w-full" style={{ aspectRatio: '560/460' }}>
      <svg
        viewBox="0 0 560 460"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.7))' }}
      >
        <ellipse cx="300" cy="220" rx="220" ry="160" fill="rgba(30,74,110,0.06)" />

        {NETWORK_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#1e4a6e"
            strokeWidth={0.7}
            strokeDasharray="3 8"
            fill="none"
            opacity={0.55}
          />
        ))}

        <path d={MEXICO_BAJA}     fill="#16243a" stroke="#253d5a" strokeWidth={0.9} />
        <path d={MEXICO_MAINLAND} fill="#16243a" stroke="#253d5a" strokeWidth={0.9} />

        <line x1="200" y1="60" x2="200" y2="340" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />
        <line x1="310" y1="60" x2="310" y2="340" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />
        <line x1="420" y1="90" x2="420" y2="340" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />
        <line x1="90" y1="160" x2="555" y2="160" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />
        <line x1="90" y1="230" x2="555" y2="230" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />

        {OPERATIONS.map((city, i) => (
          <g
            key={city.id}
            onMouseEnter={() => setActiveCity(city.id)}
            onMouseLeave={() => setActiveCity(null)}
            style={{ cursor: 'crosshair' }}
          >
            <motion.circle
              cx={city.x} cy={city.y} r={8}
              fill="none"
              stroke={activeCity === city.id ? '#60a5fa' : '#3b82f6'}
              strokeWidth={0.8}
              animate={{ r: [7, 18], opacity: [0.55, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.65, ease: 'easeOut' }}
            />
            <circle cx={city.x} cy={city.y} r={6} fill="none" stroke="#1d4ed8" strokeWidth={0.7} opacity={0.7} />
            <circle
              cx={city.x} cy={city.y} r={3.5}
              fill={activeCity === city.id ? '#93c5fd' : '#3b82f6'}
              style={{ transition: 'fill 0.2s' }}
            />
            {activeCity === city.id && (
              <circle cx={city.x} cy={city.y} r={10} fill="rgba(59,130,246,0.12)" />
            )}
          </g>
        ))}
      </svg>

      {OPERATIONS.map((city) => {
        const isActive = activeCity === city.id;
        const leftPct = (city.x / 560) * 100;
        const topPct  = (city.y / 460) * 100;
        const cardLeft = city.flipCard
          ? `calc(${leftPct}% - 194px)`
          : `calc(${leftPct}% + 14px)`;

        return (
          <div
            key={city.id}
            className="absolute w-[180px] pointer-events-none"
            style={{
              left:      cardLeft,
              top:       `calc(${topPct}% - 56px)`,
              zIndex:    20,
              opacity:   isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            <div style={{
              backgroundColor: 'rgba(10,18,30,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              padding: '14px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.12)',
            }}>
              <div style={{ width: '20px', height: '1px', backgroundColor: '#3b82f6', marginBottom: '10px' }} />
              <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                {city.name}
              </p>
              <p style={{ color: '#60a5fa', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '7px' }}>
                {city.ops}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '9.5px', lineHeight: 1.55 }}>
                {city.services}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Contact Page ──────────────────────────────────────────────────────────────

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
        sitekey:  turnstileSiteKey,
        theme:    'dark',
        callback: (token: string) => setTurnstileToken(token),
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
      {/* Hero band */}
      <section style={{ backgroundColor: '#0b1320', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="pt-28 pb-14">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-blue-500" />
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-blue-400">Global Gate Mexico</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Contact Our DG Team
          </h1>
          <p className="text-white/50 text-[15px] max-w-xl leading-relaxed">
            Reach our dangerous goods specialists for quotes, compliance questions, or logistics planning across Mexico and cross-border.
          </p>
        </Container>
      </section>

      {/* Main 2-column section */}
      <Section noPadding style={{ backgroundColor: '#0b1320' } as React.CSSProperties} className="py-16 md:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">

            {/* LEFT — inquiry form */}
            <div>
              {!submitted ? (
                <>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">
                    Send an Inquiry
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">Name *</label>
                        <input
                          name="name" type="text" required
                          className="w-full px-4 py-3 text-[13px] outline-none transition-all text-white placeholder-white/20"
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">Company *</label>
                        <input
                          name="company" type="text" required
                          className="w-full px-4 py-3 text-[13px] outline-none transition-all text-white placeholder-white/20"
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                          placeholder="Your Company"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">Email *</label>
                        <input
                          name="email" type="email" required
                          className="w-full px-4 py-3 text-[13px] outline-none transition-all text-white placeholder-white/20"
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                          placeholder="you@company.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">Phone</label>
                        <input
                          name="phone" type="tel"
                          className="w-full px-4 py-3 text-[13px] outline-none transition-all text-white placeholder-white/20"
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                          placeholder="+52 ..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">Service Interest *</label>
                      <select
                        name="service_interest" required
                        className="w-full px-4 py-3 text-[13px] outline-none transition-all text-white"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                      >
                        <option value="" style={{ backgroundColor: '#0b1320' }}>Select a service…</option>
                        <option value="Dangerous Goods Transportation" style={{ backgroundColor: '#0b1320' }}>Dangerous Goods Transportation</option>
                        <option value="DG Compliance & Consulting" style={{ backgroundColor: '#0b1320' }}>DG Compliance &amp; Consulting</option>
                        <option value="Radioactive Material Logistics" style={{ backgroundColor: '#0b1320' }}>Radioactive Material Logistics</option>
                        <option value="DG Training" style={{ backgroundColor: '#0b1320' }}>DG Training</option>
                        <option value="DG Packaging" style={{ backgroundColor: '#0b1320' }}>DG Packaging</option>
                        <option value="Other" style={{ backgroundColor: '#0b1320' }}>Other / Not Sure</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-white/40 tracking-wider ml-1">Message</label>
                      <textarea
                        name="message" rows={4}
                        className="w-full px-4 py-3 text-[13px] outline-none transition-all resize-none text-white placeholder-white/20"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                        placeholder="Briefly describe your shipment or inquiry…"
                      />
                    </div>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" required id="contact-consent" className="mt-0.5 accent-blue-500 shrink-0" />
                      <label htmlFor="contact-consent" className="text-[11px] text-white/40 leading-snug cursor-pointer">
                        I agree to Global Gate Mexico processing my data to respond to this inquiry. View our Privacy Policy.
                      </label>
                    </div>

                    {turnstileSiteKey && (
                      <div ref={turnstileContainerRef} className="mt-2" />
                    )}

                    {error && (
                      <p className="text-red-400 text-[12px] font-semibold">{error}</p>
                    )}

                    <Button
                      variant="primary"
                      className="w-full py-4 uppercase font-black tracking-widest text-[11px] mt-2"
                      disabled={isLoading || (!!turnstileSiteKey && !turnstileToken)}
                      type="submit"
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
                <div className="py-12 space-y-5">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Message Received</p>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
                    Thank You — We'll Be In Touch
                  </h3>
                  <p className="text-white/50 text-[13px] leading-relaxed max-w-sm">
                    A member of our dangerous goods team will review your inquiry and respond within one business day.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[11px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors mt-4"
                  >
                    ← Send Another Message
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT — Mexico map */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Coverage Network</p>
                <h2 className="text-2xl font-extrabold tracking-tight text-white mb-1">Operations Across Mexico</h2>
                <p className="text-white/40 text-[13px] leading-relaxed">
                  Hover over a hub to see our local capabilities.
                </p>
              </div>
              <MexicoMap />
              <div className="grid grid-cols-2 gap-3">
                {OPERATIONS.map(city => (
                  <div key={city.id} style={{ border: '1px solid rgba(255,255,255,0.07)', padding: '12px 14px' }}>
                    <p className="text-white/80 text-[11px] font-black uppercase tracking-wide">{city.name}</p>
                    <p className="text-blue-400/70 text-[9px] mt-0.5 leading-snug">{city.services}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Bottom contact strip */}
      <div style={{ backgroundColor: '#060d18', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-10">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-none flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                <MessageSquare size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">WhatsApp</p>
                <a href="https://wa.me/528121654040" target="_blank" rel="noopener noreferrer" className="text-white/70 text-[13px] font-bold hover:text-white transition-colors">
                  +52 812 165 4040
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-none flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                <Mail size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Email</p>
                <a href="mailto:ggm@globalgatemexico.com" className="text-white/70 text-[13px] font-bold hover:text-white transition-colors">
                  ggm@globalgatemexico.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-none flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
                <Clock size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Response Time</p>
                <p className="text-white/70 text-[13px] font-bold">Within 1 Business Day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-none flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}>
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
