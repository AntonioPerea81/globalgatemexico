import { ComponentType } from 'react';
import { motion } from 'motion/react';
import { Container, FadeIn, Eyebrow } from '../../components/UI';

interface TemplateStrings {
  riskEyebrow: string;
  cta1: string;
  cta2: string;
  ctaEyebrow: string;
}
const EN_STRINGS: TemplateStrings = {
  riskEyebrow: 'Common Compliance Risks',
  cta1: 'Request a Consultation',
  cta2: 'Speak with a Specialist',
  ctaEyebrow: 'DG Compliance Specialists',
};
const ES_STRINGS: TemplateStrings = {
  riskEyebrow: 'Riesgos Frecuentes de Cumplimiento',
  cta1: 'Solicitar Consulta',
  cta2: 'Hablar con un Especialista',
  ctaEyebrow: 'Especialistas en Cumplimiento DG',
};

export type LucideIcon = ComponentType<{ size?: number; className?: string }>;

export interface RiskItem {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

export interface ScopeItem {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

export interface WhyPoint {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

export interface CompliancePageData {
  hero: {
    image: string;
    eyebrow: string;
    headline: string;
    highlighted: string;
    sub: string;
  };
  risk: {
    headline: string;
    body: string;
    items: RiskItem[];
  };
  scope: {
    eyebrow: string;
    headline: string;
    body: string;
    items: ScopeItem[];
  };
  why: {
    headline: string;
    body: string;
    points: WhyPoint[];
  };
  cta: {
    headline: string;
    sub: string;
  };
}

export function CompliancePageTemplate({ data, lang = 'EN' }: { data: CompliancePageData; lang?: 'EN' | 'ES' }) {
  const { hero, risk, scope, why, cta } = data;
  const s = lang === 'ES' ? ES_STRINGS : EN_STRINGS;

  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden bg-[#060e1c] pt-[106px]">
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
              <button
                onClick={scrollToContact}
                className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_24px_rgba(7,56,223,0.5)] transition-all duration-200"
              >
                {s.cta1}
              </button>
              <button
                onClick={scrollToContact}
                className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border border-white/25 text-white hover:border-white/60 hover:bg-white/5 transition-all duration-200"
              >
                {s.cta2}
              </button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── RISK / PROBLEM ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-14">
            <Eyebrow>{s.riskEyebrow}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              {risk.headline}
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              {risk.body}
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-4">
            {risk.items.map(({ Icon: RIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="flex gap-5 p-7 bg-[#f8f9fc] border border-black/5 hover:border-primary/20 hover:bg-white transition-all duration-200">
                  <div className="w-10 h-10 bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                    <RIcon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-2">{title}</h3>
                    <p className="text-[12px] text-secondary leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SERVICE SCOPE ─────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#f8f9fc] border-y border-black/5">
        <Container>
          <FadeIn className="max-w-2xl mb-14">
            <Eyebrow>{scope.eyebrow}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              {scope.headline}
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              {scope.body}
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scope.items.map(({ Icon: SIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="group bg-white border border-black/[0.07] hover:border-primary/30 hover:shadow-sm transition-all duration-200 p-7 h-full">
                  <div className="w-10 h-10 bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                    <SIcon size={20} className="text-primary" />
                  </div>
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-2.5">{title}</h3>
                  <p className="text-[12px] text-secondary leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── WHY GGM ───────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-28 bg-[#060e1c]">
        <Container>
          <FadeIn className="max-w-2xl mb-14">
            <Eyebrow light>Why Global Gate México</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
              {why.headline}
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed">
              {why.body}
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-px bg-white/[0.06]">
            {why.points.map(({ Icon: WIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="bg-[#060e1c] p-8 group hover:bg-primary/[0.06] transition-colors duration-200 h-full">
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                      <WIcon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-white mb-2">
                        {title}
                      </h3>
                      <p className="text-[12px] text-white/45 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
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
                <button
                  onClick={scrollToContact}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-white text-primary hover:bg-white/90 hover:shadow-lg transition-all duration-200"
                >
                  {s.cta1}
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border-2 border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-200"
                >
                  {s.cta2}
                </button>
              </div>
            </FadeIn>
          </Container>
        </div>
      </section>

    </div>
  );
}
