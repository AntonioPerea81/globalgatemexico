import { motion } from 'motion/react';
import {
  ShieldCheck, BookOpen, ClipboardList, FileText, Globe,
  AlertTriangle, Tag, Package, Award, GraduationCap,
  CheckCircle, ArrowRight, Route,
  Plane, Truck, Ship,
  FlaskConical, Droplets, Car, Stethoscope, Factory, Radiation,
} from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';

// ── Data ─────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    Icon: BookOpen,
    title: 'Regulations Updated Annually',
    desc: 'IATA DGR, IMDG Code, and DOT 49 CFR are revised on annual or biennial cycles. Many operators work from outdated editions without knowing it.',
  },
  {
    Icon: Tag,
    title: 'Incorrect DG Classification',
    desc: 'Wrong UN numbers, missed subsidiary hazards, or incorrect packing groups create failures at the point of acceptance — or worse, in transit.',
  },
  {
    Icon: FileText,
    title: 'Incomplete Documentation',
    desc: 'A Dangerous Goods Declaration with missing fields, incorrect net quantities, or wrong emergency contacts will be rejected by any compliant carrier.',
  },
  {
    Icon: Package,
    title: 'Non-Compliant Packaging',
    desc: 'Using packaging without valid UN performance test certificates, or applying the wrong packing instruction, is among the most common causes of shipment rejection.',
  },
  {
    Icon: Route,
    title: 'Misunderstood Modal Differences',
    desc: 'What is permitted by road may be prohibited by air. Quantities allowed on cargo aircraft may be forbidden on passenger flights. Modal differences catch operators unprepared.',
  },
];

const SERVICES = [
  {
    Icon: ShieldCheck,
    title: 'DG Compliance',
    desc: 'Validate and correct your dangerous goods operations before a carrier or regulator does. Classification, packaging, and documentation reviewed against current modal requirements.',
    items: [
      'Shipment compliance review',
      'Classification & packaging validation',
      'Pre-shipment documentation audit',
    ],
  },
  {
    Icon: BookOpen,
    title: 'Regulatory Consulting',
    desc: 'IATA DGR, IMDG Code, DOT 49 CFR, and SCT regulations differ in ways that create real operational risk. We clarify what applies to your operation and how.',
    items: [
      'IATA DGR & IMDG Code interpretation',
      'DOT 49 CFR cross-border requirements',
      'SCT NOM compliance — Mexico',
    ],
  },
  {
    Icon: ClipboardList,
    title: 'Compliance Audits',
    desc: 'Internal DG audits identify the gaps that lead to shipment rejections and regulatory penalties — before they reach your operation. Records, procedures, and documentation reviewed against current regulations.',
    items: [
      'Classification & documentation review',
      'DG declaration accuracy audit',
      'Corrective action plan development',
    ],
  },
  {
    Icon: FileText,
    title: 'SDS Review',
    desc: 'An incorrect Safety Data Sheet produces wrong UN numbers and non-compliant declarations. We verify your SDS library against current GHS standards and transport requirements.',
    items: [
      'UN number & hazard class verification',
      'GHS Section 14 transport data review',
      'Bilingual SDS — Spanish & English',
    ],
  },
  {
    Icon: Globe,
    title: 'Cross-Border DG Compliance',
    desc: 'Mexico–USA movements must comply with SCT NOM and DOT 49 CFR simultaneously. We align your classification, documentation, and packaging across both frameworks.',
    items: [
      'Mexico–USA regulatory alignment',
      'DOT 49 CFR & SCT dual compliance',
      'Cross-border documentation review',
    ],
  },
];

const WHY_GGM = [
  {
    Icon: Award,
    title: 'Real Operational Experience',
    desc: 'Our compliance expertise is not theoretical. For nearly two decades, we have classified shipments, prepared declarations, selected packaging, and moved dangerous goods by air, ground, and sea. That operational reality shapes every consultation we deliver.',
  },
  {
    Icon: Globe,
    title: 'Multimodal Expertise',
    desc: 'Most DG compliance failures happen at modal interfaces — where air requirements don\'t match what was accepted by road, or IMDG obligations were overlooked after IATA clearance. We operate across all three transport modes and understand where the differences create risk.',
  },
  {
    Icon: ShieldCheck,
    title: 'Practical Compliance Approach',
    desc: 'We don\'t produce compliance reports that sit on a shelf. We work with your team to correct what\'s wrong and build procedures that hold under carrier scrutiny, port inspection, and regulatory audit — compliance that functions in practice, not just on paper.',
  },
  {
    Icon: GraduationCap,
    title: 'Dangerous Goods Specialists Since 2006',
    desc: 'Global Gate México was founded to do one thing: handle dangerous goods correctly. As an IATA CBTA Certified Training School and licensed CNSNS radioactive material operator, our credentials reflect nearly two decades of specialized work — not a service line added to a general logistics operation.',
  },
];

const INDUSTRIES = [
  { Icon: Package,      label: 'Freight Forwarders' },
  { Icon: Plane,        label: 'Airlines' },
  { Icon: FlaskConical, label: 'Chemical Industry' },
  { Icon: Droplets,     label: 'Oil & Gas' },
  { Icon: Car,          label: 'Automotive' },
  { Icon: Stethoscope,  label: 'Laboratories' },
  { Icon: Factory,      label: 'Manufacturing' },
  { Icon: Radiation,    label: 'Radioactive Material Operations' },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export const DGConsultingCompliancePage = () => {
  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-white">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-[#060e1c] pt-[106px]">

        {/* Background image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/dg-transport/dg-documentation-services.webp"
            alt="Dangerous goods compliance and documentation review"
            className="w-full h-full object-cover opacity-25 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1c]/98 via-[#060e1c]/85 to-[#060e1c]/60" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.08) 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary z-20" />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent z-10" />

        <Container className="relative z-20 w-full pb-20 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            {/* Left — headline */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-[10px] text-accent/80 uppercase tracking-[0.28em] mb-5 font-black">
                DG Consulting · Compliance · Audits · SDS Review
              </p>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                Dangerous Goods Compliance
                <span className="block text-primary mt-1">Without Delays or Guesswork.</span>
              </h1>
            </motion.div>

            {/* Right — sub + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:pl-10 lg:border-l lg:border-white/10"
            >
              <p className="text-lg text-white/70 font-normal leading-relaxed mb-4">
                We help shippers, freight forwarders, and operators comply with dangerous goods regulations across air, ground, and maritime transport.
              </p>
              <p className="text-[15px] text-white/50 leading-relaxed mb-10">
                Shipment rejections, regulatory fines, and carrier incidents almost always trace back to classification errors, documentation gaps, or packaging failures. We work alongside your operation to close those gaps before they create consequences.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_24px_rgba(7,56,223,0.5)] transition-all duration-200"
                >
                  Request a Consultation
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border border-white/25 text-white hover:border-white/60 hover:bg-white/5 transition-all duration-200"
                >
                  Talk to a DG Specialist
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-white/10">
                {[
                  'IATA CBTA Certified',
                  'IMDG Qualified',
                  'Since 2006',
                  'Radioactive Material Licensed',
                ].map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center shrink-0">
                      <span className="text-accent font-black" style={{ fontSize: '8px' }}>✓</span>
                    </div>
                    <span className="text-[11px] text-white/65 font-medium tracking-wide">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ── 2. PROBLEM SECTION ──────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">

            {/* Left — problem items */}
            <FadeIn direction="left">
              <Eyebrow>Where Compliance Breaks Down</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
                Dangerous Goods Compliance Is Operational
              </h2>
              <p className="text-secondary text-[15px] leading-relaxed mb-10">
                Most DG compliance failures don't happen in the boardroom. They happen at the point of acceptance — when a carrier rejects a shipment because the declaration is wrong, the packaging is not certified, or the classification doesn't match the Safety Data Sheet.
              </p>

              <div className="space-y-6">
                {PROBLEMS.map(({ Icon: PIcon, title, desc }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="w-9 h-9 bg-primary/7 flex items-center justify-center shrink-0 mt-0.5">
                      <PIcon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-extrabold uppercase tracking-[0.1em] mb-1">{title}</h4>
                      <p className="text-[13px] text-secondary leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Right — GGM approach */}
            <FadeIn direction="right" delay={0.1}>
              <div className="bg-[#060e1c] p-8 xl:p-10">
                <Eyebrow light>The GGM Approach</Eyebrow>
                <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                  Global Gate México approaches compliance as an operational discipline. We have spent nearly two decades classifying shipments, preparing declarations, correcting packaging, and training the people who handle dangerous goods every day.
                </p>
                <p className="text-white/70 text-[15px] leading-relaxed mb-10">
                  We work alongside your team to build compliance into your operation — not layer it on after incidents occur.
                </p>

                <div className="space-y-4 border-t border-white/10 pt-8">
                  {[
                    'Practical implementation, not theoretical frameworks',
                    'Compliant procedures built to hold under carrier and regulator scrutiny',
                    'Operational expertise across air, ground, and maritime transport',
                    'IATA CBTA Certified — real credentials, verifiable qualifications',
                  ].map((point) => (
                    <div key={point} className="flex gap-3 items-start">
                      <CheckCircle size={13} className="text-accent mt-[3px] shrink-0" />
                      <span className="text-[13px] text-white/65 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting image */}
              <div className="mt-6 h-44 overflow-hidden">
                <img
                  src="/images/dg-transport/dg-warehouse-01.webp"
                  alt="DG operations"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 3. SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#f8f9fc] border-y border-black/5">
        <Container>
          <FadeIn className="max-w-2xl mb-14">
            <Eyebrow>Our Services</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Dangerous Goods Compliance Services
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              Each service addresses a specific layer of the DG compliance stack. We work with companies that need one service and with operators that need all five.
            </p>
          </FadeIn>

          {/* 3 + 2 centered layout */}
          <div className="flex flex-wrap justify-center gap-4">
            {SERVICES.map(({ Icon: SIcon, title, desc, items }, i) => (
              <FadeIn key={title} delay={i * 0.07} className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]">
                <div className="group bg-white border border-black/[0.07] hover:border-primary/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition-all duration-300 p-7 h-full flex flex-col">

                  {/* Icon + title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-9 h-9 bg-primary/7 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors duration-300">
                      <SIcon size={17} className="text-primary" />
                    </div>
                    <h3 className="text-[15px] font-extrabold tracking-tight leading-snug pt-1">
                      {title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-secondary text-[13px] leading-relaxed mb-5">
                    {desc}
                  </p>

                  {/* Bullets */}
                  <ul className="mt-auto space-y-2 pt-4 border-t border-black/[0.06]">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-[11px] font-semibold text-dark/55 uppercase tracking-[0.08em]">
                        <div className="w-1 h-1 bg-primary/40 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Centralized CTA */}
          <FadeIn delay={0.4} className="mt-12 flex justify-center">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-3 px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_24px_rgba(7,56,223,0.4)] transition-all duration-200"
            >
              Discuss Your DG Operation <ArrowRight size={14} />
            </button>
          </FadeIn>
        </Container>
      </section>

      {/* ── 4. WHY GGM ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Our Credentials</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Why Companies Work With GGM
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              There is no shortage of consultants who will hand you a checklist. What is rare is a team that has actually operated in the DG environment they are advising on.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-px bg-black/8">
            {WHY_GGM.map(({ Icon: WIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="flex gap-6 p-8 xl:p-10 bg-white h-full hover:bg-[#f8f9fc] transition-colors duration-200 group">
                  <div className="w-11 h-11 bg-primary/7 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/12 transition-colors duration-200">
                    <WIcon size={22} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-extrabold uppercase tracking-wide mb-3">{title}</h3>
                    <p className="text-secondary text-[13px] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Regulatory strip */}
          <FadeIn delay={0.3} className="mt-12">
            <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em]">
              <div className="h-px flex-1 bg-black/8" />
              <span className="text-dark/30 whitespace-nowrap">IATA · IMDG · ADR · DOT 49 CFR · SCT NOM · CNSNS · GHS</span>
              <div className="h-px flex-1 bg-black/8" />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── 5. INDUSTRIES ───────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-28 bg-[#060e1c]">
        <Container>
          <FadeIn className="max-w-2xl mb-14">
            <Eyebrow light>Industries We Support</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
              Specialists Across Critical Industrial Sectors
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed">
              Every industry handles dangerous goods differently. We understand the specific regulatory requirements, operational constraints, and compliance exposure of the sectors we work in.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
            {INDUSTRIES.map(({ Icon: IIcon, label }, i) => (
              <FadeIn key={label} delay={i * 0.06}>
                <div className="group flex flex-col items-center gap-3 px-3 py-7 border border-white/[0.07] hover:border-primary/50 hover:bg-primary/8 transition-all duration-200 cursor-default text-center">
                  <IIcon size={26} className="text-white/30 group-hover:text-primary transition-colors duration-200" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45 group-hover:text-white transition-colors duration-200 leading-tight">
                    {label}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 6. FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-black/5">

        <div className="bg-primary py-20 lg:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <Container className="relative z-10 text-center">
            <FadeIn>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black mb-4">
                Expert DG Compliance Support
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">
                Compliance Should Not Slow Down Your Operation
              </h2>
              <p className="text-white/65 text-[15px] max-w-2xl mx-auto mb-10 leading-relaxed">
                Whether you need a compliance audit, a regulatory review, SDS assessment, or ongoing DG support, our team is ready to work with you. Contact us to discuss your operation and what it takes to move your goods correctly.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-white text-primary hover:bg-white/90 hover:shadow-lg transition-all duration-200"
                >
                  Contact Our DG Team
                </button>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border-2 border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-200"
                >
                  Request a Consultation
                </button>
              </div>
            </FadeIn>
          </Container>
        </div>

      </section>

    </div>
  );
};
