import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens — matches the DG quote form aesthetic
// ─────────────────────────────────────────────────────────────────────────────
const ACCENT  = '#2563eb';
const BORDER  = '#d1d9e0';
const TEXT2   = '#475569';
const TH_BG   = '#f4f6f9';

const inputSt: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: `1px solid ${BORDER}`,
  borderRadius: '4px',
  fontSize: '13px',
  color: '#1e293b',
  backgroundColor: '#fff',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
};

type FocusEvt = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
const focusBorder = (e: FocusEvt) => { e.currentTarget.style.borderColor = ACCENT; };
const blurBorder  = (e: FocusEvt) => { e.currentTarget.style.borderColor = BORDER; };

// ─────────────────────────────────────────────────────────────────────────────
// Reusable helpers
// ─────────────────────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '11px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.1em',
        color: TEXT2, marginBottom: '6px',
      }}>
        {label}
        {required && <span style={{ color: ACCENT, marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      marginBottom: '24px', paddingBottom: '12px',
      borderBottom: `1px solid ${BORDER}`,
    }}>
      <span style={{ fontSize: '11px', fontWeight: 800, color: ACCENT, letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums' }}>
        {num}
      </span>
      <span style={{ width: '1px', height: '14px', background: BORDER, flexShrink: 0 }} />
      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1e293b' }}>
        {title}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Enterprise Date Picker
// ─────────────────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplay(iso: string) {
  // Parse date components directly to avoid timezone shifting
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

interface DatePickerProps {
  value: string;          // ISO date string "YYYY-MM-DD", or ""
  onChange: (v: string) => void;
  disabled?: boolean;
}

function DatePicker({ value, onChange, disabled }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const d = value ? new Date(value + 'T12:00:00') : new Date();
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = value ? new Date(value + 'T12:00:00') : new Date();
    return d.getMonth();
  });
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const prevMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 0) { setViewYear(y => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 11) { setViewYear(y => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  // Build the calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  type Cell = { day: number; iso: string; curr: boolean };
  const cells: Cell[] = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i);
    cells.push({ day: daysInPrevMonth - i, iso: toIso(d), curr: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, iso: toIso(new Date(viewYear, viewMonth, i)), curr: true });
  }
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    const d = new Date(viewYear, viewMonth + 1, i);
    cells.push({ day: i, iso: toIso(d), curr: false });
  }

  const todayIso = toIso(new Date());

  const navBtnSt: React.CSSProperties = {
    width: '26px', height: '26px', border: `1px solid ${BORDER}`,
    borderRadius: '3px', background: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: TEXT2, transition: 'border-color 0.12s, background 0.12s', flexShrink: 0,
  };

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      {/* ── Trigger ─────────────────────────────────────────────────────────── */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => { if (!disabled) setOpen(o => !o); }}
        onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setOpen(o => !o); } }}
        style={{
          ...inputSt,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: disabled ? 'default' : 'pointer',
          borderColor: open ? ACCENT : BORDER,
          opacity: disabled ? 0.45 : 1,
          userSelect: 'none',
        }}
      >
        <span style={{ color: value ? '#1e293b' : '#94a3b8', fontSize: '13px', lineHeight: 1 }}>
          {value ? formatDisplay(value) : 'Select preferred training date'}
        </span>
        <Calendar size={13} color={TEXT2} style={{ flexShrink: 0, marginLeft: '8px' }} />
      </div>

      {/* ── Dropdown calendar ───────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 5px)', left: 0, zIndex: 100,
          background: '#fff',
          border: `1px solid ${BORDER}`,
          borderRadius: '5px',
          boxShadow: '0 10px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.06)',
          padding: '14px 14px 12px',
          width: '270px',
        }}>
          {/* Month / year navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <button
              type="button" onClick={prevMonth}
              style={navBtnSt}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = '#eff6ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = '#fff'; }}
            >
              <ChevronLeft size={12} />
            </button>

            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.03em' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button" onClick={nextMonth}
              style={navBtnSt}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = '#eff6ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = '#fff'; }}
            >
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
            {DAY_LABELS.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: '10px', fontWeight: 700,
                color: TEXT2, padding: '2px 0', letterSpacing: '0.05em',
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
            {cells.map((cell, i) => {
              const isSelected = cell.iso === value;
              const isToday    = cell.iso === todayIso;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { onChange(cell.iso); setOpen(false); }}
                  style={{
                    height: '32px',
                    borderRadius: '3px',
                    border: isToday && !isSelected ? `1px solid ${BORDER}` : '1px solid transparent',
                    background: isSelected ? ACCENT : 'transparent',
                    color: isSelected
                      ? '#fff'
                      : !cell.curr
                        ? '#c1ccd6'
                        : isToday
                          ? ACCENT
                          : '#0f172a',
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : isToday ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'background 0.08s, color 0.08s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#eff6ff';
                      if (!isToday && cell.curr) e.currentTarget.style.color = ACCENT;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = isSelected ? '#fff' : !cell.curr ? '#c1ccd6' : isToday ? ACCENT : '#0f172a';
                    }
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Form data
// ─────────────────────────────────────────────────────────────────────────────
const TRAINEES_OPTIONS = ['3–5', '6–15', '16–30', '31–50', '50+'];

const MODALITY_OPTIONS = [
  { id: 'in-person',  label: 'In-Person' },
  { id: 'virtual',    label: 'Virtual Live' },
  { id: 'hybrid',     label: 'Hybrid' },
  { id: 'on-demand',  label: 'On-Demand / E-Learning' },
];

const REGULATORY_OPTIONS = [
  'IATA DGR',
  'IMDG Code',
  '49 CFR',
  'TDG Canada',
  'NOM / Mexican Regulations',
  'Radioactive Materials',
  'Lithium Batteries',
  'WHMIS / GHS',
  'Custom Training Program',
];

const TRANSPORT_OPTIONS = ['Air', 'Ground', 'Maritime'];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export function TrainingProposalPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'Request Training Proposal | DG Training Programs | Global Gate México',
    description: 'Request a customized dangerous goods training proposal from Global Gate México. IATA CBTA certified, STPS registered. Corporate DG training across all transport modes.',
    canonical: 'https://globalgatemexico.com/training-proposal',
    lang: 'en',
  });

  // ── State ──────────────────────────────────────────────────────────────────
  const [companyName,    setCompanyName]    = useState('');
  const [contactName,    setContactName]    = useState('');
  const [jobTitle,       setJobTitle]       = useState('');
  const [email,          setEmail]          = useState('');
  const [phone,          setPhone]          = useState('');
  const [traineesRange,  setTraineesRange]  = useState('');
  const [modality,       setModality]       = useState<string[]>([]);
  const [regScope,       setRegScope]       = useState<string[]>([]);
  const [transport,      setTransport]      = useState<string[]>([]);
  const [prefDate,       setPrefDate]       = useState('');   // ISO "YYYY-MM-DD"
  const [dateFlexible,   setDateFlexible]   = useState(false);
  const [location,       setLocation]       = useState('');
  const [lang,           setLang]           = useState('');
  const [opReqs,         setOpReqs]         = useState('');
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');
  const [submitted,      setSubmitted]      = useState(false);

  // ── Multi-select toggles ───────────────────────────────────────────────────
  const toggle = (list: string[], setter: (v: string[]) => void, value: string) => {
    setter(list.includes(value) ? list.filter(x => x !== value) : [...list, value]);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const missing: string[] = [];
    if (!companyName.trim())    missing.push('Company Name');
    if (!contactName.trim())    missing.push('Contact Name');
    if (!email.trim())          missing.push('Corporate Email');
    if (!traineesRange)         missing.push('Number of Trainees');
    if (modality.length === 0)  missing.push('Training Modality');
    if (!lang)                  missing.push('Preferred Language');

    if (missing.length > 0) {
      setError(`Please complete required fields: ${missing.join(', ')}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/training-proposal-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            company_name:              companyName.trim(),
            contact_name:              contactName.trim(),
            job_title:                 jobTitle.trim()  || null,
            email:                     email.trim(),
            phone:                     phone.trim()     || null,
            trainees_range:            traineesRange,
            modality,
            regulatory_scope:          regScope,
            transportation_modes:      transport,
            preferred_training_date:   prefDate || null,
            date_flexible:             dateFlexible,
            training_location:         location.trim()  || null,
            language:                  lang,
            operational_requirements:  opReqs.trim()    || null,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed. Please try again.');
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-white min-h-screen pt-[106px]">
        <div className="max-w-xl mx-auto px-6 py-28 text-center">
          <div style={{
            width: '60px', height: '60px', background: '#eff6ff',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <CheckCircle2 size={28} color={ACCENT} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.01em' }}>
            Proposal Request Submitted
          </h2>
          <p style={{ fontSize: '15px', color: TEXT2, lineHeight: 1.65, marginBottom: '36px', maxWidth: '420px', margin: '0 auto 36px' }}>
            Your training request has been submitted successfully. Our team will contact you with a customized proposal.
          </p>
          <Link
            to="/training"
            style={{
              display: 'inline-block', padding: '11px 28px',
              background: ACCENT, color: '#fff', textDecoration: 'none',
              fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.14em', borderRadius: '4px',
            }}
          >
            ← Back to Training
          </Link>
        </div>
      </div>
    );
  }

  // ── Card button helper (modality + transport) ──────────────────────────────
  const cardBtn = (label: string, selected: boolean, onClick: () => void, wide = false) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      style={{
        padding: wide ? '9px 20px' : '9px 10px',
        border: `1.5px solid ${selected ? ACCENT : BORDER}`,
        borderRadius: '4px',
        background: selected ? '#eff6ff' : '#fff',
        color: selected ? ACCENT : TEXT2,
        fontSize: '12px',
        fontWeight: selected ? 700 : 500,
        cursor: 'pointer',
        textAlign: 'center',
        letterSpacing: '0.02em',
        lineHeight: 1.3,
        transition: 'border-color 0.12s, background 0.12s, color 0.12s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#fff' }}>

      {/* ── Hero header ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#060e1c', paddingTop: '106px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.09) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }} />
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: ACCENT }} />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p style={{ fontSize: '10px', color: 'rgba(96,165,250,0.85)', textTransform: 'uppercase', letterSpacing: '0.28em', fontWeight: 800, marginBottom: '16px' }}>
              IATA CBTA Provider · STPS Registered · Onsite & Remote Delivery
            </p>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '14px' }}>
              Request Training Proposal
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.58)', lineHeight: 1.65, maxWidth: '640px', marginBottom: '32px' }}>
              Tell us about your operational and regulatory training requirements. Our team will prepare a customized proposal based on your industry, transportation modes, regulatory scope, and operational needs.
            </p>
            {/* Trust strip */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
              {['IATA CBTA Certified', 'STPS Registered', 'Since 2006', 'All 9 Hazard Classes'].map(label => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{
                    width: '15px', height: '15px', borderRadius: '50%',
                    background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(96,165,250,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ color: '#60a5fa', fontWeight: 800, fontSize: '8px' }}>✓</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.04em' }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Form body ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 0 96px' }}>
        <Container>
          <div style={{ maxWidth: '880px' }}>
            <form onSubmit={handleSubmit} noValidate>

              {/* ── 01: Company Information ────────────────────────────────────── */}
              <div style={{ marginBottom: '52px' }}>
                <SectionHeader num="01" title="Company Information" />
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Company Name" required>
                    <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Logistics S.A. de C.V."
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                  <Field label="Contact Name" required>
                    <input value={contactName} onChange={e => setContactName(e.target.value)}
                      placeholder="Full name"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                  <Field label="Job Title">
                    <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                      placeholder="e.g. EHS Manager, DG Coordinator"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                  <Field label="Corporate Email" required>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                  <Field label="Phone Number">
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+52 (55) 0000-0000"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
                </div>
              </div>

              {/* ── 02: Training Requirements ──────────────────────────────────── */}
              <div style={{ marginBottom: '52px' }}>
                <SectionHeader num="02" title="Training Requirements" />

                {/* Trainees range */}
                <div className="grid sm:grid-cols-2 gap-5" style={{ marginBottom: '28px' }}>
                  <Field label="Number of Trainees" required>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={traineesRange}
                        onChange={e => setTraineesRange(e.target.value)}
                        style={{ ...inputSt, appearance: 'none', paddingRight: '36px', cursor: 'pointer', color: traineesRange ? '#1e293b' : '#94a3b8' }}
                        onFocus={focusBorder} onBlur={blurBorder}
                      >
                        <option value="" disabled>Select range</option>
                        {TRAINEES_OPTIONS.map(o => <option key={o} value={o}>{o} participants</option>)}
                      </select>
                      <ChevronDown size={14} color={TEXT2} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </Field>
                </div>

                {/* Training modality */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT2, marginBottom: '10px' }}>
                    Training Modality <span style={{ color: ACCENT }}>*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MODALITY_OPTIONS.map(({ id, label }) =>
                      cardBtn(label, modality.includes(id), () => toggle(modality, setModality, id))
                    )}
                  </div>
                </div>

                {/* Regulatory scope */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT2, marginBottom: '10px' }}>
                    Regulatory Scope
                  </label>
                  <div style={{ background: TH_BG, border: `1px solid ${BORDER}`, borderRadius: '4px', padding: '16px 20px' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                      {REGULATORY_OPTIONS.map(scope => {
                        const sel = regScope.includes(scope);
                        return (
                          <label key={scope} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={sel}
                              onChange={() => toggle(regScope, setRegScope, scope)}
                              style={{ width: '14px', height: '14px', accentColor: ACCENT, cursor: 'pointer', flexShrink: 0 }}
                            />
                            <span style={{ fontSize: '12px', color: sel ? '#1e293b' : TEXT2, fontWeight: sel ? 600 : 400, lineHeight: 1.35 }}>
                              {scope}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Transportation modes */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: TEXT2, marginBottom: '10px' }}>
                    Transportation Modes
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {TRANSPORT_OPTIONS.map(mode =>
                      cardBtn(mode, transport.includes(mode), () => toggle(transport, setTransport, mode), true)
                    )}
                  </div>
                </div>
              </div>

              {/* ── 03: Project Details ────────────────────────────────────────── */}
              <div style={{ marginBottom: '48px' }}>
                <SectionHeader num="03" title="Project Details" />
                <div className="grid sm:grid-cols-2 gap-5" style={{ marginBottom: '20px' }}>

                  {/* ── Date picker ────────────────────────────────────────────── */}
                  <div>
                    <Field label="Preferred Training Date">
                      <DatePicker
                        value={prefDate}
                        onChange={setPrefDate}
                        disabled={dateFlexible}
                      />
                    </Field>
                    {/* Flexible checkbox */}
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      marginTop: '9px', cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={dateFlexible}
                        onChange={e => {
                          setDateFlexible(e.target.checked);
                          if (e.target.checked) setPrefDate('');
                        }}
                        style={{ width: '14px', height: '14px', accentColor: ACCENT, cursor: 'pointer', flexShrink: 0 }}
                      />
                      <span style={{ fontSize: '12px', color: dateFlexible ? '#1e293b' : TEXT2, fontWeight: dateFlexible ? 600 : 400 }}>
                        Date is flexible
                      </span>
                    </label>
                  </div>

                  <Field label="Training Location">
                    <input value={location} onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Monterrey, NL — or Remote"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>

                  <Field label="Preferred Language" required>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={lang}
                        onChange={e => setLang(e.target.value)}
                        style={{ ...inputSt, appearance: 'none', paddingRight: '36px', cursor: 'pointer', color: lang ? '#1e293b' : '#94a3b8' }}
                        onFocus={focusBorder} onBlur={blurBorder}
                      >
                        <option value="" disabled>Select language</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                      <ChevronDown size={14} color={TEXT2} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </Field>
                </div>

                <Field label="Additional Operational Requirements">
                  <textarea
                    value={opReqs}
                    onChange={e => setOpReqs(e.target.value)}
                    placeholder="Describe your specific training needs, industry context, product types handled, compliance challenges, or any other relevant operational details…"
                    rows={5}
                    style={{ ...inputSt, resize: 'vertical', minHeight: '120px', lineHeight: 1.55 }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                </Field>
              </div>

              {/* ── Error ─────────────────────────────────────────────────────── */}
              {error && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '4px', padding: '12px 16px', marginBottom: '24px',
                }}>
                  <p style={{ fontSize: '13px', color: '#dc2626', margin: 0, lineHeight: 1.5 }}>{error}</p>
                </div>
              )}

              {/* ── Divider before submit ──────────────────────────────────────── */}
              <div style={{ height: '1px', background: BORDER, marginBottom: '32px' }} />

              {/* ── Submit ────────────────────────────────────────────────────── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '13px 40px',
                    background: loading ? '#93c5fd' : ACCENT,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = ACCENT; }}
                >
                  {loading ? 'Preparing Request…' : 'Request Proposal'}
                </button>
                <p style={{ fontSize: '11px', color: BORDER, margin: 0, lineHeight: 1.5 }}>
                  <span style={{ color: ACCENT }}>*</span> Required fields &nbsp;·&nbsp; Your information is handled with strict confidentiality.
                </p>
              </div>

            </form>
          </div>
        </Container>
      </section>

    </div>
  );
}
