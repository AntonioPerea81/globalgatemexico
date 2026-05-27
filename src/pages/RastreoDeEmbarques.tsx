import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Ship, Search, ExternalLink, Info } from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Resultados Fase 1 ─────────────────────────────────────────────────────────
//
// RESULTADO: El embedding vía iframe NO está bloqueado por Shipsgo.
// X-Frame-Options / CSP no impiden el embedding en globalgatemexico.com.
//
// BLOQUEO ACTUAL: La URL de rastreo de Shipsgo usada en Fase 1
// era una ruta estimada y devuelve un 404 de Shipsgo. El contenedor
// del iframe, los estados de carga y el manejo de fallback funcionaron correctamente.
//
// SIGUIENTE PASO (Fase 2):
//   1. Iniciar sesión en el dashboard de Shipsgo.
//   2. Localizar la sección de configuración "Embed" o "Live Map".
//   3. Copiar la URL exacta de embed o live-map proporcionada por Shipsgo.
//   4. Reemplazar las constantes de marcador de posición con esas URLs.
//
// IMPORTANTE — NUNCA exponer el token de API de Shipsgo en código frontend.
// Todas las solicitudes autenticadas deben ser enviadas a través de una
// Supabase Edge Function u otro handler del lado del servidor. La URL de
// embed en sí puede no requerir token si Shipsgo usa un enlace iframe compartible.
//
// ─────────────────────────────────────────────────────────────────────────────

// TODO (Fase 2): Reemplazar con las URLs reales de embed / live-map de Shipsgo
// obtenidas desde el dashboard. NO construir URLs desde rutas estimadas.
const AIR_PORTAL_URL   = 'https://www.shipsgo.com/air-tracking';
const OCEAN_PORTAL_URL = 'https://www.shipsgo.com/container-tracking';

type Tab = 'air' | 'ocean';

// ── Página ────────────────────────────────────────────────────────────────────

export function RastreoDeEmbarquesPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Rastrea tu Embarque | Global Gate México',
    description:
      'Visibilidad en tiempo real para embarques aéreos y marítimos gestionados por Global Gate México. Rastrea por guía aérea AWB, número de contenedor o conocimiento de embarque.',
    canonical: 'https://globalgatemexico.com/rastreo-de-embarques',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/rastreo-de-embarques' },
      { lang: 'en', href: 'https://globalgatemexico.com/shipment-tracking' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/shipment-tracking' },
    ],
  });

  // ── Estado ───────────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState<Tab>('air');
  const [airInput,     setAirInput]     = useState('');
  const [oceanInput,   setOceanInput]   = useState('');
  const [submitted,    setSubmitted]    = useState(false);
  const [trackingMode, setTrackingMode] = useState<Tab | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleTrack() {
    const raw = (activeTab === 'air' ? airInput : oceanInput).trim();
    if (!raw) return;
    setTrackingMode(activeTab);
    setSubmitted(true);
  }

  function handleTabSwitch(tab: Tab) {
    setActiveTab(tab);
    if (trackingMode && tab !== trackingMode) setSubmitted(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleTrack();
  }

  const currentInput = activeTab === 'air' ? airInput : oceanInput;
  const portalUrl    = trackingMode === 'air' ? AIR_PORTAL_URL : OCEAN_PORTAL_URL;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#060e1c] min-h-screen">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative pt-[106px] pb-20 lg:pb-24 overflow-hidden"
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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030810] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/25" />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-7">
              <div className="w-8 h-px bg-primary/45" />
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/68">
                Visibilidad de Embarques · Aéreo · Marítimo
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-[3.2rem] font-extrabold text-white leading-[1.06] tracking-tight mb-5">
              Rastrea tu<br />Embarque.
            </h1>

            <p className="text-white/46 text-[16px] leading-relaxed max-w-xl mb-7">
              Visibilidad en tiempo real para embarques aéreos y marítimos gestionados
              por Global Gate México.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/[0.06]">
              {[
                { Icon: Plane, label: 'Guía Aérea (AWB)' },
                { Icon: Ship,  label: 'Contenedor / BL' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={12} className="text-primary/45 shrink-0" />
                  <span className="text-[11px] text-white/30 font-semibold tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── 2. FORMULARIO DE RASTREO ─────────────────────────────────────── */}
      <section
        style={{
          background: '#0a1628',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Container>
          <div className="py-14 lg:py-18 max-w-2xl">

            {/* Tabs */}
            <div
              className="flex mb-10"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              {([
                { id: 'air'   as Tab, label: 'Carga Aérea',   Icon: Plane },
                { id: 'ocean' as Tab, label: 'Carga Marítima', Icon: Ship  },
              ] as const).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabSwitch(id)}
                  className="relative flex items-center gap-2.5 pb-4 pr-8 text-[11px] font-black uppercase tracking-[0.14em] transition-colors duration-200 focus:outline-none"
                  style={{ color: activeTab === id ? '#fff' : 'rgba(255,255,255,0.30)' }}
                >
                  <Icon size={13} />
                  {label}
                  {activeTab === id && (
                    <motion.div
                      layoutId="tab-underline-es"
                      className="absolute bottom-0 left-0 h-[2px] bg-primary"
                      style={{ right: '2rem' }}
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Formulario */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-white/38 mb-3">
                  {activeTab === 'air'
                    ? 'Guía Aérea (AWB)'
                    : 'Contenedor, BL o Booking'}
                </label>

                <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                  <input
                    type="text"
                    value={activeTab === 'air' ? airInput : oceanInput}
                    onChange={(e) =>
                      activeTab === 'air'
                        ? setAirInput(e.target.value)
                        : setOceanInput(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={activeTab === 'air' ? '057-12345675' : 'MSCU1234567'}
                    spellCheck={false}
                    autoComplete="off"
                    className="flex-1 min-w-0 bg-[#060e1c] text-white text-[14px] font-mono px-4 py-3.5 outline-none transition-colors duration-200 placeholder:text-white/18 border border-white/[0.10] focus:border-primary/55"
                    style={{ borderColor: 'rgba(255,255,255,0.10)' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(37,99,235,0.55)')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
                  />
                  <button
                    onClick={handleTrack}
                    disabled={!currentInput.trim()}
                    className="flex items-center gap-2 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.12em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_24px_rgba(37,99,235,0.38)] disabled:opacity-28 disabled:cursor-not-allowed transition-all duration-200 shrink-0 whitespace-nowrap"
                  >
                    <Search size={13} />
                    {activeTab === 'air' ? 'Rastrear Embarque Aéreo' : 'Rastrear Embarque Marítimo'}
                  </button>
                </div>

                <p className="mt-3 text-[11px] text-white/20 leading-snug">
                  {activeTab === 'air'
                    ? 'Ingresa el número completo de guía aérea IATA incluyendo el prefijo de 3 dígitos de la aerolínea (ej. 057-12345675).'
                    : 'Ingresa el número completo de contenedor, conocimiento de embarque o número de reserva del transportista.'}
                </p>
              </motion.div>
            </AnimatePresence>

          </div>
        </Container>
      </section>

      {/* ── 3. ÁREA DE RESULTADOS ────────────────────────────────────────── */}
      <AnimatePresence>
        {submitted && (
          <motion.section
            key="result-section-es"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38 }}
            style={{ background: '#060e1c', padding: '48px 0 72px' }}
          >
            <Container>

              {/* Encabezado de referencia */}
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary/58 mb-1.5">
                  {trackingMode === 'air' ? 'Carga Aérea' : 'Carga Marítima'} · Rastreo
                </p>
                <p className="text-white/38 text-[13px]">
                  Referencia:{' '}
                  <span className="text-white/70 font-mono font-semibold tracking-wide">
                    {trackingMode === 'air' ? airInput : oceanInput}
                  </span>
                </p>
              </div>

              {/* ── Card de configuración pendiente ──────────────────────
                  Embedding vía iframe confirmado funcional (Fase 1 completa).
                  En espera de la URL correcta de embed de Shipsgo desde el dashboard. */}
              <FadeIn>
                <div
                  className="max-w-xl p-8"
                  style={{
                    background: '#0a1628',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderLeft: '3px solid rgba(37,99,235,0.5)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Info size={15} className="text-primary/65 shrink-0" />
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary/65">
                      Configuración de Embed Pendiente
                    </p>
                  </div>
                  <p className="text-[14px] text-white/65 leading-relaxed mb-2 font-semibold">
                    URL de rastreo embebido pendiente de configuración.
                  </p>
                  <p className="text-[13px] text-white/35 leading-relaxed mb-7">
                    Favor de confirmar el formato de URL embed o live map
                    desde el dashboard de Shipsgo.
                  </p>
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-[0.14em] bg-primary text-white hover:bg-primary/85 transition-colors"
                  >
                    Abrir Portal de Rastreo
                    <ExternalLink size={12} />
                  </a>
                </div>
              </FadeIn>

            </Container>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── 4. ESTADO INICIAL — antes de la primera búsqueda ────────────── */}
      {!submitted && (
        <section style={{ background: '#060e1c', padding: '64px 0 96px' }}>
          <Container>
            <div className="grid md:grid-cols-2 gap-16 items-start max-w-4xl">

              {/* Izquierda — tipos de referencia */}
              <FadeIn direction="left">
                <Eyebrow light>Tipos de Referencia Aceptados</Eyebrow>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
                  Rastreo Aéreo y Marítimo<br />en un Solo Lugar.
                </h2>
                <div className="space-y-5">
                  {[
                    {
                      Icon: Plane,
                      label: 'Guía Aérea (AWB)',
                      desc: 'Número IATA de 11 dígitos con prefijo de 3 dígitos de la aerolínea. Ejemplo: 057-12345675.',
                    },
                    {
                      Icon: Ship,
                      label: 'Número de Contenedor',
                      desc: 'Identificador ISO 6346 — código de 4 letras del propietario + 7 dígitos. Ejemplo: MSCU1234567.',
                    },
                    {
                      Icon: Ship,
                      label: 'Conocimiento de Embarque (BL)',
                      desc: 'Número de BL original emitido por el transportista marítimo o NVOCC.',
                    },
                    {
                      Icon: Ship,
                      label: 'Número de Reserva (Booking)',
                      desc: 'Referencia de reserva del transportista para visibilidad pre-embarque y en tránsito.',
                    },
                  ].map(({ Icon, label, desc }) => (
                    <div key={label} className="flex gap-4 items-start">
                      <div
                        className="w-7 h-7 shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.18)' }}
                      >
                        <Icon size={12} className="text-primary/55" />
                      </div>
                      <div>
                        <p className="text-[12px] font-extrabold uppercase tracking-wide text-white mb-0.5">{label}</p>
                        <p className="text-[12px] text-white/30 leading-snug">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Derecha — contacto de operaciones */}
              <FadeIn direction="right" delay={0.1}>
                <div
                  className="p-8"
                  style={{
                    background: '#0a1628',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderTop: '2px solid rgba(37,99,235,0.35)',
                  }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary/55 mb-4">
                    ¿No encuentras tu número de rastreo?
                  </p>
                  <h3 className="text-[15px] font-extrabold text-white mb-3 leading-snug">
                    Contacta a Nuestro Equipo de Operaciones
                  </h3>
                  <p className="text-[13px] text-white/38 leading-relaxed mb-7">
                    Si tienes un embarque activo con Global Gate México y necesitas
                    información sobre su estado, nuestro equipo puede proporcionarte
                    actualizaciones en tiempo real.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="mailto:ggm@globalgatemexico.com"
                      className="block text-[12px] text-white/45 hover:text-white transition-colors font-semibold"
                    >
                      ggm@globalgatemexico.com
                    </a>
                    <a
                      href="tel:+528121654040"
                      className="block text-[12px] text-white/45 hover:text-white transition-colors font-semibold"
                    >
                      +52 812 165 4040
                    </a>
                  </div>
                </div>
              </FadeIn>

            </div>
          </Container>
        </section>
      )}

    </div>
  );
}
