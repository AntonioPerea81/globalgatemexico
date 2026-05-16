import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap, Award, BookOpen, Globe, ShieldCheck, Users,
  CheckCircle, Clock, Plane, Truck, Ship, Radiation,
  FileText, ClipboardList, Tag, Search, RefreshCw,
  BadgeCheck, Package, Layers, FlaskConical, Zap,
  ChevronRight, ArrowRight, Lock,
} from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Data ─────────────────────────────────────────────────────────────────────

const CREDENTIALS = [
  {
    code: 'IATA',
    name: 'International Air Transport Association',
    desc: 'CBTA-authorized provider for dangerous goods transport by air',
  },
  {
    code: 'CBTA',
    name: 'Competency-Based Training & Assessment',
    desc: 'Global standard for DG personnel qualification and assessment',
  },
  {
    code: 'IHMM',
    name: 'Institute of Hazardous Materials Management',
    desc: 'CDGP certification — international professional standard',
  },
  {
    code: 'DGTA',
    name: 'Dangerous Goods Trainers Association',
    desc: 'Institutional membership and recognized training authority',
  },
  {
    code: 'STPS',
    name: 'Secretaría del Trabajo y Previsión Social',
    desc: 'Authorized external training agent registered in Mexico',
  },
  {
    code: 'SQA DGSA',
    name: 'Scottish Qualifications Authority',
    desc: 'Dangerous Goods Safety Adviser — UK-recognized certification',
  },
];

const CERTIFICATIONS = [
  {
    Icon: GraduationCap,
    title: 'IATA Professional Diploma',
    location: 'Geneva, Switzerland',
    desc: 'Professional training in Dangerous Goods Regulations completed at IATA headquarters — the primary global standard for air transport compliance.',
  },
  {
    Icon: Award,
    title: 'IATA CBTA Provider',
    location: 'Competency-Based Training & Assessment',
    desc: 'Global Gate México certified as an IATA CBTA provider — authorized to train, assess, and certify dangerous goods personnel under the international competency framework.',
  },
  {
    Icon: ShieldCheck,
    title: 'CDGP — Certified Dangerous Goods Professional',
    location: 'Institute of Hazardous Materials Management',
    desc: 'International certification issued by IHMM validating advanced competency in dangerous goods classification, documentation, and regulatory compliance.',
  },
  {
    Icon: BadgeCheck,
    title: 'Dangerous Goods Safety Adviser (DGSA)',
    location: 'Scottish Qualifications Authority',
    desc: 'Certification recognized under UK dangerous goods transport legislation — demonstrating cross-jurisdictional compliance expertise for international operations.',
  },
  {
    Icon: ClipboardList,
    title: 'STPS External Training Agent',
    location: 'Secretaría del Trabajo y Previsión Social',
    desc: 'Authorized and registered external training provider before the Mexican labor authority — enabling issuance of official DC-3 and DC-4 training constancias.',
  },
  {
    Icon: Users,
    title: 'DGTA Membership',
    location: 'Dangerous Goods Trainers Association',
    desc: 'Institutional member of the Dangerous Goods Trainers Association — connected to a global network of DG training professionals and regulatory specialists.',
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
        <Container className="py-0">

          <div className="py-10 mb-8 text-center">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] font-black">
              Backed by internationally recognized certifications and real operational experience since 2006
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 border-t border-white/[0.05]">
            {CREDENTIALS.map(({ code, name, desc }, i) => (
              <div
                key={code}
                className={cn(
                  'px-6 py-7 border-r border-white/[0.05] last:border-r-0',
                  'group hover:bg-white/[0.03] transition-colors duration-200',
                  i >= 3 ? 'border-t border-white/[0.05] xl:border-t-0' : ''
                )}
              >
                <div className="text-[18px] font-black text-white mb-2 tracking-tight">{code}</div>
                <div className="text-[10px] text-white/35 leading-snug mb-2 font-medium">{name}</div>
                <div className="text-[10px] text-primary/70 leading-snug">{desc}</div>
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

      {/* ── 4. CERTIFICATIONS & RECOGNITIONS ──────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#f8f9fc] border-y border-black/5">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Certifications & Recognitions</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              International Credentials Behind Every Program
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              Our instructors and programs operate under the highest international standards for dangerous goods training — verified by global certification bodies across multiple regulatory frameworks.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CERTIFICATIONS.map(({ Icon: CIcon, title, location, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="group bg-white border border-black/[0.07] hover:border-primary/25 hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden">
                  {/* Top accent bar */}
                  <div className="h-[3px] bg-primary w-full group-hover:bg-primary transition-colors" />

                  {/* Icon area */}
                  <div className="p-7 pb-0 flex items-center gap-4">
                    <div className="w-11 h-11 bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                      <CIcon size={22} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] text-primary/70 uppercase tracking-[0.18em] font-black">{location}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7 flex-1 flex flex-col">
                    <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-3 leading-snug">
                      {title}
                    </h3>
                    <p className="text-[12px] text-secondary leading-relaxed flex-1">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
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
                  <div className="mt-auto">
                    <p className="text-[9px] text-primary/60 uppercase tracking-[0.15em] font-black mb-3 group-hover:text-primary/80 transition-colors">
                      {audience}
                    </p>
                    <button
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-primary group-hover:text-white/80 hover:gap-3 transition-all duration-200"
                    >
                      Request Info <ArrowRight size={11} />
                    </button>
                  </div>

                </div>
              </FadeIn>
            ))}
          </div>
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
