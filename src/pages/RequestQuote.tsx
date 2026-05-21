import { useState, useRef, useCallback } from 'react';
import {
  Plane, Anchor, Truck, Layers, Plus, Trash2,
  Upload, FileText, X, Package, AlertTriangle,
  Atom, HelpCircle, CheckCircle2, ArrowRight,
} from 'lucide-react';
import { Container } from '../components/UI';

// ── Color tokens ─────────────────────────────────────────────────────────────
const BG          = '#f0f2f5';
const HEADER_BG   = '#0d1729';
const CARD        = '#ffffff';
const BORDER      = '#e2e8f0';
const BORDER_DARK = '#cbd5e1';
const ACCENT      = '#2563eb';
const ACCENT_PALE = '#eff6ff';
const ACCENT_RING = '#bfdbfe';
const TEXT        = '#0f172a';
const TEXT2       = '#475569';
const MUTED       = '#94a3b8';
const INPUT_B     = '#d1d5db';
const LABEL_C     = '#64748b';
const TH_BG       = '#f8fafc';
const GOLD        = '#c9a227';
const AMBER_BG    = '#fffbeb';
const AMBER_B     = '#fde68a';
const AMBER_TXT   = '#92400e';
const GREEN       = '#16a34a';
const GREEN_BG    = '#f0fdf4';
const GREEN_B     = '#bbf7d0';

// ── Types ─────────────────────────────────────────────────────────────────────
type TransportMode = '' | 'air' | 'sea' | 'ground' | 'multimodal';
type CargoClass    = '' | 'general' | 'dg' | 'radioactive' | 'not_sure';

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
  pieces: '1', packageType: 'Box',
  length: '', width: '', height: '', weight: '',
});

// ── Shared style atoms ────────────────────────────────────────────────────────
const inputSt: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: '13px',
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
  padding: '9px 12px', textAlign: 'left' as const, fontSize: '9px',
  fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.12em',
  color: MUTED, whiteSpace: 'nowrap' as const, borderBottom: `1px solid ${BORDER}`,
  backgroundColor: TH_BG,
};

const tdSt: React.CSSProperties = {
  padding: '5px 6px', verticalAlign: 'middle' as const,
  borderBottom: `1px solid #f1f5f9`,
};

const tableInputSt: React.CSSProperties = {
  width: '100%', padding: '7px 9px', fontSize: '13px',
  border: `1px solid ${INPUT_B}`, borderRadius: '3px',
  backgroundColor: '#fafafa', color: TEXT, outline: 'none',
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
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 24px', borderBottom: `1px solid ${BORDER}`,
        backgroundColor: '#fcfcfd',
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

// ── Focus/blur border helpers ─────────────────────────────────────────────────
const focusBorder  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = ACCENT);
const blurBorder   = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = INPUT_B);
const focusTableIn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = ACCENT);
const blurTableIn  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = INPUT_B);

// ── Main page component ───────────────────────────────────────────────────────
export const RequestQuotePage = () => {

  // Transport mode
  const [mode, setMode]         = useState<TransportMode>('');

  // Routing
  const [oCountry, setOCountry] = useState('');
  const [oCity, setOCity]       = useState('');
  const [oTerm, setOTerm]       = useState('');
  const [dCountry, setDCountry] = useState('');
  const [dCity, setDCity]       = useState('');
  const [dTerm, setDTerm]       = useState('');

  // Cargo
  const [commodity, setCommodity]   = useState('');
  const [hsCode, setHsCode]         = useState('');
  const [cargoClass, setCargoClass] = useState<CargoClass>('');

  // Packages
  const [packages, setPackages] = useState<PkgLine[]>([newPkg()]);

  // DG fields
  const [unNum, setUnNum]           = useState('');
  const [psn, setPsn]               = useState('');
  const [hazClass, setHazClass]     = useState('');
  const [pkgGroup, setPkgGroup]     = useState('');
  const [pkgType, setPkgType]       = useState('');
  const [tiIndex, setTiIndex]       = useState('');
  const [isotope, setIsotope]       = useState('');
  const [pkgCat, setPkgCat]         = useState('');

  // Files
  const [files, setFiles]         = useState<File[]>([]);
  const [dragging, setDragging]   = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  // Comments
  const [comments, setComments]   = useState('');

  // Submission
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId]                   = useState(() => 'GGM-' + Date.now().toString(36).toUpperCase().slice(-6));

  // Computed
  const showDG      = cargoClass === 'dg' || cargoClass === 'radioactive';
  const showRadio   = cargoClass === 'radioactive';
  const totalWeight = packages.reduce((s, p) =>
    s + (parseFloat(p.weight) || 0) * (parseInt(p.pieces) || 0), 0);
  const totalVol    = packages.reduce((s, p) => {
    const l = parseFloat(p.length) || 0;
    const w = parseFloat(p.width)  || 0;
    const h = parseFloat(p.height) || 0;
    return s + (l * w * h / 1_000_000) * (parseInt(p.pieces) || 0);
  }, 0);

  // Package helpers
  const addPkg   = () => setPackages(prev => [...prev, newPkg()]);
  const removePkg = (id: string) => setPackages(prev => prev.filter(p => p.id !== id));
  const setPkg   = (id: string, f: keyof PkgLine, v: string) =>
    setPackages(prev => prev.map(p => p.id === id ? { ...p, [f]: v } : p));

  // File helpers
  const addFiles = (fs: FileList | null) => {
    if (!fs) return;
    setFiles(prev => [...prev, ...Array.from(fs)]);
  };
  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  // ── Success state ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ backgroundColor: BG, minHeight: '100vh', paddingTop: '88px' }}>
        <div style={{ paddingTop: '64px', paddingBottom: '80px' }}>
          <Container>
            <div style={{
              maxWidth: '560px', margin: '0 auto',
              backgroundColor: CARD, border: `1px solid ${BORDER}`,
              borderRadius: '10px', padding: '48px 40px', textAlign: 'center',
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
                Quote Request Received
              </p>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: TEXT,
                letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.2 }}>
                We've received your shipment details
              </h2>
              <p style={{ fontSize: '13px', color: TEXT2, lineHeight: 1.65,
                marginBottom: '24px', maxWidth: '380px', margin: '0 auto 24px' }}>
                Our logistics specialists will review the operational requirements
                and contact you within one business day.
              </p>
              <div style={{
                backgroundColor: TH_BG, border: `1px solid ${BORDER}`,
                borderRadius: '6px', padding: '12px 20px', marginBottom: '28px',
                display: 'inline-block',
              }}>
                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.15em', color: MUTED, marginBottom: '3px' }}>Reference</p>
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
                ← Submit Another Quote Request
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

      {/* ── Header band ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: HEADER_BG, paddingTop: '88px' }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '36px 0 32px' }}>
          <Container>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '16px', fontSize: '10px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>
              <span>Global Gate Mexico</span>
              <ArrowRight size={10} />
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>Request Quote</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800,
              color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15,
              marginBottom: '10px' }}>
              Request Freight Quote
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px',
              maxWidth: '560px', lineHeight: 1.65 }}>
              Tell us about your shipment and our logistics team will review the
              operational requirements before issuing the quotation.
            </p>
            {/* Certification strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
              marginTop: '20px', flexWrap: 'wrap' }}>
              {['IATA Certified', 'IMDG', 'ADR', 'CNSNS', 'Class 7 Logistics'].map(t => (
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

      {/* ── Form body ───────────────────────────────────────────────────── */}
      <div style={{ padding: '32px 0 72px' }}>
        <Container>
          <form onSubmit={handleSubmit} style={{ maxWidth: '860px', margin: '0 auto' }}>

            {/* ── 01 Transport Mode ───────────────────────────────────── */}
            <SectionCard number="01" title="Transport Mode">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { id: 'air',       label: 'Air Freight',           icon: <Plane size={22} /> },
                  { id: 'sea',       label: 'Sea Freight',           icon: <Anchor size={22} /> },
                  { id: 'ground',    label: 'Ground Transport',      icon: <Truck size={22} /> },
                  { id: 'multimodal',label: 'Multimodal',            icon: <Layers size={22} /> },
                ] as { id: TransportMode; label: string; icon: React.ReactNode }[]).map(m => {
                  const active = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      style={{
                        padding: '18px 12px', border: `2px solid ${active ? ACCENT : BORDER}`,
                        borderRadius: '6px', cursor: 'pointer', textAlign: 'center' as const,
                        backgroundColor: active ? ACCENT_PALE : '#fff',
                        transition: 'all 0.15s', outline: 'none',
                        display: 'flex', flexDirection: 'column' as const,
                        alignItems: 'center', gap: '10px',
                      }}
                    >
                      <span style={{ color: active ? ACCENT : MUTED, lineHeight: 1 }}>{m.icon}</span>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const,
                        letterSpacing: '0.08em', color: active ? ACCENT : TEXT2,
                      }}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            {/* ── 02 Routing ──────────────────────────────────────────── */}
            <SectionCard number="02" title="Origin & Destination">
              <div className="grid md:grid-cols-2 gap-6">

                {/* Origin */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '14px', paddingBottom: '10px', borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%',
                      backgroundColor: '#22c55e', flexShrink: 0 }} />
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const,
                      letterSpacing: '0.12em', color: TEXT2 }}>Origin</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                    <Field label="Country" required>
                      <input
                        value={oCountry} onChange={e => setOCountry(e.target.value)}
                        placeholder="e.g. Mexico" style={inputSt}
                        onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                    <Field label="City">
                      <input
                        value={oCity} onChange={e => setOCity(e.target.value)}
                        placeholder="e.g. Monterrey" style={inputSt}
                        onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                    <Field label={mode === 'air' ? 'Airport / IATA Code' : mode === 'sea' ? 'Port' : 'Terminal / Facility'}>
                      <input
                        value={oTerm} onChange={e => setOTerm(e.target.value)}
                        placeholder={mode === 'air' ? 'e.g. MTY — Monterrey Int\'l' : 'e.g. Port of Veracruz'}
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '14px', paddingBottom: '10px', borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '3px',
                      backgroundColor: ACCENT, flexShrink: 0 }} />
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const,
                      letterSpacing: '0.12em', color: TEXT2 }}>Destination</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                    <Field label="Country" required>
                      <input
                        value={dCountry} onChange={e => setDCountry(e.target.value)}
                        placeholder="e.g. United States" style={inputSt}
                        onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                    <Field label="City">
                      <input
                        value={dCity} onChange={e => setDCity(e.target.value)}
                        placeholder="e.g. Houston, TX" style={inputSt}
                        onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                    <Field label={mode === 'air' ? 'Airport / IATA Code' : mode === 'sea' ? 'Port' : 'Terminal / Facility'}>
                      <input
                        value={dTerm} onChange={e => setDTerm(e.target.value)}
                        placeholder={mode === 'air' ? 'e.g. IAH — George Bush Int\'l' : 'e.g. Port of Houston'}
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                  </div>
                </div>

              </div>
            </SectionCard>

            {/* ── 03 Cargo Information ─────────────────────────────────── */}
            <SectionCard number="03" title="Cargo Information">
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Commodity Description" required>
                    <input
                      value={commodity} onChange={e => setCommodity(e.target.value)}
                      placeholder="e.g. Industrial Solvents, Lithium Batteries, Medical Equipment"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder}
                    />
                  </Field>
                  <Field label="HS Code (optional)">
                    <input
                      value={hsCode} onChange={e => setHsCode(e.target.value)}
                      placeholder="e.g. 2901.10"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder}
                    />
                  </Field>
                </div>

                {/* Cargo classification */}
                <div>
                  <p style={labelSt}>Cargo Classification <span style={{ color: ACCENT }}>*</span></p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {([
                      { id: 'general',    label: 'General Cargo',      icon: <Package size={16} />,      desc: 'Standard freight' },
                      { id: 'dg',         label: 'Dangerous Goods',    icon: <AlertTriangle size={16} />, desc: 'UN regulated' },
                      { id: 'radioactive',label: 'Radioactive Material',icon: <Atom size={16} />,         desc: 'IAEA / Class 7' },
                      { id: 'not_sure',   label: 'Not Sure',           icon: <HelpCircle size={16} />,   desc: 'Need guidance' },
                    ] as { id: CargoClass; label: string; icon: React.ReactNode; desc: string }[]).map(c => {
                      const active = cargoClass === c.id;
                      const isDanger = c.id === 'dg' || c.id === 'radioactive';
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCargoClass(c.id)}
                          style={{
                            padding: '12px', border: `2px solid ${active
                              ? isDanger ? '#dc2626' : ACCENT
                              : BORDER}`,
                            borderRadius: '5px', cursor: 'pointer', textAlign: 'left' as const,
                            backgroundColor: active
                              ? isDanger ? '#fef2f2' : ACCENT_PALE
                              : '#fff',
                            transition: 'all 0.15s', outline: 'none',
                          }}
                        >
                          <span style={{
                            color: active ? isDanger ? '#dc2626' : ACCENT : MUTED,
                            display: 'block', marginBottom: '6px', lineHeight: 1,
                          }}>
                            {c.icon}
                          </span>
                          <span style={{
                            fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const,
                            letterSpacing: '0.08em', display: 'block', marginBottom: '2px',
                            color: active ? isDanger ? '#dc2626' : ACCENT : TEXT,
                          }}>
                            {c.label}
                          </span>
                          <span style={{ fontSize: '10px', color: MUTED }}>{c.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Not sure notice */}
                {cargoClass === 'not_sure' && (
                  <div style={{
                    backgroundColor: AMBER_BG, border: `1px solid ${AMBER_B}`,
                    borderRadius: '5px', padding: '12px 16px',
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                  }}>
                    <HelpCircle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ fontSize: '12px', color: AMBER_TXT, lineHeight: 1.55, margin: 0 }}>
                      Upload your <strong>SDS</strong> or <strong>technical data sheet</strong> in
                      Section 06 below for compliance review. Our team will classify the shipment
                      and confirm any regulatory requirements before issuing the quote.
                    </p>
                  </div>
                )}

              </div>
            </SectionCard>

            {/* ── 04 Package Details ───────────────────────────────────── */}
            <SectionCard number="04" title="Package Details">
              <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' as const, minWidth: '620px' }}>
                  <thead>
                    <tr>
                      {['Pieces', 'Package Type', 'L (cm)', 'W (cm)', 'H (cm)', 'Weight (kg)', ''].map(h => (
                        <th key={h} style={h === '' ? { ...thSt, width: '36px' } : thSt}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map(pkg => (
                      <tr key={pkg.id}>
                        <td style={{ ...tdSt, width: '72px' }}>
                          <input
                            type="number" min="1" value={pkg.pieces}
                            onChange={e => setPkg(pkg.id, 'pieces', e.target.value)}
                            style={{ ...tableInputSt, width: '60px' }}
                            onFocus={focusTableIn} onBlur={blurTableIn}
                          />
                        </td>
                        <td style={{ ...tdSt, minWidth: '120px' }}>
                          <select
                            value={pkg.packageType}
                            onChange={e => setPkg(pkg.id, 'packageType', e.target.value)}
                            style={{ ...tableInputSt, width: '100%', cursor: 'pointer' }}
                            onFocus={focusTableIn} onBlur={blurTableIn}
                          >
                            {['Box','Drum','Pallet','Bag','Case','IBC','Cylinder','Crate','Other'].map(t => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </td>
                        {(['length', 'width', 'height', 'weight'] as const).map(f => (
                          <td key={f} style={{ ...tdSt, width: '90px' }}>
                            <input
                              type="number" min="0" step="0.01"
                              placeholder="0"
                              value={pkg[f]}
                              onChange={e => setPkg(pkg.id, f, e.target.value)}
                              style={{ ...tableInputSt, width: '78px' }}
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
                              title="Remove line"
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

              {/* Add line button */}
              <button
                type="button"
                onClick={addPkg}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', border: `1px dashed ${BORDER_DARK}`,
                  borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff',
                  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em', color: TEXT2, transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = ACCENT;
                  e.currentTarget.style.color = ACCENT;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = BORDER_DARK;
                  e.currentTarget.style.color = TEXT2;
                }}
              >
                <Plus size={13} /> Add Package Line
              </button>

              {/* Totals */}
              {(totalWeight > 0 || totalVol > 0) && (
                <div style={{
                  display: 'flex', gap: '24px', flexWrap: 'wrap',
                  marginTop: '16px', padding: '12px 16px',
                  backgroundColor: TH_BG, border: `1px solid ${BORDER}`,
                  borderRadius: '5px',
                }}>
                  <div>
                    <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' as const,
                      letterSpacing: '0.1em', color: MUTED, marginBottom: '2px' }}>
                      Total Gross Weight
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>
                      {totalWeight.toFixed(2)} <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 600 }}>kg</span>
                    </p>
                  </div>
                  <div style={{ borderLeft: `1px solid ${BORDER}`, paddingLeft: '24px' }}>
                    <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' as const,
                      letterSpacing: '0.1em', color: MUTED, marginBottom: '2px' }}>
                      Total Volume
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>
                      {totalVol.toFixed(4)} <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 600 }}>CBM</span>
                    </p>
                  </div>
                  <div style={{ borderLeft: `1px solid ${BORDER}`, paddingLeft: '24px' }}>
                    <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' as const,
                      letterSpacing: '0.1em', color: MUTED, marginBottom: '2px' }}>
                      Package Lines
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>
                      {packages.length}
                    </p>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* ── 05 DG Details (conditional) ─────────────────────────── */}
            {showDG && (
              <SectionCard
                number="05"
                title={showRadio ? 'Radioactive Material Details' : 'Dangerous Goods Details'}
                badge="Regulated Cargo"
              >
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="UN Number" required>
                      <input
                        value={unNum} onChange={e => setUnNum(e.target.value)}
                        placeholder="e.g. UN3480" style={inputSt}
                        onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                    <Field label="Proper Shipping Name" required>
                      <input
                        value={psn} onChange={e => setPsn(e.target.value)}
                        placeholder="e.g. Lithium ion batteries"
                        style={inputSt} onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Field label="Hazard Class" required>
                      <select
                        value={hazClass} onChange={e => setHazClass(e.target.value)}
                        style={{ ...inputSt, cursor: 'pointer' }}
                        onFocus={focusBorder} onBlur={blurBorder}
                      >
                        <option value="">Select class…</option>
                        <option>Class 1 — Explosives</option>
                        <option>Class 2 — Gases</option>
                        <option>Class 3 — Flammable Liquids</option>
                        <option>Class 4 — Flammable Solids</option>
                        <option>Class 5 — Oxidizers / Org. Peroxides</option>
                        <option>Class 6 — Toxic / Infectious</option>
                        <option>Class 7 — Radioactive</option>
                        <option>Class 8 — Corrosives</option>
                        <option>Class 9 — Miscellaneous</option>
                      </select>
                    </Field>
                    <Field label="Packing Group">
                      <select
                        value={pkgGroup} onChange={e => setPkgGroup(e.target.value)}
                        style={{ ...inputSt, cursor: 'pointer' }}
                        onFocus={focusBorder} onBlur={blurBorder}
                      >
                        <option value="">Select…</option>
                        <option>PG I — High Danger</option>
                        <option>PG II — Medium Danger</option>
                        <option>PG III — Low Danger</option>
                        <option>N/A</option>
                      </select>
                    </Field>
                    <Field label="Packaging Type">
                      <input
                        value={pkgType} onChange={e => setPkgType(e.target.value)}
                        placeholder="e.g. 4G Box, 1A2 Drum" style={inputSt}
                        onFocus={focusBorder} onBlur={blurBorder}
                      />
                    </Field>
                  </div>

                  {/* Radioactive-specific fields */}
                  {showRadio && (
                    <>
                      <div style={{
                        height: '1px', backgroundColor: BORDER, margin: '4px 0',
                      }} />
                      <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' as const,
                        letterSpacing: '0.12em', color: TEXT2, marginBottom: '4px' }}>
                        Radioactive — Additional Details (optional)
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Field label="Transport Index (TI)">
                          <input
                            value={tiIndex} onChange={e => setTiIndex(e.target.value)}
                            placeholder="e.g. 0.5" style={inputSt}
                            onFocus={focusBorder} onBlur={blurBorder}
                          />
                        </Field>
                        <Field label="Isotope / Radionuclide">
                          <input
                            value={isotope} onChange={e => setIsotope(e.target.value)}
                            placeholder="e.g. Co-57" style={inputSt}
                            onFocus={focusBorder} onBlur={blurBorder}
                          />
                        </Field>
                        <Field label="Package Category">
                          <select
                            value={pkgCat} onChange={e => setPkgCat(e.target.value)}
                            style={{ ...inputSt, cursor: 'pointer' }}
                            onFocus={focusBorder} onBlur={blurBorder}
                          >
                            <option value="">Select…</option>
                            <option>Category I-WHITE</option>
                            <option>Category II-YELLOW</option>
                            <option>Category III-YELLOW</option>
                            <option>EXCEPTED</option>
                          </select>
                        </Field>
                      </div>
                    </>
                  )}

                </div>
              </SectionCard>
            )}

            {/* ── 06 Documents ────────────────────────────────────────── */}
            <SectionCard number="06" title="Supporting Documents">

              {/* Drop zone */}
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
                  Drop files here or{' '}
                  <span style={{ color: ACCENT, fontWeight: 600 }}>browse</span>
                </p>
                <p style={{ fontSize: '11px', color: MUTED }}>
                  SDS · Photos · Packing List · Technical Data Sheet
                </p>
                <p style={{ fontSize: '10px', color: MUTED, marginTop: '4px' }}>
                  PDF, PNG, JPG, XLSX — max 20 MB each
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.doc,.docx"
                onChange={e => addFiles(e.target.files)}
                style={{ display: 'none' }}
              />

              {/* File list */}
              {files.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  {files.map((f, i) => (
                    <div
                      key={`${f.name}-${i}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px', backgroundColor: TH_BG,
                        border: `1px solid ${BORDER}`, borderRadius: '4px',
                      }}
                    >
                      <FileText size={14} color={ACCENT} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: TEXT2, flex: 1,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                        {f.name}
                      </span>
                      <span style={{ fontSize: '11px', color: MUTED, flexShrink: 0 }}>
                        {(f.size / 1024).toFixed(0)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
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

            {/* ── 07 Additional Comments ───────────────────────────────── */}
            <SectionCard number="07" title="Additional Comments">
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                rows={4}
                placeholder="Special handling requirements, delivery constraints, Incoterms preference, or any other relevant details…"
                style={{ ...inputSt, resize: 'none', lineHeight: 1.6 }}
                onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                onBlur={e => (e.currentTarget.style.borderColor = INPUT_B)}
              />
            </SectionCard>

            {/* ── Submit ──────────────────────────────────────────────── */}
            <div style={{
              backgroundColor: CARD, border: `1px solid ${BORDER}`,
              borderRadius: '8px', padding: '28px 24px',
              display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
              gap: '12px', textAlign: 'center' as const,
            }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '15px 48px',
                  backgroundColor: loading ? '#93c5fd' : ACCENT,
                  color: '#fff', border: 'none', borderRadius: '5px',
                  fontSize: '12px', fontWeight: 900,
                  textTransform: 'uppercase' as const, letterSpacing: '0.14em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.15s',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  minWidth: '220px', justifyContent: 'center',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = ACCENT; }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>Request Quote <ArrowRight size={14} /></>
                )}
              </button>
              <p style={{ fontSize: '11px', color: MUTED, lineHeight: 1.55, maxWidth: '400px' }}>
                Our logistics specialists will review your shipment information before
                issuing the quotation. Response within one business day.
              </p>
            </div>

          </form>
        </Container>
      </div>

    </div>
  );
};
