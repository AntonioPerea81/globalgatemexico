import { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Radiation } from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Datos ─────────────────────────────────────────────────────────────────────

const CAPACIDADES_EMBALAJE = [
  'Bultos Tipo A para material radiactivo — todos los modos de transporte',
  'Embalaje industrial para bultos exentos y objetos con contaminación superficial (OCS)',
  'Sobreembalaje para envíos de múltiples bultos o mercancía frágil',
  'Marcado conforme al OIEA: número ONU, nombre técnico de embarque, símbolo de trébol',
  'Aplicación y verificación de etiquetas Categoría I-BLANCO, II-AMARILLO, III-AMARILLO',
  'Cálculo del Índice de Transporte (IT) y medición de tasa de dosis en superficie del bulto',
  'Embalaje para material fisionable con apoyo en evaluación de seguridad crítica',
  'Verificación de integridad del bulto previa a la aceptación por el transportista',
];

const ESPECIFICACIONES_ALMACENAMIENTO = [
  { title: 'Acceso Controlado',       desc: 'Zonas de acceso restringido con autorización de personal y requisitos de dosimetría para todos los ingresantes. Sin acceso no autorizado en ninguna etapa del manejo.' },
  { title: 'Monitoreo Continuo',      desc: 'Niveles de radiación ambiental verificados durante todas las operaciones de almacenamiento, carga y descarga mediante instrumentos de campo calibrados.' },
  { title: 'Control de Custodia',     desc: 'Control de inventario por bulto con documentación de transferencias en cada etapa operacional. Trazabilidad completa desde la recepción hasta la salida.' },
  { title: 'Protocolos de Emergencia', desc: 'Procedimientos establecidos de contención de derrames, notificación regulatoria y descontaminación, mantenidos en sitio y practicados regularmente.' },
];

const CAPACIDADES_TRANSPORTE = [
  { title: 'Autorización CNSNS',  desc: 'Permisos de transporte previos para cada envío radiactivo antes del despacho del vehículo.' },
  { title: 'IATA DGR Clase 7',    desc: 'Transporte aéreo Clase 7 — cumplimiento CAO y PAX, límites de IT y coordinación NOTOC.' },
  { title: 'DOT Transfronterizo', desc: 'Carga radiactiva México–EE.UU. bajo DOT 49 CFR con documentación bilingüe y coordinación aduanera.' },
  { title: 'Código IMDG Cl. 7',   desc: 'Envíos marítimos con cumplimiento completo de estiba, segregación, manifiestos y documentación portuaria.' },
];

const PROCEDIMIENTOS_MONITOREO = [
  { title: 'Levantamiento Previo al Transporte', desc: 'Medición de tasa de dosis en superficie y contaminación del bulto antes de cada salida de envío.' },
  { title: 'Liberación del Vehículo',            desc: 'Levantamiento radiológico posterior a la entrega para confirmar descontaminación del vehículo antes de retornar al servicio.' },
  { title: 'Dosimetría de Personal',             desc: 'El personal de campo porta dosímetros con registros de dosis mantenidos conforme a requisitos CNSNS.' },
  { title: 'Monitoreo de Área',                  desc: 'Verificación de tasa de dosis ambiental durante operaciones de carga, descarga y almacenamiento.' },
];

const NORMATIVA = [
  {
    code: 'OIEA SSR-6',
    name: 'Transporte Seguro de Material Radiactivo',
    desc: 'El estándar internacional de referencia para clasificación, embalaje, etiquetado y autorización de transporte de material radiactivo, adoptado por todos los principales organismos reguladores del transporte a nivel mundial.',
  },
  {
    code: 'IATA DGR Clase 7',
    name: 'Transporte Aéreo de Material Radiactivo',
    desc: 'Regula el transporte aéreo de materiales radiactivos, incluyendo aprobaciones de bultos, requisitos del operador, límites de IT, restricciones CAO/PAX, NOTOC y certificación del expedidor.',
  },
  {
    code: 'Código IMDG Cl. 7',
    name: 'Carga Marítima Radiactiva',
    desc: 'Regulaciones para el transporte marítimo de materiales radiactivos que cubren estiba, segregación, límites de cantidad, documentación y procedimientos de respuesta a emergencias.',
  },
  {
    code: 'NOM-002-SCT',
    name: 'Norma Mexicana de Transporte Terrestre',
    desc: 'Regulación SCT que rige el transporte terrestre de materiales peligrosos en México, incluyendo requisitos de vehículos, rutas, placardeo y documentación para carga radiactiva.',
  },
  {
    code: 'CNSNS',
    name: 'Comisión Nacional de Seguridad Nuclear y Salvaguardias',
    desc: 'Autoridad reguladora de seguridad nuclear de México. Todas las operaciones de transporte, manejo y almacenamiento de material radiactivo requieren autorización previa CNSNS y reporte post-operación.',
  },
  {
    code: 'DOT 49 CFR',
    name: 'Departamento de Transporte de EE.UU.',
    desc: 'Aplicable a envíos radiactivos transfronterizos México–EE.UU. Impone requisitos adicionales al IATA DGR para ciertos materiales, cantidades y tipos de transportista.',
  },
];

const IMAGENES_TRANSPORTE = [
  {
    src: '/radioactive/transport/radioactive_crane_operation_full_box.webp',
    alt: 'Operación de grúa — izaje de bulto radiactivo industrial',
    label: 'Grúa y Carga Pesada',
    sub: 'Operaciones de carga de bultos industriales',
  },
  {
    src: '/radioactive/transport/radioactive_forklift_operation.webp',
    alt: 'Montacargas manejando carga radiactiva',
    label: 'Manejo en Tierra',
    sub: 'Transferencia de bodega a vehículo',
  },
  {
    src: '/radioactive/transport/radioactive_night_transport.webp',
    alt: 'Operación nocturna de transporte radiactivo',
    label: 'Operaciones Nocturnas',
    sub: 'Capacidad de transporte controlado 24 horas',
  },
];

// ── Página ────────────────────────────────────────────────────────────────────

const RAD_YELLOW = '#eab308';
const IMG_FILTER = 'saturate(0.55) brightness(0.62)';

export const LogisticaMaterialRadiacticoPage = () => {
  const { setLanguage } = useLanguage();

  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Logística de Material Radiactivo en México | Global Gate México',
    description: 'Logística especializada de material radiactivo Clase 7 — embalaje, almacenamiento controlado y transporte multimodal conforme a OIEA SSR-6, IATA DGR, CNSNS, SCT e IMDG en México y Norteamérica.',
    canonical: 'https://globalgatemexico.com/logistica-material-radiactivo',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/logistica-material-radiactivo' },
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
            alt="Operación de grúa con bulto radiactivo industrial"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.5) brightness(0.42)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030810]/97 via-[#060e1c]/80 to-[#060e1c]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1c]/92 via-transparent to-[#030810]/25" />
          <div
            className="absolute inset-0 opacity-[0.09]"
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
                <div className="w-8 h-px" style={{ background: RAD_YELLOW, opacity: 0.45 }} />
                <span
                  className="text-[10px] font-black uppercase tracking-[0.28em]"
                  style={{ color: RAD_YELLOW, opacity: 0.72 }}
                >
                  OIEA SSR-6 · IATA DGR Clase 7 · Autorización CNSNS
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-[3.5rem] font-extrabold text-white leading-[1.06] tracking-tight mb-5">
                Logística de Material<br />
                <span style={{ color: RAD_YELLOW }}>Radiactivo.</span>
              </h1>

              <p className="text-white/38 text-xl md:text-2xl font-semibold tracking-tight mb-8 leading-snug">
                Manejo Seguro. Cumplimiento Regulatorio.<br className="hidden sm:block" /> Control Operacional.
              </p>

              <p className="text-white/52 text-[15px] leading-relaxed mb-10 max-w-2xl">
                Embalaje especializado, almacenamiento controlado y transporte multimodal de material
                radiactivo Clase 7 en México y Norteamérica. Cada operación ejecutada bajo los marcos
                normativos del OIEA, IATA DGR, CNSNS y SCT.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_28px_rgba(7,56,223,0.45)] transition-all duration-200"
                >
                  Solicitar Consulta
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] border text-white/72 hover:text-white hover:bg-white/5 transition-all duration-200"
                  style={{ borderColor: 'rgba(255,255,255,0.16)' }}
                >
                  Hablar con un Especialista
                </button>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-7 border-t border-white/[0.07]">
                {[
                  'Autorización CNSNS',
                  'Certificación IATA',
                  'Desde 2006',
                  'Operaciones Aéreas y Terrestres',
                ].map((tag) => (
                  <div key={tag} className="flex items-center gap-2.5">
                    <div className="w-1 h-1 rounded-full" style={{ background: RAD_YELLOW, opacity: 0.5 }} />
                    <span className="text-[11px] text-white/42 font-semibold tracking-wide">{tag}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── 2. FRANJA DE CREDIBILIDAD ─────────────────────────────────────────── */}
      <section className="bg-[#0a1422] border-t border-b border-white/[0.06]">
        <Container>
          <div className="flex flex-wrap divide-x divide-white/[0.06]">
            {[
              { num: '+20',         label: 'Años de Operación',              sub: 'Logística de mercancías peligrosas desde 2006' },
              { num: 'CNSNS',       label: 'Autorización Vigente',           sub: 'Comisión Nacional de Seguridad Nuclear' },
              { num: 'IATA DGR',    label: 'Requisitos Clase 7',             sub: 'Regulaciones para material radiactivo' },
              { num: 'Tipo A',      label: 'y Embalaje Industrial',           sub: 'Soluciones UN certificadas para todos los niveles de actividad' },
              { num: 'Aéreo',       label: 'y Terrestre',                    sub: 'Transporte nacional e internacional' },
            ].map(({ num, label, sub }) => (
              <div key={label} className="flex-1 min-w-[150px] px-7 py-9 xl:px-9 xl:py-11">
                <p className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-none mb-1">{num}</p>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.15em] mb-1.5"
                  style={{ color: RAD_YELLOW, opacity: 0.62 }}
                >
                  {label}
                </p>
                <p className="text-[11px] text-white/26 leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. EMBALAJE ─────────────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start">

            <FadeIn direction="left">
              <div className="space-y-3">
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <img
                    src="/radioactive/packaging/radioactive_overpack_label.webp"
                    alt="Bulto radiactivo conforme al OIEA — marcado y etiquetado regulatorio visible"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.82)' }}
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#060e1c]/72 to-transparent pt-16 pb-5 px-5">
                    <p
                      className="text-[9px] font-black uppercase tracking-[0.2em] mb-1"
                      style={{ color: RAD_YELLOW, opacity: 0.88 }}
                    >
                      Marcado y Etiquetado Regulatorio
                    </p>
                    <p className="text-white/62 text-[12px] font-semibold">
                      OIEA Categoría III-AMARILLO · Número ONU · Nombre Técnico de Embarque
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src="/radioactive/packaging/radioactive_crates_layout.webp"
                      alt="Bultos radiactivos — disposición previa al embarque"
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.72)' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#060e1c]/18" />
                  </div>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src="/radioactive/packaging/blue_radioactive_container.webp"
                      alt="Contenedor radiactivo industrial — embalaje Tipo A"
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.72)' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#060e1c]/18" />
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1}>
              <Eyebrow>OIEA · IATA DGR · NOM-002-SCT</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                Soluciones de Embalaje<br />Conforme a Normativa
              </h2>
              <p className="text-secondary text-[15px] leading-relaxed mb-4">
                El embalaje correcto es la primera y más crítica capa de control en el transporte de
                material radiactivo. Suministramos, preparamos, verificamos y certificamos embalajes
                UN certificados conforme al OIEA SSR-6 y las normativas modales aplicables.
              </p>
              <p className="text-secondary text-[14px] leading-relaxed mb-8">
                Nuestro equipo cuenta con certificación IATA vigente para instrucciones de embalaje
                Clase 7 y aplica marcado, etiquetado y documentación conforme a CNSNS en cada bulto
                antes de que ingrese a la cadena de transporte.
              </p>

              <div className="space-y-3 mb-10">
                {CAPACIDADES_EMBALAJE.map((cap, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px]"
                      style={{ background: RAD_YELLOW, opacity: 0.58 }}
                    />
                    <span className="text-[13px] text-dark/68 leading-snug">{cap}</span>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
                <img
                  src="/radioactive/packaging/radioactive_overpacks_warehouse.webp"
                  alt="Sobreembalajes radiactivos en bodega — preparación previa al transporte"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.68) brightness(0.9)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#060e1c]/22" />
                <div className="absolute bottom-3 left-4 border-l-2 pl-3" style={{ borderColor: `${RAD_YELLOW}50` }}>
                  <p className="text-[10px] text-white/62 font-bold uppercase tracking-wide">Operaciones de Sobreembalaje</p>
                  <p className="text-[10px] text-white/38">Preparación previa al transporte — cumplimiento IATA DGR</p>
                </div>
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 4. ALMACENAMIENTO CONTROLADO ────────────────────────────────────── */}
      <section className="py-28 lg:py-40" style={{ background: '#050c17' }}>
        <Container>

          <FadeIn className="mb-16">
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <Eyebrow light>CNSNS · Seguridad Radiológica · Control de Custodia</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Almacenamiento Controlado<br />y Retención Temporal
                </h2>
              </div>
              <p className="text-white/33 text-[14px] leading-relaxed lg:text-right max-w-md lg:ml-auto">
                Almacenamiento temporal seguro y monitoreado durante operaciones de tránsito,
                procesamiento de documentación o preparación de envíos — conforme a los requisitos
                CNSNS y protocolos de seguridad radiológica.
              </p>
            </div>
          </FadeIn>

          {/* Cuadrícula de imágenes */}
          <div className="grid lg:grid-cols-3 gap-3 lg:gap-4 mb-16">

            <FadeIn delay={0.04} className="lg:col-span-2">
              <div className="relative overflow-hidden" style={{ height: '460px' }}>
                <img
                  src="/radioactive/storage/radioactive_bunker.webp"
                  alt="Búnker de almacenamiento controlado para material radiactivo"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.4) brightness(0.6)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050c17]/88 via-[#050c17]/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p
                    className="text-[9px] font-black uppercase tracking-[0.24em] mb-1.5"
                    style={{ color: RAD_YELLOW, opacity: 0.72 }}
                  >
                    Zona de Acceso Controlado
                  </p>
                  <p className="text-white/52 text-[13px] font-semibold">
                    Personal autorizado únicamente · Dosimetría requerida al ingreso
                  </p>
                </div>
              </div>
            </FadeIn>

            <div className="flex flex-col gap-3 lg:gap-4">
              <FadeIn delay={0.1}>
                <div className="relative overflow-hidden" style={{ height: '222px' }}>
                  <img
                    src="/radioactive/storage/radioactive_storage.webp"
                    alt="Área de almacenamiento operativo de bultos radiactivos"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.45) brightness(0.6)' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#050c17]/32" />
                  <div className="absolute bottom-3 left-4 border-l border-white/18 pl-3">
                    <p className="text-[10px] text-white/42 font-bold uppercase tracking-wide">Almacenamiento Operativo</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.16}>
                <div className="relative overflow-hidden" style={{ height: '222px' }}>
                  <img
                    src="/radioactive/storage/radioactive_packages.webp"
                    alt="Bultos radiactivos en preparación para transporte"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.45) brightness(0.6)' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#050c17]/32" />
                  <div className="absolute bottom-3 left-4 border-l border-white/18 pl-3">
                    <p className="text-[10px] text-white/42 font-bold uppercase tracking-wide">Preparación Previa al Transporte</p>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>

          {/* Lista editorial de protocolos — sin íconos */}
          <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
            {ESPECIFICACIONES_ALMACENAMIENTO.map(({ title, desc }) => (
              <FadeIn key={title}>
                <div className="flex gap-5">
                  <div
                    className="w-px shrink-0 mt-1 self-stretch"
                    style={{ background: `${RAD_YELLOW}30` }}
                  />
                  <div>
                    <h3 className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-white mb-2.5">{title}</h3>
                    <p className="text-[13px] text-white/40 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

        </Container>
      </section>

      {/* ── 5. OPERACIONES DE TRANSPORTE ──────────────────────────────────────── */}
      <section className="pt-28 lg:pt-40 bg-[#060e1c]">

        <Container className="mb-12 lg:mb-14">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <Eyebrow light>Aéreo · Terrestre · Transfronterizo</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Operaciones de Transporte
                </h2>
              </div>
              <p className="text-white/33 text-[14px] leading-relaxed lg:text-right max-w-md lg:ml-auto">
                Transporte de carga radiactiva en México y corredores internacionales —
                desde la autorización previa CNSNS hasta la confirmación de entrega final.
              </p>
            </div>
          </FadeIn>
        </Container>

        {/* Imagen cinematográfica — ruta costera */}
        <div className="relative overflow-hidden" style={{ height: '560px' }}>
          <img
            src="/radioactive/transport/radioactive_transport_coastal.webp"
            alt="Transporte terrestre especializado de material radiactivo — ruta costera"
            className="w-full h-full object-cover"
            style={{ filter: IMG_FILTER }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1c]/88 via-[#060e1c]/28 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1c]/78 via-transparent to-transparent" />

          <div className="absolute bottom-10 left-0 right-0">
            <Container>
              <div className="flex items-end justify-between gap-8 flex-wrap">
                <div>
                  <p
                    className="text-[9px] font-black uppercase tracking-[0.26em] mb-2"
                    style={{ color: RAD_YELLOW, opacity: 0.72 }}
                  >
                    Transporte Terrestre Especializado
                  </p>
                  <p className="text-white/62 text-[14px] font-semibold max-w-sm leading-relaxed">
                    Vehículos con monitoreo radiológico, autorización previa CNSNS y rastreo GPS continuo
                  </p>
                </div>
                <div className="hidden lg:flex gap-3 shrink-0 flex-wrap pb-1">
                  {['NOM-002-SCT', 'Rastreo GPS', 'Permiso CNSNS', 'Protocolo de Emergencia'].map((tag) => (
                    <div key={tag} className="border border-white/[0.10] px-3.5 py-2">
                      <span className="text-[9px] text-white/38 uppercase tracking-[0.16em] font-bold">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </div>
        </div>

        {/* Cuadrícula de 3 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ height: '400px' }}>
          {IMAGENES_TRANSPORTE.map(({ src, alt, label, sub }, i) => (
            <FadeIn key={src} delay={i * 0.08} className="relative overflow-hidden group">
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: IMG_FILTER }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#060e1c]/48 group-hover:bg-[#060e1c]/20 transition-colors duration-500" />
              <div className="absolute bottom-5 left-5 border-l-2 pl-3" style={{ borderColor: `${RAD_YELLOW}52` }}>
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-white">{label}</p>
                <p className="text-[10px] text-white/38">{sub}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Capacidades de transporte */}
        <Container className="py-16 lg:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {CAPACIDADES_TRANSPORTE.map(({ title, desc }) => (
              <FadeIn key={title}>
                <div className="border-t border-white/[0.07] pt-5">
                  <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-white mb-2.5">{title}</h3>
                  <p className="text-[12px] text-white/36 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>

      </section>

      {/* ── 6. MONITOREO RADIOLÓGICO / EQUIPAMIENTO ───────────────────────────── */}
      <section className="py-28 lg:py-40 bg-[#f8f9fc] border-t border-black/5">
        <Container>

          <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start mb-18 lg:mb-20">

            <FadeIn direction="left">
              <Eyebrow>Instrumentación de Campo · Cumplimiento CNSNS</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                Monitoreo Radiológico<br />y Verificación Operacional
              </h2>
              <p className="text-secondary text-[15px] leading-relaxed mb-4">
                Cada operación de material radiactivo que ejecutamos es precedida y concluida con
                levantamientos radiológicos formales utilizando instrumentos de campo calibrados.
                Los bultos no se mueven sin datos de medición verificados en expediente.
              </p>
              <p className="text-secondary text-[14px] leading-relaxed">
                Detectores de tasa de kerma, instrumentos de medición de dosis y monitores de
                contaminación son desplegados en las etapas de carga, descarga, liberación del
                vehículo y verificación de áreas de almacenamiento — no como formalidad, sino
                como estándar operacional.
              </p>
            </FadeIn>

            <FadeIn direction="right" delay={0.1}>
              <div className="space-y-6">
                {PROCEDIMIENTOS_MONITOREO.map(({ title, desc }) => (
                  <div key={title} className="flex gap-5">
                    <div
                      className="w-px shrink-0 mt-1 self-stretch"
                      style={{ background: 'rgba(0,0,0,0.12)' }}
                    />
                    <div>
                      <h3 className="text-[12px] font-extrabold uppercase tracking-[0.16em] mb-1.5 text-dark">{title}</h3>
                      <p className="text-[13px] text-secondary leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

          </div>

          {/* Imágenes de equipamiento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                src: '/radioactive/equipment/IMG_20191129_090720_industrial.webp',
                label: 'Instrumento de Medición',
                sub: 'Detector Geiger-Müller — mediciones de tasa de dosis en superficie y ambiente previas a la salida del envío',
              },
              {
                src: '/radioactive/equipment/IMG_20191129_090959_industrial.webp',
                label: 'Dosimetría de Campo',
                sub: 'Instrumentos de dosimetría personal y de área — protección radiológica y registros de exposición del personal',
              },
              {
                src: '/radioactive/equipment/1000212370_industrial.webp',
                label: 'Monitoreo de Contaminación',
                sub: 'Verificación de contaminación superficial — liberación del vehículo e inspección de bultos posterior a la operación',
              },
            ].map(({ src, label, sub }, i) => (
              <FadeIn key={src} delay={i * 0.1}>
                <div className="group">
                  <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '3/2' }}>
                    <img
                      src={src}
                      alt={label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: 'saturate(0.62) brightness(0.86)' }}
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#060e1c]/78 backdrop-blur-sm px-2.5 py-1.5">
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.18em]"
                        style={{ color: RAD_YELLOW, opacity: 0.82 }}
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

      {/* ── 7. NORMATIVA APLICABLE ────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white border-t border-black/5">
        <Container>

          <FadeIn className="mb-16">
            <Eyebrow>Cumplimiento Regulatorio</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 leading-[1.08]">
              Normativa Aplicable
            </h2>
            <p className="text-secondary text-[15px] max-w-xl leading-relaxed">
              El transporte de material radiactivo es la categoría de carga más regulada en la logística
              internacional. Cada envío que manejamos es prevalidado contra el conjunto normativo aplicable
              completo antes de que un solo bulto se mueva.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.06]">
            {NORMATIVA.map(({ code, name, desc }, i) => (
              <FadeIn key={code} delay={i * 0.06}>
                <div className="group bg-white p-8 xl:p-10 h-full hover:bg-[#060e1c] transition-colors duration-300">
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.22em] mb-2"
                    style={{ color: RAD_YELLOW }}
                  >
                    {code}
                  </p>
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-4 text-dark group-hover:text-white transition-colors leading-snug">
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

      {/* ── 8. PERSONAL DE CAMPO ──────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-[#060e1c]">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10 xl:gap-14 items-center">

            <FadeIn direction="left" className="lg:col-span-3">
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src="/radioactive/operations/a_daytime_industrial_utility_selfie_scene_close_u.webp"
                  alt="Personal certificado en manejo de material radiactivo — operaciones en campo"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.58) brightness(0.7)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#060e1c]/52" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-[#060e1c]/72 backdrop-blur-sm px-4 py-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: RAD_YELLOW, opacity: 0.62 }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/62">
                    Personal de Campo Certificado
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1} className="lg:col-span-2">
              <Eyebrow light>Capacitado. Certificado. Responsable.</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
                La Operación Es Tan<br />Confiable Como el<br />
                <span style={{ color: RAD_YELLOW }}>Equipo que la Ejecuta.</span>
              </h2>
              <p className="text-white/42 text-[14px] leading-relaxed mb-8">
                Cada operativo de campo que maneja carga Clase 7 cuenta con autorización CNSNS vigente
                y capacitación reconocida por IATA. Los registros de dosimetría se mantienen. Los
                procedimientos de emergencia se practican. Sin excepciones.
              </p>

              <div className="space-y-4">
                {[
                  'Operadores de material radiactivo con autorización CNSNS vigente',
                  'Especialistas certificados IATA DGR Clase 7',
                  'Dosimetría personal activa — trazada y auditada',
                  'Capacitación en respuesta a emergencias conforme a CNSNS',
                  'Recertificación anual — sin prórrogas, sin excepciones',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle
                      size={14}
                      className="shrink-0 mt-0.5"
                      style={{ color: RAD_YELLOW, opacity: 0.55 }}
                    />
                    <span className="text-[13px] text-white/48 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 9. CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="relative py-32 lg:py-48 bg-[#030810] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/radioactive/storage/radioactive_box.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.22) brightness(0.2)' }}
          />
          <div className="absolute inset-0 bg-[#030810]/84" />
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
              <div className="h-px w-14" style={{ background: RAD_YELLOW, opacity: 0.28 }} />
              <Radiation size={15} style={{ color: RAD_YELLOW, opacity: 0.42 }} />
              <div className="h-px w-14" style={{ background: RAD_YELLOW, opacity: 0.28 }} />
            </div>

            <h2 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white tracking-tight mb-5 leading-[1.06]">
              ¿Requiere Soporte Especializado para el<br />
              <span style={{ color: RAD_YELLOW }}>Transporte de Material Radiactivo?</span>
            </h2>

            <p className="text-white/38 text-[15px] leading-relaxed mb-12 max-w-lg mx-auto">
              Nuestros especialistas Clase 7 evaluarán los requisitos de su envío, confirmarán las
              obligaciones regulatorias aplicables y elaborarán una propuesta operacional detallada.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={scrollToContact}
                className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.18em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_36px_rgba(7,56,223,0.45)] transition-all duration-200"
              >
                Solicitar Consulta
              </button>
              <button
                onClick={scrollToContact}
                className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.18em] bg-transparent text-white/60 hover:text-white/90 transition-colors duration-200"
                style={{ border: `1px solid ${RAD_YELLOW}30` }}
              >
                Contactar al Equipo
              </button>
            </div>
          </FadeIn>
        </Container>
      </section>

    </div>
  );
};
