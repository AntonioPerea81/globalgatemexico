import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Shield, Truck, Radiation, ExternalLink } from 'lucide-react';
import { Container, FadeIn } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Trafft public booking page ────────────────────────────────────────────────
// Do NOT change this URL. It is the official GGM Trafft public booking link.
const TRAFFT_URL = 'https://globalgatemexico.trafft.com';

// ── Page ──────────────────────────────────────────────────────────────────────

export function BookConsultationPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'Book a Consultation | Global Gate México',
    description:
      'Schedule a consultation with Global Gate México specialists in dangerous goods transportation, radioactive materials logistics, regulatory compliance, and CBTA training solutions.',
    canonical: 'https://globalgatemexico.com/book-consultation',
    lang: 'en',
    hreflang: [
      { lang: 'en', href: 'https://globalgatemexico.com/book-consultation' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/book-consultation' },
    ],
  });

  return (
    <div className="bg-[#060e1c] min-h-screen">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative pt-[106px] pb-10 lg:pb-14 overflow-hidden"
        style={{ background: '#030810' }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030810] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/25" />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-primary/45" />
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/68">
                Schedule a Consultation · DG Specialists · Since 2006
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl xl:text-[3.2rem] font-extrabold text-white leading-[1.06] tracking-tight mb-6">
              Schedule a Dangerous<br />Goods Consultation.
            </h1>

            {/* Sub */}
            <p className="text-white/50 text-[16px] leading-relaxed max-w-2xl mb-10">
              Book a consultation with Global Gate México specialists in dangerous goods
              transportation, radioactive materials logistics, regulatory compliance, and
              CBTA training solutions.
            </p>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-7 border-t border-white/[0.07]">
              {[
                { Icon: Shield,    label: 'IATA CBTA Certified' },
                { Icon: Radiation, label: 'CNSNS Authorized' },
                { Icon: Truck,     label: 'SICT Licensed' },
                { Icon: Calendar,  label: 'Operational Since 2006' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon size={12} className="text-primary/45 shrink-0" />
                  <span className="text-[11px] text-white/32 font-semibold tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── 2. BOOKING CTA ──────────────────────────────────────────────── */}
      <section style={{ background: '#060e1c', padding: '40px 0 96px' }}>
        <Container>
          <FadeIn>
            <div className="max-w-xl">
              <a
                href={TRAFFT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_36px_rgba(37,99,235,0.45)] transition-all duration-200 mb-7"
              >
                Open Booking Portal
                <ExternalLink size={13} />
              </a>

              <p className="text-[13px] text-white/35 leading-relaxed">
                You will be redirected to Global Gate México's secure booking portal to
                select your consultation, complete payment, and receive calendar confirmation.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

    </div>
  );
}
