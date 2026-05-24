import { useState, useRef, useCallback } from 'react';
import {
  Plane, Anchor, Truck, Plus, Trash2,
  Upload, FileText, X, Package, AlertTriangle,
  HelpCircle, CheckCircle2, ArrowRight, ChevronDown, Box,
} from 'lucide-react';
import { Container } from '../components/UI';
import { supabase } from '../lib/supabase';

// ── Color tokens (identical to EN version) ───────────────────────────────────
const BG          = '#e8eaed';
const HEADER_BG   = '#0d1729';
const CARD        = '#ffffff';
const BORDER      = '#d1d9e0';
const BORDER_DARK = '#b8c4cf';
const ACCENT      = '#2563eb';
const ACCENT_PALE = '#eff6ff';
const ACCENT_RING = '#bfdbfe';
const ACCENT_DIM  = '#f0f6ff';
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

// ── Types ─────────────────────────────────────────────────────────────────────
type TransportMode = '' | 'air' | 'sea' | 'ground';
type CargoClass    = '' | 'general' | 'dg' | 'not_sure';

interface PkgLine {
  id:          string;
  pieces:      string;
  packageType: string;
  length:      string;
  width:       string;
  height:      string;
  weight:      string;
}

const newPkg = (): PkgLine => ({
  id: Math.random().toString(36).slice(2),
  pieces: '1', packageType: 'Caja',
  length: '', width: '', height: '', weight: '',
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
function SectionCard({
  number, title, badge, children,
}: {
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
function Field({
  label, required, children,
}: {
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

// ── Main page component ───────────────────────────────────────────────────────
export const SolicitarCotizacionPage = () => {

  const [expanded, setExpanded]   = useState(false);
  const [mode, setMode]           = useState<TransportMode>('');
  const [hoverMode, setHoverMode] = useState<TransportMode | null>(null);

  const [oCountry, setOCountry]   = useState('');
  const [oCity, setOCity]         = useState('');
  const [oTerm, setOTerm]         = useState('');
  const [oZip, setOZip]           = useState('');
  const [dCountry, setDCountry]   = useState('');
  const [dCity, setDCity]         = useState('');
  const [dTerm, setDTerm]         = useState('');
  const [dZip, setDZip]           = useState('');

  const [commodity, setCommodity]   = useState('');
  const [hsCode, setHsCode]         = useState('');
  const [cargoClass, setCargoClass] = useState<CargoClass>('');

  const [quickCount, setQuickCount]   = useState('');
  const [quickWeight, setQuickWeight] = useState('');

  const [packages, setPackages] = useState<PkgLine[]>([newPkg()]);

  // Datos de empresa y contacto
  const [companyName, setCompanyName]         = useState('');
  const [contactName, setContactName]         = useState('');
  const [contactEmail, setContactEmail]       = useState('');
  const [contactPhone, setContactPhone]       = useState('');
  const [contactCountry, setContactCountry]   = useState('');
  const [contactDept, setContactDept]         = useState('');
  const [contactPosition, setContactPosition] = useState('');

  // Transporte marítimo
  const [seaType, setSeaType]             = useState<'lcl' | 'fcl' | ''>('');
  const [containerType, setContainerType] = useState('');
  const [containerQty, setContainerQty]   = useState('');
  const [socCoc, setSocCoc]               = useState('');
  const [dgContainer, setDgContainer]     = useState(false);

  const [unNum, setUnNum]       = useState('');
  const [psn, setPsn]           = useState('');
  const [hazClass, setHazClass] = useState('');
  const [pkgGroup, setPkgGroup] = useState('');
  const [pkgType, setPkgType]   = useState('');

  const [files, setFiles]       = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef                 = useRef<HTMLInputElement>(null);

  const [comments, setComments] = useState('');

  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [refId]                   = useState(() => 'GGM-' + Date.now().toString(36).toUpperCase().slice(-6));

  const showDG = cargoClass === 'dg';

  const totalWeight = packages.reduce((s, p) =>
    s + (parseFloat(p.weight) || 0) * (parseInt(p.pieces) || 0), 0);
  const totalVol = packages.reduce((s, p) => {
    const l = parseFloat(p.length) || 0;
    const w = parseFloat(p.width)  || 0;
    const h = parseFloat(p.height) || 0;
    return s + (l * w * h / 1_000_000) * (parseInt(p.pieces) || 0);
  }, 0);

  const addPkg    = () => setPackages(prev => [...prev, newPkg()]);
  const removePkg = (id: string) => setPackages(prev => prev.filter(p => p.id !== id));
  const setPkg    = (id: string, f: keyof PkgLine, v: string) =>
    setPackages(prev => prev.map(p => p.id === id ? { ...p, [f]: v } : p));

  const addFiles = (fs: FileList | null) => {
    if (!fs) return;
    setFiles(prev => [...prev, ...Array.from(fs)]);
  };
  const removeFile  = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));
  const handleDrop  = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // Submit — upload docs then call edge function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // ── Transporte terrestre: requerir códigos postales ───────────────────────
    if (mode === 'ground') {
      const zipMissing: string[] = [];
      if (!oZip.trim()) zipMissing.push('CP / Código Postal de Origen');
      if (!dZip.trim()) zipMissing.push('CP / Código Postal de Destino');
      if (zipMissing.length > 0) {
        setError(`Por favor complete los campos requeridos: ${zipMissing.join(', ')}`);
        setLoading(false);
        return;
      }
    }

    // Upload files to Supabase Storage
    const docPaths: { path: string; name: string; size: number }[] = [];
    console.log('[cotizacion] Archivos en estado:', files.length, files.map(f => f.name));
    console.log('[cotizacion] Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('[cotizacion] Referencia:', refId);

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueName = `${Date.now()}-${safeName}`;
      const path = `quote-requests/${refId}/${uniqueName}`;
      console.log('[cotizacion] Subiendo:', file.name, '→ bucket: quote-documents, path:', path, '| tamaño:', file.size);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('quote-documents')
        .upload(path, file);

      if (uploadError) {
        console.error('[cotizacion] Upload FALLIDO:', file.name, '| error:', uploadError.message, '| detalles:', JSON.stringify(uploadError));
        setError(`No se pudo cargar "${file.name}": ${uploadError.message}. Por favor verifica tu conexión e inténtalo de nuevo.`);
        setLoading(false);
        return; // bloquear envío — no continuar con document_paths vacío
      }

      console.log('[cotizacion] Upload OK:', uploadData?.path ?? path);
      docPaths.push({ path, name: file.name, size: file.size });
    }

    console.log('[cotizacion] Todas las cargas completadas. document_paths a enviar:', JSON.stringify(docPaths));

    const payload = {
      referenceId: refId,
      language: 'es',
      company_name: companyName,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      contact_country: contactCountry,
      contact_department: contactDept || null,
      contact_position: contactPosition || null,
      transport_mode: mode,
      origin_country: oCountry,
      origin_city: oCity,
      origin_terminal: oTerm,
      origin_postal_code: mode === 'ground' ? oZip : null,
      destination_country: dCountry,
      destination_city: dCity,
      destination_terminal: dTerm,
      destination_postal_code: mode === 'ground' ? dZip : null,
      commodity,
      hs_code: hsCode,
      cargo_class: cargoClass,
      quick_count: quickCount ? parseInt(quickCount) : null,
      quick_weight: quickWeight ? parseFloat(quickWeight) : null,
      sea_shipment_type: mode === 'sea' ? seaType : null,
      container_type: mode === 'sea' && seaType === 'fcl' ? containerType : null,
      container_qty: mode === 'sea' && seaType === 'fcl' ? (containerQty ? parseInt(containerQty) : null) : null,
      soc_coc: mode === 'sea' && seaType === 'fcl' ? socCoc : null,
      dg_container: mode === 'sea' && seaType === 'fcl' ? dgContainer : null,
      packages: expanded && !(mode === 'sea' && seaType === 'fcl') ? packages : [],
      un_number: showDG ? unNum : null,
      proper_shipping_name: showDG ? psn : null,
      hazard_class: showDG ? hazClass : null,
      packing_group: showDG ? pkgGroup : null,
      packaging_type: showDG ? pkgType : null,
      document_paths: docPaths,
      comments: expanded ? comments : '',
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/freight-quote-request`,
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
      console.log('[freight-quote-request] status:', res.status, 'body:', data);
      if (res.ok) {
        setSubmitted(true);
      } else {
        const baseMsg = (data?.error as string) || `Error del servidor (${res.status})`;
        const missing = data?.missing as string[] | undefined;
        setError(missing?.length ? `${baseMsg}: ${missing.join(', ')}` : baseMsg);
      }
    } catch {
      setError('Error de red — por favor verifica tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const expandRef = useRef<HTMLDivElement>(null);
  const handleExpand = () => {
    const opening = !expanded;
    setExpanded(prev => !prev);
    if (opening) {
      setTimeout(() => expandRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
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
                Solicitud de Cotización Recibida
              </p>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: TEXT,
                letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.2 }}>
                Hemos recibido los detalles de su embarque
              </h2>
              <p style={{ fontSize: '13px', color: TEXT2, lineHeight: 1.65,
                maxWidth: '380px', margin: '0 auto 24px' }}>
                Nuestros especialistas logísticos revisarán los requerimientos operativos
                y se comunicarán con usted en un día hábil.
              </p>
              <div style={{
                backgroundColor: TH_BG, border: `1px solid ${BORDER}`,
                borderRadius: '6px', padding: '12px 20px', marginBottom: '28px',
                display: 'inline-block',
              }}>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.15em', color: MUTED, marginBottom: '3px' }}>Referencia</p>
                <p style={{ fontSize: '13px', fontWeight: 800, color: TEXT,
                  fontFamily: 'monospace', letterSpacing: '0.05em' }}>{refId}</p>
              </div>
              <br />
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: ACCENT, background: 'none',
                  border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                ← Enviar Otra Solicitud de Cotización
              </button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  // ── Page render ────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* ── Header band ───────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: HEADER_BG, paddingTop: '88px' }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '36px 0 32px' }}>
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '16px', fontSize: '10px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>
              <span>Global Gate México</span>
              <ArrowRight size={10} />
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>Cotización</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800,
              color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '10px' }}>
              Solicitar Cotización de Flete
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px',
              maxWidth: '600px', lineHeight: 1.65 }}>
              Comparta la información de su embarque y nuestro equipo logístico revisará
              los requerimientos operativos antes de emitir la cotización.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
              marginTop: '20px', flexWrap: 'wrap' }}>
              {['IATA Certified', 'IMDG', 'ADR', 'CNSNS', 'Logística Clase 7'].map(t => (
                <span key={t} style={{
                  fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: 'rgba(255,255,255,0.32)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '3px 9px', borderRadius: '3px',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </Container>
        </div>
      </div>

      {/* ── Form body ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '32px 0 80px' }}>
        <Container>
          <form onSubmit={handleSubmit} style={{ maxWidth: '860px', margin: '0 auto' }}>

            {/* ── 01 Empresa y Datos de Contacto ──────────────────────── */}
            <SectionCard number="01" title="Empresa y Datos de Contacto">
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '18px' }}>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Empresa" required>
                    <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                      placeholder="Ej. Industrias Acme S.A. de C.V."
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                  <Field label="Nombre del Contacto" required>
                    <input value={contactName} onChange={e => setContactName(e.target.value)}
                      placeholder="Ej. María García"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Correo Electrónico" required>
                    <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                      placeholder="Ej. maria@industriasacme.com"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                  <Field label="Teléfono / WhatsApp" required>
                    <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                      placeholder="Ej. +52 81 1234 5678"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Field label="País" required>
                    <input value={contactCountry} onChange={e => setContactCountry(e.target.value)}
                      placeholder="Ej. México"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                  <Field label="Departamento">
                    <input value={contactDept} onChange={e => setContactDept(e.target.value)}
                      placeholder="Ej. Supply Chain"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                  <Field label="Cargo / Puesto">
                    <input value={contactPosition} onChange={e => setContactPosition(e.target.value)}
                      placeholder="Ej. Gerente de Logística"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                </div>

              </div>
            </SectionCard>

            {/* ── 02 Modo de Transporte ──────────────────────────────────── */}
            <SectionCard number="02" title="Modo de Transporte">
              <div className="grid grid-cols-3 gap-5">
                {([
                  { id: 'air',    label: 'Transporte Aéreo',      icon: <Plane size={22} /> },
                  { id: 'sea',    label: 'Transporte Marítimo',   icon: <Anchor size={22} /> },
                  { id: 'ground', label: 'Transporte Terrestre',  icon: <Truck size={22} /> },
                ] as { id: TransportMode; label: string; icon: React.ReactNode }[]).map(m => {
                  const isActive = mode === m.id;
                  const isHover  = hoverMode === m.id && !isActive;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setMode(m.id); if (m.id !== 'sea') setSeaType(''); }}
                      onMouseEnter={() => setHoverMode(m.id)}
                      onMouseLeave={() => setHoverMode(null)}
                      style={{
                        padding: '28px 20px',
                        border: `2px solid ${isActive ? ACCENT : isHover ? ACCENT_RING : BORDER}`,
                        borderRadius: '8px', cursor: 'pointer', textAlign: 'center' as const,
                        backgroundColor: isActive ? ACCENT_PALE : isHover ? ACCENT_DIM : '#fff',
                        boxShadow: isActive
                          ? `0 0 0 3px ${ACCENT_RING}, 0 3px 10px rgba(37,99,235,0.12)`
                          : isHover ? '0 3px 10px rgba(0,0,0,0.09)' : '0 1px 3px rgba(0,0,0,0.04)',
                        transform: isHover ? 'translateY(-2px)' : 'none',
                        transition: 'all 0.16s ease', outline: 'none',
                        display: 'flex', flexDirection: 'column' as const,
                        alignItems: 'center', gap: '12px',
                      }}
                    >
                      <span style={{ color: isActive ? ACCENT : isHover ? ACCENT : MUTED, lineHeight: 1 }}>
                        {m.icon}
                      </span>
                      <span style={{
                        fontSize: '11px', fontWeight: 700,
                        textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                        color: isActive ? ACCENT : isHover ? ACCENT : TEXT2,
                      }}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            {/* ── 03 Origen y Destino ────────────────────────────────────── */}
            <SectionCard number="03" title="Origen y Destino">
              <div className="grid md:grid-cols-2 gap-6">

                {/* ── Origen ─────────────────────────────────────────────── */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '14px', paddingBottom: '10px', borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%',
                      backgroundColor: '#22c55e', flexShrink: 0 }} />
                    <span style={{ fontSize: '10px', fontWeight: 800,
                      textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: TEXT2 }}>
                      Origen
                    </span>
                  </div>

                  {mode === 'air' ? (
                    /* Aéreo — solo código IATA */
                    <div>
                      <Field label="Aeropuerto / Ciudad / Código IATA" required>
                        <input value={oTerm} onChange={e => setOTerm(e.target.value)}
                          placeholder="Ej. MTY, Monterrey, Ciudad de México"
                          style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                      </Field>
                      <p style={{ fontSize: '11px', color: MUTED, marginTop: '6px', lineHeight: 1.5 }}>
                        Ingrese código de aeropuerto, nombre de ciudad o nombre del aeropuerto.
                      </p>
                    </div>
                  ) : (
                    /* Marítimo / Terrestre / Multimodal / sin selección */
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
                      <Field label="País" required>
                        <input value={oCountry} onChange={e => setOCountry(e.target.value)}
                          placeholder="Ej. México" style={inputSt}
                          onFocus={focusBorder} onBlur={blurBorder} />
                      </Field>
                      {mode !== 'sea' && (
                        <Field label="Ciudad">
                          <input value={oCity} onChange={e => setOCity(e.target.value)}
                            placeholder="Ej. Monterrey" style={inputSt}
                            onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      )}
                      {mode === 'ground' ? (
                        <>
                          <Field label="Estado / Provincia">
                            <input value={oTerm} onChange={e => setOTerm(e.target.value)}
                              placeholder="Ej. Nuevo León"
                              style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                          </Field>
                          <Field label="CP / Código Postal" required>
                            <input value={oZip} onChange={e => setOZip(e.target.value)}
                              placeholder="Ej. 64000"
                              style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                          </Field>
                        </>
                      ) : (
                        <Field label={mode === 'sea' ? 'Puerto / Terminal' : 'Aeropuerto / Puerto / Terminal'}>
                          <input value={oTerm} onChange={e => setOTerm(e.target.value)}
                            placeholder={mode === 'sea' ? 'Ej. Veracruz, Altamira, Manzanillo' : 'Ej. Puerto, aeropuerto o terminal'}
                            style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Destino ────────────────────────────────────────────── */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '14px', paddingBottom: '10px', borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '3px',
                      backgroundColor: ACCENT, flexShrink: 0 }} />
                    <span style={{ fontSize: '10px', fontWeight: 800,
                      textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: TEXT2 }}>
                      Destino
                    </span>
                  </div>

                  {mode === 'air' ? (
                    /* Aéreo — solo código IATA */
                    <div>
                      <Field label="Aeropuerto / Ciudad / Código IATA" required>
                        <input value={dTerm} onChange={e => setDTerm(e.target.value)}
                          placeholder="Ej. IAH, Houston, Aeropuerto de Frankfurt"
                          style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                      </Field>
                      <p style={{ fontSize: '11px', color: MUTED, marginTop: '6px', lineHeight: 1.5 }}>
                        Ingrese código de aeropuerto, nombre de ciudad o nombre del aeropuerto.
                      </p>
                    </div>
                  ) : (
                    /* Marítimo / Terrestre / Multimodal / sin selección */
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
                      <Field label="País" required>
                        <input value={dCountry} onChange={e => setDCountry(e.target.value)}
                          placeholder="Ej. Estados Unidos" style={inputSt}
                          onFocus={focusBorder} onBlur={blurBorder} />
                      </Field>
                      {mode !== 'sea' && (
                        <Field label="Ciudad">
                          <input value={dCity} onChange={e => setDCity(e.target.value)}
                            placeholder="Ej. Houston, TX" style={inputSt}
                            onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      )}
                      {mode === 'ground' ? (
                        <>
                          <Field label="Estado / Provincia">
                            <input value={dTerm} onChange={e => setDTerm(e.target.value)}
                              placeholder="Ej. Texas"
                              style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                          </Field>
                          <Field label="CP / Código Postal" required>
                            <input value={dZip} onChange={e => setDZip(e.target.value)}
                              placeholder="Ej. 77001"
                              style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                          </Field>
                        </>
                      ) : (
                        <Field label={mode === 'sea' ? 'Puerto / Terminal' : 'Aeropuerto / Puerto / Terminal'}>
                          <input value={dTerm} onChange={e => setDTerm(e.target.value)}
                            placeholder={mode === 'sea' ? 'Ej. Houston, Rotterdam, Nhava Sheva' : 'Ej. Puerto, aeropuerto o terminal'}
                            style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </SectionCard>

            {/* ── 04 Información de la Carga ─────────────────────────────── */}
            <SectionCard number="04" title="Información de la Carga">
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '18px' }}>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Descripción de la Mercancía" required>
                    <input value={commodity} onChange={e => setCommodity(e.target.value)}
                      placeholder="Ej. Solventes Industriales, Baterías de Litio, Equipo Médico"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                  <Field label="Fracción Arancelaria (opcional)">
                    <input value={hsCode} onChange={e => setHsCode(e.target.value)}
                      placeholder="Ej. 2901.10"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                </div>

                {/* Clasificación */}
                <div>
                  <p style={labelSt}>Clasificación de la Carga <span style={{ color: ACCENT }}>*</span></p>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: 'general',  label: 'Carga General',         icon: <Package size={16} />,       desc: 'Flete estándar' },
                      { id: 'dg',       label: 'Mercancías Peligrosas', icon: <AlertTriangle size={16} />, desc: 'Regulado ONU' },
                      { id: 'not_sure', label: 'No Estoy Seguro',       icon: <HelpCircle size={16} />,    desc: 'Necesito orientación' },
                    ] as { id: CargoClass; label: string; icon: React.ReactNode; desc: string }[]).map(c => {
                      const active   = cargoClass === c.id;
                      const isDanger = c.id === 'dg' || c.id === 'radioactive';
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCargoClass(c.id)}
                          style={{
                            padding: '12px', textAlign: 'left' as const, cursor: 'pointer',
                            outline: 'none', transition: 'all 0.15s',
                            border: `2px solid ${active ? (isDanger ? '#dc2626' : ACCENT) : BORDER}`,
                            borderRadius: '5px',
                            backgroundColor: active ? (isDanger ? '#fef2f2' : ACCENT_PALE) : '#fff',
                          }}
                        >
                          <span style={{
                            color: active ? (isDanger ? '#dc2626' : ACCENT) : MUTED,
                            display: 'block', marginBottom: '6px', lineHeight: 1,
                          }}>
                            {c.icon}
                          </span>
                          <span style={{
                            fontSize: '10px', fontWeight: 800,
                            textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                            display: 'block', marginBottom: '2px',
                            color: active ? (isDanger ? '#dc2626' : ACCENT) : TEXT,
                          }}>
                            {c.label}
                          </span>
                          <span style={{ fontSize: '10px', color: MUTED }}>{c.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Clase 7 */}
                <div style={{
                  marginTop: '4px', padding: '11px 16px',
                  backgroundColor: TH_BG, border: `1px solid ${BORDER}`,
                  borderRadius: '5px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' as const,
                }}>
                  <p style={{ fontSize: '12px', color: TEXT2, margin: 0, lineHeight: 1.5 }}>
                    ¿Necesita apoyo para transporte de <strong>Material Radiactivo / Clase 7?</strong>
                  </p>
                  <a
                    href="/logistica-material-radiactivo"
                    style={{
                      fontSize: '11px', fontWeight: 700, color: ACCENT,
                      textDecoration: 'none', flexShrink: 0, letterSpacing: '0.03em',
                      whiteSpace: 'nowrap' as const,
                    }}
                  >
                    Visitar Logística Clase 7 →
                  </a>
                </div>

                {cargoClass === 'not_sure' && (
                  <div style={{
                    backgroundColor: AMBER_BG, border: `1px solid ${AMBER_B}`,
                    borderRadius: '5px', padding: '12px 16px',
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                  }}>
                    <HelpCircle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ fontSize: '12px', color: AMBER_TXT, lineHeight: 1.55, margin: 0 }}>
                      Adjunte su <strong>Hoja de Datos de Seguridad (SDS)</strong> o{' '}
                      <strong>ficha técnica</strong> en la sección de documentos para revisión regulatoria.
                      Nuestro equipo clasificará el embarque y confirmará los requisitos normativos antes
                      de emitir la cotización.
                    </p>
                  </div>
                )}

              </div>
            </SectionCard>

            {/* ── 05 Resumen del Embarque / Requerimientos del Contenedor ── */}
            <SectionCard
              number="05"
              title={mode === 'sea' && seaType === 'fcl' ? 'Requerimientos del Contenedor' : 'Resumen del Embarque'}
            >

              {/* ── Marítimo: selector LCL / FCL ───────────────────────── */}
              {mode === 'sea' && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={labelSt}>
                    Tipo de Embarque <span style={{ color: ACCENT }}>*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      {
                        id: 'lcl' as const,
                        icon: <Package size={20} />,
                        label: 'LCL',
                        sub: 'Carga Consolidada',
                        desc: 'Contenedor compartido',
                      },
                      {
                        id: 'fcl' as const,
                        icon: <Box size={20} />,
                        label: 'FCL',
                        sub: 'Contenedor Completo',
                        desc: 'Contenedor(es) dedicado(s)',
                      },
                    ]).map(t => {
                      const active = seaType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSeaType(t.id)}
                          style={{
                            padding: '16px 18px', textAlign: 'left' as const,
                            cursor: 'pointer', outline: 'none', transition: 'all 0.15s',
                            border: `2px solid ${active ? ACCENT : BORDER}`,
                            borderRadius: '6px',
                            backgroundColor: active ? ACCENT_PALE : '#fff',
                            boxShadow: active
                              ? `0 0 0 3px ${ACCENT_RING}, 0 2px 8px rgba(37,99,235,0.1)`
                              : '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                        >
                          <span style={{
                            color: active ? ACCENT : MUTED,
                            display: 'block', marginBottom: '8px', lineHeight: 1,
                          }}>
                            {t.icon}
                          </span>
                          <span style={{
                            fontSize: '13px', fontWeight: 800, letterSpacing: '-0.01em',
                            display: 'block', marginBottom: '2px',
                            color: active ? ACCENT : TEXT,
                          }}>
                            {t.label}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: active ? ACCENT : TEXT2, display: 'block', marginBottom: '2px' }}>
                            {t.sub}
                          </span>
                          <span style={{ fontSize: '10px', color: MUTED }}>{t.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── FCL: Requerimientos del Contenedor ─────────────────── */}
              {mode === 'sea' && seaType === 'fcl' && (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Tipo de Contenedor" required>
                      <select
                        value={containerType}
                        onChange={e => setContainerType(e.target.value)}
                        style={{ ...inputSt, cursor: 'pointer' }}
                        onFocus={focusBorder} onBlur={blurBorder}
                      >
                        <option value="">Seleccionar tipo…</option>
                        <option value="20GP">20GP — 20' Propósito General</option>
                        <option value="40GP">40GP — 40' Propósito General</option>
                        <option value="40HC">40HC — 40' High Cube (Alto)</option>
                        <option value="20OT">20OT — 20' Open Top (Techo Abierto)</option>
                        <option value="40OT">40OT — 40' Open Top (Techo Abierto)</option>
                        <option value="Reefer">Reefer — Refrigerado</option>
                        <option value="ISO Tank">Tanque ISO</option>
                      </select>
                    </Field>
                    <Field label="Número de Contenedores" required>
                      <input
                        type="number" min="1" value={containerQty}
                        onChange={e => setContainerQty(e.target.value)}
                        placeholder="Ej. 2"
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Propiedad del Equipo (opcional)">
                      <select
                        value={socCoc}
                        onChange={e => setSocCoc(e.target.value)}
                        style={{ ...inputSt, cursor: 'pointer' }}
                        onFocus={focusBorder} onBlur={blurBorder}
                      >
                        <option value="">No especificado</option>
                        <option value="COC">COC — Contenedor del Armador</option>
                        <option value="SOC">SOC — Contenedor del Fletador</option>
                      </select>
                    </Field>
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={dgContainer}
                          onChange={e => setDgContainer(e.target.checked)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: ACCENT }}
                        />
                        <span style={{ fontSize: '13px', color: TEXT, lineHeight: 1.4 }}>
                          Contenedor con Mercancías Peligrosas
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ── LCL o no marítimo: campos estándar ─────────────────── */}
              {(mode !== 'sea' || seaType === 'lcl') && (
                <>
                  <div className="grid md:grid-cols-2 gap-4" style={{ marginBottom: '12px' }}>
                    <Field label="Número de Bultos">
                      <input
                        type="number" min="1" value={quickCount}
                        onChange={e => setQuickCount(e.target.value)}
                        placeholder="Ej. 4"
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                    <Field label="Peso Total Aprox. (kg)">
                      <input
                        type="number" min="0" step="0.01" value={quickWeight}
                        onChange={e => setQuickWeight(e.target.value)}
                        placeholder="Ej. 250"
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                  </div>
                  <p style={{ fontSize: '12px', color: MUTED, lineHeight: 1.55 }}>
                    {mode === 'sea'
                      ? 'Para especificar dimensiones exactas por bulto y pesos individuales, utilice la sección detallada.'
                      : 'Para especificar dimensiones exactas por bulto, pesos individuales y detalles de mercancías peligrosas, utilice la sección detallada.'}
                  </p>
                </>
              )}

              {/* ── Marítimo: sin tipo seleccionado ────────────────────── */}
              {mode === 'sea' && !seaType && (
                <p style={{ fontSize: '12px', color: MUTED, lineHeight: 1.55 }}>
                  Seleccione el tipo de embarque para continuar.
                </p>
              )}

            </SectionCard>

            {/* ── Error ─────────────────────────────────────────────────── */}
            {error && (
              <div style={{
                backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '6px', padding: '12px 16px', marginBottom: '10px',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
              }}>
                <span style={{ color: '#dc2626', fontSize: '14px', lineHeight: 1, flexShrink: 0 }}>✕</span>
                <p style={{ fontSize: '13px', color: '#991b1b', margin: 0, lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* ── Submit — CTA primaria, siempre visible ─────────────────── */}
            <div style={{
              backgroundColor: CARD, border: `1px solid ${BORDER}`,
              borderRadius: '8px', padding: '28px 24px',
              display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
              gap: '12px', textAlign: 'center' as const,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              marginBottom: '10px',
            }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '17px 56px',
                  backgroundColor: loading ? '#93c5fd' : ACCENT,
                  color: '#fff', border: 'none', borderRadius: '6px',
                  fontSize: '13px', fontWeight: 900,
                  textTransform: 'uppercase' as const, letterSpacing: '0.14em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.18s',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(37,99,235,0.32)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  minWidth: '240px', justifyContent: 'center',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                    e.currentTarget.style.boxShadow = '0 6px 22px rgba(37,99,235,0.46)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = ACCENT;
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.32)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Procesando…
                  </>
                ) : (
                  <>Solicitar Cotización <ArrowRight size={15} /></>
                )}
              </button>
              <p style={{ fontSize: '11px', color: MUTED, lineHeight: 1.55, maxWidth: '420px' }}>
                Nuestros especialistas logísticos revisarán la información del embarque
                antes de emitir la cotización. Respuesta en un día hábil.
              </p>
            </div>

            {/* ══════════════════════════════════════════════════════════
                ACORDEÓN — Información Detallada del Embarque (Opcional)
            ══════════════════════════════════════════════════════════ */}
            <div style={{ marginBottom: '32px' }}>

              {/* Trigger del acordeón */}
              <button
                type="button"
                onClick={handleExpand}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 18px',
                  backgroundColor: expanded ? '#f4f6f9' : '#f9fafb',
                  border: `1px solid ${BORDER}`,
                  borderRadius: expanded ? '8px 8px 0 0' : '8px',
                  cursor: 'pointer', outline: 'none',
                  transition: 'background-color 0.15s',
                  textAlign: 'left' as const,
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0f3f7'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = expanded ? '#f4f6f9' : '#f9fafb'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ChevronDown
                    size={15}
                    color={TEXT2}
                    style={{
                      transform: expanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: TEXT2,
                    textTransform: 'uppercase' as const, letterSpacing: '0.1em',
                  }}>
                    Información Detallada del Embarque
                  </span>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, color: MUTED,
                    backgroundColor: '#fff', border: `1px solid ${BORDER}`,
                    padding: '2px 7px', borderRadius: '3px',
                    textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                  }}>
                    Opcional
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: MUTED, flexShrink: 0, marginLeft: '12px' }}>
                  {expanded ? 'Ocultar' : 'Agregar dimensiones, detalles MP y documentos'}
                </span>
              </button>

              {/* Contenido del acordeón */}
              {expanded && (
              <div
                ref={expandRef}
                style={{
                  border: `1px solid ${BORDER}`, borderTop: 'none',
                  borderRadius: '0 0 8px 8px', padding: '20px 20px 4px',
                  backgroundColor: BG,
                }}
              >

                {/* ── 06 Detalle de Bultos (oculto para FCL marítimo) ─────── */}
                {!(mode === 'sea' && seaType === 'fcl') && <SectionCard number="06" title="Detalle de Bultos">
                  <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' as const, minWidth: '680px' }}>
                      <thead>
                        <tr>
                          {[
                            'Bultos', 'Tipo de Embalaje',
                            'Largo (cm)', 'Ancho (cm)', 'Alto (cm)',
                            'Peso (kg)', '',
                          ].map(h => (
                            <th key={h} style={h === '' ? { ...thSt, width: '36px' } : thSt}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {packages.map(pkg => (
                          <tr key={pkg.id}>
                            <td style={{ ...tdSt, width: '76px' }}>
                              <input
                                type="number" min="1" value={pkg.pieces}
                                onChange={e => setPkg(pkg.id, 'pieces', e.target.value)}
                                style={{ ...tableInputSt, width: '64px' }}
                                onFocus={focusTableIn} onBlur={blurTableIn}
                              />
                            </td>
                            <td style={{ ...tdSt, minWidth: '130px' }}>
                              <select
                                value={pkg.packageType}
                                onChange={e => setPkg(pkg.id, 'packageType', e.target.value)}
                                style={{ ...tableInputSt, width: '100%', cursor: 'pointer' }}
                                onFocus={focusTableIn} onBlur={blurTableIn}
                              >
                                {['Caja','Tambor','Tarima','Bolsa','Estuche','GRG','Cilindro','Jaula','Otro'].map(t => (
                                  <option key={t}>{t}</option>
                                ))}
                              </select>
                            </td>
                            {(['length', 'width', 'height', 'weight'] as const).map(f => (
                              <td key={f} style={{ ...tdSt, width: '100px' }}>
                                <input
                                  type="number" min="0" step="0.01" placeholder="0"
                                  value={pkg[f]}
                                  onChange={e => setPkg(pkg.id, f, e.target.value)}
                                  style={{ ...tableInputSt, width: '88px' }}
                                  onFocus={focusTableIn} onBlur={blurTableIn}
                                />
                              </td>
                            ))}
                            <td style={{ ...tdSt, width: '36px', textAlign: 'center' as const }}>
                              {packages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removePkg(pkg.id)}
                                  style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#ef4444', padding: '4px', lineHeight: 1,
                                    borderRadius: '3px', transition: 'background 0.12s',
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                  title="Eliminar línea"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={addPkg}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', border: `1px dashed ${BORDER_DARK}`,
                      borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff',
                      fontSize: '11px', fontWeight: 700,
                      textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                      color: TEXT2, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER_DARK; e.currentTarget.style.color = TEXT2; }}
                  >
                    <Plus size={13} /> Agregar Línea
                  </button>

                  {(totalWeight > 0 || totalVol > 0) && (
                    <div style={{
                      display: 'flex', gap: '24px', flexWrap: 'wrap',
                      marginTop: '16px', padding: '14px 18px',
                      backgroundColor: TH_BG, border: `1px solid ${BORDER}`, borderRadius: '5px',
                    }}>
                      {[
                        { label: 'Peso Bruto Total', value: `${totalWeight.toFixed(2)}`, unit: 'kg' },
                        { label: 'Volumen Total',    value: `${totalVol.toFixed(4)}`,    unit: 'CBM' },
                        { label: 'Líneas de Bultos', value: `${packages.length}`,        unit: '' },
                      ].map((t, i) => (
                        <div key={t.label} style={i > 0 ? { borderLeft: `1px solid ${BORDER}`, paddingLeft: '24px' } : {}}>
                          <p style={{ fontSize: '9px', fontWeight: 700,
                            textTransform: 'uppercase' as const, letterSpacing: '0.1em',
                            color: MUTED, marginBottom: '2px' }}>
                            {t.label}
                          </p>
                          <p style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>
                            {t.value}{' '}
                            {t.unit && <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 600 }}>{t.unit}</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>}

                {/* ── 07 Detalle MP (condicional) ───────────────────────── */}
                {showDG && (
                  <SectionCard
                    number="07"
                    title="Detalle de Mercancías Peligrosas"
                    badge="Carga Regulada"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Field label="Número ONU" required>
                          <input value={unNum} onChange={e => setUnNum(e.target.value)}
                            placeholder="Ej. UN3480" style={inputSt}
                            onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                        <Field label="Nombre Apropiado de Expedición" required>
                          <input value={psn} onChange={e => setPsn(e.target.value)}
                            placeholder="Ej. Baterías de iones de litio"
                            style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <Field label="Clase de Peligro" required>
                          <select value={hazClass} onChange={e => setHazClass(e.target.value)}
                            style={{ ...inputSt, cursor: 'pointer' }}
                            onFocus={focusBorder} onBlur={blurBorder}>
                            <option value="">Seleccionar clase…</option>
                            <option>Clase 1 — Explosivos</option>
                            <option>Clase 2 — Gases</option>
                            <option>Clase 3 — Líquidos Inflamables</option>
                            <option>Clase 4 — Sólidos Inflamables</option>
                            <option>Clase 5 — Oxidantes / Peróxidos Orgánicos</option>
                            <option>Clase 6 — Tóxicos / Infecciosos</option>
                            <option>Clase 7 — Radiactivos</option>
                            <option>Clase 8 — Corrosivos</option>
                            <option>Clase 9 — Misceláneos</option>
                          </select>
                        </Field>
                        <Field label="Grupo de Embalaje">
                          <select value={pkgGroup} onChange={e => setPkgGroup(e.target.value)}
                            style={{ ...inputSt, cursor: 'pointer' }}
                            onFocus={focusBorder} onBlur={blurBorder}>
                            <option value="">Seleccionar…</option>
                            <option>GE I — Peligro Alto</option>
                            <option>GE II — Peligro Medio</option>
                            <option>GE III — Peligro Bajo</option>
                            <option>N/A</option>
                          </select>
                        </Field>
                        <Field label="Tipo de Embalaje">
                          <input value={pkgType} onChange={e => setPkgType(e.target.value)}
                            placeholder="Ej. Caja 4G, Tambor 1A2" style={inputSt}
                            onFocus={focusBorder} onBlur={blurBorder} />
                        </Field>
                      </div>


                    </div>
                  </SectionCard>
                )}

                {/* ── 08 Documentos de Soporte ───────────────────────────── */}
                <SectionCard number={showDG ? '08' : '07'} title="Documentos de Soporte">
                  <p style={{ fontSize: '12px', color: TEXT2, marginBottom: '14px', lineHeight: 1.55 }}>
                    Adjunte SDS, lista de empaque, fotografías o documentación técnica.
                  </p>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileRef.current?.click()}
                    onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragEnter={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    style={{
                      border: `2px dashed ${dragging ? ACCENT : BORDER_DARK}`,
                      borderRadius: '6px', padding: '32px 24px', textAlign: 'center' as const,
                      cursor: 'pointer', backgroundColor: dragging ? ACCENT_PALE : '#fafbfc',
                      transition: 'all 0.15s', marginBottom: files.length ? '12px' : 0,
                      outline: 'none',
                    }}
                  >
                    <Upload size={22} color={dragging ? ACCENT : MUTED} style={{ margin: '0 auto 10px' }} />
                    <p style={{ fontSize: '13px', color: TEXT2, marginBottom: '4px' }}>
                      Arrastre archivos aquí o{' '}
                      <span style={{ color: ACCENT, fontWeight: 600 }}>explore</span>
                    </p>
                    <p style={{ fontSize: '11px', color: MUTED }}>
                      SDS · Fotos · Lista de Empaque · Ficha Técnica
                    </p>
                    <p style={{ fontSize: '10px', color: MUTED, marginTop: '4px' }}>
                      PDF, PNG, JPG, XLSX — máx. 20 MB por archivo
                    </p>
                  </div>
                  <input
                    ref={fileRef} type="file" multiple
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.doc,.docx"
                    onChange={e => addFiles(e.target.files)}
                    style={{ display: 'none' }}
                  />
                  {files.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                      {files.map((f, i) => (
                        <div key={`${f.name}-${i}`} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '9px 12px', backgroundColor: TH_BG,
                          border: `1px solid ${BORDER}`, borderRadius: '4px',
                        }}>
                          <FileText size={14} color={ACCENT} style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: TEXT2, flex: 1,
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' as const }}>{f.name}</span>
                          <span style={{ fontSize: '11px', color: MUTED, flexShrink: 0 }}>
                            {(f.size / 1024).toFixed(0)} KB
                          </span>
                          <button
                            type="button" onClick={() => removeFile(i)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer',
                              color: MUTED, padding: '2px', lineHeight: 1, flexShrink: 0,
                              borderRadius: '3px', transition: 'color 0.12s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                {/* ── 09 Comentarios Adicionales ────────────────────────── */}
                <SectionCard number={showDG ? '09' : '08'} title="Comentarios Adicionales">
                  <textarea
                    value={comments} onChange={e => setComments(e.target.value)}
                    rows={4}
                    placeholder="Requerimientos especiales de manejo, restricciones de entrega, Incoterms preferidos u otros detalles relevantes…"
                    style={{ ...inputSt, resize: 'none', lineHeight: 1.6 }}
                    onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderColor = INPUT_B)}
                  />
                </SectionCard>

              </div>
              )}

            </div>{/* end accordion wrapper */}

          </form>
        </Container>
      </div>

    </div>
  );
};
