import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Shield, Truck, Radiation, ExternalLink } from 'lucide-react';
import { Container, FadeIn } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Trafft public booking page ────────────────────────────────────────────────
// Do NOT change this URL. It is the official GGM Trafft public booking link.
const TRAFFT_URL = 'https://globalgatemexico.trafft.com';

// ── Página ────────────────────────────────────────────────────────────────────

export function AgendarConsultoriaPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Agendar Consultoría | Global Gate México',
    description:
      'Agenda una consulta con los especialistas de Global Gate México en transporte de mercancías peligrosas, logística de materiales radiactivos, cumplimiento regulatorio y soluciones de capacitación CBTA.',
    canonical: 'https://globalgatemexico.com/agendar-consultoria',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/agendar-consultoria' },
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
                Agendar Consultoría · Especialistas DG · Desde 2006
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl xl:text-[3.2rem] font-extrabold text-white leading-[1.06] tracking-tight mb-6">
              Agenda una Consultoría en<br />Mercancías Peligrosas.
            </h1>

            {/* Sub */}
            <p className="text-white/50 text-[16px] leading-relaxed max-w-2xl mb-10">
              Agenda una consulta con los especialistas de Global Gate México en transporte
              de mercancías peligrosas, logística de materiales radiactivos, cumplimiento
              regulatorio y soluciones de capacitación CBTA.
            </p>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-7 border-t border-white/[0.07]">
              {[
                { Icon: Shield,    label: 'Proveedor IATA CBTA' },
                { Icon: Radiation, label: 'Autorizado CNSNS' },
                { Icon: Truck,     label: 'Permiso SICT' },
                { Icon: Calendar,  label: 'Operando desde 2006' },
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

      {/* ── 2. CTA DE RESERVA ───────────────────────────────────────────── */}
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
                Agendar Consultoría DG
                <ExternalLink size={13} />
              </a>

              <p className="text-[13px] text-white/35 leading-relaxed">
                Serás redirigido a la plataforma segura de programación de consultas de
                Global Gate México para seleccionar tu servicio, completar el pago y
                recibir la confirmación en tu calendario.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

    </div>
  );
}
