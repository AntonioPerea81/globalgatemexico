import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, Clock, Globe, Monitor, GraduationCap,
  ChevronRight, Lock, Award, Layers,
} from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Constants ────────────────────────────────────────────────────────────────

const CORPORATE_TRAINING_HREF = 'https://bookings.globalgatemexico.com';

// ── Course attributes ────────────────────────────────────────────────────────

const COURSE_ATTRIBUTES = [
  { Icon: Monitor,       label: 'Format',   value: 'Online — asynchronous' },
  { Icon: Globe,         label: 'Language', value: 'English' },
  { Icon: Layers,        label: 'Focus',    value: 'Mexican Regulations & NOMs' },
  { Icon: GraduationCap, label: 'Level',    value: 'Introductory to intermediate' },
];

// ── Why GGM Academy ──────────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    Icon: Award,
    title: 'Built by Certified Experts',
    desc: 'Every course is authored by IATA-certified DG professionals with direct operational and regulatory experience in Mexico.',
  },
  {
    Icon: BookOpen,
    title: 'Regulation-Aligned Curriculum',
    desc: 'Content maps directly to SCT, NOM, and applicable IATA/IMDG/ADR standards — no generic training. What you learn applies to your real operation.',
  },
  {
    Icon: Clock,
    title: 'Learn at Your Own Pace',
    desc: 'Asynchronous delivery means your team trains on their schedule, without disrupting operations or requiring travel.',
  },
  {
    Icon: Globe,
    title: 'Mexico-Specific Focus',
    desc: 'While many platforms cover international frameworks in the abstract, GGM Academy zeroes in on the Mexican regulatory environment.',
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export function OnlineAcademyPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'GGM Academy | Online Training | Global Gate México',
    description: 'Professional dangerous goods online training by GGM. Asynchronous courses covering Mexican DG regulations, NOMs, and compliance requirements. Launching soon.',
    canonical: 'https://globalgatemexico.com/training/online-academy',
    lang: 'en',
  });

  return (
    <div className="bg-[#060e1c]">

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-[#030810] pt-[106px]">

        {/* Background gradient layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#030810] via-[#060e1c] to-[#030810]" />
          {/* Subtle accent glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)' }}
          />
        </div>

        <Container className="relative z-10 pb-24 lg:pb-32 pt-16">
          <FadeIn>
            <div className="max-w-3xl">

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <Eyebrow>GGM Academy</Eyebrow>
                <span className="h-px w-10 bg-primary/40" />
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30">
                  Online Training Division
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-[clamp(2.6rem,6vw,4.8rem)] font-black leading-[1.0] tracking-tight text-white mb-6">
                GGM<br />
                <span className="text-primary">Academy.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-[1.05rem] font-semibold text-white/70 tracking-wide mb-5 uppercase">
                Professional Dangerous Goods Training Platform
              </p>

              {/* Body */}
              <p className="text-[0.97rem] text-white/50 leading-relaxed max-w-2xl mb-10">
                GGM Academy is the online training division of Global Gate México — delivering
                professional dangerous goods courses built for compliance teams, logistics
                operators, and regulatory personnel operating under Mexican law. Learn at
                your own pace, with content authored by certified DG professionals.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Launching Soon — disabled */}
                <button
                  disabled
                  aria-disabled="true"
                  className={cn(
                    'inline-flex items-center gap-2.5 px-8 py-4',
                    'bg-primary text-[#030810] text-[11px] font-black tracking-[0.14em] uppercase',
                    'pointer-events-none cursor-not-allowed opacity-[0.32]',
                  )}
                >
                  <Lock size={13} />
                  Launching Soon
                </button>

                {/* Corporate training CTA */}
                <a
                  href={CORPORATE_TRAINING_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-[11px] font-bold tracking-[0.12em] uppercase text-white/70 hover:text-white hover:border-white/50 transition-all"
                >
                  Request Corporate Training
                  <ChevronRight size={13} />
                </a>
              </div>

            </div>
          </FadeIn>
        </Container>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060e1c] to-transparent z-10 pointer-events-none" />
      </section>

      {/* ── 2. FEATURED COURSE ───────────────────────────────────────────────── */}
      <section className="py-24 bg-[#060e1c]" id="courses">
        <Container>
          <FadeIn>
            <div className="max-w-3xl mb-14">
              <Eyebrow className="mb-4">Course Catalog</Eyebrow>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-black text-white tracking-tight mb-4">
                First Release
              </h2>
              <p className="text-white/45 text-[0.95rem] leading-relaxed">
                GGM Academy launches with a focused curriculum on Mexican dangerous goods
                regulations — the most immediate compliance gap for operators in this market.
              </p>
            </div>
          </FadeIn>

          {/* Course card */}
          <FadeIn delay={0.08}>
            <div className="relative bg-[#07101f] border border-white/[0.08] overflow-hidden max-w-4xl">

              {/* Top accent bar */}
              <div className="h-[3px] bg-primary w-full" />

              <div className="p-8 md:p-12">

                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[9px] font-black tracking-[0.2em] uppercase text-primary/80 border border-primary/25 px-2.5 py-1">
                        Featured Course
                      </span>
                      {/* THINKIFIC INTEGRATION NOTE: Replace this static "Launching Soon" chip
                          with a live enrollment status badge when the course is published. */}
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 border border-white/[0.12] px-2.5 py-1">
                        Launching Soon
                      </span>
                    </div>
                    <h3 className="text-[1.45rem] md:text-[1.7rem] font-black text-white leading-tight tracking-tight max-w-xl">
                      Mexican Dangerous Goods Transportation Regulations
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/50 text-[0.95rem] leading-relaxed mb-10 max-w-2xl">
                  Practical compliance training for companies shipping dangerous goods in
                  Mexico. Covers applicable NOMs, SCT requirements, classification, documentation,
                  labeling, and packaging obligations — structured for real operational application.
                </p>

                {/* Course attributes grid */}
                {/* THINKIFIC INTEGRATION NOTE: These attributes map to Thinkific course metadata.
                    When live, pull dynamically from the enrollment widget or API response. */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {COURSE_ATTRIBUTES.map(({ Icon, label, value }) => (
                    <div key={label} className="bg-white/[0.03] border border-white/[0.07] px-4 py-4">
                      <Icon size={15} className="text-primary/70 mb-2" />
                      <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-white/30 mb-1">{label}</p>
                      <p className="text-[11px] font-semibold text-white/70">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Course CTAs */}
                <div className="flex flex-wrap gap-4 items-center">

                  {/* Launching Soon — disabled primary */}
                  {/* THINKIFIC INTEGRATION NOTE: Replace this disabled button with:
                      <a href="THINKIFIC_ENROLLMENT_URL"> or embed the Thinkific enrollment widget.
                      Remove pointer-events-none and opacity classes when going live. */}
                  <button
                    disabled
                    aria-disabled="true"
                    className={cn(
                      'inline-flex items-center gap-2.5 px-8 py-3.5',
                      'bg-primary text-[#030810] text-[11px] font-black tracking-[0.14em] uppercase',
                      'pointer-events-none cursor-not-allowed opacity-[0.32]',
                    )}
                  >
                    <Lock size={13} />
                    Launching Soon
                  </button>

                  {/* Request corporate training */}
                  <a
                    href={CORPORATE_TRAINING_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/15 text-[11px] font-bold tracking-[0.12em] uppercase text-white/55 hover:text-white hover:border-white/40 transition-all"
                  >
                    Request Corporate Training
                    <ChevronRight size={13} />
                  </a>
                </div>

              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── 3. WHY GGM ACADEMY ───────────────────────────────────────────────── */}
      <section className="py-24 bg-[#040c19]">
        <Container>
          <FadeIn>
            <div className="max-w-2xl mb-14">
              <Eyebrow className="mb-4">Why GGM Academy</Eyebrow>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-black text-white tracking-tight mb-4">
                Training built for real operations.
              </h2>
              <p className="text-white/45 text-[0.95rem] leading-relaxed">
                GGM Academy is not a generic compliance library. Every course is purpose-built
                for the specific regulatory environment your team operates in.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {VALUE_PROPS.map(({ Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.06}>
                <motion.div
                  className="group bg-[#07101f]/60 border border-white/[0.07] p-8 hover:border-primary/30 transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 border border-primary/20 mb-5 group-hover:bg-primary/15 transition-colors">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <h3 className="text-[0.95rem] font-bold text-white mb-3 tracking-tight">{title}</h3>
                  <p className="text-white/45 text-[0.88rem] leading-relaxed">{desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. CORPORATE CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#060e1c] border-t border-white/[0.06]">
        <Container>
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Eyebrow className="mb-6 justify-center">Corporate Training</Eyebrow>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-black text-white tracking-tight mb-5">
                Need training for your team <span className="text-primary">now?</span>
              </h2>
              <p className="text-white/45 text-[0.97rem] leading-relaxed mb-10 max-w-xl mx-auto">
                While the self-paced platform is in development, GGM delivers instructor-led
                dangerous goods training onsite and remotely. Schedule a consultation to design
                a custom program for your organization.
              </p>
              <a
                href={CORPORATE_TRAINING_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-10 py-4 bg-primary text-[#030810] text-[11px] font-black tracking-[0.16em] uppercase hover:opacity-90 transition-opacity"
              >
                Schedule Training Consultation
                <ChevronRight size={14} />
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>

    </div>
  );
}
