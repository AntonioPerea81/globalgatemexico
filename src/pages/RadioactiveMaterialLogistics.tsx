import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Lock, Eye, FileText, Shield,
  CheckCircle, Radiation,
} from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Data ──────────────────────────────────────────────────────────────────────

const PACKAGING_CAPABILITIES = [
  'Type A packages for radioactive materials — all transport modes',
  'Industrial packaging for exempt and surface-contaminated objects (SCO)',
  'Overpack assembly for multi-piece and fragile shipments',
  'IAEA-compliant marking: UN number, proper shipping name, trefoil symbol',
  'Category I-WHITE, II-YELLOW, III-YELLOW label application and verification',
  'Transport Index (TI) calculation and package dose rate measurement',
  'Fissile material packaging with criticality safety assessment support',
  'Pre-shipment package integrity verification prior to carrier acceptance',
];

const STORAGE_CARDS = [
  { Icon: Lock,     title: 'Controlled Access',     desc: 'Restricted entry zones with personnel authorization and dosimetry requirements for all entrants.' },
  { Icon: Eye,      title: 'Continuous Monitoring',  desc: 'Ambient radiation levels surveyed during all storage, loading, and unloading operations.' },
  { Icon: FileText, title: 'Chain of Custody',       desc: 'Package-level inventory control with documented handoffs at every operational stage.' },
  { Icon: Shield,   title: 'Emergency Protocols',    desc: 'Established spill containment, notification, and decontamination procedures on-site.' },
];

const TRANSPORT_CAPABILITIES = [
  { title: 'CNSNS Authorization',   desc: 'Prior transport permits obtained for every radioactive shipment before vehicle dispatch.' },
  { title: 'IATA DGR Chapter 10',   desc: 'Class 7 air freight — CAO and PAX aircraft compliance, TI limits, and NOTOC coordination.' },
  { title: 'IMDG Code Class 7',     desc: 'Ocean shipments with full stowage, segregation, manifest preparation, and port documentation.' },
  { title: 'Cross-Border DOT',      desc: 'Mexico–USA radioactive cargo under DOT 49 CFR with bilingual documentation and customs coordination.' },
];

const MONITORING_PROCEDURES = [
  { title: 'Pre-Transport Survey',  desc: 'Package surface dose rate and contamination measurement before every shipment departure.' },
  { title: 'Vehicle Clearance',     desc: 'Post-delivery radiation survey to confirm vehicle decontamination before return to service.' },
  { title: 'Personnel Dosimetry',   desc: 'Field personnel wear dosimeters with dose records maintained under CNSNS requirements.' },
  { title: 'Area Monitoring',       desc: 'Ambient dose rate verification during loading, unloading, and storage operations.' },
];

const REGULATIONS = [
  {
    code: 'IAEA SSR-6',
    name: 'Safe Transport of Radioactive Material',
    desc: 'The international benchmark standard for radioactive material classification, packaging, labelling, and transport authorization, adopted by all major transport regulators worldwide.',
  },
  {
    code: 'IATA DGR Ch. 10',
    name: 'Class 7 Air Transport Requirements',
    desc: 'Governs air transport of radioactive materials including package approvals, operator requirements, TI limits, CAO/PAX restrictions, NOTOC, and shipper certification.',
  },
  {
    code: 'IMDG Code Cl. 7',
    name: 'Maritime Radioactive Cargo',
    desc: 'Regulations for ocean shipment of radioactive materials covering stowage, segregation, quantity limits, documentation, and emergency response procedures.',
  },
  {
    code: 'NOM-002-SCT',
    name: 'Mexican Land Transport Standard',
    desc: 'SCT regulation governing road transport of hazardous materials within Mexico, including radioactive cargo vehicle requirements, routes, placarding, and documentation.',
  },
  {
    code: 'CNSNS',
    name: 'Comisión Nacional de Seguridad Nuclear',
    desc: "Mexico's nuclear safety regulatory authority. All radioactive material transport, handling, and storage operations require prior CNSNS authorization and post-operation reporting.",
  },
  {
    code: 'DOT 49 CFR',
    name: 'US Department of Transportation',
    desc: 'Applicable to cross-border Mexico–USA radioactive shipments. Imposes additional requirements beyond IATA DGR for certain materials, quantities, and carrier types.',
  },
];

const TRANSPORT_IMAGES = [
  {
    src: '/radioactive/transport/radioactive_crane_operation_full_box.webp',
    alt: 'Crane lifting radioactive industrial package',
    label: 'Crane & Heavy Lift',
    sub: 'Industrial package loading operations',
  },
  {
    src: '/radioactive/transport/radioactive_forklift_operation.webp',
    alt: 'Forklift handling radioactive cargo',
    label: 'Ground Handling',
    sub: 'Warehouse to vehicle transfer',
  },
  {
    src: '/radioactive/transport/radioactive_night_transport.webp',
    alt: 'Night radioactive transport operation',
    label: 'Night Operations',
    sub: 'Controlled 24-hour transport capability',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

const RAD_YELLOW = '#eab308';

export const RadioactiveMaterialLogisticsPage = () => {
  const { setLanguage } = useLanguage();

  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'Radioactive Material Logistics in Mexico | Global Gate México',
    description: 'Specialized Class 7 radioactive material logistics — packaging, controlled storage, and multimodal transport compliant with IAEA SSR-6, IATA DGR, CNSNS, SCT, and IMDG regulations across Mexico and North America.',
    canonical: 'https://globalgatemexico.com/radioactive-material-logistics',
    lang: 'en',
    hreflang: [
      { lang: 'en', href: 'https://globalgatemexico.com/radioactive-material-logistics' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/radioactive-material-logistics' },
    ],
  });

  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-[#060e1c]">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-[#030810] pt-[106px]">

        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/radioactive/transport/radioactive_crane_operation_full_box.webp"
            alt="Radioactive industrial package crane operation"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.55) brightness(0.45)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030810]/97 via-[#060e1c]/82 to-[#060e1c]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1c]/90 via-transparent to-[#030810]/30" />
          <div
            className="absolute inset-0 opacity-[0.10]"
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
              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px" style={{ background: RAD_YELLOW, opacity: 0.5 }} />
                <span
                  className="text-[10px] font-black uppercase tracking-[0.28em]"
                  style={{ color: RAD_YELLOW, opacity: 0.75 }}
                >
                  IAEA SSR-6 · IATA DGR Ch. 10 · CNSNS Authorized · Class 7
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl xl:text-[3.5rem] font-extrabold text-white leading-[1.06] tracking-tight mb-6">
                Radioactive Material<br />
                <span style={{ color: RAD_YELLOW }}>Logistics.</span>
              </h1>

              <p className="text-white/40 text-xl md:text-2xl font-semibold tracking-tight mb-8">
                Secure Handling. Regulatory Precision.<br className="hidden sm:block" /> Operational Control.
              </p>

              <p className="text-white/55 text-[15px] leading-relaxed mb-10 max-w-2xl">
                Specialized packaging, controlled storage, and multimodal transport of Class 7
                radioactive materials across Mexico and North America. Every operation executed
                under IAEA, IATA DGR, CNSNS, and SCT compliance frameworks.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_28px_rgba(7,56,223,0.45)] transition-all duration-200"
                >
                  Request Consultation
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] border text-white/75 hover:text-white hover:bg-white/5 transition-all duration-200"
                  style={{ borderColor: 'rgba(255,255,255,0.18)' }}
                >
                  Speak with a Specialist
                </button>
              </div>

              {/* Trust tags */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-7 border-t border-white/[0.08]">
                {[
                  'CNSNS Authorized',
                  'IATA Certified',
                  'Operational Since 2006',
                  'Air · Ground · Maritime',
                ].map((tag) => (
                  <div key={tag} className="flex items-center gap-2.5">
                    <div className="w-1 h-1 rounded-full" style={{ background: RAD_YELLOW, opacity: 0.55 }} />
                    <span className="text-[11px] text-white/45 font-semibold tracking-wide">{tag}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── 2. CREDIBILITY STRIP ──────────────────────────────────────────────── */}
      <section className="bg-[#0a1422] border-t border-b border-white/[0.06]">
        <Container>
          <div className="flex flex-wrap divide-x divide-white/[0.06]">
            {[
              { num: '20+',        label: 'Years Operational',      sub: 'Dangerous goods logistics since 2006' },
              { num: 'CNSNS',      label: 'Authorized',             sub: "Mexico's nuclear safety commission" },
              { num: 'IATA DGR',   label: 'Chapter 10',             sub: 'Class 7 air transport compliant' },
              { num: 'Type A',     label: '& Industrial Pkg.',       sub: 'UN-certified packaging solutions' },
              { num: 'Air · Ground', label: '· Maritime',           sub: 'Full multimodal coverage' },
            ].map(({ num, label, sub }) => (
              <div key={label} className="flex-1 min-w-[150px] px-7 py-8 xl:px-9 xl:py-10">
                <p className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-none mb-1">{num}</p>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.16em] mb-1.5"
                  style={{ color: RAD_YELLOW, opacity: 0.65 }}
                >
                  {label}
                </p>
                <p className="text-[11px] text-white/28 leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. PACKAGING ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start">

            {/* Left — image stack */}
            <FadeIn direction="left">
              <div className="space-y-3">

                {/* Primary — label proof image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <img
                    src="/radioactive/packaging/radioactive_overpack_label.webp"
                    alt="IAEA-compliant radioactive package — regulatory marking and labeling visible"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.8)' }}
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#060e1c]/70 to-transparent pt-12 pb-4 px-4">
                    <p
                      className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5"
                      style={{ color: RAD_YELLOW, opacity: 0.85 }}
                    >
                      Regulatory Marking & Labeling
                    </p>
                    <p className="text-white/65 text-[12px] font-semibold">
                      IAEA Category III-YELLOW · UN number · Proper Shipping Name
                    </p>
                  </div>
                </div>

                {/* Secondary row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src="/radioactive/packaging/radioactive_crates_layout.webp"
                      alt="Radioactive material crates — pre-shipment layout"
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.75)' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#060e1c]/20" />
                  </div>
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src="/radioactive/packaging/blue_radioactive_container.webp"
                      alt="Type A industrial radioactive container"
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.75)' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#060e1c]/20" />
                  </div>
                </div>

              </div>
            </FadeIn>

            {/* Right — content */}
            <FadeIn direction="right" delay={0.1}>
              <Eyebrow>IAEA · IATA DGR · NOM-002-SCT</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                Compliant Radioactive<br />Packaging Solutions
              </h2>
              <p className="text-secondary text-[15px] leading-relaxed mb-4">
                Correct packaging is the first and most critical layer of control in radioactive material
                transport. We source, prepare, verify, and certify UN-certified packages in strict
                accordance with IAEA SSR-6 and applicable modal regulations.
              </p>
              <p className="text-secondary text-[14px] leading-relaxed mb-8">
                Our team holds active IATA certification for Class 7 packing instructions and applies
                CNSNS-compliant marking, labeling, and documentation to every package before it
                enters the transport chain.
              </p>

              <div className="space-y-3 mb-8">
                {PACKAGING_CAPABILITIES.map((cap, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px]"
                      style={{ background: RAD_YELLOW, opacity: 0.6 }}
                    />
                    <span className="text-[13px] text-dark/70 leading-snug">{cap}</span>
                  </div>
                ))}
              </div>

              {/* Overpacks image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
                <img
                  src="/radioactive/packaging/radioactive_overpacks_warehouse.webp"
                  alt="Radioactive overpacks staged in warehouse — pre-shipment"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.7) brightness(0.92)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#060e1c]/20" />
                <div className="absolute bottom-3 left-3 border-l-2 pl-3" style={{ borderColor: `${RAD_YELLOW}55` }}>
                  <p className="text-[10px] text-white/65 font-bold uppercase tracking-wide">Overpack Operations</p>
                  <p className="text-[10px] text-white/40">Pre-transport staging — IATA DGR compliant</p>
                </div>
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 4. STORAGE / CONTROLLED AREA ────────────────────────────────────── */}
      <section className="py-24 lg:py-32" style={{ background: '#050c17' }}>
        <Container>

          <FadeIn className="mb-14">
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <Eyebrow light>CNSNS · Radiation Safety · Chain of Custody</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Controlled Storage<br />&amp; Temporary Holding
                </h2>
              </div>
              <p className="text-white/35 text-[14px] leading-relaxed lg:text-right max-w-md lg:ml-auto">
                Secure, monitored interim storage during transit operations, documentation processing,
                or shipment staging — fully compliant with CNSNS requirements and radiation safety protocols.
              </p>
            </div>
          </FadeIn>

          {/* Image grid */}
          <div className="grid lg:grid-cols-3 gap-3 lg:gap-4 mb-14">

            {/* Bunker — large */}
            <FadeIn delay={0.04} className="lg:col-span-2">
              <div className="relative overflow-hidden" style={{ height: '420px' }}>
                <img
                  src="/radioactive/storage/radioactive_bunker.webp"
                  alt="Radioactive material controlled-access storage bunker"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.45) brightness(0.65)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050c17]/85 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <p
                    className="text-[9px] font-black uppercase tracking-[0.22em] mb-1"
                    style={{ color: RAD_YELLOW, opacity: 0.75 }}
                  >
                    Controlled Access Area
                  </p>
                  <p className="text-white/55 text-[12px] font-semibold">
                    Authorized personnel only · Dosimetry required at entry
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Supporting column */}
            <div className="flex flex-col gap-3 lg:gap-4">
              <FadeIn delay={0.1}>
                <div className="relative overflow-hidden" style={{ height: '200px' }}>
                  <img
                    src="/radioactive/storage/radioactive_storage.webp"
                    alt="Radioactive package storage area — operational"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.5) brightness(0.65)' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#050c17]/35" />
                  <div className="absolute bottom-3 left-3 border-l border-white/15 pl-2.5">
                    <p className="text-[10px] text-white/45 font-bold uppercase tracking-wide">Operational Storage</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.16}>
                <div className="relative overflow-hidden" style={{ height: '200px' }}>
                  <img
                    src="/radioactive/storage/radioactive_packages.webp"
                    alt="Radioactive packages staged for transport"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.5) brightness(0.65)' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#050c17]/35" />
                  <div className="absolute bottom-3 left-3 border-l border-white/15 pl-2.5">
                    <p className="text-[10px] text-white/45 font-bold uppercase tracking-wide">Pre-Transport Staging</p>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>

          {/* Capability tiles */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05]">
            {STORAGE_CARDS.map(({ Icon: SIcon, title, desc }) => (
              <FadeIn key={title}>
                <div className="h-full p-7 xl:p-8" style={{ background: '#070e1c' }}>
                  <SIcon size={18} className="mb-4" style={{ color: RAD_YELLOW, opacity: 0.55 }} />
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-white mb-2.5">{title}</h3>
                  <p className="text-[12px] text-white/38 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

        </Container>
      </section>

      {/* ── 5. TRANSPORT OPERATIONS ───────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#060e1c]">

        <Container className="mb-10 lg:mb-12">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <Eyebrow light>Air · Ground · Maritime · Cross-Border</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Transport Operations
                </h2>
              </div>
              <p className="text-white/35 text-[14px] leading-relaxed lg:text-right max-w-md lg:ml-auto">
                Multimodal radioactive cargo transport across Mexico and international corridors —
                from CNSNS prior authorization through final delivery confirmation.
              </p>
            </div>
          </FadeIn>
        </Container>

        {/* Cinematic coastal transport */}
        <div className="relative overflow-hidden" style={{ height: '500px' }}>
          <img
            src="/radioactive/transport/radioactive_transport_coastal.webp"
            alt="Radioactive material specialized ground transport — coastal route operation"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.65) brightness(0.65)' }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1c]/85 via-[#060e1c]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1c]/75 via-transparent to-transparent" />

          <div className="absolute bottom-8 left-0 right-0">
            <Container>
              <div className="flex items-end justify-between gap-8 flex-wrap">
                <div>
                  <p
                    className="text-[9px] font-black uppercase tracking-[0.26em] mb-2"
                    style={{ color: RAD_YELLOW, opacity: 0.75 }}
                  >
                    Specialized Ground Transport
                  </p>
                  <p className="text-white/65 text-[14px] font-semibold max-w-sm leading-relaxed">
                    Radiation-monitored vehicles with prior CNSNS authorization and continuous GPS tracking
                  </p>
                </div>
                <div className="hidden lg:flex gap-3 shrink-0 flex-wrap">
                  {['SCT NOM-002', 'GPS Tracked', 'CNSNS Permit', 'Emergency Protocol'].map((tag) => (
                    <div key={tag} className="border border-white/12 px-3.5 py-2">
                      <span className="text-[9px] text-white/40 uppercase tracking-[0.15em] font-bold">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </div>
        </div>

        {/* 3-col transport grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ height: '340px' }}>
          {TRANSPORT_IMAGES.map(({ src, alt, label, sub }, i) => (
            <FadeIn key={src} delay={i * 0.08} className="relative overflow-hidden group">
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'saturate(0.55) brightness(0.6)' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#060e1c]/50 group-hover:bg-[#060e1c]/25 transition-colors duration-500" />
              <div className="absolute bottom-4 left-4 border-l-2 pl-3" style={{ borderColor: `${RAD_YELLOW}55` }}>
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-white">{label}</p>
                <p className="text-[10px] text-white/40">{sub}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Transport capability grid */}
        <Container className="mt-14 lg:mt-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {TRANSPORT_CAPABILITIES.map(({ title, desc }) => (
              <FadeIn key={title}>
                <div className="border-t border-white/[0.08] pt-5">
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-white mb-2.5">{title}</h3>
                  <p className="text-[12px] text-white/38 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>

      </section>

      {/* ── 6. RADIATION MONITORING / EQUIPMENT ──────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#f8f9fc] border-t border-black/5">
        <Container>

          <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start mb-16 lg:mb-18">

            <FadeIn direction="left">
              <Eyebrow>Field Instrumentation · CNSNS Compliance</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                Radiation Monitoring<br />&amp; Operational Verification
              </h2>
              <p className="text-secondary text-[15px] leading-relaxed mb-4">
                Every radioactive material operation we execute is preceded and concluded by formal
                radiation surveys using calibrated field instruments. Packages do not move without
                verified measurement data on file.
              </p>
              <p className="text-secondary text-[14px] leading-relaxed">
                Survey instruments, dose rate meters, and contamination monitors are deployed at
                loading, unloading, vehicle clearance, and storage area verification stages — not
                as a formality, but as an operational standard.
              </p>
            </FadeIn>

            <FadeIn direction="right" delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                {MONITORING_PROCEDURES.map(({ title, desc }) => (
                  <div key={title} className="bg-white border border-black/[0.07] p-5">
                    <div
                      className="w-1.5 h-1.5 rounded-full mb-3"
                      style={{ background: RAD_YELLOW, opacity: 0.65 }}
                    />
                    <h3 className="text-[12px] font-extrabold uppercase tracking-wide mb-2 text-dark">{title}</h3>
                    <p className="text-[12px] text-secondary leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

          </div>

          {/* Equipment images */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                src: '/radioactive/equipment/IMG_20191129_090720_industrial.webp',
                label: 'Survey Instrument',
                sub: 'Geiger-Müller dose rate meter — surface and ambient measurements before shipment departure',
              },
              {
                src: '/radioactive/equipment/IMG_20191129_090959_industrial.webp',
                label: 'Field Dosimetry',
                sub: 'Personal and area dosimetry instruments — personnel radiation protection and exposure records',
              },
              {
                src: '/radioactive/equipment/1000212370_industrial.webp',
                label: 'Contamination Monitoring',
                sub: 'Surface contamination verification — vehicle clearance and post-operation package inspection',
              },
            ].map(({ src, label, sub }, i) => (
              <FadeIn key={src} delay={i * 0.1}>
                <div className="group">
                  <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={src}
                      alt={label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: 'saturate(0.65) brightness(0.88)' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#060e1c]/15 group-hover:bg-transparent transition-colors duration-400" />
                    <div className="absolute top-3 left-3 bg-[#060e1c]/80 backdrop-blur-sm px-2.5 py-1.5">
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.18em]"
                        style={{ color: RAD_YELLOW, opacity: 0.85 }}
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                  <p className="text-[12px] text-secondary leading-snug">{sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>

        </Container>
      </section>

      {/* ── 7. REGULATORY FRAMEWORK ──────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white border-t border-black/5">
        <Container>

          <FadeIn className="mb-14">
            <Eyebrow>Regulatory Compliance</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-[1.08]">
              Applicable Regulations
            </h2>
            <p className="text-secondary text-[15px] max-w-2xl leading-relaxed">
              Radioactive material transport is the most heavily regulated cargo category in international
              logistics. Every shipment we handle is pre-validated against the full applicable regulatory
              stack before a single package moves.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07]">
            {REGULATIONS.map(({ code, name, desc }, i) => (
              <FadeIn key={code} delay={i * 0.07}>
                <div className="group bg-white p-8 xl:p-10 h-full hover:bg-[#060e1c] transition-colors duration-300">
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.22em] mb-2 transition-colors group-hover:opacity-70"
                    style={{ color: RAD_YELLOW }}
                  >
                    {code}
                  </p>
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-4 text-dark group-hover:text-white transition-colors leading-snug">
                    {name}
                  </h3>
                  <p className="text-[13px] text-secondary group-hover:text-white/48 leading-relaxed transition-colors">
                    {desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

        </Container>
      </section>

      {/* ── 8. FIELD PERSONNEL ────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#060e1c]">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10 xl:gap-14 items-center">

            {/* Image */}
            <FadeIn direction="left" className="lg:col-span-3">
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                <img
                  src="/radioactive/operations/a_daytime_industrial_utility_selfie_scene_close_u.webp"
                  alt="Certified radioactive material handling personnel — field operations"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.6) brightness(0.72)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#060e1c]/55" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-[#060e1c]/75 backdrop-blur-sm px-4 py-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: RAD_YELLOW, opacity: 0.65 }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/65">
                    Certified Field Personnel
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Content */}
            <FadeIn direction="right" delay={0.1} className="lg:col-span-2">
              <Eyebrow light>Trained. Certified. Accountable.</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
                The Operation Is Only<br />As Good As the<br />
                <span style={{ color: RAD_YELLOW }}>People Running It.</span>
              </h2>
              <p className="text-white/45 text-[14px] leading-relaxed mb-8">
                Every field operative handling Class 7 cargo holds active CNSNS authorization and
                IATA-recognized training. Dosimetry records are maintained. Emergency procedures
                are drilled. No exceptions.
              </p>

              <div className="space-y-3.5">
                {[
                  'CNSNS-authorized radioactive material handlers',
                  'IATA DGR Class 7 certified specialists',
                  'Active personal dosimetry — tracked and audited',
                  'Emergency response training per CNSNS requirements',
                  'Annual recertification — no extensions, no exceptions',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle
                      size={14}
                      className="shrink-0 mt-0.5"
                      style={{ color: RAD_YELLOW, opacity: 0.6 }}
                    />
                    <span className="text-[13px] text-white/50 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 9. FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="relative py-28 lg:py-36 bg-[#030810] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/radioactive/storage/radioactive_box.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.25) brightness(0.22)' }}
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
            <div className="flex items-center justify-center gap-5 mb-8">
              <div className="h-px w-14" style={{ background: RAD_YELLOW, opacity: 0.3 }} />
              <Radiation size={16} style={{ color: RAD_YELLOW, opacity: 0.45 }} />
              <div className="h-px w-14" style={{ background: RAD_YELLOW, opacity: 0.3 }} />
            </div>

            <h2 className="text-3xl md:text-4xl xl:text-[2.75rem] font-extrabold text-white tracking-tight mb-5 leading-[1.08]">
              Need Specialized Support for<br />
              <span style={{ color: RAD_YELLOW }}>Radioactive Material Transport?</span>
            </h2>

            <p className="text-white/40 text-[15px] leading-relaxed mb-10 max-w-xl mx-auto">
              Our Class 7 specialists will evaluate your shipment requirements, confirm applicable
              regulatory obligations, and provide a detailed operational proposal.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={scrollToContact}
                className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.18em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_32px_rgba(7,56,223,0.45)] transition-all duration-200"
              >
                Request Consultation
              </button>
              <button
                onClick={scrollToContact}
                className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.18em] border text-white/65 hover:text-white transition-all duration-200"
                style={{
                  borderColor: `${RAD_YELLOW}35`,
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${RAD_YELLOW}65`;
                  (e.currentTarget as HTMLButtonElement).style.background = `${RAD_YELLOW}08`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${RAD_YELLOW}35`;
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                Contact Our Team
              </button>
            </div>
          </FadeIn>
        </Container>
      </section>

    </div>
  );
};
