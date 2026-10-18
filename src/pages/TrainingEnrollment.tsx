import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CreditCard, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Container, Eyebrow } from '../components/UI';
import { supabase } from '../lib/supabase';
import { Turnstile } from '@marsidev/react-turnstile';
import { usePageMeta } from '../hooks/usePageMeta';
import { trackPurchase } from '../lib/analytics';

const DATES = [
  { suffix: '2027-01', label: 'January 19–21, 2027' },
  { suffix: '2027-02', label: 'February 16–18, 2027' },
  { suffix: '2027-04', label: 'April 13–15, 2027' },
  { suffix: '2027-05', label: 'May 18–20, 2027' },
  { suffix: '2027-06', label: 'June 22–24, 2027' },
];

const COURSES = {
  '7.1': { id: 'iata-71-initial', prefix: '71i', title: 'Preparing Dangerous Goods Consignments — Initial' },
  '7.3': { id: 'iata-73-initial', prefix: '73i', title: 'Accepting Dangerous Goods Consignments — Initial' },
} as const;

type FunctionCode = keyof typeof COURSES;
type Participant = { fullName: string; email: string; jobTitle: string };

const money = (cents: number) => new Intl.NumberFormat('en-CA', {
  style: 'currency', currency: 'CAD', currencyDisplay: 'code',
}).format(cents / 100);

const normalizeReferralCode = (value: string) => value
  .toUpperCase()
  .replace(/[^A-Z0-9-]/g, '')
  .slice(0, 32);

const ATTRIBUTION_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export function TrainingEnrollmentPage() {
  const [params] = useSearchParams();
  const initialFunction = params.get('function') === '7.3' ? '7.3' : '7.1';
  const [functionCode, setFunctionCode] = useState<FunctionCode>(initialFunction);
  const course = COURSES[functionCode];
  const suggestedCohort = params.get('cohort');
  const [dateSuffix, setDateSuffix] = useState(
    suggestedCohort?.startsWith(`${course.prefix}-`) ? suggestedCohort.replace(`${course.prefix}-`, '') : DATES[0].suffix,
  );
  const [buyer, setBuyer] = useState({ name: '', email: '', phone: '', company: '', country: 'CA' });
  const [referralCode, setReferralCode] = useState(() => normalizeReferralCode(params.get('ref') ?? ''));
  const attribution = useMemo(() => Object.fromEntries(
    ATTRIBUTION_PARAMS.flatMap((key) => {
      const value = params.get(key)?.trim();
      return value ? [[key, value.slice(0, 160)]] : [];
    }),
  ), [params]);
  const [participants, setParticipants] = useState<Participant[]>([{ fullName: '', email: '', jobTitle: '' }]);
  const [accepted, setAccepted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const enrollmentEnabled = import.meta.env.VITE_ENROLLMENT_ENABLED === 'true';

  usePageMeta({
    title: 'Secure Course Enrollment | Global Gate México',
    description: 'Enroll in GGM live virtual IATA CBTA training and pay securely through PayPal.',
    canonical: 'https://globalgatemexico.com/training/enrollment',
    lang: 'en',
  });

  useEffect(() => window.scrollTo(0, 0), []);
  useEffect(() => setDateSuffix(DATES[0].suffix), [functionCode]);

  const subtotal = participants.length * 120000;
  const tax = 0;
  const total = subtotal + tax;
  const selectedDate = useMemo(() => DATES.find((date) => date.suffix === dateSuffix) ?? DATES[0], [dateSuffix]);

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    setParticipants((current) => current.map((participant, position) => position === index ? { ...participant, [field]: value } : participant));
  };

  const setSeatCount = (count: number) => {
    setParticipants((current) => Array.from({ length: count }, (_, index) => current[index] ?? { fullName: '', email: '', jobTitle: '' }));
  };

  const startCheckout = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!enrollmentEnabled) {
      setError('Secure online payment is being connected. Please return shortly or contact GGM for assistance.');
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          courseId: course.id,
          cohortCode: `${course.prefix}-${dateSuffix}`,
          buyer,
          participants,
          referralCode,
          attribution,
          turnstileToken,
        },
      });
      if (invokeError || !data?.approvalUrl) throw new Error(data?.error ?? invokeError?.message ?? 'Unable to start PayPal checkout');
      window.location.assign(data.approvalUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start PayPal checkout');
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#f7f8fb] min-h-screen py-20 lg:py-28">
      <Container>
        <Link to={`/training/iata-cbta-${functionCode.replace('.', '-')}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-primary mb-8">
          <ArrowLeft size={15} /> Back to course
        </Link>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_370px] gap-8 lg:gap-12 items-start">
          <form onSubmit={startCheckout} className="bg-white border border-black/[0.07] p-6 md:p-10 shadow-[0_20px_60px_rgba(8,20,45,0.06)]">
            <Eyebrow>Secure enrollment</Eyebrow>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Reserve your seat</h1>
            <p className="text-secondary leading-relaxed mb-9">Complete the participant information below. Your selected seats are held for 30 minutes when you continue to PayPal.</p>

            {!enrollmentEnabled && (
              <div className="mb-8 border-l-[3px] border-[#d6b850] bg-[#fffaf0] p-4 text-sm text-dark/70">
                The enrollment form is ready, and the PayPal Sandbox connection is currently being activated. No payment can be submitted yet.
              </div>
            )}

            <section className="mb-10">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] mb-5">1. Course selection</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-xs font-bold text-dark/70">Function
                  <select value={functionCode} onChange={(event) => setFunctionCode(event.target.value as FunctionCode)} className="mt-2 w-full border border-black/10 bg-white px-4 py-3 text-sm text-dark outline-none focus:border-primary">
                    <option value="7.1">Function 7.1 — Preparing consignments</option>
                    <option value="7.3">Function 7.3 — Accepting consignments</option>
                  </select>
                </label>
                <label className="text-xs font-bold text-dark/70">Course date
                  <select value={dateSuffix} onChange={(event) => setDateSuffix(event.target.value)} className="mt-2 w-full border border-black/10 bg-white px-4 py-3 text-sm text-dark outline-none focus:border-primary">
                    {DATES.map((date) => <option key={date.suffix} value={date.suffix}>{date.label}</option>)}
                  </select>
                </label>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] mb-5">2. Purchaser information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full name" required value={buyer.name} onChange={(value) => setBuyer({ ...buyer, name: value })} />
                <Field label="Email" type="email" required value={buyer.email} onChange={(value) => setBuyer({ ...buyer, email: value })} />
                <Field label="Company" value={buyer.company} onChange={(value) => setBuyer({ ...buyer, company: value })} />
                <Field label="Phone" type="tel" value={buyer.phone} onChange={(value) => setBuyer({ ...buyer, phone: value })} />
              </div>
              <label className="mt-4 block text-xs font-bold text-dark/70">Referral Code (optional)
                <input
                  type="text"
                  autoComplete="off"
                  maxLength={32}
                  value={referralCode}
                  onChange={(event) => setReferralCode(normalizeReferralCode(event.target.value))}
                  className="mt-2 w-full border border-black/10 bg-white px-4 py-3 text-sm uppercase tracking-[0.08em] text-dark outline-none focus:border-primary"
                />
                <span className="mt-2 block text-[11px] font-normal normal-case tracking-normal text-dark/45">Enter your referral code, if applicable.</span>
              </label>
            </section>

            <section className="mb-9">
              <div className="flex items-center justify-between gap-5 mb-5">
                <h2 className="text-sm font-black uppercase tracking-[0.14em]">3. Participant details</h2>
                <label className="text-xs font-bold text-dark/70">Seats
                  <select value={participants.length} onChange={(event) => setSeatCount(Number(event.target.value))} className="ml-2 border border-black/10 bg-white px-3 py-2 text-sm">
                    {Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}
                  </select>
                </label>
              </div>
              <div className="space-y-4">
                {participants.map((participant, index) => (
                  <div key={index} className="border border-black/[0.07] p-4 md:p-5">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-primary font-black mb-4">Participant {index + 1}</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Field label="Full legal name" required value={participant.fullName} onChange={(value) => updateParticipant(index, 'fullName', value)} />
                      <Field label="Email" type="email" required value={participant.email} onChange={(value) => updateParticipant(index, 'email', value)} />
                      <Field label="Job title" value={participant.jobTitle} onChange={(value) => updateParticipant(index, 'jobTitle', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <label className="flex items-start gap-3 text-sm text-dark/65 leading-relaxed mb-7">
              <input type="checkbox" required checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 accent-[#0738df]" />
              <span>I confirm the information is correct and accept the <Link to="/terms-of-service" className="text-primary underline">terms of service</Link> and applicable course cancellation policy.</span>
            </label>
            {error && <p role="alert" className="mb-5 bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</p>}
            {import.meta.env.VITE_TURNSTILE_SITE_KEY && (
              <div className="mb-5 flex justify-center">
                <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
              </div>
            )}
            <button type="submit" disabled={submitting || !accepted || !enrollmentEnabled || (!!import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken)} className="w-full inline-flex items-center justify-center gap-3 bg-primary text-white px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-black disabled:bg-primary/35 disabled:cursor-not-allowed">
              <CreditCard size={17} /> {submitting ? 'Opening PayPal…' : `Continue to PayPal · ${money(total)}`}
            </button>
          </form>

          <aside className="bg-[#07101f] text-white p-7 md:p-8 lg:sticky lg:top-24">
            <p className="text-[10px] uppercase tracking-[0.18em] font-black text-[#d6b850] mb-3">Order summary</p>
            <h2 className="text-xl font-extrabold leading-snug mb-2">{course.title}</h2>
            <p className="text-sm text-white/45 mb-7">{selectedDate.label}<br />8:00 a.m.–4:00 p.m. Eastern Time</p>
            <div className="space-y-3 border-y border-white/10 py-5 text-sm">
              <Summary label={`${participants.length} participant${participants.length === 1 ? '' : 's'}`} value={money(subtotal)} />
              <Summary label="Tax (0%)" value={money(tax)} muted />
              <Summary label="Total" value={money(total)} strong />
            </div>
            <div className="space-y-4 mt-7 text-xs leading-relaxed text-white/45">
              <p className="flex gap-3"><LockKeyhole size={16} className="text-[#d6b850] shrink-0" /> Payment is completed on PayPal's secure checkout.</p>
              <p className="flex gap-3"><ShieldCheck size={16} className="text-[#d6b850] shrink-0" /> GGM does not store card or PayPal login details.</p>
              <p className="flex gap-3"><CheckCircle2 size={16} className="text-[#d6b850] shrink-0" /> Tuition and tax are calculated on the server before payment.</p>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

export function TrainingEnrollmentCompletePage() {
  const [params] = useSearchParams();
  const paypalOrderId = params.get('token');
  const sessionToken = params.get('session');
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [reference, setReference] = useState('');
  const [message, setMessage] = useState('Confirming your PayPal payment…');

  usePageMeta({
    title: 'Enrollment Confirmation | Global Gate México',
    description: 'GGM course enrollment confirmation.',
    canonical: 'https://globalgatemexico.com/training/enrollment/complete',
    lang: 'en',
  });

  useEffect(() => {
    if (!paypalOrderId || !sessionToken) {
      setState('error');
      setMessage('The PayPal order reference is missing.');
      return;
    }
    supabase.functions.invoke('capture-paypal-order', { body: { paypalOrderId, sessionToken } }).then(({ data, error }) => {
      if (error || data?.status !== 'COMPLETED') {
        setState('error');
        setMessage(data?.error ?? error?.message ?? 'We could not confirm the payment.');
        return;
      }
      setReference(data.reference);
      trackPurchase({
        transactionId: data.reference,
        value: Number(data.totalCents ?? 0) / 100,
        currency: data.currency ?? 'CAD',
        itemId: data.courseId ?? 'iata-cbta-training',
        quantity: Number(data.seats ?? 1),
      });
      setState('success');
      setMessage('Your payment and course enrollment have been confirmed.');
    });
  }, [paypalOrderId, sessionToken]);

  return (
    <main className="bg-[#f7f8fb] min-h-[75vh] py-24">
      <Container>
        <div className="max-w-2xl mx-auto bg-white border border-black/[0.07] p-8 md:p-12 text-center shadow-[0_20px_60px_rgba(8,20,45,0.06)]">
          <div className={`w-14 h-14 mx-auto mb-6 flex items-center justify-center ${state === 'success' ? 'bg-green-50 text-green-600' : state === 'error' ? 'bg-red-50 text-red-600' : 'bg-primary/7 text-primary'}`}>
            {state === 'success' ? <CheckCircle2 size={28} /> : <LockKeyhole size={26} />}
          </div>
          <h1 className="text-3xl font-extrabold mb-4">{state === 'success' ? 'Enrollment confirmed' : state === 'error' ? 'Payment needs attention' : 'Confirming enrollment'}</h1>
          <p className="text-secondary leading-relaxed mb-4">{message}</p>
          {reference && <p className="text-sm font-bold mb-8">GGM reference: {reference}</p>}
          <Link to="/training" className="inline-flex bg-primary text-white px-7 py-4 text-[11px] uppercase tracking-[0.15em] font-black">Return to training</Link>
        </div>
      </Container>
    </main>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="text-xs font-bold text-dark/70">{label}
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full border border-black/10 bg-white px-4 py-3 text-sm text-dark outline-none focus:border-primary" />
    </label>
  );
}

function Summary({ label, value, muted = false, strong = false }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return <div className={`flex justify-between gap-4 ${muted ? 'text-white/40' : strong ? 'text-white text-base font-extrabold pt-2' : 'text-white/70'}`}><span>{label}</span><span>{value}</span></div>;
}

