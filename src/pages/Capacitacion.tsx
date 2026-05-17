import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap, Award, BookOpen, Globe, ShieldCheck, Users,
  CheckCircle, Clock, Plane, Truck, Ship, Radiation,
  FileText, ClipboardList, Tag, Search, RefreshCw,
  Package, Layers, FlaskConical, Zap,
  ChevronRight, Lock,
} from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Datos ─────────────────────────────────────────────────────────────────────

const CREDENTIALS = [
  {
    designation: 'IATA Diploma',
    issuer: 'International Air Transport Association',
    detail: 'Diploma Profesional DGR — Ginebra, Suiza',
  },
  {
    designation: 'ICAO TDC',
    issuer: 'International Civil Aviation Organization',
    detail: 'Training Developers Course — Doc OACI 9941',
  },
  {
    designation: 'IATA CBTA',
    issuer: 'Competency-Based Training & Assessment',
    detail: 'Proveedor autorizado de capacitación MP — vía aérea',
  },
  {
    designation: 'IHMM CDGP',
    issuer: 'Institute of Hazardous Materials Management',
    detail: 'Certified Dangerous Goods Professional',
  },
  {
    designation: 'DGSA',
    issuer: 'Scottish Qualifications Authority',
    detail: 'Asesor de Seguridad en Mercancías Peligrosas',
  },
  {
    designation: 'STPS',
    issuer: 'Secretaría del Trabajo y Previsión Social',
    detail: 'Agente Capacitador Externo Registrado',
  },
  {
    designation: 'DGTA',
    issuer: 'Dangerous Goods Trainers Association',
    detail: 'Miembro institucional',
  },
];

interface Certification {
  title: string;
  issuer: string;
  image: string;
  location?: string;
  tier: 'primary' | 'secondary';
  verifyUrl?: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    title: 'IATA Professional Diploma',
    issuer: 'International Air Transport Association',
    image: '/certifications/iata-diploma.png',
    location: 'Ginebra, Suiza',
    tier: 'primary',
  },
  {
    title: 'ICAO Training Developers Course',
    issuer: 'International Civil Aviation Organization',
    image: '/certifications/icao-tdc.png',
    tier: 'primary',
  },
  {
    title: 'IATA CBTA Provider',
    issuer: 'International Air Transport Association',
    image: '/certifications/cbta-provider.png',
    tier: 'primary',
    verifyUrl: 'https://www.iata.org/en/services/certification/training-development/cbta-center/cbta-certified-companies/global-gate-mexico-s-de-rl-de-cv/440489/',
  },
  {
    title: 'Dangerous Goods Safety Adviser',
    issuer: 'Scottish Qualifications Authority',
    image: '/certifications/dgsa-sqa.png',
    tier: 'primary',
  },
  {
    title: 'Certified DG Professional (CDGP)',
    issuer: 'Institute of Hazardous Materials Management',
    image: '/certifications/ihmm-cdgp.png',
    tier: 'secondary',
  },
  {
    title: 'STPS External Training Agent',
    issuer: 'Secretaría del Trabajo y Previsión Social',
    image: '/certifications/stps-dc5.png',
    tier: 'secondary',
  },
  {
    title: 'DGTA Membership',
    issuer: 'Dangerous Goods Trainers Association',
    image: '/certifications/dgta-membership.png',
    tier: 'secondary',
  },
];

const WHY_FEATURES = [
  { Icon: Award,         text: 'Proveedor Autorizado IATA CBTA' },
  { Icon: Globe,         text: 'Certificaciones internacionales — IATA, IHMM, SQA, DGTA' },
  { Icon: Truck,         text: 'Experiencia operativa real en logística de MP desde 2006' },
  { Icon: ShieldCheck,   text: 'Especialización en cumplimiento regulatorio multimodal' },
  { Icon: Users,         text: 'Modalidades presencial, remota y mixta' },
  { Icon: ClipboardList, text: 'Programas corporativos de capacitación completamente a medida' },
];

const PROGRAMS = [
  {
    Icon: Plane,
    code: 'IATA DGR',
    title: 'Reglamentación IATA para Mercancías Peligrosas',
    desc: 'Capacitación en cumplimiento IATA DGR para expedidores, agentes de carga y personal aeronáutico. Cursos iniciales y de actualización conforme a la edición vigente del IATA DGR.',
    audience: 'Expedidores · Agentes de Carga · Aerolíneas',
  },
  {
    Icon: Truck,
    code: 'SCT / ADR',
    title: 'Transporte Terrestre de Mercancías Peligrosas',
    desc: 'Cumplimiento NOM-002-SCT/2011 para conductores, despachadores y equipos de operaciones. Clasificación, señalización, documentación y respuesta a emergencias.',
    audience: 'Conductores · Despachadores · Operaciones',
  },
  {
    Icon: Ship,
    code: 'Código IMDG',
    title: 'Mercancías Peligrosas por Vía Marítima',
    desc: 'Capacitación en transporte marítimo de mercancías peligrosas conforme al Código IMDG. Embalaje, estiba, segregación, documentación y cumplimiento portuario.',
    audience: 'Agentes de Carga · Operaciones Portuarias',
  },
  {
    Icon: Zap,
    code: 'IATA PI 965–970',
    title: 'Transporte de Baterías de Litio',
    desc: 'Capacitación especializada para el transporte aéreo, terrestre y marítimo de baterías de litio conforme a las Instrucciones de Empaque IATA 965–970, IMDG y ADR. Todos los tipos de celda y umbrales de exención.',
    audience: 'Fabricantes · Equipos de Logística',
  },
  {
    Icon: Radiation,
    code: 'OIEA / IATA Clase 7',
    title: 'Transporte de Materiales Radiactivos',
    desc: 'Capacitación para mercancías peligrosas Clase 7 conforme a normativa OIEA, IATA DGR Capítulo 10 y requisitos CNSNS en México. Medicina nuclear, aplicaciones industriales e investigación.',
    audience: 'Sector Salud · Industrial · Investigación',
  },
  {
    Icon: FileText,
    code: 'SGA / HazCom',
    title: 'SGA y Hojas de Datos de Seguridad',
    desc: 'Capacitación en clasificación de peligros SGA y elaboración de HDS. Revisión de la Sección 14 (transporte), elementos de etiquetado y cumplimiento NOM-018-STPS y HazCom 2012.',
    audience: 'Equipos SSO · Industria Química',
  },
  {
    Icon: Package,
    code: 'Todos los modos',
    title: 'Operaciones de Almacén con Mercancías Peligrosas',
    desc: 'Capacitación práctica para personal de almacén que maneja mercancías peligrosas: recepción, almacenamiento, segregación, inspección de etiquetas, atención a derrames y procedimientos de emergencia.',
    audience: 'Personal de Almacén · Supervisores',
  },
  {
    Icon: Layers,
    code: 'A medida',
    title: 'Programa de Capacitación Corporativa a Medida',
    desc: 'Programas de capacitación en mercancías peligrosas completamente adaptados a sus productos, modos de transporte, rutas y procesos internos. Modalidad presencial o remota.',
    audience: 'Todos los Perfiles de Personal MP',
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    Icon: Search,
    title: 'Diagnóstico de Necesidades de Capacitación',
    desc: 'Evaluamos las operaciones de mercancías peligrosas de su organización, los roles del personal, los modos de transporte y las obligaciones regulatorias aplicables para definir el alcance exacto del programa.',
  },
  {
    num: '02',
    Icon: BookOpen,
    title: 'Identificación del Marco Regulatorio',
    desc: 'Determinamos las normativas aplicables según modo y ruta — IATA DGR, IMDG, ADR, SCT, DOT 49 CFR — garantizando que la capacitación se ajuste a las reglas que rigen su operación.',
  },
  {
    num: '03',
    Icon: ClipboardList,
    title: 'Desarrollo del Programa',
    desc: 'Elaboramos contenidos, ejercicios prácticos y criterios de evaluación bajo estándares de capacitación basada en competencias. Módulos específicos por función y perfil de puesto.',
  },
  {
    num: '04',
    Icon: GraduationCap,
    title: 'Impartición de la Capacitación',
    desc: 'Instructores certificados con experiencia operativa real en logística de mercancías peligrosas — en sus instalaciones, en modalidad remota o formato mixto, según sus requerimientos.',
  },
  {
    num: '05',
    Icon: CheckCircle,
    title: 'Validación de Competencias',
    desc: 'Evaluaciones escritas y prácticas conforme a la metodología IATA CBTA. Competencia verificada contra los objetivos de desempeño definidos para cada perfil de puesto.',
  },
  {
    num: '06',
    Icon: FileText,
    title: 'Documentación de Certificación',
    desc: 'Emisión de documentación oficial: constancias DC-3/DC-4, diplomas y registros de competencia conformes a los requisitos IATA DGR y SCT.',
  },
];

// ── CertCard ─────────────────────────────────────────────────────────────────

function CertCard({ cert, primary = false }: { cert: Certification; primary?: boolean }) {
  return (
    <div
      className={cn(
        'group flex flex-col',
        'bg-[#0b1221]',
        'ring-1 ring-white/[0.06]',
        'shadow-[0_2px_12px_rgba(0,0,0,0.28)]',
        'hover:-translate-y-1 hover:scale-[1.02]',
        'hover:shadow-[0_12px_32px_rgba(7,56,223,0.13),0_4px_16px_rgba(0,0,0,0.4)]',
        'transition-all duration-300 ease-out',
      )}
    >
      {/* Badge — object-contain inside padded neutral mount; normalizes visual weight */}
      <div className="aspect-video overflow-hidden bg-white flex items-center justify-center p-4">
        <img
          src={cert.image}
          alt={cert.title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Caption */}
      <div className="px-4 py-4 border-t border-white/[0.05]">
        <p
          className="text-[7px] font-semibold uppercase tracking-[0.18em] mb-1.5 leading-none"
          style={{ color: '#C8A96B', opacity: 0.5 }}
        >
          {cert.issuer}
        </p>
        <h3
          className={cn(
            'font-extrabold uppercase tracking-wide text-white leading-snug',
            primary ? 'text-[11px]' : 'text-[10px]',
          )}
        >
          {cert.title}
        </h3>
        {cert.location && (
          <p className="text-[8px] text-white/25 mt-1.5 tracking-wide">{cert.location}</p>
        )}
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 mt-2.5 text-[8px] font-bold uppercase tracking-[0.13em] text-white/20 hover:text-primary/70 transition-colors duration-200"
          >
            Verificado en el Registro IATA
            <svg width="8" height="8" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <path d="M1.5 7.5L7.5 1.5M7.5 1.5H3M7.5 1.5V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>

    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────

export function CapacitacionPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Capacitación en Mercancías Peligrosas | Proveedor CBTA IATA | Global Gate México',
    description: 'Programas de capacitación en mercancías peligrosas autorizados por IATA CBTA para transporte aéreo, terrestre, marítimo y materiales radiactivos. Instructores certificados internacionalmente con experiencia operativa real.',
    canonical: 'https://globalgatemexico.com/es/capacitacion',
    lang: 'es',
  });

  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToPrograms() {
    document.getElementById('programas')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-white">

      {/* ── 1. HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-[#060e1c] pt-[106px]">

        <div className="absolute inset-0 z-0">
          <img
            src="/images/dg-transport/dg-operations-team.webp"
            alt="Equipo de capacitación en mercancías peligrosas"
            className="w-full h-full object-cover opacity-25 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1c]/98 via-[#060e1c]/88 to-[#060e1c]/65" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.09) 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

        <Container className="relative z-20 w-full pb-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            {/* Left — encabezado */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-[10px] text-accent/80 uppercase tracking-[0.28em] mb-5 font-black">
                IATA CBTA Provider · IHMM CDGP · SQA DGSA · Agente STPS
              </p>
              <h1 className="text-3xl md:text-4xl xl:text-[3.2rem] font-extrabold text-white leading-[1.08] tracking-tight">
                Capacitación en<br />
                <span className="text-primary">Mercancías Peligrosas</span><br />
                de Alcance Internacional
              </h1>
            </motion.div>

            {/* Right — descripción + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:pl-10 lg:border-l lg:border-white/[0.08]"
            >
              <p className="text-base md:text-lg text-white/65 leading-relaxed mb-10">
                Forme a su personal con instructores certificados internacionalmente, experiencia operativa real y programas de capacitación basada en competencias, alineados con IATA, IMDG, SCT y DOT.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_24px_rgba(7,56,223,0.5)] transition-all duration-200"
                >
                  Solicitar Propuesta de Capacitación
                </button>
                <button
                  onClick={scrollToPrograms}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border border-white/25 text-white hover:border-white/60 hover:bg-white/5 transition-all duration-200"
                >
                  Ver Programas de Capacitación
                </button>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.08]">
                {[
                  { value: '2006', label: 'En operación desde' },
                  { value: '6+',   label: 'Certificaciones Int\'l' },
                  { value: '9',    label: 'Clases de Peligro' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-white mb-0.5">{value}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-[0.18em] font-bold">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ── 2. FRANJA DE CREDENCIALES ─────────────────────────────────────────── */}
      <section className="bg-[#070f1c] border-b border-white/[0.05]">
        <Container>

          {/* Declaración */}
          <div className="py-7 flex items-center justify-between gap-8 border-b border-white/[0.05] flex-wrap">
            <p className="text-[9px] uppercase tracking-[0.28em] font-bold" style={{ color: '#C8A96B', opacity: 0.55 }}>
              Credenciales internacionales. Experiencia operativa. Capacitación basada en competencias.
            </p>
            <p className="text-[9px] uppercase tracking-[0.22em] font-bold shrink-0" style={{ color: '#C8A96B', opacity: 0.35 }}>
              Desde 2006
            </p>
          </div>

          {/* Siete credenciales — tipográficas, sin íconos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-px bg-white/[0.05]">
            {CREDENTIALS.map(({ designation, issuer, detail }) => (
              <div
                key={designation}
                className="bg-[#070f1c] px-5 py-6 hover:bg-white/[0.025] transition-colors duration-200"
              >
                <div className="text-[14px] font-black text-white tracking-tight mb-1.5 leading-none">
                  {designation}
                </div>
                <div className="text-[10px] text-white/35 font-medium leading-snug mb-1.5 tracking-wide">
                  {issuer}
                </div>
                <div className="text-[9px] leading-snug uppercase tracking-[0.12em] font-semibold" style={{ color: '#C8A96B', opacity: 0.6 }}>
                  {detail}
                </div>
              </div>
            ))}
          </div>

        </Container>
      </section>

      {/* ── 3. POR QUÉ CAPACITARSE CON GGM ───────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">

            {/* Left — encabezado principal */}
            <FadeIn direction="left">
              <Eyebrow>Por qué capacitarse con Global Gate México</Eyebrow>
              <h2 className="text-4xl md:text-5xl xl:text-[3.5rem] font-extrabold tracking-tight leading-[1.06] mb-8">
                No solo<br />
                Formadores.<br />
                <span className="text-primary">Operadores.</span>
              </h2>
              <p className="text-secondary text-[15px] leading-relaxed mb-5">
                Nuestros programas de capacitación están fundamentados en casi dos décadas de operaciones activas en logística de mercancías peligrosas — transporte aéreo, terrestre, marítimo y materiales radiactivos en México y América del Norte.
              </p>
              <p className="text-secondary text-[15px] leading-relaxed">
                Cuando nuestros instructores explican un procedimiento de clasificación, un requisito de embalaje o un escenario de cruce fronterizo, lo hacen desde la experiencia operativa — no desde marcos teóricos. Esa diferencia se mide en cómo su personal aplica la capacitación en el campo.
              </p>
            </FadeIn>

            {/* Right — lista de atributos */}
            <FadeIn direction="right" delay={0.1}>
              <div className="space-y-3">
                {WHY_FEATURES.map(({ Icon: WIcon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-4 p-5 bg-[#f8f9fc] border border-black/[0.05] hover:border-primary/20 hover:bg-white transition-all duration-200"
                  >
                    <div className="w-9 h-9 bg-primary/8 flex items-center justify-center shrink-0">
                      <WIcon size={17} className="text-primary" />
                    </div>
                    <span className="text-[13px] font-semibold text-dark/80 leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              {/* Franja de cobertura operativa */}
              <div className="mt-8 p-6 bg-[#060e1c] flex flex-wrap gap-x-8 gap-y-4">
                <p className="w-full text-[9px] text-white/30 uppercase tracking-[0.2em] font-black mb-1">
                  Cobertura Operativa
                </p>
                {[
                  { Icon: Plane,     label: 'Aéreo' },
                  { Icon: Truck,     label: 'Terrestre' },
                  { Icon: Ship,      label: 'Marítimo' },
                  { Icon: Radiation, label: 'Radiactivo' },
                  { Icon: Package,   label: 'Almacén' },
                  { Icon: Globe,     label: 'Transfronterizo' },
                ].map(({ Icon: MIcon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <MIcon size={13} className="text-primary/70" />
                    <span className="text-[10px] text-white/45 uppercase tracking-[0.12em] font-bold">{label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 4. CERTIFICACIONES Y RECONOCIMIENTOS ──────────────────────────────── */}
      <section
        className="py-24 lg:py-32"
        style={{ background: 'linear-gradient(180deg, #060e1c 0%, #070f1e 60%, #060e1c 100%)' }}
      >
        <Container>

          {/* Encabezado de sección — dos columnas en escritorio */}
          <FadeIn className="mb-14">
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <Eyebrow light>Certificaciones y Reconocimientos</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Credenciales Internacionales
                </h2>
              </div>
              <div className="lg:text-right">
                <p className="text-white/40 text-[14px] leading-relaxed max-w-md lg:ml-auto">
                  Credenciales internacionalmente reconocidas en capacitación, cumplimiento regulatorio y transporte de mercancías peligrosas.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Primer nivel — 4 tarjetas */}
          <FadeIn delay={0.06}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[8px] text-primary/50 uppercase tracking-[0.22em] font-black">Credenciales Principales</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {CERTIFICATIONS.filter(c => c.tier === 'primary').map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <CertCard cert={cert} primary />
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Segundo nivel — 3 tarjetas */}
          <FadeIn delay={0.18}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[8px] text-white/20 uppercase tracking-[0.22em] font-black">Credenciales Adicionales</span>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {CERTIFICATIONS.filter(c => c.tier === 'secondary').map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <CertCard cert={cert} />
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* Pie de sección */}
          <FadeIn delay={0.28} className="mt-12 pt-8 border-t border-white/[0.05] flex items-center justify-between gap-6 flex-wrap">
            <p className="text-[9px] text-white/20 uppercase tracking-[0.22em] font-black leading-relaxed">
              Todas las certificaciones son vigentes y renovadas conforme al calendario de cada organismo emisor
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <p className="text-[9px] text-primary/45 uppercase tracking-[0.18em] font-black">
                7 Credenciales Internacionales
              </p>
            </div>
          </FadeIn>

        </Container>
      </section>

      {/* ── 5. PROGRAMAS DE CAPACITACIÓN ──────────────────────────────────────── */}
      <section id="programas" className="py-24 lg:py-32 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Programas de Capacitación</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Capacitación Regulatoria en Todos los Modos de Transporte
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              Cada programa se desarrolla conforme a la normativa modal aplicable — IATA DGR, Código IMDG, NOM-SCT o DOT 49 CFR — e impartido por instructores certificados en ese marco específico.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06]">
            {PROGRAMS.map(({ Icon: PIcon, code, title, desc, audience }, i) => (
              <FadeIn key={title} delay={i * 0.05}>
                <div className="group bg-white p-7 h-full flex flex-col hover:bg-[#060e1c] transition-colors duration-300">

                  {/* Encabezado */}
                  <div className="flex items-start justify-between mb-5">
                    <span className="inline-block px-2 py-0.5 bg-primary/8 text-primary text-[9px] font-black uppercase tracking-[0.15em] group-hover:bg-primary/20 transition-colors">
                      {code}
                    </span>
                    <div className="w-9 h-9 bg-primary/8 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <PIcon size={18} className="text-primary" />
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide mb-3 leading-snug group-hover:text-white transition-colors">
                    {title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-[12px] text-secondary group-hover:text-white/55 leading-relaxed flex-1 mb-5 transition-colors">
                    {desc}
                  </p>

                  {/* Audiencia */}
                  <p className="mt-auto text-[9px] text-primary/60 uppercase tracking-[0.15em] font-black group-hover:text-primary/80 transition-colors">
                    {audience}
                  </p>

                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA de programas */}
          <FadeIn delay={0.15} className="mt-12 border border-black/[0.07] bg-[#f8f9fc]">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center p-8 lg:p-10">
              <div>
                <p className="text-[9px] text-primary uppercase tracking-[0.22em] font-black mb-3">
                  Programas de Capacitación a Medida
                </p>
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight mb-3 leading-snug">
                  ¿Necesita un Programa de Capacitación en<br className="hidden sm:block" /> Mercancías Peligrosas a Medida?
                </h3>
                <p className="text-secondary text-[13px] leading-relaxed max-w-lg">
                  Ayudamos a las empresas a formar a su personal en cumplimiento con la normativa internacional de mercancías peligrosas para operaciones aéreas, terrestres y marítimas.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={scrollToContact}
                  className="px-7 py-3.5 text-[10px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_20px_rgba(7,56,223,0.35)] transition-all duration-200 whitespace-nowrap"
                >
                  Solicitar Propuesta de Capacitación
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-7 py-3.5 text-[10px] font-black uppercase tracking-[0.15em] bg-transparent border border-black/15 text-dark/60 hover:border-primary/40 hover:text-primary transition-all duration-200 whitespace-nowrap"
                >
                  Contactar al Equipo
                </button>
              </div>
            </div>
          </FadeIn>

        </Container>
      </section>

      {/* ── 6. PROCESO DE CAPACITACIÓN ────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#060e1c]">
        <Container>

          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow light>Nuestro Proceso de Capacitación</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
              Del Diagnóstico a la Competencia Certificada
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed">
              Cada programa de capacitación sigue un proceso estructurado de seis etapas — desde el diagnóstico inicial hasta la documentación de certificación — garantizando que su personal emerja plenamente competente y con registros verificables.
            </p>
          </FadeIn>

          {/* Etapas — cuadrícula 3+3 en escritorio */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
            {PROCESS_STEPS.map(({ num, Icon: SIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="group bg-[#060e1c] p-8 h-full hover:bg-primary/[0.07] transition-colors duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[48px] font-black text-white/[0.04] group-hover:text-white/[0.06] leading-none select-none transition-colors">
                      {num}
                    </span>
                    <div className="w-10 h-10 bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                      <SIcon size={19} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-white mb-3">
                    {title}
                  </h3>
                  <p className="text-[12px] text-white/40 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Línea final */}
          <FadeIn delay={0.4} className="mt-12 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/80">
              Competencia validada. Documentación completa. Su equipo, listo.
            </p>
          </FadeIn>

        </Container>
      </section>

      {/* ── SECTORES ATENDIDOS ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-black/5">
        <Container>
          <FadeIn className="text-center mb-10">
            <p className="text-[10px] text-primary uppercase tracking-[0.22em] font-black">
              Sectores Atendidos
            </p>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Farmacéutica y Biotecnología',
              'Manufactura Química',
              'Petróleo y Gas',
              'Automotriz',
              'Agencias de Carga',
              'Aerolíneas y Operadores de Rampa',
              'E-Commerce y Retail',
              'Medicina Nuclear',
              'Gases Industriales',
              'Alimentos y Agroindustria',
              'Servicios Ambientales',
              'Gobierno y Defensa',
            ].map((sector) => (
              <span
                key={sector}
                className="px-4 py-2 bg-[#f8f9fc] border border-black/5 text-[10px] font-bold text-dark/55 uppercase tracking-[0.1em] hover:border-primary/20 hover:text-dark/80 transition-colors"
              >
                {sector}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7. CTA FINAL ──────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-black/5">
        <div className="bg-primary py-20 lg:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Línea vertical decorativa */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.06] hidden xl:block" />

          <Container className="relative z-10 text-center">
            <FadeIn>
              <p className="text-[10px] text-white/45 uppercase tracking-[0.25em] font-black mb-5">
                IATA CBTA Provider · Autoridad en Capacitación de Mercancías Peligrosas
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-5 max-w-2xl mx-auto leading-[1.1]">
                Capacite a su Equipo Antes de que los Errores se Vuelvan Costosos.
              </h2>
              <p className="text-white/60 text-[15px] max-w-xl mx-auto mb-10 leading-relaxed">
                Ayudamos a las empresas a desarrollar personal competente en mercancías peligrosas, alineado con la normativa internacional y las realidades operativas del transporte aéreo, terrestre, marítimo y transfronterizo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={scrollToContact}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-white text-primary hover:bg-white/92 hover:shadow-lg transition-all duration-200"
                >
                  Solicitar Propuesta
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border-2 border-white/35 text-white hover:border-white hover:bg-white/10 transition-all duration-200"
                >
                  Hablar con un Especialista
                </button>
              </div>
            </FadeIn>
          </Container>
        </div>
      </section>

    </div>
  );
}
