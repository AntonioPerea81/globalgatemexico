import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap, Award, BookOpen, Globe, ShieldCheck, Users,
  CheckCircle, Clock, Plane, Truck, Ship, Radiation,
  FileText, ClipboardList, Tag, Search, RefreshCw,
  Package, Layers, FlaskConical, Zap,
  ChevronRight, Lock,
} from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Data ─────────────────────────────────────────────────────────────────────

const CREDENTIALS = [
  {
    designation: 'IATA Diploma',
    issuer: 'International Air Transport Association',
    detail: 'DGR Professional Diploma — Geneva, Switzerland',
  },
  {
    designation: 'ICAO TDC',
    issuer: 'International Civil Aviation Organization',
    detail: 'Training Developers Course — ICAO Doc 9941',
  },
  {
    designation: 'IATA CBTA',
    issuer: 'Competency-Based Training & Assessment',
    detail: 'Authorized DG training provider — by air',
  },
  {
    designation: 'IHMM CDGP',
    issuer: 'Institute of Hazardous Materials Management',
    detail: 'Certified Dangerous Goods Professional',
  },
  {
    designation: 'DGSA',
    issuer: 'Scottish Qualifications Authority',
    detail: 'Dangerous Goods Safety Adviser',
  },
  {
    designation: 'STPS',
    issuer: 'Secretaría del Trabajo y Previsión Social',
    detail: 'Agente Capacitador Externo Registrado',
  },
  {
    designation: 'DGTA',
    issuer: 'Dangerous Goods Trainers Association',
    detail: 'Institutional member',
  },
];

interface Certification {
  title: string;
  issuer: string;
  image: string;
  location?: string;
  tier: 'primary' | 'secondary';
  verifyUrl?: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    title: 'IATA Professional Diploma',
    issuer: 'International Air Transport Association',
    image: '/certifications/iata-diploma.png',
    location: 'Geneva, Switzerland',
    tier: 'primary',
  },
  {
    title: 'ICAO Training Developers Course',
    issuer: 'International Civil Aviation Organization',
    image: '/certifications/icao-tdc.png',
    tier: 'primary',
  },
  {
    title: 'IATA CBTA Provider',
    issuer: 'International Air Transport Association',
    image: '/certifications/cbta-provider.png',
    tier: 'primary',
    verifyUrl: 'https://www.iata.org/en/services/certification/training-development/cbta-center/cbta-certified-companies/global-gate-mexico-s-de-rl-de-cv/440489/',
  },
  {
    title: 'Dangerous Goods Safety Adviser',
    issuer: 'Scottish Qualifications Authority',
    image: '/certifications/dgsa-sqa.png',
    tier: 'primary',
  },
  {
    title: 'Certified DG Professional (CDGP)',
    issuer: 'Institute of Hazardous Materials Management',
    image: '/certifications/ihmm-cdgp.png',
    tier: 'secondary',
  },
  {
    title: 'STPS External Training Agent',
    issuer: 'Secretaría del Trabajo y Previsión Social',
    image: '/certifications/stps-dc5.png',
    tier: 'secondary',
  },
  {
    title: 'DGTA Membership',
    issuer: 'Dangerous Goods Trainers Association',
    image: '/certifications/dgta-membership.png',
    tier: 'secondary',
  },
];

const WHY_FEATURES = [
  { Icon: Award,        text: 'IATA CBTA Authorized Provider' },
  { Icon: Globe,        text: 'International certifications — IATA, IHMM, SQA, DGTA' },
  { Icon: Truck,        text: 'Real operational DG logistics experience since 2006' },
  { Icon: ShieldCheck,  text: 'Regulatory compliance expertise across all transport modes' },
  { Icon: Users,        text: 'Onsite, remote, and blended training delivery' },
  { Icon: ClipboardList,text: 'Fully customized corporate training programs' },
];

const PROGRAMS = [
  {
    Icon: Plane,
    code: 'IATA DGR',
    title: 'IATA Dangerous Goods Regulations',
    desc: 'Full IATA DGR compliance training for shippers, freight forwarders, and airline personnel. Initial and recurrent courses aligned with the current IATA edition.',
    audience: 'Shippers · Forwarders · Airlines',
  },
  {
    Icon: Truck,
    code: 'SCT / ADR',
    title: 'Ground Transportation of Dangerous Goods',
    desc: 'NOM-002-SCT/2011 compliance training for drivers, dispatchers, and operations teams. Covers classification, placarding, documentation, and emergency response.',
    audience: 'Drivers · Dispatchers · Operations',
  },
  {
    Icon: Ship,
    code: 'IMDG Code',
    title: 'IMDG Maritime Dangerous Goods',
    desc: 'Dangerous goods training under the International Maritime Dangerous Goods Code. Packing, stowage, segregation, documentation, and port compliance.',
    audience: 'Freight Forwarders · Port Operations',
  },
  {
    Icon: Zap,
    code: 'IATA PI 965–970',
    title: 'Lithium Batteries Shipping',
    desc: 'Specialized training for safe air, ground, and ocean shipping of lithium batteries under IATA PI 965–970, IMDG, and ADR. Covers all battery types and exception thresholds.',
    audience: 'Manufacturers · Logistics Teams',
  },
  {
    Icon: Radiation,
    code: 'IAEA / IATA Class 7',
    title: 'Radioactive Materials Transport',
    desc: 'Class 7 dangerous goods training covering IAEA regulations, IATA DGR Chapter 10, and CNSNS requirements for Mexico. For nuclear medicine, industrial, and research applications.',
    audience: 'Healthcare · Industrial · Research',
  },
  {
    Icon: FileText,
    code: 'GHS / HazCom',
    title: 'GHS & Safety Data Sheets',
    desc: 'GHS hazard classification and SDS preparation training. Section 14 transport data review, GHS label elements, and HazCom 2012 compliance for Mexico and the United States.',
    audience: 'EHS Teams · Chemical Industry',
  },
  {
    Icon: Package,
    code: 'All Modes',
    title: 'Warehouse DG Operations',
    desc: 'Practical training for warehouse personnel handling dangerous goods: receiving, storage, segregation, label inspection, spill response, and emergency procedures.',
    audience: 'Warehouse Teams · Supervisors',
  },
  {
    Icon: Layers,
    code: 'Custom',
    title: 'Customized In-Company Training',
    desc: 'Fully tailored dangerous goods training programs built around your specific products, transport modes, routes, and internal processes. Delivered onsite or remotely.',
    audience: 'All DG Personnel Profiles',
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    Icon: Search,
    title: 'Training Needs Assessment',
    desc: 'We evaluate your current DG operations, personnel roles, transport modes, and regulatory obligations to define the exact training scope required.',
  },
  {
    num: '02',
    Icon: BookOpen,
    title: 'Regulatory Scope Identification',
    desc: 'Applicable regulations identified per mode and route — IATA DGR, IMDG, ADR, SCT, DOT 49 CFR — ensuring training aligns with the exact rules that govern your operation.',
  },
  {
    num: '03',
    Icon: ClipboardList,
    title: 'Program Development',
    desc: 'Course content, practical exercises, and assessment criteria developed to competency-based standards. Role-specific modules for each function group.',
  },
  {
    num: '04',
    Icon: GraduationCap,
    title: 'Training Delivery',
    desc: 'Delivered by certified instructors with real operational DG experience — onsite at your facility, remotely, or in a hybrid format based on your requirements.',
  },
  {
    num: '05',
    Icon: CheckCircle,
    title: 'Competency Validation',
    desc: 'Written and practical assessments conducted per IATA CBTA methodology. Competency verified against defined performance objectives for each role.',
  },
  {
    num: '06',
    Icon: FileText,
    title: 'Certification Records Support',
    desc: 'Official training documentation issued, including certificates, constancias DC-3/DC-4, and competency records compliant with IATA DGR and SCT requirements.',
  },
];

// ── CertCard ─────────────────────────────────────────────────────────────────

function CertCard({ cert, primary = false }: { cert: Certification; primary?: boolean }) {
  return (
    <div
      className={cn(
        'group flex flex-col',
        'bg-[#0b1221]',
        'ring-1 ring-white/[0.07]',
        'shadow-[0_2px_16px_rgba(0,0,0,0.35)]',
        'hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.5)] hover:ring-white/[0.13]',
        'transition-all duration-300 ease-out',
      )}
    >
      {/* Badge — native 16:9 asset, integrity preserved */}
      <div className="aspect-video overflow-hidden">
        <img
          src={cert.image}
          alt={cert.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Caption */}
      <div className="px-4 py-4 border-t border-white/[0.05]">
        <p
          className="text-[7px] font-semibold uppercase tracking-[0.18em] mb-1.5 leading-none"
          style={{ color: '#C8A96B', opacity: 0.6 }}
        >
          {cert.issuer}
        </p>
        <h3
          className={cn(
            'font-extrabold uppercase tracking-wide text-white leading-snug',
            primary ? 'text-[11px]' : 'text-[10px]',
          )}
        >
          {cert.title}
        </h3>
        {cert.location && (
          <p className="text-[8px] text-white/25 mt-1.5 tracking-wide">{cert.location}</p>
        )}
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 mt-2.5 text-[8px] font-bold uppercase tracking-[0.13em] text-white/20 hover:text-primary/70 transition-colors duration-200"
          >
            Verified in IATA Registry
            <svg width="8" height="8" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <path d="M1.5 7.5L7.5 1.5M7.5 1.5H3M7.5 1.5V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>

    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function TrainingPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'Dangerous Goods Training & Certifications | IATA CBTA Provider | Global Gate México',
    description: 'IATA CBTA-authorized dangerous goods training programs for air, ground, maritime, and radioactive materials. Corporate training, international certifications, onsite and remote delivery.',
    canonical: 'https://globalgatemexico.com/training',
    lang: 'en',
  });

  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToPrograms() {
    document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-white">

      {/* ── 1. HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-[#060e1c] pt-[106px]">

        <div className="absolute inset-0 z-0">
          <img
            src="/images/dg-transport/dg-operations-team.webp"
            alt="Dangerous goods training operations"
            className="w-full h-full object-cover opacity-25 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1c]/98 via-[#060e1c]/88 to-[#060e1c]/65" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.09) 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

        <Container className="relative z-20 w-full pb-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            {/* Left — headline */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-[10px] text-accent/80 uppercase tracking-[0.28em] mb-5 font-black">
                IATA CBTA Provider · IHMM CDGP · SQA DGSA · STPS Agent
              </p>
              <h1 className="text-3xl md:text-4xl xl:text-[3.2rem] font-extrabold text-white leading-[1.08] tracking-tight">
                Internationally Recognized<br />
                <span className="text-primary">Dangerous Goods</span><br />
                Training
              </h1>
            </motion.div>

            {/* Right — sub + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:pl-10 lg:border-l lg:border-white/[0.08]"
            >
              <p className="text-base md:text-lg text-white/65 leading-relaxed mb-10">
                Train your personnel with internationally certified instructors, real operational experience, and competency-based dangerous goods programs aligned with IATA, IMDG, SCT, and DOT requirements.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_24px_rgba(7,56,223,0.5)] transition-all duration-200"
                >
                  Request Training Proposal
                </button>
                <button
                  onClick={scrollToPrograms}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border border-white/25 text-white hover:border-white/60 hover:bg-white/5 transition-all duration-200"
                >
                  View Training Programs
                </button>
              </div>

              {/* Quick stat strip */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.08]">
                {[
                  { value: '2006', label: 'Operating Since' },
                  { value: '6+',   label: 'Int\'l Certifications' },
                  { value: '9',    label: 'Hazard Classes' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-white mb-0.5">{value}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-[0.18em] font-bold">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ── 2. CREDENTIAL STRIP ────────────────────────────────────────────────── */}
      <section className="bg-[#070f1c] border-b border-white/[0.05]">
        <Container>

          {/* Statement */}
          <div className="py-7 flex items-center justify-between gap-8 border-b border-white/[0.05] flex-wrap">
            <p className="text-[9px] uppercase tracking-[0.28em] font-bold" style={{ color: '#C8A96B', opacity: 0.55 }}>
              International credentials. Operational experience. Competency-based training.
            </p>
            <p className="text-[9px] uppercase tracking-[0.22em] font-bold shrink-0" style={{ color: '#C8A96B', opacity: 0.35 }}>
              Since 2006
            </p>
          </div>

          {/* Seven credentials — horizontal, typographic only */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-px bg-white/[0.05]">
            {CREDENTIALS.map(({ designation, issuer, detail }) => (
              <div
                key={designation}
                className="bg-[#070f1c] px-5 py-6 hover:bg-white/[0.025] transition-colors duration-200"
              >
                <div className="text-[14px] font-black text-white tracking-tight mb-1.5 leading-none">
                  {designation}
                </div>
                <div className="text-[10px] text-white/35 font-medium leading-snug mb-1.5 tracking-wide">
                  {issuer}
                </div>
                <div className="text-[9px] leading-snug uppercase tracking-[0.12em] font-semibold" style={{ color: '#C8A96B', opacity: 0.6 }}>
                  {detail}
                </div>
              </div>
            ))}
          </div>

        </Container>
      </section>

      {/* ── 3. WHY TRAIN WITH GGM ─────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">

            {/* Left — large heading */}
            <FadeIn direction="left">
              <Eyebrow>Why Train with Global Gate México</Eyebrow>
              <h2 className="text-4xl md:text-5xl xl:text-[3.5rem] font-extrabold tracking-tight leading-[1.06] mb-8">
                Not Just<br />
                Trainers.<br />
                <span className="text-primary">Operators.</span>
              </h2>
              <p className="text-secondary text-[15px] leading-relaxed mb-5">
                Our training programs are built on nearly two decades of active dangerous goods logistics operations — air, ground, maritime, and radioactive material handling across Mexico and North America.
              </p>
              <p className="text-secondary text-[15px] leading-relaxed">
                When our instructors explain a classification procedure, a packaging requirement, or a border crossing scenario, they draw from operational experience — not theoretical frameworks. That difference is measurable in how your personnel apply the training on the floor.
              </p>
            </FadeIn>

            {/* Right — feature list */}
            <FadeIn direction="right" delay={0.1}>
              <div className="space-y-3">
                {WHY_FEATURES.map(({ Icon: WIcon, text }, i) => (
                  <div
                    key={text}
                    className="flex items-center gap-4 p-5 bg-[#f8f9fc] border border-black/[0.05] hover:border-primary/20 hover:bg-white transition-all duration-200"
                  >
                    <div className="w-9 h-9 bg-primary/8 flex items-center justify-center shrink-0">
                      <WIcon size={17} className="text-primary" />
                    </div>
                    <span className="text-[13px] font-semibold text-dark/80 leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              {/* Transport mode strip */}
              <div className="mt-8 p-6 bg-[#060e1c] flex flex-wrap gap-x-8 gap-y-4">
                <p className="w-full text-[9px] text-white/30 uppercase tracking-[0.2em] font-black mb-1">
                  Operational Coverage
                </p>
                {[
                  { Icon: Plane, label: 'Air' },
                  { Icon: Truck, label: 'Ground' },
                  { Icon: Ship, label: 'Maritime' },
                  { Icon: Radiation, label: 'Radioactive' },
                  { Icon: Package, label: 'Warehouse' },
                  { Icon: Globe, label: 'Cross-Border' },
                ].map(({ Icon: MIcon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <MIcon size={13} className="text-primary/70" />
                    <span className="text-[10px] text-white/45 uppercase tracking-[0.12em] font-bold">{label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 4. INTERNATIONAL CREDENTIALS ──────────────────────────────────────── */}
      <section
        className="py-24 lg:py-32"
        style={{ background: 'linear-gradient(180deg, #060e1c 0%, #070f1e 60%, #060e1c 100%)' }}
      >
        <Container>

          {/* Section header — two-col on desktop */}
          <FadeIn className="mb-14">
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <Eyebrow light>Certifications & Recognitions</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  International Credentials
                </h2>
              </div>
              <div className="lg:text-right">
                <p className="text-white/40 text-[14px] leading-relaxed max-w-md lg:ml-auto">
                  Internationally recognized training, compliance, and dangerous goods transportation credentials.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Primary tier — 4 cards */}
          <FadeIn delay={0.06}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[8px] text-primary/50 uppercase tracking-[0.22em] font-black">Primary Credentials</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {CERTIFICATIONS.filter(c => c.tier === 'primary').map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <CertCard cert={cert} primary />
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Secondary tier — 3 cards */}
          <FadeIn delay={0.18}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[8px] text-white/20 uppercase tracking-[0.22em] font-black">Additional Credentials</span>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {CERTIFICATIONS.filter(c => c.tier === 'secondary').map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <CertCard cert={cert} />
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Footer attestation */}
          <FadeIn delay={0.28} className="mt-12 pt-8 border-t border-white/[0.05] flex items-center justify-between gap-6 flex-wrap">
            <p className="text-[9px] text-white/20 uppercase tracking-[0.22em] font-black leading-relaxed">
              All certifications held by Global Gate México instructors · renewed per issuing body schedule
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <p className="text-[9px] text-primary/45 uppercase tracking-[0.18em] font-black">
                7 International Credentials
              </p>
            </div>
          </FadeIn>

        </Container>
      </section>

      {/* ── 5. TRAINING PROGRAMS ──────────────────────────────────────────────── */}
      <section id="programs" className="py-24 lg:py-32 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Training Programs</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Regulatory Training Across All Transport Modes
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              Each program is built to the applicable modal regulation — IATA DGR, IMDG Code, SCT NOM, or DOT 49 CFR — and delivered by instructors certified in that specific framework.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06]">
            {PROGRAMS.map(({ Icon: PIcon, code, title, desc, audience }, i) => (
              <FadeIn key={title} delay={i * 0.05}>
                <div className="group bg-white p-7 h-full flex flex-col hover:bg-[#060e1c] transition-colors duration-300">

                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <span className="inline-block px-2 py-0.5 bg-primary/8 text-primary text-[9px] font-black uppercase tracking-[0.15em] group-hover:bg-primary/20 transition-colors">
                      {code}
                    </span>
                    <div className="w-9 h-9 bg-primary/8 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <PIcon size={18} className="text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-3 leading-snug group-hover:text-white transition-colors">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-[12px] text-secondary group-hover:text-white/55 leading-relaxed flex-1 mb-5 transition-colors">
                    {desc}
                  </p>

                  {/* Audience */}
                  <p className="mt-auto text-[9px] text-primary/60 uppercase tracking-[0.15em] font-black group-hover:text-primary/80 transition-colors">
                    {audience}
                  </p>

                </div>
              </FadeIn>
            ))}
          </div>

          {/* Programs CTA */}
          <FadeIn delay={0.15} className="mt-12 border border-black/[0.07] bg-[#f8f9fc]">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center p-8 lg:p-10">
              <div>
                <p className="text-[9px] text-primary uppercase tracking-[0.22em] font-black mb-3">
                  Custom Training Programs
                </p>
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight mb-3 leading-snug">
                  Need a Customized Dangerous Goods<br className="hidden sm:block" /> Training Program?
                </h3>
                <p className="text-secondary text-[13px] leading-relaxed max-w-lg">
                  We help companies train personnel in compliance with international dangerous goods regulations across air, ground, and maritime operations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={scrollToContact}
                  className="px-7 py-3.5 text-[10px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_20px_rgba(7,56,223,0.35)] transition-all duration-200 whitespace-nowrap"
                >
                  Request Training Proposal
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-7 py-3.5 text-[10px] font-black uppercase tracking-[0.15em] bg-transparent border border-black/15 text-dark/60 hover:border-primary/40 hover:text-primary transition-all duration-200 whitespace-nowrap"
                >
                  Contact Our Team
                </button>
              </div>
            </div>
          </FadeIn>

        </Container>
      </section>

      {/* ── 6. TRAINING PROCESS ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#060e1c]">
        <Container>

          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow light>Our Training Process</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
              From Assessment to Certified Competency
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed">
              Every training engagement follows a structured six-stage process — from initial needs assessment through final certification records — ensuring your personnel emerge fully competent and documentably qualified.
            </p>
          </FadeIn>

          {/* Steps — 3+3 grid on desktop, stacked on mobile */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
            {PROCESS_STEPS.map(({ num, Icon: SIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="group bg-[#060e1c] p-8 h-full hover:bg-primary/[0.07] transition-colors duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[48px] font-black text-white/[0.04] group-hover:text-white/[0.06] leading-none select-none transition-colors">
                      {num}
                    </span>
                    <div className="w-10 h-10 bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                      <SIcon size={19} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-white mb-3">
                    {title}
                  </h3>
                  <p className="text-[12px] text-white/40 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Keyline */}
          <FadeIn delay={0.4} className="mt-12 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/80">
              Competency verified. Documentation complete. Your team is ready.
            </p>
          </FadeIn>

        </Container>
      </section>

      {/* ── INDUSTRIES SERVED ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-black/5">
        <Container>
          <FadeIn className="text-center mb-10">
            <p className="text-[10px] text-primary uppercase tracking-[0.22em] font-black">
              Industries Served
            </p>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Pharmaceutical & Biotech',
              'Chemical Manufacturing',
              'Oil & Gas',
              'Automotive',
              'Freight Forwarding',
              'Airlines & Ground Handlers',
              'E-Commerce & Retail',
              'Nuclear Medicine',
              'Industrial Gases',
              'Food & Agriculture',
              'Environmental Services',
              'Government & Defense',
            ].map((sector) => (
              <span
                key={sector}
                className="px-4 py-2 bg-[#f8f9fc] border border-black/5 text-[10px] font-bold text-dark/55 uppercase tracking-[0.1em] hover:border-primary/20 hover:text-dark/80 transition-colors"
              >
                {sector}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7. FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-black/5">
        <div className="bg-primary py-20 lg:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Subtle vertical rule */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.06] hidden xl:block" />

          <Container className="relative z-10 text-center">
            <FadeIn>
              <p className="text-[10px] text-white/45 uppercase tracking-[0.25em] font-black mb-5">
                IATA CBTA Provider · Dangerous Goods Training Authority
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-5 max-w-2xl mx-auto leading-[1.1]">
                Train Your Team Before Mistakes Become Expensive.
              </h2>
              <p className="text-white/60 text-[15px] max-w-xl mx-auto mb-10 leading-relaxed">
                We help companies develop competent dangerous goods personnel aligned with international regulations and the operational realities of air, ground, maritime, and cross-border logistics.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={scrollToContact}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-white text-primary hover:bg-white/92 hover:shadow-lg transition-all duration-200"
                >
                  Request a Proposal
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border-2 border-white/35 text-white hover:border-white hover:bg-white/10 transition-all duration-200"
                >
                  Contact Our Team
                </button>
              </div>
            </FadeIn>
          </Container>
        </div>
      </section>

    </div>
  );
}
