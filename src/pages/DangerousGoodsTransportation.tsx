import { motion } from 'motion/react';
import {
  Plane, Truck, Ship, Package, FileText, Tag,
  ShieldCheck, Award, Globe, Users, GraduationCap,
  CheckCircle, ArrowRight, Search, Route,
  FlaskConical, Droplets, Car, Stethoscope, Factory,
  BadgeCheck, Lock, ClipboardList, Radiation,
} from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

// ── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    Icon: Plane,
    image: '/images/dg-transport/dg-air-transport.webp' as string | null,
    href: '/services/air-transportation',
    title: 'Air Transportation',
    desc: 'IATA DGR-compliant air freight for Class 1–9 dangerous goods. Packing, documentation, and airline coordination handled end-to-end.',
    items: ['IATA DGR compliance', 'Dangerous Goods Declaration', 'Class 1–9 materials', 'Express & scheduled freight'],
  },
  {
    Icon: Truck,
    image: '/images/dg-transport/dg-ground-transport.webp' as string | null,
    href: '/services/ground-transportation',
    title: 'Ground Transportation',
    desc: 'SCT-regulated road transport across Mexico and cross-border to the US and Canada. Dedicated DG-certified drivers and vehicles.',
    items: ['SCT NOM compliance', 'Certified DG drivers', 'Cross-border US/Canada', 'Real-time tracking'],
  },
  {
    Icon: Ship,
    image: '/images/dg-transport/dg-ocean-freight.webp' as string | null,
    href: '/services/ocean-freight',
    title: 'Ocean Freight',
    desc: 'IMDG-compliant sea shipments for bulk and containerized hazardous cargo. Full port handling and customs documentation.',
    items: ['IMDG Code compliance', 'FCL & LCL options', 'Port-to-port / door-to-door', 'Hazmat manifest preparation'],
  },
  {
    Icon: Package,
    image: '/images/dg-transport/dg-specialized-packaging.webp' as string | null,
    href: '/services/dg-packaging',
    title: 'DG Packaging',
    desc: 'UN-certified packaging sourced, prepared, and validated for all hazard classes. Compliant with IATA, IMDG, and ADR specifications.',
    items: ['UN-certified containers', 'All hazard classes', 'Inner & outer packaging', 'Compatibility verification'],
  },
  {
    Icon: FileText,
    image: '/images/dg-transport/dg-documentation-services.webp' as string | null,
    href: '/services/documentation-services',
    title: 'Documentation Services',
    desc: 'Complete preparation of DG declarations, shipper certifications, SDS review, and all regulatory paperwork across transport modes.',
    items: ['Dangerous Goods Declaration', 'SDS preparation & review', 'Shipper certification', 'Multi-modal documentation'],
  },
];

const PROCESS = [
  {
    num: '01',
    Icon: Search,
    title: 'Classification',
    desc: 'We identify the UN Number, Proper Shipping Name, hazard class, and packing group under IATA, IMDG, and SCT regulations.',
  },
  {
    num: '02',
    Icon: Tag,
    title: 'Identification',
    desc: 'Assignment of hazard labels, handling marks, and all required package identification in full regulatory compliance.',
  },
  {
    num: '03',
    Icon: Package,
    title: 'Packaging',
    desc: 'Selection and sourcing of UN-certified packaging appropriate to the material, quantity, and transport mode.',
  },
  {
    num: '04',
    Icon: ClipboardList,
    title: 'Marking & Labelling',
    desc: 'Application of all mandatory labels, marks, and placards as required by applicable modal regulations.',
  },
  {
    num: '05',
    Icon: FileText,
    title: 'Documentation',
    desc: 'Preparation of the Dangerous Goods Declaration, Safety Data Sheets, emergency response documentation, and transport permits.',
  },
  {
    num: '06',
    Icon: Route,
    title: 'Transportation',
    desc: 'Coordinated execution via certified carriers, with compliance verification at every handoff point.',
  },
];

const WHY_GGM = [
  { Icon: Award,        title: 'Specialists Since 2006',             desc: 'Nearly two decades exclusively focused on dangerous goods logistics across Mexico and North America.' },
  { Icon: GraduationCap, title: 'IATA CBTA Certified School',        desc: 'Authorized IATA Competency-Based Training and Assessment provider for dangerous goods personnel.' },
  { Icon: Globe,        title: 'Cross-border Operations',             desc: 'Proven cross-border logistics corridors: Mexico–USA–Canada, supported by bilingual compliance teams.' },
  { Icon: Package,      title: 'UN Packaging Solutions',              desc: 'In-house sourcing and preparation of UN-certified packaging for all hazard classes and transport modes.' },
  { Icon: Radiation,    title: 'Radioactive Material License',        desc: 'Licensed by CNSNS for the transportation and handling of Class 7 radioactive materials.' },
  { Icon: ShieldCheck,  title: 'Compliance-First Operations',         desc: 'Every shipment is pre-screened by certified DG professionals before it moves. Zero-compromise approach.' },
  { Icon: Users,        title: 'Specialized DG Staff',                desc: 'All personnel hold IATA, IMDG, or SCT certifications. No generalists — only dangerous goods experts.' },
  { Icon: Truck,        title: 'Dedicated DG Fleet',                  desc: 'Purpose-equipped vehicles with placard systems, spill kits, and DG emergency response protocols.' },
];

const INDUSTRIES = [
  { Icon: FlaskConical, label: 'Chemical' },
  { Icon: Droplets,     label: 'Oil & Gas' },
  { Icon: Car,          label: 'Automotive' },
  { Icon: Plane,        label: 'Airlines' },
  { Icon: Package,      label: 'Freight Forwarders' },
  { Icon: Stethoscope,  label: 'Healthcare' },
  { Icon: Factory,      label: 'Industrial Manufacturing' },
];

const SAFETY = [
  { Icon: ShieldCheck, title: 'Regulatory Compliance', desc: 'Every shipment is validated against IATA DGR, IMDG Code, ADR, and SCT before departure.' },
  { Icon: BadgeCheck,  title: 'Certified Personnel',   desc: 'Our team holds active IATA, IHMM, and SQA certifications renewed on an annual cycle.' },
  { Icon: Lock,        title: 'Risk Mitigation',       desc: 'Pre-shipment audits, SDS review, and compatibility checks eliminate compliance exposure.' },
  { Icon: CheckCircle, title: 'Operational Integrity', desc: 'Chain-of-custody documentation and real-time status tracking from origin to final delivery.' },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export const DangerousGoodsTransportationPage = () => {
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
            src="/images/dg-transport/dg-hero-main.webp"
            alt="Dangerous goods transportation fleet"
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1c]/98 via-[#060e1c]/85 to-[#060e1c]/60" />
          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '36px 36px' }}
          />
        </div>

        {/* Bottom fade to white */}
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
                Air · Ground · Ocean
              </p>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                Safe & Compliant<br />
                <span className="text-primary">Dangerous Goods</span><br />
                Transportation Across Mexico
              </h1>
            </motion.div>

            {/* Right — sub + CTAs + trust */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:pl-10 lg:border-l lg:border-white/10"
            >
              <p className="text-base md:text-lg text-white/70 font-normal leading-relaxed mb-8 max-w-lg">
                We help companies transport hazardous materials safely, efficiently and in compliance with national and international regulations by air, ground and ocean.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_24px_rgba(7,56,223,0.5)] transition-all duration-200"
                >
                  Request a Quote
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border border-white/25 text-white hover:border-white/60 hover:bg-white/5 transition-all duration-200"
                >
                  Speak with a DG Specialist
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-white/10">
                {[
                  { label: 'Since 2006' },
                  { label: 'IATA Certified' },
                  { label: 'Radioactive Material License' },
                  { label: 'DG Specialists' },
                ].map(({ label }) => (
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

      {/* ── 2. SERVICES OVERVIEW ────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Integrated Solutions</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Integrated Dangerous Goods Transportation Solutions
            </h2>
            <p className="text-secondary leading-relaxed text-[15px]">
              Global Gate Mexico provides specialized logistics solutions for hazardous materials, including classification, packaging, documentation, storage and transportation services.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-black/8">
            {SERVICES.map(({ Icon: SIcon, image, href, title, desc, items }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className={cn(
                  'group flex flex-col h-full transition-all duration-300 border-b border-black/8',
                  i % 2 === 0 && 'sm:border-r sm:border-black/8 lg:border-r-0',
                  i % 3 !== 2 && 'lg:border-r lg:border-black/8',
                )}>
                  {/* Photo header (when image available) */}
                  {image ? (
                    <div className="relative h-52 overflow-hidden shrink-0">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060e1c]/75 via-[#060e1c]/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 w-10 h-10 bg-primary flex items-center justify-center">
                        <SIcon size={20} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    /* Icon-only header when no photo */
                    <div className="px-8 xl:px-10 pt-8 xl:pt-10">
                      <div className="w-14 h-14 bg-primary/6 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <SIcon size={26} className="text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-8 xl:p-10 pt-7">
                    <h3 className="text-xl font-extrabold mb-3 tracking-tight">{title}</h3>
                    <p className="text-secondary text-[14px] leading-relaxed mb-7">{desc}</p>

                    <ul className="mt-auto space-y-2.5">
                      {items.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-[12px] font-semibold text-dark/70 uppercase tracking-wide">
                          <div className="w-1.5 h-1.5 bg-primary/50 rounded-full shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 pt-6 border-t border-black/6">
                      <Link
                        to={href}
                        className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-primary hover:gap-3 transition-all duration-200"
                      >
                        Learn More <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. PROCESS ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#f8f9fc] border-y border-black/5">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Our Method</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              How We Move Dangerous Goods Safely
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              Every shipment follows a strict six-step compliance workflow. No step is skipped. No shipment moves until it is validated.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8">
            {PROCESS.map(({ num, Icon: PIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="group bg-white p-8 xl:p-10 h-full hover:bg-[#060e1c] transition-colors duration-300">
                  {/* Step number + icon */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[42px] font-black text-black/5 group-hover:text-white/5 leading-none transition-colors select-none">
                      {num}
                    </span>
                    <div className="w-10 h-10 bg-primary/8 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <PIcon size={20} className="text-primary group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-extrabold uppercase tracking-wide mb-3 group-hover:text-white transition-colors">
                    {title}
                  </h3>
                  <p className="text-[13px] text-secondary group-hover:text-white/60 leading-relaxed transition-colors">
                    {desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Keyline */}
          <FadeIn delay={0.4} className="mt-12 text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">
              If it doesn't pass validation — it doesn't move forward.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── Photo gallery strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 h-64 sm:h-80">
        {[
          { src: '/images/dg-transport/dg-warehouse-01.webp',       alt: 'Dangerous goods warehouse operations' },
          { src: '/images/dg-transport/dg-operations-team.webp',    alt: 'Global Gate México DG operations team' },
          { src: '/images/dg-transport/dg-field-operations.webp',   alt: 'DG field operations and transport' },
        ].map(({ src, alt }, i) => (
          <FadeIn key={src} delay={i * 0.08} className="relative overflow-hidden">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              style={{ minHeight: '100%' }}
            />
            <div className="absolute inset-0 bg-[#060e1c]/35 hover:bg-[#060e1c]/10 transition-colors duration-700" />
          </FadeIn>
        ))}
      </div>

      {/* ── 4. WHY GGM ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Our Credentials</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Why Companies Choose Global Gate Mexico
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              Not all logistics providers are dangerous goods specialists. We are.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-black/8">
            {WHY_GGM.map(({ Icon: WIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.06}>
                <div className={cn(
                  'p-7 xl:p-8 h-full border-b border-black/8 hover:bg-[#f8f9fc] transition-colors duration-200',
                  i % 4 !== 3 && 'lg:border-r',
                  i % 2 !== 1 && 'sm:border-r lg:border-r-0',
                  i >= 4 && 'lg:border-t',
                )}>
                  <div className="w-10 h-10 bg-primary/7 flex items-center justify-center mb-5">
                    <WIcon size={20} className="text-primary" />
                  </div>
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-2.5">{title}</h3>
                  <p className="text-[12px] text-secondary leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. INDUSTRIES ───────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-28 bg-[#060e1c]">
        <Container>
          <FadeIn className="max-w-2xl mb-14">
            <Eyebrow light>Industries We Serve</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
              Specialized Across Critical Industrial Sectors
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed">
              From chemical manufacturers to pharmaceutical distributors, we understand the specific regulatory requirements of your industry.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {INDUSTRIES.map(({ Icon: IIcon, label }, i) => (
              <FadeIn key={label} delay={i * 0.06}>
                <div className="group flex flex-col items-center gap-3 px-4 py-7 border border-white/[0.07] hover:border-primary/50 hover:bg-primary/8 transition-all duration-200 cursor-default text-center">
                  <IIcon size={28} className="text-white/30 group-hover:text-primary transition-colors duration-200" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50 group-hover:text-white transition-colors duration-200">
                    {label}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 6. SAFETY ───────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#070f1c] relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            <FadeIn direction="left">
              <Eyebrow light>Our Commitment</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">
                Safety and Compliance First. <span className="text-primary">Every Time.</span>
              </h2>
              <p className="text-white/55 text-[15px] leading-relaxed mb-8 max-w-lg">
                In dangerous goods logistics, there is no margin for error. We operate under the strictest regulatory frameworks and embed compliance into every action, decision, and shipment.
              </p>
              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.15em]">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-white/30">IATA · IMDG · ADR · SCT · CNSNS</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-4">
              {SAFETY.map(({ Icon: SIcon, title, desc }, i) => (
                <FadeIn key={title} delay={i * 0.1}>
                  <div className="p-6 border border-white/[0.08] hover:border-primary/40 hover:bg-primary/[0.06] transition-all duration-200 group">
                    <div className="w-9 h-9 bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                      <SIcon size={18} className="text-primary" />
                    </div>
                    <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-white mb-2">{title}</h3>
                    <p className="text-[12px] text-white/45 leading-relaxed">{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* ── 7. FINAL CTA ────────────────────────────────────────────────────── */}
      <section id="dgt-contact" className="bg-white border-t border-black/5">

        {/* Primary CTA block */}
        <div className="bg-primary py-20 lg:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <Container className="relative z-10 text-center">
            <FadeIn>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black mb-4">
                Expert DG Logistics
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">
                Need Help Transporting Dangerous Goods?
              </h2>
              <p className="text-white/65 text-[15px] max-w-xl mx-auto mb-10 leading-relaxed">
                Our certified dangerous goods specialists are ready to review your shipment and provide a compliance-backed logistics plan.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-white text-primary hover:bg-white/90 hover:shadow-lg transition-all duration-200"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border-2 border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-200"
                >
                  Request a Quote
                </button>
              </div>
            </FadeIn>
          </Container>
        </div>

        {/* Contact strip */}
        <div className="bg-[#060e1c] py-8">
          <Container>
            <FadeIn>
              <div className="flex items-center gap-3">
                <img src="/GGM-SM.png" alt="Global Gate México" style={{ height: '36px', width: 'auto', opacity: 0.85 }} />
                <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-bold hidden sm:inline">
                  Dangerous Goods Specialists
                </span>
              </div>
            </FadeIn>
          </Container>
        </div>

      </section>

    </div>
  );
};
