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
const ACCENT    = '#ea580c';                                  // DG-orange — hazmat industrial
const QUOTE_HREF   = '/solicitar-cotizacion';
const CONTACT_HREF = '/contacto';

// ── Data ─────────────────────────────────────────────────────────────────────

const CARGO_CATEGORIES = [
  {
    Icon: Flame,
    un: 'Clase 3',
    title: 'Líquidos Inflamables',
    desc: 'Gasolina, solventes, pinturas industriales y derivados del petróleo con puntos de inflamación específicos, transportados bajo NOM-002-SCT con documentación completa.',
  },
  {
    Icon: Wind,
    un: 'Clases 2.1 · 2.2 · 2.3',
    title: 'Gases',
    desc: 'Gases comprimidos, licuados, refrigerados y disueltos para uso industrial, hospitalario y manufacturero con manejo especializado.',
  },
  {
    Icon: Droplet,
    un: 'Clase 8',
    title: 'Corrosivos',
    desc: 'Ácidos, bases y soluciones corrosivas para la industria química, automotriz y de manufactura con protocolos de contención.',
  },
  {
    Icon: Zap,
    un: 'Clase 9 · SEMARNAT',
    title: 'Baterías de Litio',
    desc: 'Baterías nuevas, dañadas o destinadas a disposición final. Autorización SEMARNAT para baterías de litio metálico.',
  },
  {
    Icon: AlertTriangle,
    un: 'Clase 9 · CRETIB',
    title: 'Residuos Peligrosos',
    desc: 'Residuos CRETIB bajo normativa SEMARNAT con trazabilidad completa, manifiestos de movimiento y procedimientos auditables.',
  },
  {
    Icon: AlertCircle,
    un: 'Clases 6.1 · 6.2',
    title: 'Tóxicos e Infecciosos',
    desc: 'Sustancias tóxicas para industria farmacéutica, química y de investigación bajo estrictos protocolos de manipulación y bioseguridad.',
  },
  {
    Icon: Package,
    un: 'Clase 9 · Varios',
    title: 'Mercancías Diversas',
    desc: 'Materiales magnetizados, contaminantes del ambiente, hielo seco y otros artículos y sustancias de la Clase 9 y misceláneos.',
  },
];

const CAPABILITIES = [
  {
    title: 'Unidades SICT Autorizadas',
    desc: 'Vehículos con permisos SICT vigentes para el transporte de materiales y residuos peligrosos en México.',
  },
  {
    title: 'Operadores Certificados',
    desc: 'Personal con capacitación formal en manejo de mercancías peligrosas conforme a NOM-087-SCT y regulaciones aplicables.',
  },
  {
    title: 'Documentación Integral',
    desc: 'Carta de porte, manifiesto de carga peligrosa, SDS y documentos de emergencia preparados antes de cada despacho.',
  },
  {
    title: 'Embalaje ONU Certificado',
    desc: 'Embalaje homologado con especificaciones de Naciones Unidas para cada clase y categoría de peligrosidad.',
  },
  {
    title: 'Marcado y Etiquetado',
    desc: 'Aplicación de marcas, etiquetas, rótulos y placa-riesgo conforme a NOM-002-SCT/2011 y normativa internacional aplicable.',
  },
  {
    title: 'Cobertura Nacional',
    desc: 'Operaciones en CDMX, Monterrey, Guadalajara, Bajío, corredor industrial norte y rutas estratégicas en todo el país.',
  },
  {
    title: 'Seguimiento en Tiempo Real',
    desc: 'Monitoreo GPS continuo con capacidad de reporte de posición y estado del cargamento durante todo el trayecto.',
  },
  {
    title: 'Protocolo de Emergencias',
    desc: 'Plan de respuesta a incidentes, coordinación con Protección Civil y notificación a autoridades según Hoja de Emergencia.',
  },
];

const LITHIUM_POINTS = [
  'Autorización SEMARNAT para baterías de litio metálico destinadas a disposición final',
  'Transporte de baterías dañadas, defectuosas o con deterioro visible bajo procedimientos de contención especial',
  'Segregación y embalaje para baterías con riesgo de cortocircuito o fuga de electrolito',
  'Documentación completa: SDS, notificación de expedidor, manifiesto y carta de porte',
  'Coordinación con gestores de residuos peligrosos autorizados por SEMARNAT',
  'Compatibilidad multimodal para tránsitos con componente aéreo posterior (coordinación con IATA)',
];

const INDUSTRIES = [
  { Icon: Flame,        label: 'Petróleo y Gas',             sub: 'Hidrocarburos · Refinación · Distribución' },
  { Icon: Droplet,      label: 'Industria Química',           sub: 'Reactivos · Insumos · Productos especializados' },
  { Icon: Car,          label: 'Automotriz',                  sub: 'OEM · Tier 1 · Manufactura de componentes' },
  { Icon: Zap,          label: 'Energía y Renovables',        sub: 'Baterías · Solar · Eólica · Almacenamiento' },
  { Icon: Factory,      label: 'Manufactura Industrial',      sub: 'Plantas · Operaciones · Logística interna' },
  { Icon: Truck,        label: 'Agentes de Carga',            sub: 'Freight forwarders · Operadores logísticos' },
  { Icon: Plane,        label: 'Aerolíneas y Operadores',     sub: 'Consolidación terrestre · Pre-embarque aéreo' },
  { Icon: Cog,          label: 'Operaciones Industriales',    sub: 'Minería · Construcción · Mantenimiento' },
];

const REGULATIONS = [
  {
    code: 'NOM-002-SCT/2011',
    name: 'Listado de Materiales y Residuos Peligrosos',
    desc: 'Norma oficial que establece las especificaciones para clasificación, descripción y transporte terrestre de sustancias y residuos peligrosos en territorio mexicano.',
  },
  {
    code: 'SICT',
    name: 'Secretaría de Infraestructura, Comunicaciones y Transportes',
    desc: 'Autoridad federal emisora de permisos para el transporte terrestre de materiales y residuos peligrosos. Toda unidad operativa debe contar con autorización SICT vigente.',
  },
  {
    code: 'SEMARNAT',
    name: 'Secretaría de Medio Ambiente y Recursos Naturales',
    desc: 'Autoridad ambiental federal. Otorga autorizaciones para el manejo, transporte y disposición de residuos peligrosos, incluyendo baterías de litio metálico para disposición final.',
  },
  {
    code: 'NOM-010-SCT2',
    name: 'Especificaciones de Embalaje para Transporte',
    desc: 'Norma que regula los requerimientos de embalaje, marcado, etiquetado y placardeo de mercancías peligrosas en transporte terrestre federal.',
  },
  {
    code: 'Regl. TTMRP',
    name: 'Reglamento para el Transporte Terrestre',
    desc: 'Reglamento federal que establece las condiciones operativas para vehículos, rutas, responsabilidades y documentación en el transporte de materiales y residuos peligrosos.',
  },
  {
    code: 'IATA DGR · IMDG',
    name: 'Coordinación Multimodal Internacional',
    desc: 'Para operaciones multimodales, GGM garantiza trazabilidad y continuidad regulatoria entre el transporte terrestre y el despacho aéreo o marítimo internacional.',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export function TransporteTerrestreMercanciasPeligrosasPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Transporte Terrestre de Mercancías Peligrosas en México | Global Gate México',
    description: 'Transporte terrestre especializado de mercancías peligrosas en México: líquidos inflamables, gases, corrosivos, baterías de litio y residuos peligrosos. Autorizado por SICT y SEMARNAT.',
    canonical: 'https://globalgatemexico.com/transporte-terrestre-mercancias-peligrosas',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/transporte-terrestre-mercancias-peligrosas' },
      { lang: 'en', href: 'https://globalgatemexico.com/dangerous-goods-ground-transportation' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/transporte-terrestre-mercancias-peligrosas' },
    ],
  });

  return (
    <div className="bg-[#060e1c]">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-[#030810] pt-[106px]">

        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/dg-transport/dg-ground-transport.webp"
            alt="Transporte terrestre especializado de mercancías peligrosas — operaciones DG México"
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
                  NOM-002-SCT · SICT Autorizado · SEMARNAT
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-[3.2rem] font-extrabold text-white leading-[1.04] tracking-tight mb-5">
                Transporte Terrestre<br />
                Especializado para{' '}
                <span style={{ color: ACCENT }}>Mercancías</span><br />
                <span style={{ color: ACCENT }}>Peligrosas</span>{' '}en México.
              </h1>

              <p className="text-white/38 text-xl md:text-2xl font-semibold tracking-tight mb-6 leading-snug">
                Cumplimiento Regulatorio. Control Operacional.<br className="hidden sm:block" />
                Logística de Alto Riesgo.
              </p>

              <p className="text-white/52 text-[15px] leading-relaxed mb-10 max-w-2xl">
                Operaciones seguras y en cumplimiento para líquidos inflamables, gases, baterías de litio,
                corrosivos y residuos peligrosos autorizados por SICT y SEMARNAT. Trazabilidad completa
                en cada operación de transporte de materiales peligrosos.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to={QUOTE_HREF}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_28px_rgba(7,56,223,0.45)] transition-all duration-200 inline-block"
                >
                  Solicitar Cotización
                </Link>
                <Link
                  to={CONTACT_HREF}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] border text-white/68 hover:text-white hover:border-white/38 transition-all duration-200 inline-block"
                  style={{ borderColor: 'rgba(255,255,255,0.18)' }}
                >
                  Hablar con un Especialista
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-7 border-t border-white/[0.07]">
                {[
                  'SICT Autorizado',
                  'SEMARNAT Autorizado',
                  'Operadores Certificados',
                  'Cobertura Nacional',
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
              { num: '20+',       label: 'Años de Operación',     sub: 'Logística DG desde 2006' },
              { num: 'SICT',      label: 'Permisos Vigentes',      sub: 'Unidades autorizadas para MP' },
              { num: 'SEMARNAT',  label: 'Autorización Baterías',  sub: 'Litio metálico para disposición' },
              { num: 'Clases 2–9', label: 'Operaciones DG Autorizadas', sub: 'Excl. Clase 1 y radiactivo — división especializada' },
              { num: 'Nacional',  label: 'Cobertura',              sub: 'CDMX · MTY · GDL · Bajío · Norte' },
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

      {/* ── 3. QUÉ TRANSPORTAMOS ─────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white">
        <Container>

          <FadeIn className="mb-16">
            <Eyebrow>Clases DG 1–9 · NOM-002-SCT · Materiales Peligrosos</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 leading-[1.08]">
              Qué Transportamos
            </h2>
            <p className="text-secondary text-[15px] max-w-xl leading-relaxed">
              Operamos con todas las clases de mercancías peligrosas relevantes para la industria mexicana. No somos
              transportistas genéricos — somos operadores especializados en logística de materiales peligrosos con
              control regulatorio en cada etapa.
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
                    División Especializada
                  </span>
                </div>
                <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-3 text-white">
                  Material Radioactivo
                </h3>
                <p className="text-[12px] text-white/36 leading-relaxed mb-6 flex-1">
                  También operamos una división especializada en logística de material radiactivo
                  (Clase 7) bajo autorización CNSNS e IATA DGR.
                </p>
                <Link
                  to="/logistica-material-radiactivo"
                  className="text-[10px] font-black uppercase tracking-[0.16em] transition-opacity hover:opacity-100"
                  style={{ color: ACCENT, opacity: 0.65 }}
                >
                  Ver División Clase 7 →
                </Link>
              </div>
            </FadeIn>
          </div>

        </Container>
      </section>

      {/* ── 4. CAPACIDADES OPERATIVAS ────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-[#050c17]">
        <Container>

          <FadeIn className="mb-16">
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <Eyebrow light>Operaciones Certificadas · Infraestructura Técnica</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Capacidades Operativas
                </h2>
              </div>
              <p className="text-white/33 text-[14px] leading-relaxed lg:text-right max-w-md lg:ml-auto">
                No vendemos capacidad de carga. Proveemos un servicio integrado de logística regulatoria para
                mercancías de alto riesgo, con control documental y operacional en cada etapa del proceso.
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
                alt="Operaciones de campo — transporte terrestre de mercancías peligrosas México"
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
                        Operaciones DG Terrestres · México
                      </p>
                      <p className="text-white/58 text-[14px] font-semibold max-w-md leading-relaxed">
                        Logística de materiales peligrosos con control regulatorio completo desde origen hasta entrega final
                      </p>
                    </div>
                    <div className="hidden lg:flex gap-3 shrink-0 flex-wrap pb-1">
                      {['NOM-002-SCT', 'SICT Vigente', 'GPS Tracking', 'Protocolo de Emergencia'].map((tag) => (
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

      {/* ── 5. BATERÍAS DE LITIO ─────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white border-t border-black/5">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-start">

            <FadeIn direction="left">
              <div className="space-y-3">
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <img
                    src="/images/dg-transport/dg-specialized-packaging.webp"
                    alt="Embalaje especializado para baterías de litio — mercancías peligrosas Clase 9"
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
                      Embalaje Especializado · Clase 9
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
                      alt="Proceso de embalaje de mercancías peligrosas"
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.65)' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#060e1c]/18" />
                  </div>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src="/images/dg-transport/dg-warehouse-01.webp"
                      alt="Almacén especializado de mercancías peligrosas"
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
                  Alta Especialización · SEMARNAT
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                Especialización en<br />
                <span style={{ color: ACCENT }}>Baterías de Litio</span>
              </h2>
              <p className="text-secondary text-[15px] leading-relaxed mb-4">
                El transporte de baterías de litio es uno de los segmentos de mayor complejidad regulatoria en
                la logística terrestre mexicana. Las restricciones de embalaje, las condiciones de carga y los
                requisitos documentales varían según el estado de la batería, su tipo y su destino final.
              </p>
              <p className="text-secondary text-[14px] leading-relaxed mb-8">
                Global Gate México cuenta con <strong>autorización SEMARNAT para el transporte de baterías de
                litio metálico destinadas a disposición final</strong>, posicionándose como operador referente
                para la industria manufacturera, automotriz y de energía en México.
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
                  Autorización SEMARNAT
                </p>
                <p className="text-[13px] text-dark/65 leading-relaxed">
                  Global Gate México cuenta con autorización de la Secretaría de Medio Ambiente y Recursos
                  Naturales para el transporte de baterías de litio metálico para disposición final — un
                  segmento con restricciones significativas en México.
                </p>
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 6. FLOTA Y UNIDADES ──────────────────────────────────────────────── */}
      <section className="pt-28 lg:pt-40 bg-[#060e1c]">

        <Container className="mb-12 lg:mb-14">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <Eyebrow light>Unidades Especializadas · Permisos SICT Vigentes</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Flota y Unidades DG
                </h2>
              </div>
              <p className="text-white/33 text-[14px] leading-relaxed lg:text-right max-w-md lg:ml-auto">
                Unidades con permisos SICT vigentes para el transporte de materiales y residuos peligrosos.
                Equipadas con kit de emergencia, señalización DG y documentación de bordo completa.
              </p>
            </div>
          </FadeIn>
        </Container>

        {/* Cinematic fleet strip */}
        <div className="relative overflow-hidden" style={{ height: '520px' }}>
          <img
            src="/images/dg-transport/dg-hero-main.webp"
            alt="Flota especializada para transporte de mercancías peligrosas — Global Gate México"
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
                    Logística de Mercancías Peligrosas · Especializada
                  </p>
                  <p className="text-white/58 text-[14px] font-semibold max-w-sm leading-relaxed">
                    Unidades autorizadas, operadores certificados, documentación DG completa y protocolo de
                    emergencias activo en cada despacho
                  </p>
                </div>
                <div className="hidden lg:flex gap-3 shrink-0 flex-wrap pb-1">
                  {['Permisos SICT', 'Kit de Emergencia', 'Placardeo DG', 'GPS Continuo'].map((tag) => (
                    <div key={tag} className="border border-white/[0.10] px-3.5 py-2">
                      <span className="text-[9px] text-white/38 uppercase tracking-[0.16em] font-bold">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </div>
        </div>

        {/* Fleet capabilities strip */}
        <Container className="py-16 lg:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[
              {
                title: 'Capacidad de Carga',
                desc: 'Unidades para carga fraccionada y completa (FTL/LTL) con compartimentación según tipo y clase de mercancía peligrosa.',
              },
              {
                title: 'Preparación Operacional',
                desc: 'Vehículos inspeccionados antes de cada despacho. Kit de emergencia DG, extintor y equipo de contención a bordo.',
              },
              {
                title: 'Manejo Seguro',
                desc: 'Protocolos de carga y descarga para mercancías peligrosas con supervisión técnica en operaciones críticas.',
              },
              {
                title: 'Trazabilidad Total',
                desc: 'Registro de cada movimiento, hora de salida, ruta y estado del embarque disponible para auditorías.',
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

      {/* ── 7. INDUSTRIAS QUE ATENDEMOS ──────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-[#f8f9fc] border-t border-black/5">
        <Container>

          <FadeIn className="mb-14">
            <Eyebrow>Sectores · Industrias · Mercados</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 leading-[1.08]">
              Industrias que Atendemos
            </h2>
            <p className="text-secondary text-[15px] max-w-xl leading-relaxed">
              Nuestras operaciones de transporte de mercancías peligrosas sirven a los sectores de mayor
              intensidad regulatoria en México.
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

      {/* ── 8. MARCO REGULATORIO ─────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white border-t border-black/5">
        <Container>

          <FadeIn className="mb-16">
            <Eyebrow>Normatividad · Cumplimiento Regulatorio</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 leading-[1.08]">
              Marco Regulatorio
            </h2>
            <p className="text-secondary text-[15px] max-w-xl leading-relaxed">
              El transporte terrestre de mercancías peligrosas en México opera bajo un marco normativo
              federal estricto. Cada operación de GGM es validada contra el conjunto regulatorio aplicable
              antes de despacharse.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.06]">
            {REGULATIONS.map(({ code, name, desc }, i) => (
              <FadeIn key={code} delay={i * 0.06}>
                <div className="group bg-white p-8 xl:p-10 h-full hover:bg-[#060e1c] transition-colors duration-300">
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.22em] mb-2"
                    style={{ color: ACCENT }}
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

      {/* ── 9. EQUIPO DE OPERACIONES ─────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-[#060e1c]">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10 xl:gap-14 items-center">

            <FadeIn direction="left" className="lg:col-span-3">
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src="/images/dg-transport/dg-operations-team.webp"
                  alt="Equipo de operaciones — transporte de mercancías peligrosas Global Gate México"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.52) brightness(0.6)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#060e1c]/52" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-[#060e1c]/72 backdrop-blur-sm px-4 py-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: ACCENT, opacity: 0.62 }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/62">
                    Personal Certificado · Operaciones DG
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1} className="lg:col-span-2">
              <Eyebrow light>Formación. Experiencia. Responsabilidad.</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
                La Operación Es Tan Buena Como el{' '}
                <span style={{ color: ACCENT }}>Equipo que la Ejecuta.</span>
              </h2>
              <p className="text-white/42 text-[14px] leading-relaxed mb-8">
                Nuestro personal operativo está capacitado en manejo de mercancías peligrosas conforme a la
                normativa aplicable. Los procedimientos de emergencia son conocidos, practicados y auditados.
              </p>

              <div className="space-y-4">
                {[
                  'Operadores con capacitación formal en mercancías peligrosas',
                  'Conocimiento de NOM-002-SCT, tablas de compatibilidad y segregación',
                  'Procedimientos de emergencia y respuesta a incidentes activos',
                  'Documentación de bordo completa en cada unidad despachada',
                  'Supervisión técnica en operaciones de carga y descarga de alto riesgo',
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
              ¿Necesita Transporte Especializado<br />para{' '}
              <span style={{ color: ACCENT }}>Mercancías Peligrosas?</span>
            </h2>

            <p className="text-white/38 text-[15px] leading-relaxed mb-12 max-w-lg mx-auto">
              Nuestro equipo evaluará sus requerimientos, confirmará las obligaciones regulatorias aplicables
              y le presentará una propuesta operacional detallada.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to={QUOTE_HREF}
                className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.18em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_36px_rgba(7,56,223,0.45)] transition-all duration-200 inline-block"
              >
                Solicitar Cotización
              </Link>
              <Link
                to={CONTACT_HREF}
                className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.18em] border border-white/18 text-white/65 hover:text-white hover:border-white/35 transition-all duration-200 inline-block"
              >
                Hablar con un Especialista
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>

    </div>
  );
}
