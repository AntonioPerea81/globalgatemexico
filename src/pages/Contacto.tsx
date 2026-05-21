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

const BG    = '#0a1628';
const BG2   = '#060f1e';
const CARD  = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';
const INPUT_BG = 'rgba(255,255,255,0.06)';
const BLUE_DIM  = 'rgba(59,130,246,0.18)';
const BLUE_FILL = 'rgba(59,130,246,0.08)';

const HUBS = [
  {
    city:     'Ciudad de México',
    role:     'Operaciones DG Aéreas',
    services: 'Coordinación con aerolíneas · Logística de material radioactivo · Documentación IATA',
  },
  {
    city:     'Monterrey',
    role:     'Hub de Mercancías Peligrosas',
    services: 'Almacenaje · Transporte terrestre · Capacitación DG',
  },
  {
    city:     'Guadalajara',
    role:     'Logística Occidente de México',
    services: 'Coordinación de carga · Soporte de cumplimiento · DG Cross-Border',
  },
  {
    city:     'Villahermosa',
    role:     'Sector Oil & Gas',
    services: 'Operaciones con material radioactivo · Logística Clase 7',
  },
] as const;

const inputStyle = {
  backgroundColor: INPUT_BG,
  border:          `1px solid ${BORDER}`,
  color:           '#fff',
  width:           '100%',
  padding:         '11px 14px',
  fontSize:        '13px',
  outline:         'none',
  display:         'block',
  fontFamily:      'inherit',
} as const;

const labelStyle = {
  display:         'block',
  fontSize:        '10px',
  fontWeight:      900,
  textTransform:   'uppercase' as const,
  letterSpacing:   '0.12em',
  color:           'rgba(255,255,255,0.38)',
  marginBottom:    '6px',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export const ContactoPage = () => {
  const [submitted, setSubmitted]     = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId     = useRef<string | null>(null);

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
    setIsLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);

    try {
      const { error: fnError } = await supabase.functions.invoke('contact-inquiry', {
        body: {
          full_name:        (fd.get('name') as string).trim(),
          company:          (fd.get('company') as string | null)?.trim()           || undefined,
          email:            (fd.get('email') as string).trim(),
          phone:            (fd.get('phone') as string | null)?.trim()             || undefined,
          service_interest: (fd.get('service_interest') as string | null)?.trim() || undefined,
          message:          (fd.get('message') as string).trim(),
          consent:          true,
          language:         'es',
          turnstile_token:  turnstileToken || undefined,
        },
      });

      if (fnError) {
        console.error('[contact-inquiry] Error:', fnError);
        setError('No pudimos enviar tu mensaje. Intenta de nuevo o contáctanos directamente.');
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('[contact-inquiry] Invocation failed:', err);
      setError('No pudimos enviar tu mensaje. Intenta de nuevo o contáctanos directamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)');
  const blurBorder  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = BORDER);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      <div style={{ backgroundColor: BG, paddingTop: '88px', paddingBottom: 0 }}>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, paddingTop: '40px', paddingBottom: '40px' }}>
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ height: '1px', width: '40px', backgroundColor: '#3b82f6' }} />
              <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60a5fa' }}>
                Global Gate Mexico
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '10px' }}>
              Contacto Global Gate Mexico
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', maxWidth: '500px', lineHeight: 1.65 }}>
              ¿No sabes por dónde empezar? Envíanos un mensaje breve y nuestro equipo te ayudará a identificar la solución logística o de cumplimiento adecuada.
            </p>
          </Container>
        </div>

        {/* ── Main 2-column ─────────────────────────────────────────────────── */}
        <div style={{ paddingTop: '48px', paddingBottom: '64px' }}>
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">

              {/* ── LEFT: form card ──────────────────────────────────────────── */}
              <div style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, padding: '36px 32px' }}>
                {!submitted ? (
                  <>
                    <div style={{ marginBottom: '24px', paddingBottom: '18px', borderBottom: `1px solid ${BORDER}` }}>
                      <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: '6px' }}>
                        Consulta General
                      </p>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                        Cuéntanos qué necesitas
                      </h2>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', marginTop: '6px', lineHeight: 1.5 }}>
                        Un especialista responderá dentro de un día hábil.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Field label="Nombre completo *">
                          <input name="name" type="text" required placeholder="Juan Pérez"
                            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                        <Field label="Empresa *">
                          <input name="company" type="text" required placeholder="Tu empresa"
                            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Field label="Correo electrónico *">
                          <input name="email" type="email" required placeholder="tu@empresa.com"
                            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                        <Field label="Teléfono / WhatsApp">
                          <input name="phone" type="tel" placeholder="+52 ..."
                            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      </div>

                      <Field label="Servicio de interés *">
                        <select name="service_interest" required
                          style={{ ...inputStyle, backgroundColor: '#0d1e35', cursor: 'pointer' }}
                          onFocus={focusBorder} onBlur={blurBorder}
                        >
                          <option value="" style={{ backgroundColor: '#0d1e35' }}>Selecciona un servicio…</option>
                          <option value="Transporte de Mercancías Peligrosas" style={{ backgroundColor: '#0d1e35' }}>Transporte de Mercancías Peligrosas</option>
                          <option value="Logística de Material Radioactivo"   style={{ backgroundColor: '#0d1e35' }}>Logística de Material Radioactivo</option>
                          <option value="Consultoría y Cumplimiento DG"       style={{ backgroundColor: '#0d1e35' }}>Consultoría y Cumplimiento DG</option>
                          <option value="Capacitación"                        style={{ backgroundColor: '#0d1e35' }}>Capacitación</option>
                          <option value="Almacenaje"                          style={{ backgroundColor: '#0d1e35' }}>Almacenaje</option>
                          <option value="Otro / No estoy seguro todavía"      style={{ backgroundColor: '#0d1e35' }}>Otro / No estoy seguro todavía</option>
                        </select>
                      </Field>

                      <Field label="Mensaje">
                        <textarea name="message" rows={4}
                          placeholder="Describe brevemente tu embarque o consulta…"
                          style={{ ...inputStyle, resize: 'none' }}
                          onFocus={focusBorder} onBlur={blurBorder}
                        />
                      </Field>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '2px' }}>
                        <input type="checkbox" required id="contacto-consent"
                          style={{ marginTop: '2px', accentColor: '#3b82f6', flexShrink: 0 }} />
                        <label htmlFor="contacto-consent"
                          style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.55, cursor: 'pointer' }}>
                          Acepto que Global Gate Mexico procese mis datos para responder a esta consulta de acuerdo con las regulaciones de privacidad aplicables.
                        </label>
                      </div>

                      {turnstileSiteKey && (
                        <div ref={turnstileContainerRef} />
                      )}

                      {error && (
                        <p style={{ color: '#f87171', fontSize: '12px', fontWeight: 600 }}>{error}</p>
                      )}

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-full uppercase font-black tracking-widest text-[11px]"
                        style={{ marginTop: '4px', padding: '14px' }}
                        disabled={isLoading || (!!turnstileSiteKey && !turnstileToken)}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Enviando...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Enviar Mensaje <Send size={14} />
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
                    <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60a5fa' }}>
                      Mensaje recibido
                    </p>
                    <h3 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#fff', lineHeight: 1.2 }}>
                      Gracias
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: '320px' }}>
                      Nuestro equipo se pondrá en contacto contigo pronto.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '8px', textAlign: 'left' }}
                    >
                      ← Enviar otro mensaje
                    </button>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Operational Coverage ─────────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div>
                  <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: '8px' }}>
                    Cobertura Operativa
                  </p>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: '8px' }}>
                    Red México y Cross-Border
                  </h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '340px' }}>
                    Nuestros especialistas operan en corredores logísticos clave de México para transporte aéreo, terrestre y marítimo.
                  </p>
                </div>

                {/* Hub cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {HUBS.map((hub, i) => (
                    <div
                      key={hub.city}
                      style={{
                        backgroundColor: i === 0 ? BLUE_FILL : CARD,
                        border:          `1px solid ${i === 0 ? BLUE_DIM : BORDER}`,
                        padding:         '16px 18px',
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
                    Alcance Cross-Border
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      { label: 'Reglamentación DG México', accent: true  },
                      { label: 'USA 49 CFR Awareness',     accent: true  },
                      { label: 'Canada TDG Awareness',     accent: true  },
                      { label: 'IATA DGR',                 accent: false },
                      { label: 'Código IMDG',              accent: false },
                      { label: 'ADR Compliance Knowledge', accent: false },
                    ].map(({ label, accent }) => (
                      <span
                        key={label}
                        style={{
                          fontSize:        '10px',
                          fontWeight:      700,
                          textTransform:   'uppercase',
                          letterSpacing:   '0.08em',
                          padding:         '4px 10px',
                          backgroundColor: accent ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                          border:          accent ? '1px solid rgba(59,130,246,0.22)' : `1px solid ${BORDER}`,
                          color:           accent ? 'rgba(147,197,253,0.85)' : 'rgba(255,255,255,0.35)',
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
              {
                icon:     <MessageSquare size={14} />,
                label:    'WhatsApp',
                value:    '+52 812 165 4040',
                sub:      'Respuesta rápida',
                href:     'https://wa.me/528121654040',
                external: true,
              },
              {
                icon:     <Mail size={14} />,
                label:    'Correo',
                value:    'ggm@globalgatemexico.com',
                sub:      'Respondemos en 24 horas',
                href:     'mailto:ggm@globalgatemexico.com',
                external: false,
              },
              {
                icon:     <Clock size={14} />,
                label:    'Tiempo de respuesta',
                value:    'Dentro de 24 horas',
                sub:      'Días hábiles',
                href:     null,
                external: false,
              },
              {
                icon:     <MapPin size={14} />,
                label:    'Horario de oficina',
                value:    'Lun–Vie: 8:00 AM – 6:00 PM',
                sub:      'Sábado con cita previa',
                href:     null,
                external: false,
              },
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
                  <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)', marginBottom: '3px' }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'block' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                      {item.value}
                    </p>
                  )}
                  {item.sub && (
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>
                      {item.sub}
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
