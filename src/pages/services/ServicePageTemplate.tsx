import { ComponentType } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Container, FadeIn, Eyebrow } from '../../components/UI';

export type LucideIcon = ComponentType<{ size?: number; className?: string }>;

interface TemplateStrings {
  heroCta1: string;
  heroCta2: string;
  capabilities: string;
  regulatoryEyebrow: string;
  processEyebrow: string;
  keyline: string;
  whyEyebrow: string;
  ctaEyebrow: string;
  ctaBtn1: string;
  ctaBtn2: string;
}

const EN_STRINGS: TemplateStrings = {
  heroCta1: 'Request a Quote',
  heroCta2: 'Speak with a Specialist',
  capabilities: 'Capabilities',
  regulatoryEyebrow: 'Regulatory Framework',
  processEyebrow: 'Our Process',
  keyline: "If it doesn't pass validation — it doesn't move forward.",
  whyEyebrow: 'Why Global Gate México',
  ctaEyebrow: 'Expert DG Logistics',
  ctaBtn1: 'Contact Us',
  ctaBtn2: 'Request a Quote',
};

const ES_STRINGS: TemplateStrings = {
  heroCta1: 'Solicitar Cotización',
  heroCta2: 'Hablar con un Especialista',
  capabilities: 'Capacidades',
  regulatoryEyebrow: 'Marco Regulatorio',
  processEyebrow: 'Nuestro Proceso',
  keyline: 'Si no pasa la validación — no avanza.',
  whyEyebrow: 'Por Qué Global Gate México',
  ctaEyebrow: 'Logística DG Especializada',
  ctaBtn1: 'Contáctenos',
  ctaBtn2: 'Solicitar Cotización',
};

export interface ComplianceStandard {
  code: string;
  name: string;
  desc: string;
}

export interface ProcessStep {
  num: string;
  Icon: LucideIcon;
  title: string;
  desc: string;
}

export interface Advantage {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

export interface ServicePageData {
  hero: {
    image: string;
    eyebrow: string;
    headline: string;
    highlighted: string;
    sub: string;
  };
  overview: {
    eyebrow: string;
    headline: string;
    paragraphs: string[];
    capabilities: string[];
    image?: string;
  };
  compliance: {
    headline: string;
    body: string;
    standards: ComplianceStandard[];
  };
  process: {
    headline: string;
    body: string;
    steps: ProcessStep[];
  };
  whyGGM: {
    headline: string;
    body: string;
    points: Advantage[];
  };
  cta: {
    headline: string;
    sub: string;
  };
}

export function ServicePageTemplate({ data, lang = 'EN' }: { data: ServicePageData; lang?: 'EN' | 'ES' }) {
  const { hero, overview, compliance, process: proc, whyGGM, cta } = data;
  const s = lang === 'ES' ? ES_STRINGS : EN_STRINGS;
  const overviewImageIsLogo = overview.image?.toLowerCase().endsWith('.png') ?? false;

  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden bg-[#060e1c] pt-[106px]">
        <div className="absolute inset-0 z-0">
          <img
            src={hero.image}
            alt={hero.headline}
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1c]/98 via-[#060e1c]/80 to-[#060e1c]/55" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.08) 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent z-10" />

        <Container className="relative z-20 w-full pb-20 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <p className="text-[10px] text-accent/80 uppercase tracking-[0.28em] mb-5 font-black">
              {hero.eyebrow}
            </p>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              {hero.headline}
            </h1>
            <p className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-primary leading-[1.1] tracking-tight mb-8">
              {hero.highlighted}
            </p>
            <p className="text-base md:text-lg text-white/65 font-normal leading-relaxed mb-10 max-w-2xl">
              {hero.sub}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={lang === 'ES' ? '/solicitar-cotizacion' : '/request-quote'}
                className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_24px_rgba(7,56,223,0.5)] transition-all duration-200 inline-block"
              >
                {s.heroCta1}
              </Link>
              <a
                href={
                  lang === 'ES'
                    ? 'https://wa.me/525587894742?text=Hola%20GGM%2C%20necesito%20apoyo%20con%20un%20env%C3%ADo%20de%20mercanc%C3%ADas%20peligrosas.'
                    : 'https://wa.me/525587894742?text=Hello%20GGM%2C%20I%20need%20support%20with%20a%20dangerous%20goods%20shipment.'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border border-white/25 text-white hover:border-white/60 hover:bg-white/5 transition-all duration-200 inline-flex items-center gap-2"
              >
                {/* WhatsApp icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.847L0 24l6.327-1.501A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 01-5.001-1.373l-.36-.214-3.752.89.938-3.64-.234-.374A9.768 9.768 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                </svg>
                {s.heroCta2}
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── OVERVIEW ──────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">

            <FadeIn direction="left">
              <Eyebrow>{overview.eyebrow}</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-7">
                {overview.headline}
              </h2>
              {overview.paragraphs.map((p, i) => (
                <p key={i} className="text-secondary text-[15px] leading-relaxed mb-5 last:mb-0">
                  {p}
                </p>
              ))}
            </FadeIn>

            <FadeIn direction="right" delay={0.1}>
              <div className="bg-[#f8f9fc] border border-black/5 p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-5">
                  {s.capabilities}
                </p>
                <ul className="space-y-3">
                  {overview.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-3 text-[13px] text-dark/75 leading-relaxed">
                      <div className="mt-[7px] w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
              {overview.image && (
                overviewImageIsLogo ? (
                  <div className="mt-6 h-52 bg-[#060e1c] border border-white/[0.06] flex items-center justify-center px-10">
                    <img
                      src={overview.image}
                      alt="Certification"
                      className="max-h-32 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                ) : (
                  <div className="mt-6 h-52 overflow-hidden">
                    <img
                      src={overview.image}
                      alt="Operations"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                )
              )}
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── COMPLIANCE ────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#f8f9fc] border-y border-black/5">
        <Container>
          <FadeIn className="max-w-2xl mb-14">
            <Eyebrow>{s.regulatoryEyebrow}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              {compliance.headline}
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              {compliance.body}
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {compliance.standards.map(({ code, name, desc }, i) => (
              <FadeIn key={code} delay={i * 0.07}>
                <div className="h-full p-6 bg-white border border-black/8 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                  <span className="inline-block px-2.5 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-[0.18em] mb-4">
                    {code}
                  </span>
                  <h4 className="text-[13px] font-extrabold mb-2.5 leading-tight">{name}</h4>
                  <p className="text-[12px] text-secondary leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>{s.processEyebrow}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              {proc.headline}
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              {proc.body}
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/8">
            {proc.steps.map(({ num, Icon: PIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="group bg-white p-8 h-full hover:bg-[#060e1c] transition-colors duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[42px] font-black text-black/5 group-hover:text-white/5 leading-none transition-colors select-none">
                      {num}
                    </span>
                    <div className="w-10 h-10 bg-primary/8 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <PIcon size={20} className="text-primary" />
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

          <FadeIn delay={0.35} className="mt-12 text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">
              {s.keyline}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── WHY GGM ───────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-28 bg-[#060e1c]">
        <Container>
          <FadeIn className="max-w-2xl mb-14">
            <Eyebrow light>{s.whyEyebrow}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
              {whyGGM.headline}
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed">
              {whyGGM.body}
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyGGM.points.map(({ Icon: WIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="p-7 border border-white/[0.07] hover:border-primary/40 hover:bg-primary/[0.06] transition-all duration-200 group h-full">
                  <div className="w-10 h-10 bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/25 transition-colors">
                    <WIcon size={20} className="text-primary" />
                  </div>
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-white mb-2.5">
                    {title}
                  </h3>
                  <p className="text-[12px] text-white/45 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-black/5">
        <div className="bg-primary py-20 lg:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <Container className="relative z-10 text-center">
            <FadeIn>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black mb-4">
                {s.ctaEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">
                {cta.headline}
              </h2>
              <p className="text-white/65 text-[15px] max-w-xl mx-auto mb-10 leading-relaxed">
                {cta.sub}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to={lang === 'ES' ? '/contacto' : '/contact'}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-white text-primary hover:bg-white/90 hover:shadow-lg transition-all duration-200 inline-block"
                >
                  {s.ctaBtn1}
                </Link>
                <Link
                  to={lang === 'ES' ? '/solicitar-cotizacion' : '/request-quote'}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border-2 border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-200 inline-block"
                >
                  {s.ctaBtn2}
                </Link>
              </div>
            </FadeIn>
          </Container>
        </div>

      </section>

    </div>
  );
}
