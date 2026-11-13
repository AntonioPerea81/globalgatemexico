import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Upload, FileText, Camera, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Container } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { isClass7Excluded } from '../lib/class7';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

// ── Constants ──────────────────────────────────────────────────────────────
const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL?.replace('.supabase.co', '.supabase.co/functions/v1') ?? '';
const ANON_KEY               = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const TURNSTILE_SITE_KEY: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY || undefined;

const HAZARD_CLASSES = [
  'Class 1 — Explosives',
  'Class 2 — Gases',
  'Class 3 — Flammable Liquids',
  'Class 4 — Flammable Solids',
  'Class 5 — Oxidizers / Org. Peroxides',
  'Class 6 — Toxic / Infectious',
  'Class 7 — Radioactive',
  'Class 8 — Corrosives',
  'Class 9 — Miscellaneous',
];

// ── Shared styles ──────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', background: '#fff', border: '1px solid #d1d5db',
  padding: '10px 14px', fontSize: '14px', outline: 'none', borderRadius: '3px',
  color: '#111827', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 800,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'rgba(0,0,0,0.5)', marginBottom: '6px',
};
const fieldStyle: React.CSSProperties = { marginBottom: '16px' };

// ── DG entry row type ──────────────────────────────────────────────────────
type DGEntry = { un_number: string; hazard_class: string; proper_shipping_name: string };

function emptyEntry(): DGEntry { return { un_number: '', hazard_class: '', proper_shipping_name: '' }; }

// ── FAQ accordion ──────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #e5e7eb' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', paddingRight: '16px' }}>{q}</span>
        <ChevronDown size={16} color="#6b7280" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, paddingBottom: '16px' }}>{a}</div>
      )}
    </div>
  );
}

// ── Main page component ────────────────────────────────────────────────────
function DGPreCheckContent({ lang }: { lang: 'EN' | 'ES' }) {
  const EN = lang === 'EN';

  const [formStep,        setFormStep]        = useState(1);
  const [buyerName,       setBuyerName]       = useState('');
  const [companyName,     setCompanyName]     = useState('');
  const [buyerEmail,      setBuyerEmail]      = useState('');
  const [buyerPhone,      setBuyerPhone]      = useState('');
  const [billingCountry,  setBillingCountry]  = useState('MX');
  const [numPackages,     setNumPackages]     = useState('');
  const [entries,         setEntries]         = useState<DGEntry[]>([emptyEntry()]);
  const [acceptedTerms,   setAcceptedTerms]   = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [formError,       setFormError]       = useState('');
  const [turnstileToken,  setTurnstileToken]  = useState('');

  const formRef              = useRef<HTMLDivElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId    = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (formStep !== 2 || !TURNSTILE_SITE_KEY) return;
    const SCRIPT_ID = 'cf-turnstile-script';
    const mount = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return;
      if (turnstileWidgetId.current) {
        try { window.turnstile.remove(turnstileWidgetId.current); } catch { /* noop */ }
        turnstileWidgetId.current = undefined;
      }
      turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey:            TURNSTILE_SITE_KEY,
        theme:              'light',
        callback:           (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
      });
    };
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id    = SCRIPT_ID;
      script.src   = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = mount;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      mount();
    }
    return () => {
      if (window.turnstile && turnstileWidgetId.current) {
        try { window.turnstile.remove(turnstileWidgetId.current); } catch { /* noop */ }
        turnstileWidgetId.current = undefined;
      }
    };
  }, [formStep]);

  const isMX         = billingCountry === 'MX';
  const displayTax   = isMX ? 80 * 0.16 : 0;
  const displayTotal = 80 + displayTax;

  // Check if any entry has Class 7 or excluded UN
  const class7Entry = entries.find(e => e.un_number && e.hazard_class && isClass7Excluded(e.un_number, e.hazard_class));
  const exceedsLimit = Number(numPackages) > 5 || entries.length > 5;

  function scrollToForm() { formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function handleStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError('');
    if (!buyerName || !companyName || !buyerEmail || !numPackages) { setFormError(EN ? 'Please fill all required fields.' : 'Complete todos los campos requeridos.'); return; }
    setFormStep(2);
  }

  function updateEntry(idx: number, field: keyof DGEntry, value: string) {
    setEntries(prev => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  }

  function addEntry() {
    if (entries.length >= 5) return;
    setEntries(prev => [...prev, emptyEntry()]);
  }

  function removeEntry(idx: number) {
    setEntries(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleStep2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError('');

    if (class7Entry) { setFormError(EN ? 'Class 7 materials are not covered by this service.' : 'Los materiales Clase 7 no están cubiertos por este servicio.'); return; }
    if (exceedsLimit) { setFormError(EN ? 'Maximum 5 packages and 5 DG entries.' : 'Máximo 5 bultos y 5 entradas DG.'); return; }
    if (!acceptedTerms) { setFormError(EN ? 'You must accept the terms to continue.' : 'Debe aceptar los términos para continuar.'); return; }
    if (TURNSTILE_SITE_KEY && !turnstileToken) { setFormError(EN ? 'Please complete the security check.' : 'Complete la verificación de seguridad.'); return; }

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (!e.un_number || !e.hazard_class) { setFormError(EN ? `Entry ${i + 1}: UN number and hazard class are required.` : `Entrada ${i + 1}: número UN y clase de peligro son obligatorios.`); return; }
      const unNorm = e.un_number.trim().toUpperCase().replace(/^UN/, '');
      if (!/^\d{4}$/.test(unNorm)) { setFormError(EN ? `Entry ${i + 1}: invalid UN number (expected format: UN####).` : `Entrada ${i + 1}: número UN inválido (formato esperado: UN####).`); return; }
    }

    setIsLoading(true);
    try {
      const payload = {
        buyer_name:      buyerName,
        company_name:    companyName,
        buyer_email:     buyerEmail,
        buyer_phone:     buyerPhone || undefined,
        billing_country: billingCountry,
        num_packages:    Number(numPackages),
        entries:         entries.map(e => ({
          un_number:            e.un_number.trim(),
          hazard_class:         e.hazard_class,
          proper_shipping_name: e.proper_shipping_name.trim() || undefined,
        })),
        accepted_terms:  true,
        turnstileToken:  turnstileToken || undefined,
      };

      const res  = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-precheck-order`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'CLASS7_EXCLUDED') { setFormError(EN ? 'Class 7 materials are not covered by this service.' : 'Los materiales Clase 7 no están cubiertos por este servicio.'); return; }
        if (data.code === 'EXCEEDS_LIMITS')  { setFormError(EN ? 'Your shipment exceeds the limits of this service (max 5 packages, 5 DG entries).' : 'Su embarque supera los límites del servicio (máx. 5 bultos, 5 entradas DG).'); return; }
        throw new Error(data.error ?? 'Error desconocido');
      }
      window.location.href = data.approveUrl;
    } catch (err) {
      setFormError(err instanceof Error ? err.message : (EN ? 'Error processing request. Please try again.' : 'Error al procesar. Intente de nuevo.'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div style={{ background: '#060e1c', paddingTop: '106px', paddingBottom: '56px', position: 'relative', borderBottom: '2px solid #2563eb' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '36px 36px' }} />
        <Container className="relative">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '10px', color: 'rgba(96,165,250,0.8)', textTransform: 'uppercase', letterSpacing: '0.26em', fontWeight: 800, margin: 0 }}>
              {EN ? 'Air Freight · DG Compliance · Digital Service' : 'Carga Aérea · Cumplimiento DG · Servicio Digital'}
            </p>
            <span style={{ background: '#2563eb', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              USD {displayTotal.toFixed(2)}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: '16px', maxWidth: '640px' }}>
            {EN ? 'Verify Before You Ship' : 'Verifica Antes de Embarcar'}
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '28px' }}>
            {EN
              ? 'Your DGD reviewed by certified DG professionals before it reaches the airline — in 2 business hours or less.'
              : 'Su DGD revisada por especialistas certificados en mercancías peligrosas antes de llegar a la aerolínea, en 2 horas hábiles o menos.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={scrollToForm} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '14px 28px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
              {EN ? 'Submit Your DGD for Review' : 'Enviar DGD para Revisión'} →
            </button>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{EN ? 'Mon–Fri 9:00–17:00 CDMX' : 'Lun–Vie 9:00–17:00 CDMX'}</span>
          </div>
          <div style={{ marginTop: '28px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {(EN
              ? ['1 DGD per request', 'Max 5 packages · 5 DG entries', 'Mexico · USA · Canada', 'No airline acceptance guarantee']
              : ['1 DGD por solicitud', 'Máx. 5 bultos · 5 entradas DG', 'México · EE.UU. · Canadá', 'Sin garantía de aceptación aerolínea']
            ).map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 800 }}>✓</span>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb', padding: '56px 0' }}>
        <Container>
          <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#2563eb', textAlign: 'center', marginBottom: '14px' }}>
            {EN ? 'How it works' : 'Cómo funciona'}
          </p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, color: '#111827', marginBottom: '40px', letterSpacing: '-0.01em' }}>
            {EN ? 'Four steps. No surprises.' : 'Cuatro pasos. Sin sorpresas.'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {(EN ? [
              { n: '01', title: 'Pay online', desc: 'USD 80 + taxes via PayPal. Secure checkout.' },
              { n: '02', title: 'Upload documents', desc: 'Your DGD (PDF), Safety Data Sheets (optional), and at least one shipment photo.' },
              { n: '03', title: 'Expert review', desc: 'Our certified DG team analyzes your DGD against IATA DGR requirements.' },
              { n: '04', title: 'Receive your report', desc: 'PDF report delivered to your email within 2 business hours.' },
            ] : [
              { n: '01', title: 'Paga en línea', desc: 'USD 80 + impuestos vía PayPal. Proceso seguro.' },
              { n: '02', title: 'Carga documentos', desc: 'Su DGD (PDF), Fichas de Datos de Seguridad (opcionales) y al menos una fotografía del embarque.' },
              { n: '03', title: 'Revisión experta', desc: 'Nuestro equipo de especialistas DG analiza su DGD contra los requisitos IATA DGR.' },
              { n: '04', title: 'Reciba su reporte', desc: 'Reporte en PDF entregado a su correo en 2 horas hábiles o menos.' },
            ]).map(({ n, title, desc }) => (
              <div key={n} style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '24px' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb' }}>{n}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── What we review ────────────────────────────────────────────── */}
      <div style={{ padding: '64px 0', background: '#fff' }}>
        <Container>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', maxWidth: '840px', margin: '0 auto' }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', marginBottom: '20px' }}>
                {EN ? 'What we review' : 'Qué revisamos'}
              </p>
              {(EN ? [
                'Dangerous Goods Declaration (DGD) completeness and accuracy',
                'UN number, proper shipping name, packing group',
                'Quantity limits per IATA DGR for passenger and cargo aircraft',
                'Labeling, marking, and packaging requirements',
                'State/country variations and operator variations',
                'Overall IATA DGR compliance of the submitted DGD',
              ] : [
                'Completitud y exactitud de la Declaración de Mercancías Peligrosas (DGD)',
                'Número ONU, nombre de embarque apropiado, grupo de embalaje',
                'Límites de cantidad por IATA DGR para aeronaves de pasajeros y cargueros',
                'Requisitos de etiquetado, marcado y embalaje',
                'Variaciones de estado/país y variaciones de operador',
                'Cumplimiento general IATA DGR del DGD presentado',
              ]).map(item => (
                <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <CheckCircle size={15} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ef4444', marginBottom: '20px' }}>
                {EN ? 'Not included' : 'No incluido'}
              </p>
              {(EN ? [
                'Class 7 radioactive materials (contact us for separate quote)',
                'More than 5 packages or more than 5 DG entries (special quote required)',
                'Physical inspection of packages or cargo',
                'Airline acceptance guarantee',
                'Corrections or additional advisory services (quoted separately)',
                'Non-air transport modes (ocean, ground)',
              ] : [
                'Materiales radiactivos Clase 7 (contáctenos para cotización separada)',
                'Más de 5 bultos o más de 5 entradas DG (requiere cotización especial)',
                'Inspección física de los paquetes o la carga',
                'Garantía de aceptación por la aerolínea',
                'Correcciones o servicios adicionales de asesoría (cotizan por separado)',
                'Modos de transporte no aéreos (marítimo, terrestre)',
              ]).map(item => (
                <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ color: '#ef4444', fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✕</span>
                  <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <div style={{ background: '#060e1c', padding: '64px 0' }}>
        <Container>
          <div style={{ maxWidth: '480px', margin: '0 auto', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: 'rgba(96,165,250,0.7)', textTransform: 'uppercase', letterSpacing: '0.26em', fontWeight: 800, marginBottom: '8px' }}>
              {EN ? 'Service fee' : 'Tarifa del servicio'}
            </p>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '52px', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>$80</span>
              <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.4)', marginLeft: '4px' }}>USD</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '28px' }}>
              {EN ? '+ applicable taxes (IVA 16% for Mexican entities)' : '+ impuestos aplicables (IVA 16% para entidades mexicanas)'}
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', marginBottom: '28px' }}>
              {(EN ? [
                '1 DGD per request', 'Max 5 packages AND 5 DG entries',
                'Air freight only — MX, US, CA', 'Report in ≤ 2 business hours', 'Mon–Fri 9:00–17:00 CDMX',
              ] : [
                '1 DGD por solicitud', 'Máx. 5 bultos Y 5 entradas DG',
                'Sólo transporte aéreo — MX, EE.UU., CAN', 'Reporte en ≤ 2 horas hábiles', 'Lun–Vie 9:00–17:00 hora CDMX',
              ]).map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#60a5fa', fontSize: '11px' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={scrollToForm} style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '14px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
              {EN ? 'Start Your Review →' : 'Iniciar Revisión →'}
            </button>
          </div>
        </Container>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <div style={{ padding: '64px 0', background: '#f8fafc' }}>
        <Container>
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, color: '#111827', marginBottom: '40px', textAlign: 'center' }}>
            {EN ? 'Frequently asked questions' : 'Preguntas frecuentes'}
          </h2>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {(EN ? [
              {
                q: 'Does this service guarantee my shipment will be accepted by the airline?',
                a: 'No. This service reviews your DGD against IATA DGR requirements and identifies potential issues. The final acceptance decision is made by the airline. GGM is not liable for acceptance or rejection by any carrier.',
              },
              {
                q: 'What if my shipment exceeds the 5-package or 5-DG-entry limit?',
                a: (<>Please request a special quote via our{' '}<Link to="/request-quote" style={{ color: '#2563eb' }}>Request Quote form</Link>. If you have already paid for this service and your shipment exceeds the limits, the amount paid will be credited toward your special-quote invoice.</>),
              },
              {
                q: 'Is Class 7 (radioactive) cargo covered?',
                a: 'No. Class 7 materials require separate regulatory authorization and specialized handling. Please contact us directly for a Class 7 logistics quote.',
              },
              {
                q: 'When do the 2 hours start counting?',
                a: 'The 2-business-hour clock starts once payment is confirmed AND all required documents (DGD + at least one photo) have been successfully uploaded. Payment alone does not start the clock.',
              },
              {
                q: 'Can I get a refund if I cancel before uploading documents?',
                a: 'Yes. If you have paid but not yet uploaded your DGD and photos, you may request a full refund by contacting ggm@globalgatemexico.com with your reference number.',
              },
              {
                q: 'What file formats are accepted?',
                a: 'DGD and Safety Data Sheets (SDS) must be PDF. Photos can be JPG, PNG, or WebP. Maximum file size is 20 MB per file.',
              },
            ] : [
              {
                q: '¿Este servicio garantiza que mi embarque será aceptado por la aerolínea?',
                a: 'No. Este servicio revisa su DGD contra los requisitos IATA DGR e identifica posibles inconsistencias. La decisión de aceptación final la toma la aerolínea. GGM no es responsable de la aceptación o el rechazo por parte de ningún transportista.',
              },
              {
                q: '¿Qué pasa si mi embarque supera el límite de 5 bultos o 5 entradas DG?',
                a: (<>Solicite una cotización especial a través de nuestro{' '}<Link to="/solicitar-cotizacion" style={{ color: '#2563eb' }}>formulario de cotización</Link>. Si ya pagó por este servicio y su embarque supera los límites, el importe pagado se acreditará en la factura de su cotización especial.</>),
              },
              {
                q: '¿El servicio cubre carga Clase 7 (radiactiva)?',
                a: 'No. Los materiales Clase 7 requieren autorización regulatoria separada y manejo especializado. Contáctenos directamente para una cotización de logística Clase 7.',
              },
              {
                q: '¿Cuándo comienzan a contar las 2 horas?',
                a: 'El contador de 2 horas hábiles comienza una vez que el pago es confirmado Y todos los documentos requeridos (DGD + al menos una fotografía) han sido cargados exitosamente. El pago por sí solo no inicia el contador.',
              },
              {
                q: '¿Puedo obtener un reembolso si cancelo antes de cargar documentos?',
                a: 'Sí. Si ha pagado pero aún no ha cargado su DGD y fotos, puede solicitar un reembolso completo contactando a ggm@globalgatemexico.com con su número de folio.',
              },
              {
                q: '¿Qué formatos de archivo se aceptan?',
                a: 'El DGD y las Fichas de Datos de Seguridad (FDS/SDS) deben ser PDF. Las fotos pueden ser JPG, PNG o WebP. El tamaño máximo por archivo es 20 MB.',
              },
            ]).map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </Container>
      </div>

      {/* ── Checkout form ─────────────────────────────────────────────── */}
      <div ref={formRef} style={{ padding: '64px 0 80px', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
        <Container>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <p style={{ fontSize: '10px', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '8px' }}>
              {EN ? 'Submit your DGD for review' : 'Enviar DGD para revisión'}
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '-0.01em' }}>
              {EN ? 'Start your Pre-Check' : 'Iniciar su Pre-Check'}
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px', lineHeight: 1.6 }}>
              {EN
                ? 'Complete the form below. After payment, you will upload your DGD and shipment documents.'
                : 'Complete el formulario. Después del pago, cargará su DGD y los documentos del embarque.'}
            </p>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ flex: 1, height: '3px', background: i <= formStep ? '#2563eb' : '#e5e7eb', borderRadius: '2px', transition: 'background 0.3s' }} />
              ))}
            </div>

            {/* STEP 1: Contact + billing + packages */}
            {formStep === 1 && (
              <form onSubmit={handleStep1}>
                <p style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', marginBottom: '20px' }}>
                  {EN ? 'Step 1 of 2 — Contact & billing' : 'Paso 1 de 2 — Contacto y facturación'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{EN ? 'Full name *' : 'Nombre completo *'}</label>
                    <input required style={inputStyle} placeholder={EN ? 'Jane Smith' : 'Juan Pérez'} value={buyerName} onChange={e => setBuyerName(e.target.value)} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{EN ? 'Company *' : 'Empresa *'}</label>
                    <input required style={inputStyle} placeholder={EN ? 'Acme Chemicals Inc.' : 'Química del Norte SA'} value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{EN ? 'Email *' : 'Correo electrónico *'}</label>
                    <input type="email" required style={inputStyle} placeholder="jane@acme.com" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{EN ? 'Phone' : 'Teléfono'}</label>
                    <input type="tel" style={inputStyle} placeholder="+52 55 1234 5678" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{EN ? 'Billing country *' : 'País de facturación *'}</label>
                    <select required style={inputStyle} value={billingCountry} onChange={e => setBillingCountry(e.target.value)}>
                      <option value="MX">México</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>{EN ? 'Number of packages *' : 'Número de bultos *'}</label>
                    <select required style={inputStyle} value={numPackages} onChange={e => setNumPackages(e.target.value)}>
                      <option value="" disabled>{EN ? 'Select…' : 'Seleccionar…'}</option>
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                      {EN ? 'Max 5 — need more?' : 'Máx. 5 — ¿necesita más?'}{' '}
                      <Link to={EN ? '/request-quote' : '/solicitar-cotizacion'} style={{ color: '#2563eb' }}>
                        {EN ? 'Request a quote.' : 'Solicite cotización.'}
                      </Link>
                    </p>
                  </div>
                </div>
                {formError && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{formError}</p>}
                <button type="submit" style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '14px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
                  {EN ? 'Continue →' : 'Continuar →'}
                </button>
              </form>
            )}

            {/* STEP 2: DG entries + terms + pay */}
            {formStep === 2 && (
              <form onSubmit={handleStep2}>
                <p style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', marginBottom: '20px' }}>
                  {EN ? 'Step 2 of 2 — DG entries & payment' : 'Paso 2 de 2 — Entradas DG y pago'}
                </p>

                {/* DG entries table */}
                <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(0,0,0,0.5)', marginBottom: '10px' }}>
                  {EN ? 'Dangerous goods entries' : 'Entradas de mercancías peligrosas'}
                </p>
                {entries.map((entry, idx) => (
                  <div key={idx} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '3px', padding: '14px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#6b7280' }}>
                        {EN ? `Entry ${idx + 1}` : `Entrada ${idx + 1}`}
                      </span>
                      {entries.length > 1 && (
                        <button type="button" onClick={() => removeEntry(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0 12px' }}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>{EN ? 'UN number *' : 'Número UN *'}</label>
                        <input
                          required
                          style={{ ...inputStyle, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
                          placeholder="UN1234"
                          value={entry.un_number}
                          onChange={e => updateEntry(idx, 'un_number', e.target.value)}
                          maxLength={6}
                        />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>{EN ? 'Hazard class *' : 'Clase de peligro *'}</label>
                        <select
                          required
                          style={inputStyle}
                          value={entry.hazard_class}
                          onChange={e => updateEntry(idx, 'hazard_class', e.target.value)}
                        >
                          <option value="" disabled>{EN ? 'Select…' : 'Seleccionar…'}</option>
                          {HAZARD_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>{EN ? 'Proper shipping name (optional)' : 'Nombre de embarque apropiado (opcional)'}</label>
                      <input
                        style={inputStyle}
                        placeholder={EN ? 'e.g. Flammable liquid, n.o.s.' : 'ej. Líquido inflamable, n.e.p.'}
                        value={entry.proper_shipping_name}
                        onChange={e => updateEntry(idx, 'proper_shipping_name', e.target.value)}
                      />
                    </div>
                    {/* Per-entry Class 7 alert */}
                    {entry.un_number && entry.hazard_class && isClass7Excluded(entry.un_number, entry.hazard_class) && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderLeft: '3px solid #ef4444', padding: '10px 12px', marginTop: '10px', borderRadius: '2px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '12px', color: '#7f1d1d', margin: 0 }}>
                          {EN ? 'Class 7 materials are not covered. ' : 'Los materiales Clase 7 no están cubiertos. '}
                          <Link to={EN ? '/contact' : '/contacto'} style={{ color: '#2563eb' }}>{EN ? 'Contact us' : 'Contáctenos'}</Link>
                          {EN ? ' for a separate quote.' : ' para cotización separada.'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {entries.length < 5 && (
                  <button
                    type="button"
                    onClick={addEntry}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px dashed #d1d5db', padding: '8px 14px', fontSize: '12px', fontWeight: 700, color: '#2563eb', cursor: 'pointer', borderRadius: '3px', marginBottom: '20px' }}
                  >
                    <Plus size={14} />
                    {EN ? 'Add entry' : 'Agregar entrada'}
                  </button>
                )}
                {entries.length >= 5 && (
                  <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '20px' }}>
                    {EN ? 'Maximum of 5 DG entries reached. Need more? ' : 'Se alcanzó el máximo de 5 entradas DG. ¿Necesita más? '}
                    <Link to={EN ? '/request-quote' : '/solicitar-cotizacion'} style={{ color: '#2563eb' }}>
                      {EN ? 'Request a special quote.' : 'Solicite cotización especial.'}
                    </Link>
                  </p>
                )}

                {/* Terms checkbox */}
                <div style={{ background: acceptedTerms ? '#f0fdf4' : '#f9fafb', border: `1px solid ${acceptedTerms ? '#86efac' : '#e5e7eb'}`, padding: '14px', marginBottom: '16px', borderRadius: '3px', transition: 'all 0.2s' }}>
                  <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      style={{ marginTop: '3px', flexShrink: 0, accentColor: '#2563eb', width: '15px', height: '15px' }}
                      checked={acceptedTerms}
                      onChange={e => setAcceptedTerms(e.target.checked)}
                    />
                    <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                      {EN
                        ? <>I confirm this shipment is for <strong>air transport only</strong>, contains no Class 7 radioactive materials, and covers a maximum of 5 packages and 5 DG entries. I understand this service has scope limitations and does not guarantee airline acceptance. I accept the{' '}<Link to="/terms-of-service" style={{ color: '#2563eb' }}>Terms of Service</Link>.</>
                        : <>Confirmo que este embarque es <strong>exclusivamente para transporte aéreo</strong>, no contiene materiales radiactivos Clase 7, y comprende un máximo de 5 bultos y 5 entradas DG. Entiendo las limitaciones de alcance del servicio y que no garantiza la aceptación de la aerolínea. Acepto los{' '}<Link to="/terminos-de-servicio" style={{ color: '#2563eb' }}>Términos del Servicio</Link>.</>
                      }
                    </span>
                  </label>
                </div>

                {/* Turnstile */}
                {TURNSTILE_SITE_KEY && (
                  <div style={{ marginBottom: '16px' }}>
                    <div ref={turnstileContainerRef} />
                  </div>
                )}

                {/* Price summary */}
                <div style={{ background: '#f4f6f9', border: '1px solid #e5e7eb', padding: '14px', marginBottom: '20px', borderRadius: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                    <span>{EN ? 'Service fee' : 'Tarifa del servicio'}</span>
                    <span>USD 80.00</span>
                  </div>
                  {displayTax > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                      <span>IVA 16%</span>
                      <span>USD {displayTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#111827', borderTop: '1px solid #d1d5db', paddingTop: '8px', marginTop: '8px' }}>
                    <span>Total</span>
                    <span>USD {displayTotal.toFixed(2)}</span>
                  </div>
                </div>

                {formError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderLeft: '3px solid #ef4444', padding: '12px 14px', marginBottom: '14px', borderRadius: '3px' }}>
                    <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0 }}>{formError}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => { setFormStep(1); setFormError(''); }} style={{ background: 'none', border: '1px solid #d1d5db', padding: '14px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px', color: '#6b7280' }}>
                    ← {EN ? 'Back' : 'Atrás'}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !!class7Entry || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
                    style={{ flex: 1, background: (isLoading || !!class7Entry || (!!TURNSTILE_SITE_KEY && !turnstileToken)) ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', padding: '14px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: (isLoading || !!class7Entry || (!!TURNSTILE_SITE_KEY && !turnstileToken)) ? 'not-allowed' : 'pointer', borderRadius: '2px' }}
                  >
                    {isLoading ? (EN ? 'Processing…' : 'Procesando…') : (EN ? `Pay USD ${displayTotal.toFixed(2)} via PayPal →` : `Pagar USD ${displayTotal.toFixed(2)} vía PayPal →`)}
                  </button>
                </div>
              </form>
            )}

            <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '20px' }}>
              🔒 {EN ? 'Secure payment via PayPal. GGM never stores your card details.' : 'Pago seguro vía PayPal. GGM no almacena sus datos de tarjeta.'}
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}

// ── Post-payment: file upload page ─────────────────────────────────────────
function DGPreCheckCompleteContent({ lang }: { lang: 'EN' | 'ES' }) {
  const [searchParams] = useSearchParams();
  const sessionToken   = searchParams.get('session') ?? '';
  const ppToken        = searchParams.get('token') ?? '';

  const [phase,     setPhase]     = useState<'capturing' | 'upload' | 'uploading' | 'done' | 'error'>('capturing');
  const [orderId,   setOrderId]   = useState('');
  const [reference, setReference] = useState('');
  const [errMsg,    setErrMsg]    = useState('');

  const [dgdFile,       setDgdFile]       = useState<File | null>(null);
  const [sdsFiles,      setSdsFiles]      = useState<(File | null)[]>([null, null, null, null, null]);
  const [photoFiles,    setPhotoFiles]    = useState<File[]>([]);
  const [uploadPct,     setUploadPct]     = useState(0);

  const EN = lang === 'EN';

  const fnBase = import.meta.env.VITE_SUPABASE_URL?.replace('.supabase.co', '.supabase.co/functions/v1') ?? '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

  useEffect(() => {
    if (!sessionToken) { setPhase('error'); setErrMsg(EN ? 'Missing session. Please return to the payment page.' : 'Sesión no encontrada. Regrese a la página de pago.'); return; }

    fetch(`${fnBase}/capture-precheck-order`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', apikey: anonKey },
      body:    JSON.stringify({ sessionToken, paypalOrderId: ppToken }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setOrderId(data.orderId);
        setReference(data.reference);
        setPhase('upload');
      })
      .catch(err => { setPhase('error'); setErrMsg(err.message); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!dgdFile) return;
    if (photoFiles.length === 0) { setErrMsg(EN ? 'Please add at least one shipment photo.' : 'Agregue al menos una fotografía del embarque.'); return; }
    setPhase('uploading');
    setUploadPct(0);
    setErrMsg('');

    try {
      const activeSds = sdsFiles.map((f, i) => f ? { name: `sds_${i + 1}`, file: f } : null).filter((x): x is { name: string; file: File } => x !== null);

      const fieldNames = [
        'dgd',
        ...activeSds.map(s => s.name),
        ...photoFiles.map((_, i) => `photo_${i + 1}`),
      ];

      const urlsRes = await fetch(`${fnBase}/create-precheck-upload-urls`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', apikey: anonKey },
        body:    JSON.stringify({ sessionToken, fields: fieldNames }),
      });
      const urlsData = await urlsRes.json();
      if (!urlsRes.ok) throw new Error(urlsData.error ?? 'No se pudieron obtener URLs de carga');

      const signedUrls: Record<string, { signedUrl: string; path: string }> = urlsData.urls;

      const allFiles: Array<{ fieldName: string; file: File }> = [
        { fieldName: 'dgd', file: dgdFile },
        ...activeSds.map(s => ({ fieldName: s.name, file: s.file })),
        ...photoFiles.map((f, i) => ({ fieldName: `photo_${i + 1}`, file: f })),
      ];
      const total = allFiles.length;
      let done = 0;
      const uploadedFiles: Array<{ fieldName: string; filePath: string; fileName: string; fileSize: number; mimeType: string }> = [];

      for (const { fieldName, file } of allFiles) {
        const entry = signedUrls[fieldName];
        if (!entry) throw new Error(`No URL for field: ${fieldName}`);
        const putRes = await fetch(entry.signedUrl, {
          method:  'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body:    file,
        });
        if (!putRes.ok) throw new Error(`Upload failed for ${fieldName}: ${putRes.status}`);
        uploadedFiles.push({ fieldName, filePath: entry.path, fileName: file.name, fileSize: file.size, mimeType: file.type });
        done++;
        setUploadPct(Math.round((done / total) * 80));
      }

      setUploadPct(85);
      const notifyRes = await fetch(`${fnBase}/notify-precheck`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', apikey: anonKey },
        body:    JSON.stringify({ orderId, sessionToken, files: uploadedFiles }),
      });
      const notifyData = await notifyRes.json();
      if (!notifyRes.ok) throw new Error(notifyData.error ?? 'Error al notificar');

      setUploadPct(100);
      setPhase('done');
    } catch (err) {
      setPhase('error');
      setErrMsg(err instanceof Error ? err.message : (EN ? 'Error uploading files. Please try again.' : 'Error al cargar archivos. Intente de nuevo.'));
    }
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: '100px' }}>
      <Container>
        <div style={{ maxWidth: '560px', margin: '0 auto', paddingBottom: '80px' }}>

          {phase === 'capturing' && (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <div style={{ width: '48px', height: '48px', border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{EN ? 'Confirming your payment…' : 'Confirmando su pago…'}</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {phase === 'upload' && (
            <>
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderLeft: '3px solid #22c55e', padding: '16px', marginBottom: '32px', borderRadius: '3px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle size={18} color="#16a34a" />
                <div>
                  <p style={{ fontWeight: 800, color: '#166534', fontSize: '14px', margin: '0 0 2px' }}>{EN ? 'Payment confirmed' : 'Pago confirmado'}</p>
                  <p style={{ fontSize: '12px', color: '#166534', margin: 0 }}>{EN ? 'Reference:' : 'Folio:'} <strong>{reference}</strong></p>
                </div>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                {EN ? 'Upload your documents' : 'Carga sus documentos'}
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.6 }}>
                {EN
                  ? 'Upload your DGD (required), Safety Data Sheets (optional, up to 5), and at least one shipment photo (required).'
                  : 'Cargue su DGD (obligatorio), Fichas de Datos de Seguridad (opcionales, hasta 5), y al menos una fotografía del embarque (obligatorio).'}
              </p>

              {errMsg && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderLeft: '3px solid #ef4444', padding: '12px 14px', marginBottom: '16px', borderRadius: '3px' }}>
                  <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0 }}>{errMsg}</p>
                </div>
              )}

              <form onSubmit={handleUpload}>
                {/* DGD */}
                <div style={fieldStyle}>
                  <label style={{ ...labelStyle, color: '#111827' }}>
                    {EN ? 'Dangerous Goods Declaration — DGD (PDF, required)' : 'Declaración de Mercancías Peligrosas — DGD (PDF, obligatorio)'}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '2px dashed', borderColor: dgdFile ? '#2563eb' : '#d1d5db', padding: '16px', cursor: 'pointer', borderRadius: '3px', background: dgdFile ? '#eff6ff' : '#f9fafb' }}>
                    <input type="file" accept=".pdf,application/pdf" required style={{ display: 'none' }} onChange={e => setDgdFile(e.target.files?.[0] ?? null)} />
                    <FileText size={20} color={dgdFile ? '#2563eb' : '#9ca3af'} />
                    <span style={{ fontSize: '13px', color: dgdFile ? '#1e40af' : '#6b7280' }}>
                      {dgdFile ? dgdFile.name : (EN ? 'Click to select PDF…' : 'Haga clic para seleccionar PDF…')}
                    </span>
                  </label>
                </div>

                {/* SDS files */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ ...labelStyle, color: '#111827' }}>
                    {EN ? 'Safety Data Sheets — SDS (PDF, optional, up to 5)' : 'Fichas de Datos de Seguridad — FDS/SDS (PDF, opcionales, hasta 5)'}
                  </p>
                  {sdsFiles.map((f, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px dashed', borderColor: f ? '#2563eb' : '#d1d5db', padding: '10px 14px', cursor: 'pointer', borderRadius: '3px', background: f ? '#eff6ff' : '#f9fafb' }}>
                        <input type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
                          onChange={e => { const files = [...sdsFiles]; files[i] = e.target.files?.[0] ?? null; setSdsFiles(files); }} />
                        <FileText size={16} color={f ? '#2563eb' : '#9ca3af'} />
                        <span style={{ fontSize: '12px', color: f ? '#1e40af' : '#9ca3af' }}>
                          {f ? f.name : `SDS ${i + 1} — ${EN ? 'optional' : 'opcional'}`}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Photos */}
                <div style={fieldStyle}>
                  <label style={{ ...labelStyle, color: '#111827' }}>
                    {EN ? 'Shipment photos (JPG/PNG/WebP, at least 1 required, up to 5)' : 'Fotos del embarque (JPG/PNG/WebP, mínimo 1 obligatoria, hasta 5)'}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '2px dashed', borderColor: photoFiles.length > 0 ? '#2563eb' : '#d1d5db', padding: '16px', cursor: 'pointer', borderRadius: '3px', background: photoFiles.length > 0 ? '#eff6ff' : '#f9fafb' }}>
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple style={{ display: 'none' }}
                      onChange={e => { const files = Array.from(e.target.files ?? []).slice(0, 5); setPhotoFiles(files); }} />
                    <Camera size={20} color={photoFiles.length > 0 ? '#2563eb' : '#9ca3af'} />
                    <span style={{ fontSize: '13px', color: photoFiles.length > 0 ? '#1e40af' : '#6b7280' }}>
                      {photoFiles.length > 0
                        ? `${photoFiles.length} ${EN ? 'photo(s) selected' : 'foto(s) seleccionada(s)'}`
                        : (EN ? 'Click to select photos…' : 'Haga clic para seleccionar fotos…')}
                    </span>
                  </label>
                  <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>
                    {EN ? 'Packages, labels, marks, and packaging in clearly lit conditions.' : 'Bultos, etiquetas, marcas y embalaje en condiciones de buena iluminación.'}
                  </p>
                </div>

                <button type="submit" style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '14px', fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Upload size={15} />
                  {EN ? 'Send documents & start review →' : 'Enviar documentos e iniciar revisión →'}
                </button>
              </form>
            </>
          )}

          {phase === 'uploading' && (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#2563eb', width: `${uploadPct}%`, transition: 'width 0.3s' }} />
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '10px' }}>
                  {EN ? `Uploading… ${uploadPct}%` : `Cargando… ${uploadPct}%`}
                </p>
              </div>
            </div>
          )}

          {phase === 'done' && (
            <div style={{ textAlign: 'center', paddingTop: '20px' }}>
              <div style={{ width: '64px', height: '64px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={32} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                {EN ? 'Documents received' : 'Documentos recibidos'}
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '400px', margin: '0 auto 8px', lineHeight: 1.6 }}>
                {EN
                  ? `Your review is underway (reference: ${reference}). Our team will email you the report within 2 business hours.`
                  : `Su revisión está en curso (folio: ${reference}). Nuestro equipo le enviará el reporte por correo en 2 horas hábiles.`}
              </p>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '28px' }}>
                {EN ? 'Mon–Fri 9:00–17:00 CDMX' : 'Lun–Vie 9:00–17:00 hora CDMX'}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', maxWidth: '380px', margin: '0 auto 24px', lineHeight: 1.6, fontStyle: 'italic' }}>
                {EN
                  ? 'Note: an invoice will be issued by our accounting team and sent to your email once payment is processed.'
                  : 'Nota: nuestra área de contabilidad emitirá y enviará la factura a su correo una vez procesado el pago.'}
              </p>
              <Link to="/" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 24px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', borderRadius: '2px' }}>
                {EN ? 'Return home' : 'Volver al inicio'}
              </Link>
            </div>
          )}

          {phase === 'error' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderLeft: '3px solid #ef4444', padding: '20px', borderRadius: '3px', textAlign: 'center' }}>
              <AlertTriangle size={24} color="#ef4444" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>{EN ? 'An error occurred' : 'Ocurrió un error'}</h3>
              <p style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '16px' }}>{errMsg}</p>
              <p style={{ fontSize: '13px', color: '#7f1d1d' }}>
                {EN
                  ? 'Please email us at ggm@globalgatemexico.com with your reference number and we will assist you.'
                  : 'Por favor contáctenos a ggm@globalgatemexico.com con su folio y le asistiremos.'}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

// ── Exported page components ───────────────────────────────────────────────

export function DGPreCheckPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('EN'); }, []);
  usePageMeta({
    title: 'DG Pre-Check — Verify Before You Ship | Global Gate México',
    description: 'Get your Dangerous Goods Declaration reviewed by certified DG professionals before it reaches the airline. USD 80 flat fee. Report in 2 business hours.',
    canonical: 'https://www.globalgatemexico.com/dg-pre-check',
    lang: 'en',
    hreflang: [
      { lang: 'en', href: 'https://www.globalgatemexico.com/dg-pre-check' },
      { lang: 'es', href: 'https://www.globalgatemexico.com/revision-previa-dg' },
      { lang: 'x-default', href: 'https://www.globalgatemexico.com/dg-pre-check' },
    ],
  });
  return <DGPreCheckContent lang="EN" />;
}

export function RevisionPreviaDGPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'DG Pre-Check — Verifica Antes de Embarcar | Global Gate México',
    description: 'Revisión de su Declaración de Mercancías Peligrosas por especialistas certificados antes de llegar a la aerolínea. USD 80. Reporte en 2 horas hábiles.',
    canonical: 'https://www.globalgatemexico.com/revision-previa-dg',
    lang: 'es',
    hreflang: [
      { lang: 'en', href: 'https://www.globalgatemexico.com/dg-pre-check' },
      { lang: 'es', href: 'https://www.globalgatemexico.com/revision-previa-dg' },
      { lang: 'x-default', href: 'https://www.globalgatemexico.com/dg-pre-check' },
    ],
  });
  return <DGPreCheckContent lang="ES" />;
}

export function DGPreCheckCompletePage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('EN'); }, []);
  usePageMeta({ title: 'Upload Documents — DG Pre-Check | Global Gate México', canonical: 'https://www.globalgatemexico.com/dg-pre-check/complete', lang: 'en' });
  return <DGPreCheckCompleteContent lang="EN" />;
}

export function RevisionPreviaDGCompletePage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({ title: 'Cargar Documentos — DG Pre-Check | Global Gate México', canonical: 'https://www.globalgatemexico.com/revision-previa-dg/completo', lang: 'es' });
  return <DGPreCheckCompleteContent lang="ES" />;
}
