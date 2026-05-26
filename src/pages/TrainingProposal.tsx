import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronDown } from 'lucide-react';
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
  const [prefDates,      setPrefDates]      = useState('');
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
            company_name:             companyName.trim(),
            contact_name:             contactName.trim(),
            job_title:                jobTitle.trim()  || null,
            email:                    email.trim(),
            phone:                    phone.trim()     || null,
            trainees_range:           traineesRange,
            modality,
            regulatory_scope:         regScope,
            transportation_modes:     transport,
            preferred_dates:          prefDates.trim() || null,
            training_location:        location.trim()  || null,
            language:                 lang,
            operational_requirements: opReqs.trim()    || null,
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
                  <Field label="Preferred Training Dates">
                    <input value={prefDates} onChange={e => setPrefDates(e.target.value)}
                      placeholder="e.g. Q1 2026 or March 10–12"
                      style={inputSt} onFocus={focusBorder} onBlur={blurBorder} />
                  </Field>
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
