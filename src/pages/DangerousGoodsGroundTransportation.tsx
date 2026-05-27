import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Flame, Wind, Droplet, Zap, AlertTriangle, AlertCircle, Package,
  CheckCircle, Truck, Plane, Car, Factory, Cog, ShieldCheck,
} from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Constants ─────────────────────────────────────────────────────────────────
const ACCENT       = '#ea580c';                               // DG-orange — hazmat industrial
const QUOTE_HREF   = '/request-quote';
const CONTACT_HREF = '/contact';

// ── Data ─────────────────────────────────────────────────────────────────────

const CARGO_CATEGORIES = [
  {
    Icon: Flame,
    un: 'Class 3',
    title: 'Flammable Liquids',
    desc: 'Gasoline, solvents, industrial coatings, and petroleum derivatives transported under NOM-002-SCT with complete DG documentation.',
  },
  {
    Icon: Wind,
    un: 'Classes 2.1 · 2.2 · 2.3',
    title: 'Gases',
    desc: 'Compressed, liquefied, refrigerated, and dissolved gases for industrial, hospital, and manufacturing applications.',
  },
  {
    Icon: Droplet,
    un: 'Class 8',
    title: 'Corrosives',
    desc: 'Acids, bases, and corrosive solutions for chemical, automotive, and manufacturing industries with containment protocols.',
  },
  {
    Icon: Zap,
    un: 'Class 9 · SEMARNAT',
    title: 'Lithium Batteries',
    desc: 'New, damaged, or end-of-life batteries. SEMARNAT authorization for lithium metal batteries destined for disposal.',
  },
  {
    Icon: AlertTriangle,
    un: 'Class 9 · CRETIB',
    title: 'Hazardous Waste',
    desc: 'CRETIB hazardous waste under SEMARNAT regulations with full traceability, movement manifests, and auditable procedures.',
  },
  {
    Icon: AlertCircle,
    un: 'Classes 6.1 · 6.2',
    title: 'Toxic & Infectious',
    desc: 'Toxic substances for pharmaceutical, chemical, and research industries under strict biosafety handling protocols.',
  },
  {
    Icon: Package,
    un: 'Class 9 · Misc.',
    title: 'Miscellaneous DG',
    desc: 'Magnetized materials, environmentally hazardous substances, dry ice, and other Class 9 and miscellaneous articles.',
  },
];

const CAPABILITIES = [
  {
    title: 'SICT-Authorized Units',
    desc: 'Vehicles with current SICT permits for the transport of hazardous materials and waste throughout Mexico.',
  },
  {
    title: 'Certified Operators',
    desc: 'Personnel with formal dangerous goods training under NOM-087-SCT and applicable Mexican and international regulations.',
  },
  {
    title: 'Complete Documentation',
    desc: 'Bill of lading, DG manifest, SDS, and emergency documents prepared before every dispatch — no exceptions.',
  },
  {
    title: 'UN-Certified Packaging',
    desc: 'UN-specification packaging matched to each DG class, packing group, and quantity for every shipment.',
  },
  {
    title: 'Marking & Labelling',
    desc: 'Marks, labels, placards, and orange panels applied per NOM-002-SCT/2011 and applicable international standards.',
  },
  {
    title: 'National Coverage',
    desc: 'Operations from Mexico City, Monterrey, Guadalajara, Bajío, industrial north corridor, and nationwide routes.',
  },
  {
    title: 'Real-Time Tracking',
    desc: 'Continuous GPS monitoring with position and shipment status reporting throughout the entire transport.',
  },
  {
    title: 'Emergency Protocols',
    desc: 'Incident response plan, Civil Protection coordination, and authority notification per Emergency Response Sheet.',
  },
];

const LITHIUM_POINTS = [
  'SEMARNAT authorization for lithium metal batteries destined for final disposal',
  'Transport of damaged, defective, or visibly deteriorated batteries under special containment procedures',
  'Specialized packaging and segregation for batteries at risk of short circuit or electrolyte leakage',
  'Complete documentation: SDS, shipper notification, manifest, and bill of lading',
  'Coordination with SEMARNAT-authorized hazardous waste handlers for end-of-life processing',
  'Multimodal compatibility for shipments with subsequent air transport component (IATA coordination)',
];

const INDUSTRIES = [
  { Icon: Flame,   label: 'Oil & Gas',               sub: 'Hydrocarbons · Refining · Distribution' },
  { Icon: Droplet, label: 'Chemical Industry',        sub: 'Reagents · Inputs · Specialty chemicals' },
  { Icon: Car,     label: 'Automotive',               sub: 'OEM · Tier 1 · Component manufacturing' },
  { Icon: Zap,     label: 'Energy & Renewables',      sub: 'Batteries · Solar · Wind · Storage' },
  { Icon: Factory, label: 'Industrial Manufacturing', sub: 'Plants · Operations · Internal logistics' },
  { Icon: Truck,   label: 'Freight Forwarders',       sub: 'Logistics operators · 3PL providers' },
  { Icon: Plane,   label: 'Airlines & Operators',     sub: 'Ground consolidation · Pre-air dispatch' },
  { Icon: Cog,     label: 'Industrial Operations',    sub: 'Mining · Construction · Maintenance' },
];

const REGULATIONS = [
  {
    code: 'Regl. TTMRP',
    name: 'Ground Transport Regulation',
    desc: 'Federal regulation establishing operational conditions for vehicles, routes, responsibilities, and documentation in hazardous materials and waste transport throughout Mexico.',
  },
  {
    code: "NOMs · Operational Standards",
    name: 'Hazardous Materials & Waste Standards',
    desc: "Mexico's official NOM standards establishing classification, description, packaging, marking, and road transport requirements for hazardous substances and waste. Includes NOM-002-SCT, NOM-003-SCT, NOM-004-SCT, and NOM-005-SCT.",
  },
  {
    code: 'SEMARNAT',
    name: 'Hazardous Waste Authorization',
    desc: 'Federal environmental authority issuing authorizations for the handling, transportation, and disposal logistics of hazardous waste — including lithium metal batteries intended for final disposal.',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export function DangerousGoodsGroundTransportationPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'Dangerous Goods Ground Transportation in Mexico | Global Gate México',
    description: 'Specialized dangerous goods ground transportation in Mexico: flammable liquids, gases, corrosives, lithium batteries, and hazardous waste. SICT and SEMARNAT authorized.',
    canonical: 'https://globalgatemexico.com/dangerous-goods-ground-transportation',
    lang: 'en',
    hreflang: [
      { lang: 'en', href: 'https://globalgatemexico.com/dangerous-goods-ground-transportation' },
      { lang: 'es', href: 'https://globalgatemexico.com/transporte-terrestre-mercancias-peligrosas' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dangerous-goods-ground-transportation' },
    ],
  });

  return (
    <div className="bg-[#060e1c]">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-[#030810] pt-[106px]">

        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/dg-transport/dg-ground-transport.webp"
            alt="Specialized dangerous goods ground transportation — DG logistics operations Mexico"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.42) brightness(0.35)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030810]/97 via-[#060e1c]/82 to-[#060e1c]/28" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1c]/96 via-transparent to-[#030810]/20" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        <Container className="relative z-20 w-full pb-20 lg:pb-28">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px" style={{ background: ACCENT, opacity: 0.45 }} />
                <span
                  className="text-[10px] font-black uppercase tracking-[0.28em]"
                  style={{ color: ACCENT, opacity: 0.75 }}
                >
                  NOM-002-SCT · SICT Authorized · SEMARNAT
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-[3.2rem] font-extrabold text-white leading-[1.04] tracking-tight mb-5">
                Dangerous Goods<br />
                <span style={{ color: ACCENT }}>Ground Transportation</span><br />
                in Mexico.
              </h1>

              <p className="text-white/38 text-xl md:text-2xl font-semibold tracking-tight mb-6 leading-snug">
                Regulatory Compliance. Operational Control.<br className="hidden sm:block" />
                High-Consequence Logistics.
              </p>

              <p className="text-white/52 text-[15px] leading-relaxed mb-10 max-w-2xl">
                Specialized hazardous materials transportation for flammable liquids, gases, corrosives,
                lithium batteries, and authorized hazardous waste throughout Mexico. SICT and SEMARNAT
                authorized. Full traceability on every operation.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to={QUOTE_HREF}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_28px_rgba(7,56,223,0.45)] transition-all duration-200 inline-block"
                >
                  Request Quote
                </Link>
                <Link
                  to={CONTACT_HREF}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] border text-white/68 hover:text-white hover:border-white/38 transition-all duration-200 inline-block"
                  style={{ borderColor: 'rgba(255,255,255,0.18)' }}
                >
                  Speak with a Specialist
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-7 border-t border-white/[0.07]">
                {[
                  'SICT Authorized',
                  'SEMARNAT Authorized',
                  'Certified Operators',
                  'Nationwide Coverage',
                ].map((tag) => (
                  <div key={tag} className="flex items-center gap-2.5">
                    <div className="w-1 h-1 rounded-full" style={{ background: ACCENT, opacity: 0.55 }} />
                    <span className="text-[11px] text-white/42 font-semibold tracking-wide">{tag}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── 2. CREDIBILITY STRIP ─────────────────────────────────────────────── */}
      <section className="bg-[#0a1422] border-t border-b border-white/[0.06]">
        <Container>
          <div className="flex flex-wrap divide-x divide-white/[0.06]">
            {[
              { num: '20+',       label: 'Years Operational',    sub: 'DG logistics since 2006' },
              { num: 'SICT',      label: 'Active Permits',       sub: 'Authorized hazmat vehicles' },
              { num: 'SEMARNAT',  label: 'Battery Authorization', sub: 'Lithium metal for disposal' },
              { num: 'Classes 2–9', label: 'Authorized DG Operations', sub: 'Excl. Class 1 and radioactive — specialized division' },
              { num: 'National',  label: 'Coverage',             sub: 'CDMX · MTY · GDL · Bajío · North' },
            ].map(({ num, label, sub }) => (
              <div key={label} className="flex-1 min-w-[150px] px-7 py-9 xl:px-9 xl:py-11">
                <p className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-none mb-1">{num}</p>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.15em] mb-1.5"
                  style={{ color: ACCENT, opacity: 0.68 }}
                >
                  {label}
                </p>
                <p className="text-[11px] text-white/26 leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. WHAT WE TRANSPORT ─────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white">
        <Container>

          <FadeIn className="mb-16">
            <Eyebrow>DG Classes 1–9 · NOM-002-SCT · Hazardous Materials</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 leading-[1.08]">
              What We Transport
            </h2>
            <p className="text-secondary text-[15px] max-w-xl leading-relaxed">
              We operate across all dangerous goods classes relevant to Mexican industry. We are not general
              freight carriers — we are specialized hazardous materials logistics operators with regulatory
              control at every stage.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06]">
            {CARGO_CATEGORIES.map(({ Icon, un, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.06}>
                <div className="group bg-white p-8 xl:p-9 h-full hover:bg-[#060e1c] transition-colors duration-300 cursor-default">
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="w-9 h-9 flex items-center justify-center border"
                      style={{ borderColor: `${ACCENT}28`, background: `${ACCENT}0d` }}
                    >
                      <Icon size={16} style={{ color: ACCENT }} />
                    </div>
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.16em]"
                      style={{ color: ACCENT, opacity: 0.72 }}
                    >
                      {un}
                    </span>
                  </div>
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-3 text-dark group-hover:text-white transition-colors leading-snug">
                    {title}
                  </h3>
                  <p className="text-[12px] text-secondary group-hover:text-white/42 leading-relaxed transition-colors">
                    {desc}
                  </p>
                </div>
              </FadeIn>
            ))}

            {/* 8th cell — Class 7 cross-reference */}
            <FadeIn delay={0.42}>
              <div className="bg-[#060e1c] p-8 xl:p-9 h-full flex flex-col">
                <div className="mb-5">
                  <span
                    className="text-[9px] font-black uppercase tracking-[0.18em]"
                    style={{ color: ACCENT, opacity: 0.5 }}
                  >
                    Specialized Division
                  </span>
                </div>
                <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-3 text-white">
                  Radioactive Material
                </h3>
                <p className="text-[12px] text-white/36 leading-relaxed mb-6 flex-1">
                  We also operate a specialized division for radioactive material logistics (Class 7)
                  under CNSNS and IATA DGR authorization.
                </p>
                <Link
                  to="/radioactive-material-logistics"
                  className="text-[10px] font-black uppercase tracking-[0.16em] transition-opacity hover:opacity-100"
                  style={{ color: ACCENT, opacity: 0.65 }}
                >
                  View Class 7 Division →
                </Link>
              </div>
            </FadeIn>
          </div>

        </Container>
      </section>

      {/* ── 4. OPERATIONAL CAPABILITIES ─────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-[#050c17]">
        <Container>

          <FadeIn className="mb-16">
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <Eyebrow light>Certified Operations · Technical Infrastructure</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Operational Capabilities
                </h2>
              </div>
              <p className="text-white/33 text-[14px] leading-relaxed lg:text-right max-w-md lg:ml-auto">
                We are not selling truck capacity. We provide an integrated regulatory logistics service for
                high-risk cargo, with documentary and operational control at every stage of the process.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-16">
            {CAPABILITIES.map(({ title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.05}>
                <div className="border-t pt-5" style={{ borderColor: `${ACCENT}22` }}>
                  <div className="w-5 h-px mb-4" style={{ background: ACCENT, opacity: 0.4 }} />
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-white mb-2.5">{title}</h3>
                  <p className="text-[12px] text-white/36 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Cinematic field operations strip */}
          <FadeIn>
            <div className="relative overflow-hidden" style={{ height: '420px' }}>
              <img
                src="/images/dg-transport/dg-field-operations.webp"
                alt="Field operations — dangerous goods ground transportation Mexico"
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.4) brightness(0.48)' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050c17]/94 via-[#050c17]/28 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050c17]/82 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-0 right-0">
                <Container>
                  <div className="flex items-end justify-between gap-6 flex-wrap">
                    <div>
                      <p
                        className="text-[9px] font-black uppercase tracking-[0.26em] mb-2"
                        style={{ color: ACCENT, opacity: 0.72 }}
                      >
                        DG Ground Operations · Mexico
                      </p>
                      <p className="text-white/58 text-[14px] font-semibold max-w-md leading-relaxed">
                        Hazardous materials logistics with full regulatory control from origin to final delivery
                      </p>
                    </div>
                    <div className="hidden lg:flex gap-3 shrink-0 flex-wrap pb-1">
                      {['NOM-002-SCT', 'Active SICT', 'GPS Tracking', 'Emergency Protocol'].map((tag) => (
                        <div key={tag} className="border border-white/[0.10] px-3.5 py-2">
                          <span className="text-[9px] text-white/38 uppercase tracking-[0.16em] font-bold">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          </FadeIn>

        </Container>
      </section>

      {/* ── 5. LITHIUM BATTERY SPECIALIZATION ───────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white border-t border-black/5">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start">

            <FadeIn direction="left">
              <div className="space-y-3">
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <img
                    src="/images/dg-transport/dg-specialized-packaging.webp"
                    alt="Specialized packaging for lithium batteries — Class 9 dangerous goods"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.72)' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e1c]/75 to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <p
                      className="text-[9px] font-black uppercase tracking-[0.2em] mb-1"
                      style={{ color: ACCENT, opacity: 0.88 }}
                    >
                      Specialized Packaging · Class 9
                    </p>
                    <p className="text-white/62 text-[12px] font-semibold">
                      UN 3480 · UN 3481 · UN 3090 · UN 3091
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src="/images/dg-transport/dg-process-packaging.webp"
                      alt="Dangerous goods packaging process"
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.65)' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#060e1c]/18" />
                  </div>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src="/images/dg-transport/dg-warehouse-01.webp"
                      alt="Specialized hazardous materials warehouse"
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.65)' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#060e1c]/18" />
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1}>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border"
                style={{ borderColor: `${ACCENT}30`, background: `${ACCENT}0a` }}
              >
                <Zap size={11} style={{ color: ACCENT }} />
                <span
                  className="text-[9px] font-black uppercase tracking-[0.22em]"
                  style={{ color: ACCENT }}
                >
                  High Specialization · SEMARNAT
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                Lithium Battery<br />
                <span style={{ color: ACCENT }}>Specialization</span>
              </h2>
              <p className="text-secondary text-[15px] leading-relaxed mb-4">
                Lithium battery transport is one of the highest regulatory complexity segments in ground
                logistics today. Packaging restrictions, loading conditions, and documentary requirements
                vary depending on battery state, type, and final destination.
              </p>
              <p className="text-secondary text-[14px] leading-relaxed mb-8">
                Global Gate México holds <strong>SEMARNAT authorization for the transport of lithium metal
                batteries destined for final disposal</strong>, positioning us as a reference operator for
                Mexico's manufacturing, automotive, and energy industries.
              </p>

              <div className="space-y-3 mb-10">
                {LITHIUM_POINTS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px]"
                      style={{ background: ACCENT, opacity: 0.58 }}
                    />
                    <span className="text-[13px] text-dark/68 leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <div
                className="p-5 border-l-2"
                style={{ borderColor: ACCENT, background: `${ACCENT}08` }}
              >
                <p
                  className="text-[11px] font-black uppercase tracking-[0.16em] mb-1.5"
                  style={{ color: ACCENT }}
                >
                  SEMARNAT Authorization
                </p>
                <p className="text-[13px] text-dark/65 leading-relaxed">
                  Global Gate México holds authorization from Mexico's Secretaría de Medio Ambiente y
                  Recursos Naturales for the transport of lithium metal batteries for final disposal — a
                  segment with significant regulatory restrictions in Mexico.
                </p>
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 6. FLEET ─────────────────────────────────────────────────────────── */}
      <section className="pt-28 lg:pt-40 bg-[#060e1c]">

        <Container className="mb-12 lg:mb-14">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <Eyebrow light>Specialized Units · Active SICT Permits</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Fleet &amp; DG Units
                </h2>
              </div>
              <p className="text-white/33 text-[14px] leading-relaxed lg:text-right max-w-md lg:ml-auto">
                Vehicles with current SICT permits for hazardous materials and waste transport. Equipped with
                DG emergency kits, correct placarding, and complete on-board documentation on every dispatch.
              </p>
            </div>
          </FadeIn>
        </Container>

        {/* Cinematic fleet strip */}
        <div className="relative overflow-hidden" style={{ height: '520px' }}>
          <img
            src="/images/dg-transport/dg-hero-main.webp"
            alt="Specialized fleet for dangerous goods transportation — Global Gate México"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.40) brightness(0.45)' }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1c]/92 via-[#060e1c]/22 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1c]/90 via-transparent to-transparent" />

          <div className="absolute bottom-8 left-0 right-0">
            <Container>
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <p
                    className="text-[9px] font-black uppercase tracking-[0.26em] mb-2"
                    style={{ color: ACCENT, opacity: 0.72 }}
                  >
                    Dangerous Goods Logistics · Specialized Operations
                  </p>
                  <p className="text-white/58 text-[14px] font-semibold max-w-sm leading-relaxed">
                    Authorized units, certified operators, complete DG documentation, and active emergency
                    protocols on every dispatch
                  </p>
                </div>
                <div className="hidden lg:flex gap-3 shrink-0 flex-wrap pb-1">
                  {['SICT Permits', 'Emergency Kit', 'DG Placards', 'Continuous GPS'].map((tag) => (
                    <div key={tag} className="border border-white/[0.10] px-3.5 py-2">
                      <span className="text-[9px] text-white/38 uppercase tracking-[0.16em] font-bold">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </div>
        </div>

        {/* Fleet capabilities */}
        <Container className="py-16 lg:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[
              {
                title: 'Load Capacity',
                desc: 'FTL and LTL units with compartmentalization adapted to the DG class, packing group, and segregation requirements of each shipment.',
              },
              {
                title: 'Operational Readiness',
                desc: 'Vehicles inspected before every dispatch. DG emergency kit, fire extinguisher, and containment equipment on board.',
              },
              {
                title: 'Secure Handling',
                desc: 'Loading and unloading protocols for dangerous goods with technical supervision on every high-risk operation.',
              },
              {
                title: 'Full Traceability',
                desc: 'Movement logs, departure times, routes taken, and shipment condition documented for post-operation audits.',
              },
            ].map(({ title, desc }) => (
              <FadeIn key={title}>
                <div className="border-t pt-5 border-white/[0.07]">
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-white mb-2.5">{title}</h3>
                  <p className="text-[12px] text-white/36 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>

      </section>

      {/* ── 7. INDUSTRIES WE SERVE ───────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-[#f8f9fc] border-t border-black/5">
        <Container>

          <FadeIn className="mb-14">
            <Eyebrow>Sectors · Industries · Markets</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 leading-[1.08]">
              Industries We Serve
            </h2>
            <p className="text-secondary text-[15px] max-w-xl leading-relaxed">
              Our dangerous goods ground transportation operations serve Mexico's most regulatory-intensive
              industrial sectors.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06]">
            {INDUSTRIES.map(({ Icon, label, sub }, i) => (
              <FadeIn key={label} delay={i * 0.05}>
                <div className="group bg-white p-7 xl:p-8 h-full hover:bg-[#060e1c] transition-colors duration-300 cursor-default">
                  <Icon
                    size={18}
                    className="mb-5 transition-colors duration-300"
                    style={{ color: ACCENT, opacity: 0.65 }}
                  />
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide mb-2 text-dark group-hover:text-white transition-colors">
                    {label}
                  </h3>
                  <p className="text-[11px] text-secondary group-hover:text-white/38 leading-snug transition-colors">
                    {sub}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

        </Container>
      </section>

      {/* ── 8. REGULATORY FRAMEWORK ──────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white border-t border-black/5">
        <Container>

          <FadeIn className="mb-16">
            <Eyebrow>Regulatory Compliance · Legal Framework</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 leading-[1.08]">
              Regulatory Framework
            </h2>
            <p className="text-secondary text-[15px] max-w-xl leading-relaxed">
              Dangerous goods ground transport in Mexico operates under a strict federal regulatory framework.
              Every GGM operation is validated against the full applicable regulatory stack before dispatch.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/[0.06]">
            {REGULATIONS.map(({ code, name, desc }, i) => (
              <FadeIn key={code} delay={i * 0.08}>
                <div className="group bg-white p-10 xl:p-12 h-full hover:bg-[#060e1c] transition-colors duration-300">
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.22em] mb-3"
                    style={{ color: ACCENT }}
                  >
                    {code}
                  </p>
                  <h3 className="text-[14px] font-extrabold uppercase tracking-wide mb-5 text-dark group-hover:text-white transition-colors leading-snug">
                    {name}
                  </h3>
                  <p className="text-[13px] text-secondary group-hover:text-white/45 leading-relaxed transition-colors">
                    {desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

        </Container>
      </section>

      {/* ── 9. OPERATIONS TEAM ───────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-[#060e1c]">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10 xl:gap-14 items-center">

            <FadeIn direction="left" className="lg:col-span-3">
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src="/images/dg-transport/dg-operations-team.webp"
                  alt="Operations team — dangerous goods transportation Global Gate México"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.52) brightness(0.6)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#060e1c]/52" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-[#060e1c]/72 backdrop-blur-sm px-4 py-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: ACCENT, opacity: 0.62 }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/62">
                    Certified Personnel · DG Operations
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1} className="lg:col-span-2">
              <Eyebrow light>Trained. Experienced. Accountable.</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
                The Operation Is Only As Good As the{' '}
                <span style={{ color: ACCENT }}>People Running It.</span>
              </h2>
              <p className="text-white/42 text-[14px] leading-relaxed mb-8">
                Our field personnel are trained in dangerous goods handling under applicable Mexican and
                international regulations. Emergency procedures are known, practiced, and periodically audited.
              </p>

              <div className="space-y-4">
                {[
                  'Operators with formal dangerous goods handling training',
                  'Knowledge of NOM-002-SCT, compatibility tables, and segregation requirements',
                  'Active emergency response and incident procedures',
                  'Complete on-board DG documentation on every dispatched unit',
                  'Technical supervision on high-risk loading and unloading operations',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle
                      size={14}
                      className="shrink-0 mt-0.5"
                      style={{ color: ACCENT, opacity: 0.55 }}
                    />
                    <span className="text-[13px] text-white/48 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 10. FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative py-32 lg:py-48 bg-[#030810] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/dg-transport/dg-ground-transport.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.18) brightness(0.18)' }}
          />
          <div className="absolute inset-0 bg-[#030810]/82" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        <Container className="relative z-10 text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-5 mb-10">
              <div className="h-px w-14" style={{ background: ACCENT, opacity: 0.28 }} />
              <Truck size={16} style={{ color: ACCENT, opacity: 0.42 }} />
              <div className="h-px w-14" style={{ background: ACCENT, opacity: 0.28 }} />
            </div>

            <h2 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white tracking-tight mb-5 leading-[1.06]">
              Need Specialized Support for<br />
              <span style={{ color: ACCENT }}>Dangerous Goods Transport?</span>
            </h2>

            <p className="text-white/38 text-[15px] leading-relaxed mb-12 max-w-lg mx-auto">
              Our DG specialists will evaluate your requirements, confirm applicable regulatory obligations,
              and provide a detailed operational proposal.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to={QUOTE_HREF}
                className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.18em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_36px_rgba(7,56,223,0.45)] transition-all duration-200 inline-block"
              >
                Request Quote
              </Link>
              <Link
                to={CONTACT_HREF}
                className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.18em] border border-white/18 text-white/65 hover:text-white hover:border-white/35 transition-all duration-200 inline-block"
              >
                Speak with a Specialist
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>

    </div>
  );
}
