import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, ArrowRight, Upload, FileText,
  X, Plus, Trash2, AlertTriangle,
} from 'lucide-react';
import { Container } from '../components/UI';
import { supabase } from '../lib/supabase';
import { usePageMeta } from '../hooks/usePageMeta';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset:  (widgetId?: string) => void;
    };
  }
}

// ── Color tokens (same as RequestQuote) ──────────────────────────────────────
const BG          = '#e8eaed';
const HEADER_BG   = '#0d1729';
const CARD        = '#ffffff';
const BORDER      = '#d1d9e0';
const ACCENT      = '#2563eb';
const ACCENT_PALE = '#eff6ff';
const ACCENT_RING = '#bfdbfe';
const TEXT        = '#0f172a';
const TEXT2       = '#475569';
const MUTED       = '#94a3b8';
const INPUT_B     = '#d1d5db';
const LABEL_C     = '#64748b';
const TH_BG       = '#f4f6f9';
const AMBER_BG    = '#fffbeb';
const AMBER_B     = '#fde68a';
const AMBER_TXT   = '#92400e';
const GREEN       = '#16a34a';
const GREEN_BG    = '#f0fdf4';
const GREEN_B     = '#bbf7d0';
const RED         = '#dc2626';
const RED_BG      = '#fef2f2';
const RED_B       = '#fecaca';

// ── Types ─────────────────────────────────────────────────────────────────────
type BillingCountry = '' | 'MX' | 'US' | 'CA';

interface DGEntry {
  id: string;
  unNumber:  string;
  packages:  string;
  psn:       string;
}

const newEntry = (): DGEntry => ({
  id: Math.random().toString(36).slice(2),
  unNumber: '', packages: '1', psn: '',
});

// ── Shared style atoms ────────────────────────────────────────────────────────
const inputSt: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: '13px',
  border: `1px solid ${INPUT_B}`, borderRadius: '4px',
  backgroundColor: '#fff', color: TEXT, outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
};

const labelSt: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 700,
  textTransform: 'uppercase' as const, letterSpacing: '0.1em',
  color: LABEL_C, marginBottom: '5px',
};

const thSt: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'left' as const, fontSize: '9px',
  fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.12em',
  color: MUTED, whiteSpace: 'nowrap' as const, borderBottom: `1px solid ${BORDER}`,
  backgroundColor: TH_BG,
};

const tdSt: React.CSSProperties = {
  padding: '6px 6px', verticalAlign: 'middle' as const,
  borderBottom: `1px solid #edf0f4`,
};

const tableInputSt: React.CSSProperties = {
  width: '100%', padding: '9px 10px', fontSize: '13px',
  border: `1px solid ${INPUT_B}`, borderRadius: '3px',
  backgroundColor: '#fafbfc', color: TEXT, outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
};

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ number, title, badge, children }: {
  number: string; title: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      backgroundColor: CARD, border: `1px solid ${BORDER}`,
      borderRadius: '8px', marginBottom: '14px', overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 24px', borderBottom: `1px solid ${BORDER}`,
        backgroundColor: '#f9fafb',
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '24px', height: '24px', borderRadius: '4px', flexShrink: 0,
          backgroundColor: ACCENT_PALE, border: `1px solid ${ACCENT_RING}`,
          fontSize: '10px', fontWeight: 900, color: ACCENT,
        }}>
          {number}
        </span>
        <h3 style={{
          fontSize: '12px', fontWeight: 800, color: TEXT, margin: 0,
          textTransform: 'uppercase' as const, letterSpacing: '0.1em',
        }}>
          {title}
        </h3>
        {badge && (
          <span style={{
            marginLeft: 'auto', fontSize: '9px', fontWeight: 700,
            textTransform: 'uppercase' as const, letterSpacing: '0.08em',
            color: AMBER_TXT, backgroundColor: AMBER_BG,
            border: `1px solid ${AMBER_B}`, padding: '2px 8px', borderRadius: '3px',
          }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelSt}>
        {label}{required && <span style={{ color: ACCENT, marginLeft: '2px' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Focus/blur helpers ────────────────────────────────────────────────────────
const focusBorder  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = ACCENT);
const blurBorder   = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = INPUT_B);
const focusTableIn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = ACCENT);
const blurTableIn  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = INPUT_B);

// ── Folio generator ───────────────────────────────────────────────────────────
function generateFolio(): string {
  const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return 'PCK-' + Array.from(bytes).map(b => ALPHABET[b % ALPHABET.length]).join('');
}

// ── Normalize UN number ───────────────────────────────────────────────────────
function normalizeUN(raw: string): string {
  const stripped = raw.replace(/^un/i, '').replace(/\D/g, '');
  if (!stripped) return raw.toUpperCase().trim();
  return 'UN' + stripped.padStart(4, '0');
}

// ── File helpers ──────────────────────────────────────────────────────────────
const ACCEPTED_MIME = new Set(['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']);
const ACCEPTED_EXT  = new Set(['.pdf', '.jpg', '.jpeg', '.png']);
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

function isAcceptedFile(f: File): boolean {
  if (ACCEPTED_MIME.has(f.type)) return true;
  const ext = '.' + f.name.split('.').pop()!.toLowerCase();
  return ACCEPTED_EXT.has(ext);
}

function isPdf(f: File): boolean {
  return f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
}

function isImage(f: File): boolean {
  return ['image/jpeg', 'image/jpg', 'image/png'].includes(f.type) ||
    /\.(jpe?g|png)$/i.test(f.name);
}

// ── i18n strings ──────────────────────────────────────────────────────────────
type Lang = 'en' | 'es';

const T = {
  breadcrumb: { en: 'DG Pre-Check', es: 'Revisión Previa DG' },
  heroTitle:  { en: 'DG Shipment Pre-Check', es: 'Revisión Previa de Embarque DG' },
  heroSub:    {
    en: 'Expert review of your dangerous goods air shipment before booking.',
    es: 'Revisión experta de su embarque de mercancías peligrosas aéreo antes de la reserva.',
  },
  price: { en: 'USD 80 + taxes', es: 'USD 80 + impuestos' },
  reqTitle:  { en: 'Requirements', es: 'Requisitos' },
  reqBody:   {
    en: 'You must have a fully completed Dangerous Goods Declaration (DGD) and photographs of the finished, marked, and labeled package. If you need a full shipment solution, see ',
    es: 'Debe contar con una Declaración de Mercancías Peligrosas (DGD) completamente elaborada y fotografías del bulto terminado, marcado y etiquetado. Si necesita una solución de embarque completa, consulte ',
  },
  dgShipmentReviewLink: {
    en: 'DG Shipment Review',
    es: 'DG Shipment Review',
  },
  step1Title:  { en: 'Step 1 — Payment', es: 'Paso 1 — Pago' },
  step2Title:  { en: 'Step 2 — Submit Your Request', es: 'Paso 2 — Envíe su Solicitud' },
  billingCountryLabel: { en: 'Billing Country', es: 'País de facturación' },
  countryMX: { en: 'México', es: 'México' },
  countryUS: { en: 'United States', es: 'Estados Unidos' },
  countryCA: { en: 'Canada', es: 'Canadá' },
  selectCountry: { en: 'Select country…', es: 'Seleccione país…' },
  priceDisplay: {
    MX: { en: 'USD 80 + IVA 16% = USD 92.80', es: 'USD 80 + IVA 16% = USD 92.80' },
    US: { en: 'USD 80.00', es: 'USD 80.00' },
    CA: { en: 'USD 80.00', es: 'USD 80.00' },
  } as Record<string, { en: string; es: string }>,
  payBtn: { en: 'Pay with PayPal', es: 'Pagar con PayPal' },
  payUnavailable: {
    en: 'Payment temporarily unavailable. Please write to ggm@globalgatemexico.com',
    es: 'Pago no disponible temporalmente. Escriba a ggm@globalgatemexico.com',
  },
  afterPayment: {
    en: 'After completing payment, return to this page to submit your documents. You will need your PayPal transaction ID.',
    es: 'Después de completar el pago, regrese a esta página para enviar sus documentos. Necesitará el ID de transacción de PayPal.',
  },
  contactSection: { en: 'Contact Information', es: 'Información de Contacto' },
  nameLabel:    { en: 'Name', es: 'Nombre' },
  companyLabel: { en: 'Company', es: 'Empresa' },
  emailLabel:   { en: 'Email', es: 'Correo electrónico' },
  phoneLabel:   { en: 'Phone / WhatsApp', es: 'Teléfono / WhatsApp' },
  billingLabel: { en: 'Billing Country', es: 'País de facturación' },
  dgEntriesSection: { en: 'DG Entries', es: 'Entradas DG' },
  unLabel:    { en: 'UN Number', es: 'Número ONU' },
  pkgsLabel:  { en: 'Packages', es: 'Bultos' },
  psnLabel:   { en: 'PSN (optional)', es: 'NSP (opcional)' },
  totalBultos: { en: 'Total packages: %d of 5', es: 'Total de bultos: %d de 5' },
  overLimitTitle: { en: 'Over shipment limit', es: 'Límite de envío superado' },
  overLimitMsg: {
    en: 'This service covers up to 5 packages in a single DGD. For larger shipments, please ',
    es: 'Este servicio cubre hasta 5 bultos en una sola DGD. Para embarques mayores, por favor ',
  },
  overLimitLink: { en: 'request a freight quote', es: 'solicite una cotización de flete' },
  overLimitOr:  { en: ' or book a ', es: ' o reserve una ' },
  addEntry: { en: '+ Add UN number', es: '+ Agregar número ONU' },
  txIdSection: { en: 'PayPal Transaction ID', es: 'ID de Transacción PayPal' },
  txIdLabel: {
    en: 'Transaction ID (from PayPal confirmation email)',
    es: 'ID de transacción (del correo de confirmación de PayPal)',
  },
  txIdHint: {
    en: '10–25 uppercase alphanumeric characters',
    es: '10–25 caracteres alfanuméricos en mayúsculas',
  },
  docsSection: { en: 'Documents & Photos', es: 'Documentos y Fotografías' },
  dropZoneText: {
    en: 'Complete DGD (PDF). Minimum 4 photos of the finished package (JPEG or PNG) showing clear and legible marks and labels. Optional: SDS safety data sheets (PDF).',
    es: 'DGD completa (PDF). Mínimo 4 fotografías del bulto terminado (JPEG o PNG) en las que se aprecien bien y sean legibles las marcas y etiquetas. Opcional: fichas de seguridad SDS (PDF).',
  },
  dropZoneCta:  { en: 'Click to browse or drag files here', es: 'Haga clic para explorar o arrastre archivos aquí' },
  fileFormats:  { en: 'PDF, JPEG, PNG — max 20 MB per file', es: 'PDF, JPEG, PNG — máx 20 MB por archivo' },
  photosCount:  { en: 'Photos: %d of 4 minimum', es: 'Fotos: %d de 4 mínimo' },
  fileCountInfo: { en: 'Files: %d of 5–16', es: 'Archivos: %d de 5–16' },
  commentsSection: { en: 'Additional Comments', es: 'Comentarios adicionales' },
  commentsLabel:   { en: 'Comments (optional)', es: 'Comentarios (opcional)' },
  commentsPlaceholder: {
    en: 'Any additional information relevant to your shipment…',
    es: 'Cualquier información adicional relevante para su embarque…',
  },
  termsPrefix: { en: 'I accept the ', es: 'Acepto los ' },
  termsLink:   { en: 'Terms of Service', es: 'Términos de Servicio' },
  termsSuffix: {
    en: ' for this pre-check service.',
    es: ' de este servicio de revisión previa.',
  },
  submitBtn: { en: 'Submit Request', es: 'Enviar Solicitud' },
  submitting: { en: 'Submitting…', es: 'Enviando…' },
  turnstileNote: {
    en: 'Complete the security check to enable submission.',
    es: 'Complete la verificación de seguridad para habilitar el envío.',
  },
  turnstileUnavailable: {
    en: 'Service unavailable. Please write to ggm@globalgatemexico.com',
    es: 'Servicio no disponible. Escriba a ggm@globalgatemexico.com',
  },
  successTitle: {
    en: 'Request received',
    es: 'Solicitud recibida',
  },
  successSub: {
    en: 'Your pre-check request has been submitted successfully.',
    es: 'Su solicitud de revisión previa se ha enviado correctamente.',
  },
  successNext: {
    en: 'What happens next: GGM will verify your payment and documentation. Once verified, the 2-business-hour review clock starts. You will receive your PDF report by email.',
    es: 'Siguientes pasos: GGM verificará su pago y documentación. Una vez verificado, inician 2 horas hábiles para la revisión. Recibirá su reporte PDF por correo.',
  },
  folioLabel: { en: 'Your reference', es: 'Su referencia' },
  submitAnother: { en: '← Submit another request', es: '← Enviar otra solicitud' },
  howItWorksTitle: { en: 'How It Works', es: 'Cómo Funciona' },
  howSteps: {
    en: ['Pay with PayPal', 'Upload DGD and photos', 'We verify and review', 'PDF report to your email'],
    es: ['Pague con PayPal', 'Suba la DGD y fotos', 'Verificamos y revisamos', 'Reporte PDF a su correo'],
  },
  faqTitle: { en: 'Frequently Asked Questions', es: 'Preguntas Frecuentes' },
  faqs: {
    en: [
      {
        q: 'What file formats are accepted?',
        a: 'The DGD and SDS must be PDF. Photos must be JPEG or PNG: minimum 4, clearly showing the marks and labels on the package. Maximum 20 MB per file.',
      },
      {
        q: 'When does the 2-hour review start?',
        a: 'When GGM verifies your payment and the documentation is complete.',
      },
      {
        q: 'What if I need a refund?',
        a: 'If you have not yet submitted documents: request a refund by email to ggm@globalgatemexico.com with your folio and PayPal transaction ID. If documents have already been submitted: no refund is issued. If your shipment exceeds the scope of this service: a credit is applied toward a new freight quote.',
      },
      {
        q: 'Does this service accept Class 7 (radioactive) materials?',
        a: 'No. This service covers IATA dangerous goods in air transport, excluding Class 7 (radioactive) materials.',
      },
      {
        q: 'Can I get a CFDI receipt?',
        a: 'Yes. Our accounting team will contact you after receiving your request to issue the CFDI.',
      },
    ],
    es: [
      {
        q: '¿Qué formatos de archivo se aceptan?',
        a: 'La DGD y las SDS deben ser PDF. Las fotografías deben ser JPEG o PNG: mínimo 4, en las que se aprecien bien y sean legibles las marcas y etiquetas del bulto. Máximo 20 MB por archivo.',
      },
      {
        q: '¿Cuándo empiezan a contar las 2 horas?',
        a: 'Cuando GGM verifica su pago y la documentación está completa.',
      },
      {
        q: '¿Puedo solicitar un reembolso?',
        a: 'Si aún no ha enviado sus documentos: solicite un reembolso por correo a ggm@globalgatemexico.com con su folio y el ID de transacción de PayPal. Si ya envió documentos: no se emite reembolso. Si su embarque supera el alcance de este servicio: se aplica un crédito hacia una nueva cotización de flete.',
      },
      {
        q: '¿Este servicio acepta materiales Clase 7 (radiactivos)?',
        a: 'No. Este servicio cubre mercancías peligrosas IATA en transporte aéreo, excluyendo materiales Clase 7 (radiactivos).',
      },
      {
        q: '¿Puedo obtener CFDI?',
        a: 'Sí. Nuestro equipo de contabilidad se pondrá en contacto con usted para emitir el CFDI.',
      },
    ],
  },
};

function t(key: keyof typeof T, lang: Lang): string {
  const entry = T[key];
  if (typeof entry === 'object' && 'en' in entry && 'es' in entry) {
    return (entry as { en: string; es: string })[lang];
  }
  return '';
}

// ── Main page component ───────────────────────────────────────────────────────
function DGPreCheckInner({ lang }: { lang: Lang }) {

  const isES = lang === 'es';

  usePageMeta({
    title: isES
      ? 'Revisión Previa DG — Global Gate Mexico'
      : 'DG Pre-Check — Global Gate Mexico',
    description: isES
      ? 'Revisión previa de su embarque de mercancías peligrosas aéreo. Envíe su DGD y fotos; reciba su reporte PDF en 2 horas hábiles.'
      : 'Expert pre-check review of your dangerous goods air shipment. Submit your DGD and photos; receive your PDF report in 2 business hours.',
    canonical: isES
      ? 'https://www.globalgatemexico.com/revision-previa-dg'
      : 'https://www.globalgatemexico.com/dg-pre-check',
    hreflang: [
      { lang: 'en', href: 'https://www.globalgatemexico.com/dg-pre-check' },
      { lang: 'es', href: 'https://www.globalgatemexico.com/revision-previa-dg' },
      { lang: 'x-default', href: 'https://www.globalgatemexico.com/dg-pre-check' },
    ],
    lang,
  });

  // ── State ────────────────────────────────────────────────────────────────
  const [billingCountry, setBillingCountry] = useState<BillingCountry>('');

  // Contact
  const [contactName,  setContactName]  = useState('');
  const [companyName,  setCompanyName]  = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [formCountry,  setFormCountry]  = useState<BillingCountry>('');

  // DG entries
  const [entries, setEntries] = useState<DGEntry[]>([newEntry()]);
  const totalPackages = entries.reduce((s, e) => s + (parseInt(e.packages) || 0), 0);

  // TX ID
  const [txId, setTxId] = useState('');

  // Files
  const [files, setFiles]     = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Comments
  const [comments, setComments] = useState('');

  // Terms
  const [accepted, setAccepted] = useState(false);

  // Turnstile
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileSiteKey: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY || undefined;

  // Submission
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [folio] = useState(() => generateFolio());

  // PayPal env vars
  const paypalLinkMX   = import.meta.env.VITE_PAYPAL_PRECHECK_LINK_MX   as string | undefined;
  const paypalLinkIntl = import.meta.env.VITE_PAYPAL_PRECHECK_LINK_INTL as string | undefined;

  // ── Turnstile setup ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileContainerRef.current) return;
    const SCRIPT_ID = 'cf-turnstile-script';
    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey:            turnstileSiteKey,
        theme:              'light',
        callback:           (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback':   () => setTurnstileToken(''),
      });
    };
    if (window.turnstile) {
      renderWidget();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const script    = document.createElement('script');
      script.id       = SCRIPT_ID;
      script.src      = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async    = true;
      script.defer    = true;
      script.onload   = renderWidget;
      script.onerror  = () => console.error('[Turnstile] script failed to load');
      document.head.appendChild(script);
    } else {
      const tid = setInterval(() => { if (window.turnstile) { renderWidget(); clearInterval(tid); } }, 200);
      return () => clearInterval(tid);
    }
    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        try { window.turnstile.remove(turnstileWidgetId.current); } catch { /* noop */ }
        turnstileWidgetId.current = null;
      }
    };
  }, [turnstileSiteKey]);

  // ── DG entry helpers ─────────────────────────────────────────────────────
  const addEntry    = () => setEntries(prev => [...prev, newEntry()]);
  const removeEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));
  const setEntry    = (id: string, f: keyof DGEntry, v: string) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [f]: v } : e));

  // ── File helpers ─────────────────────────────────────────────────────────
  const addFiles = (fs: FileList | null) => {
    if (!fs) return;
    const valid: File[] = [];
    for (const f of Array.from(fs)) {
      if (!isAcceptedFile(f)) {
        setError(`"${f.name}" — tipo de archivo no aceptado. Use PDF, JPEG o PNG.`);
        return;
      }
      if (f.size > MAX_FILE_BYTES) {
        setError(`"${f.name}" supera el límite de 20 MB por archivo.`);
        return;
      }
      valid.push(f);
    }
    setFiles(prev => [...prev, ...valid]);
    setError(null);
  };

  const removeFile  = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));
  const handleDrop  = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const pdfCount   = files.filter(isPdf).length;
  const imageCount = files.filter(isImage).length;

  // ── PayPal link logic ────────────────────────────────────────────────────
  const paypalLink = billingCountry === 'MX' ? paypalLinkMX : paypalLinkIntl;

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!turnstileSiteKey) {
      setError(t('turnstileUnavailable', lang));
      return;
    }
    if (!turnstileToken) {
      setError(isES
        ? 'Complete la verificación de seguridad antes de enviar.'
        : 'Please complete the security check before submitting.');
      return;
    }

    // Client-side file validation
    if (files.length < 5 || files.length > 16) {
      setError(isES
        ? `Debe adjuntar entre 5 y 16 archivos. Tiene: ${files.length}.`
        : `Please attach between 5 and 16 files. Current: ${files.length}.`);
      return;
    }
    if (pdfCount < 1) {
      setError(isES ? 'Debe incluir al menos 1 PDF (DGD).' : 'Please include at least 1 PDF (DGD).');
      return;
    }
    if (imageCount < 4) {
      setError(isES
        ? `Debe incluir al menos 4 fotografías (JPEG/PNG). Tiene: ${imageCount}.`
        : `Please include at least 4 photos (JPEG/PNG). Current: ${imageCount}.`);
      return;
    }

    // Validate TX ID format
    const txTrimmed = txId.trim().toUpperCase();
    if (!/^[A-Z0-9]{10,25}$/.test(txTrimmed)) {
      setError(isES
        ? 'El ID de transacción debe tener entre 10 y 25 caracteres alfanuméricos en mayúsculas.'
        : 'Transaction ID must be 10–25 uppercase alphanumeric characters.');
      return;
    }

    setLoading(true);

    // ── Upload files ─────────────────────────────────────────────────────
    const docPaths: { path: string; name: string; size: number }[] = [];
    for (const file of files) {
      const safeName   = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueName = `${Date.now()}-${safeName}`;
      const path       = `precheck/${folio}/${uniqueName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('quote-documents')
        .upload(path, file);

      if (uploadError) {
        setError(isES
          ? `No se pudo subir "${file.name}": ${uploadError.message}. Revise su conexión.`
          : `Could not upload "${file.name}": ${uploadError.message}. Check your connection.`);
        setLoading(false);
        return;
      }
      docPaths.push({ path: uploadData?.path ?? path, name: file.name, size: file.size });
    }

    const normalizedEntries = entries.map(e => ({
      un_number: normalizeUN(e.unNumber),
      packages:  parseInt(e.packages) || 1,
      psn:       e.psn.trim() || null,
    }));

    const payload = {
      referenceId:          folio,
      language:             lang.toUpperCase(),
      contact_name:         contactName.trim(),
      company_name:         companyName.trim(),
      contact_email:        contactEmail.trim(),
      contact_phone:        contactPhone.trim(),
      billing_country:      formCountry || billingCountry,
      entries:              normalizedEntries,
      num_packages:         totalPackages,
      paypal_transaction_id: txTrimmed,
      comments:             comments.trim() || null,
      document_paths:       docPaths,
      accepted_terms:       true,
      turnstile_token:      turnstileToken,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/precheck-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );
      let data: Record<string, unknown> = {};
      try { data = await res.json(); } catch { /* non-JSON body */ }
      if (res.ok) {
        setSubmitted(true);
      } else {
        const baseMsg = (data?.error as string) || `Error del servidor (${res.status})`;
        const missing = data?.missing as string[] | undefined;
        setError(missing?.length ? `${baseMsg}: ${missing.join(', ')}` : baseMsg);
      }
    } catch {
      setError(isES
        ? 'Error de red — revise su conexión e intente de nuevo.'
        : 'Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ backgroundColor: BG, minHeight: '100vh', paddingTop: '88px' }}>
        <div style={{ paddingTop: '64px', paddingBottom: '80px' }}>
          <Container>
            <div style={{
              maxWidth: '560px', margin: '0 auto',
              backgroundColor: CARD, border: `1px solid ${BORDER}`,
              borderRadius: '10px', padding: '48px 40px', textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 20px',
                backgroundColor: GREEN_BG, border: `2px solid ${GREEN_B}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle2 size={26} color={GREEN} />
              </div>
              <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px' }}>
                {t('successTitle', lang)}
              </p>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: TEXT,
                letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.2 }}>
                {t('successSub', lang)}
              </h2>
              <p style={{ fontSize: '13px', color: TEXT2, lineHeight: 1.65,
                maxWidth: '420px', margin: '0 auto 24px' }}>
                {t('successNext', lang)}
              </p>
              <div style={{
                backgroundColor: TH_BG, border: `1px solid ${BORDER}`,
                borderRadius: '6px', padding: '12px 20px', marginBottom: '28px',
                display: 'inline-block',
              }}>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.15em', color: MUTED, marginBottom: '3px' }}>
                  {t('folioLabel', lang)}
                </p>
                <p style={{ fontSize: '13px', fontWeight: 800, color: TEXT,
                  fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                  {folio}
                </p>
              </div>
              <br />
              <button
                onClick={() => window.location.reload()}
                style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: ACCENT, background: 'none',
                  border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {t('submitAnother', lang)}
              </button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  // ── Page render ──────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: HEADER_BG, paddingTop: '88px' }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '36px 0 32px' }}>
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '16px', fontSize: '10px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>
              <span>Global Gate Mexico</span>
              <ArrowRight size={10} />
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{t('breadcrumb', lang)}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800,
              color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '10px' }}>
              {t('heroTitle', lang)}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px',
              maxWidth: '560px', lineHeight: 1.65 }}>
              {t('heroSub', lang)}
            </p>
            <div style={{ marginTop: '16px' }}>
              <span style={{
                display: 'inline-block', fontSize: '22px', fontWeight: 900, color: '#fff',
                letterSpacing: '-0.02em',
              }}>
                {t('price', lang)}
              </span>
            </div>
          </Container>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '32px 0 80px' }}>
        <Container>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>

            {/* ── Requirements note ───────────────────────────────────── */}
            <div style={{
              backgroundColor: AMBER_BG, border: `1px solid ${AMBER_B}`,
              borderRadius: '8px', padding: '16px 20px', marginBottom: '24px',
            }}>
              <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: AMBER_TXT, marginBottom: '6px' }}>
                {t('reqTitle', lang)}
              </p>
              <p style={{ fontSize: '13px', color: AMBER_TXT, lineHeight: 1.6, margin: 0 }}>
                {t('reqBody', lang)}
                <a href="https://bookings.globalgatemexico.com/services/dg-shipment-review-1-hr"
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: AMBER_TXT, fontWeight: 700, textDecoration: 'underline' }}>
                  {t('dgShipmentReviewLink', lang)}
                </a>
                {'.'}
              </p>
            </div>

            {/* ══════════════════════════════════════════════════════════
                STEP 1 — PAYMENT
            ══════════════════════════════════════════════════════════ */}
            <SectionCard number="01" title={t('step1Title', lang)}>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>

                <Field label={t('billingCountryLabel', lang)} required>
                  <select
                    value={billingCountry}
                    onChange={e => setBillingCountry(e.target.value as BillingCountry)}
                    style={inputSt}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  >
                    <option value="">{t('selectCountry', lang)}</option>
                    <option value="MX">{t('countryMX', lang)}</option>
                    <option value="US">{t('countryUS', lang)}</option>
                    <option value="CA">{t('countryCA', lang)}</option>
                  </select>
                </Field>

                {billingCountry && (
                  <div style={{
                    backgroundColor: ACCENT_PALE, border: `1px solid ${ACCENT_RING}`,
                    borderRadius: '6px', padding: '12px 16px',
                  }}>
                    <p style={{ fontSize: '12px', color: TEXT2, margin: '0 0 4px' }}>
                      {isES ? 'Monto a pagar:' : 'Amount due:'}
                    </p>
                    <p style={{ fontSize: '18px', fontWeight: 900, color: TEXT, margin: 0 }}>
                      {T.priceDisplay[billingCountry][lang]}
                    </p>
                  </div>
                )}

                {billingCountry ? (
                  paypalLink ? (
                    <a
                      href={paypalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        backgroundColor: '#0070ba', color: '#fff',
                        padding: '12px 24px', borderRadius: '6px',
                        fontSize: '14px', fontWeight: 700, textDecoration: 'none',
                        border: 'none', cursor: 'pointer', alignSelf: 'flex-start',
                      }}
                    >
                      {t('payBtn', lang)}
                    </a>
                  ) : (
                    <p style={{
                      fontSize: '13px', color: RED,
                      backgroundColor: RED_BG, border: `1px solid ${RED_B}`,
                      borderRadius: '6px', padding: '12px 16px', margin: 0,
                    }}>
                      {t('payUnavailable', lang)}
                    </p>
                  )
                ) : null}

                <p style={{ fontSize: '12px', color: TEXT2, lineHeight: 1.6, margin: 0 }}>
                  {t('afterPayment', lang)}
                </p>
              </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════
                STEP 2 — SUBMISSION FORM
            ══════════════════════════════════════════════════════════ */}
            <form onSubmit={handleSubmit}>

              <SectionCard number="02" title={t('step2Title', lang)}>
                <p style={{ fontSize: '12px', color: TEXT2, marginBottom: '20px', marginTop: '-6px' }}>
                  {isES
                    ? 'Llene este formulario después de completar su pago.'
                    : 'Fill in this form after completing your payment.'}
                </p>

                {/* Contact */}
                <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.12em', color: MUTED, marginBottom: '12px' }}>
                  {t('contactSection', lang)}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px', marginBottom: '24px' }}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label={t('nameLabel', lang)} required>
                      <input value={contactName} onChange={e => setContactName(e.target.value)}
                        placeholder={isES ? 'ej. María García' : 'e.g. María García'}
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                    </Field>
                    <Field label={t('companyLabel', lang)} required>
                      <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                        placeholder={isES ? 'ej. Acme Industries S.A. de C.V.' : 'e.g. Acme Industries S.A. de C.V.'}
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                    </Field>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label={t('emailLabel', lang)} required>
                      <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                        placeholder={isES ? 'ej. maria@empresa.com' : 'e.g. maria@company.com'}
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                    </Field>
                    <Field label={t('phoneLabel', lang)} required>
                      <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                        placeholder={isES ? 'ej. +52 81 1234 5678' : 'e.g. +52 81 1234 5678'}
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                    </Field>
                  </div>
                  <div style={{ maxWidth: '300px' }}>
                    <Field label={t('billingLabel', lang)} required>
                      <select
                        value={formCountry || billingCountry}
                        onChange={e => setFormCountry(e.target.value as BillingCountry)}
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder}
                      >
                        <option value="">{t('selectCountry', lang)}</option>
                        <option value="MX">{t('countryMX', lang)}</option>
                        <option value="US">{t('countryUS', lang)}</option>
                        <option value="CA">{t('countryCA', lang)}</option>
                      </select>
                    </Field>
                  </div>
                </div>

                {/* DG Entries */}
                <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.12em', color: MUTED, marginBottom: '12px' }}>
                  {t('dgEntriesSection', lang)}
                </p>

                {/* Total packages counter */}
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontSize: '12px', fontWeight: 700,
                    color: totalPackages > 5 ? RED : totalPackages === 5 ? GREEN : TEXT2,
                  }}>
                    {t('totalBultos', lang).replace('%d', String(totalPackages))}
                  </span>
                  {totalPackages > 5 && (
                    <span style={{ fontSize: '11px', color: RED }}>
                      <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {isES ? 'Límite superado' : 'Limit exceeded'}
                    </span>
                  )}
                </div>

                {/* Over limit warning */}
                {totalPackages > 5 && (
                  <div style={{
                    backgroundColor: RED_BG, border: `1px solid ${RED_B}`,
                    borderRadius: '6px', padding: '12px 16px', marginBottom: '16px',
                  }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: RED, marginBottom: '4px' }}>
                      {t('overLimitTitle', lang)}
                    </p>
                    <p style={{ fontSize: '12px', color: RED, margin: 0, lineHeight: 1.6 }}>
                      {t('overLimitMsg', lang)}
                      <Link
                        to={isES ? '/solicitar-cotizacion' : '/request-quote'}
                        style={{ color: RED, fontWeight: 700 }}
                      >
                        {t('overLimitLink', lang)}
                      </Link>
                      {t('overLimitOr', lang)}
                      <a
                        href="https://bookings.globalgatemexico.com/services/dg-shipment-review-1-hr"
                        target="_blank" rel="noopener noreferrer"
                        style={{ color: RED, fontWeight: 700 }}
                      >
                        {t('dgShipmentReviewLink', lang)}
                      </a>
                      {'.'}
                    </p>
                  </div>
                )}

                {/* Entries table */}
                <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th style={{ ...thSt, width: '160px' }}>{t('unLabel', lang)} *</th>
                        <th style={{ ...thSt, width: '100px' }}>{t('pkgsLabel', lang)} *</th>
                        <th style={thSt}>{t('psnLabel', lang)}</th>
                        <th style={{ ...thSt, width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map(entry => (
                        <tr key={entry.id}>
                          <td style={tdSt}>
                            <input
                              value={entry.unNumber}
                              onChange={e => setEntry(entry.id, 'unNumber', e.target.value)}
                              onBlur={e => {
                                blurTableIn(e as React.FocusEvent<HTMLInputElement>);
                                if (entry.unNumber.trim()) {
                                  setEntry(entry.id, 'unNumber', normalizeUN(entry.unNumber));
                                }
                              }}
                              onFocus={focusTableIn}
                              placeholder="UN3480"
                              style={tableInputSt}
                            />
                          </td>
                          <td style={tdSt}>
                            <select
                              value={entry.packages}
                              onChange={e => setEntry(entry.id, 'packages', e.target.value)}
                              onFocus={focusTableIn}
                              onBlur={blurTableIn}
                              style={{ ...tableInputSt, width: '80px' }}
                            >
                              {[1,2,3,4,5].map(n => (
                                <option key={n} value={String(n)}
                                  disabled={totalPackages - (parseInt(entry.packages) || 0) + n > 5}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td style={tdSt}>
                            <input
                              value={entry.psn}
                              onChange={e => setEntry(entry.id, 'psn', e.target.value)}
                              onFocus={focusTableIn}
                              onBlur={blurTableIn}
                              placeholder={isES ? 'Nombre de embarque propio' : 'Proper shipping name'}
                              style={tableInputSt}
                            />
                          </td>
                          <td style={tdSt}>
                            {entries.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEntry(entry.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer',
                                  color: MUTED, padding: '4px', display: 'flex' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {entries.length < 5 && totalPackages < 5 && (
                  <button
                    type="button"
                    onClick={addEntry}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '12px', fontWeight: 700, color: ACCENT,
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      marginBottom: '24px',
                    }}
                  >
                    <Plus size={14} />
                    {t('addEntry', lang)}
                  </button>
                )}
                {(entries.length >= 5 || totalPackages >= 5) && (
                  <div style={{ marginBottom: '24px' }} />
                )}

              </SectionCard>

              {/* TX ID */}
              <SectionCard number="03" title={t('txIdSection', lang)}>
                <Field label={t('txIdLabel', lang)} required>
                  <input
                    value={txId}
                    onChange={e => setTxId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    placeholder="XXXXXXXXXX"
                    maxLength={25}
                    style={inputSt}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </Field>
                <p style={{ fontSize: '11px', color: MUTED, marginTop: '6px' }}>
                  {t('txIdHint', lang)}
                </p>
              </SectionCard>

              {/* Documents */}
              <SectionCard number="04" title={t('docsSection', lang)}>
                <p style={{ fontSize: '12px', color: TEXT2, lineHeight: 1.6, marginBottom: '16px', marginTop: '-6px' }}>
                  {t('dropZoneText', lang)}
                </p>

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragging ? ACCENT : BORDER}`,
                    borderRadius: '8px', padding: '32px 24px', textAlign: 'center',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                    backgroundColor: dragging ? ACCENT_PALE : '#fafbfc',
                    marginBottom: '16px',
                  }}
                >
                  <Upload size={28} color={MUTED} style={{ margin: '0 auto 10px', display: 'block' }} />
                  <p style={{ fontSize: '13px', fontWeight: 600, color: TEXT2, margin: '0 0 4px' }}>
                    {t('dropZoneCta', lang)}
                  </p>
                  <p style={{ fontSize: '11px', color: MUTED, margin: 0 }}>
                    {t('fileFormats', lang)}
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
                  />
                </div>

                {/* Counters */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: imageCount >= 4 ? GREEN : TEXT2, fontWeight: 600 }}>
                    {t('photosCount', lang).replace('%d', String(imageCount))}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: files.length >= 5 && files.length <= 16 ? GREEN : files.length > 16 ? RED : TEXT2,
                    fontWeight: 600,
                  }}>
                    {t('fileCountInfo', lang).replace('%d', String(files.length))}
                  </span>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                    {files.map((f, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', backgroundColor: TH_BG,
                        border: `1px solid ${BORDER}`, borderRadius: '5px',
                      }}>
                        <FileText size={14} color={isPdf(f) ? ACCENT : GREEN} />
                        <span style={{ fontSize: '12px', color: TEXT, flex: 1,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.name}
                        </span>
                        <span style={{ fontSize: '11px', color: MUTED, whiteSpace: 'nowrap' }}>
                          {(f.size / 1024).toFixed(0)} KB
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer',
                            color: MUTED, padding: '2px', display: 'flex' }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Comments */}
              <SectionCard number="05" title={t('commentsSection', lang)}>
                <Field label={t('commentsLabel', lang)}>
                  <textarea
                    value={comments}
                    onChange={e => setComments(e.target.value.slice(0, 1000))}
                    placeholder={t('commentsPlaceholder', lang)}
                    rows={4}
                    style={{ ...inputSt, resize: 'vertical', minHeight: '80px' }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </Field>
                <p style={{ fontSize: '11px', color: MUTED, marginTop: '4px' }}>
                  {comments.length}/1000
                </p>
              </SectionCard>

              {/* Terms + Turnstile + Submit */}
              <div style={{
                backgroundColor: CARD, border: `1px solid ${BORDER}`,
                borderRadius: '8px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>

                {/* Terms checkbox */}
                <label style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  cursor: 'pointer', marginBottom: '20px',
                }}>
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={e => setAccepted(e.target.checked)}
                    style={{ marginTop: '2px', accentColor: ACCENT, width: '15px', height: '15px', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '12px', color: TEXT2, lineHeight: 1.6 }}>
                    {t('termsPrefix', lang)}
                    <Link
                      to={isES ? '/terminos-de-servicio' : '/terms-of-service'}
                      target="_blank"
                      style={{ color: ACCENT, fontWeight: 700 }}
                    >
                      {t('termsLink', lang)}
                    </Link>
                    {t('termsSuffix', lang)}
                  </span>
                </label>

                {/* Turnstile */}
                {turnstileSiteKey ? (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '11px', color: TEXT2, marginBottom: '8px' }}>
                      {t('turnstileNote', lang)}
                    </p>
                    <div ref={turnstileContainerRef} />
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: RED_BG, border: `1px solid ${RED_B}`,
                    borderRadius: '6px', padding: '12px 16px', marginBottom: '20px',
                  }}>
                    <p style={{ fontSize: '12px', color: RED, margin: 0 }}>
                      {t('turnstileUnavailable', lang)}
                    </p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{
                    backgroundColor: RED_BG, border: `1px solid ${RED_B}`,
                    borderRadius: '6px', padding: '12px 16px', marginBottom: '16px',
                  }}>
                    <p style={{ fontSize: '12px', color: RED, margin: 0 }}>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !accepted ||
                    !turnstileSiteKey ||
                    (!!turnstileSiteKey && !turnstileToken) ||
                    totalPackages > 5
                  }
                  style={{
                    width: '100%', padding: '14px', fontSize: '13px', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    backgroundColor: loading ? MUTED : ACCENT, color: '#fff',
                    border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.15s',
                    opacity: (!accepted || (!!turnstileSiteKey && !turnstileToken) || totalPackages > 5) ? 0.6 : 1,
                  }}
                >
                  {loading ? t('submitting', lang) : t('submitBtn', lang)}
                </button>
              </div>
            </form>

            {/* ── How it works ─────────────────────────────────────────── */}
            <div style={{ marginTop: '48px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.12em', color: MUTED, marginBottom: '20px', textAlign: 'center' }}>
                {t('howItWorksTitle', lang)}
              </h2>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {T.howSteps[lang].map((step, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    backgroundColor: CARD, border: `1px solid ${BORDER}`,
                    borderRadius: '8px', padding: '14px 18px', flex: '1 1 180px', maxWidth: '220px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: ACCENT_PALE, color: ACCENT, fontSize: '11px', fontWeight: 900,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: TEXT }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── FAQ ──────────────────────────────────────────────────── */}
            <div style={{ marginTop: '48px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase',
                letterSpacing: '0.12em', color: MUTED, marginBottom: '20px', textAlign: 'center' }}>
                {t('faqTitle', lang)}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {T.faqs[lang].map((faq, i) => (
                  <details key={i} style={{
                    backgroundColor: CARD, border: `1px solid ${BORDER}`,
                    borderRadius: '8px', overflow: 'hidden',
                  }}>
                    <summary style={{
                      padding: '14px 20px', fontSize: '13px', fontWeight: 700,
                      color: TEXT, cursor: 'pointer', userSelect: 'none',
                      listStyle: 'none', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      {faq.q}
                    </summary>
                    <div style={{
                      padding: '0 20px 16px', fontSize: '13px', color: TEXT2, lineHeight: 1.6,
                    }}>
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────
export function DGPreCheckPage()       { return <DGPreCheckInner lang="en" />; }
export function RevisionPreviaDGPage() { return <DGPreCheckInner lang="es" />; }
