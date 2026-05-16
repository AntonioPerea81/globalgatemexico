import { useEffect } from 'react';
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
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Datos ─────────────────────────────────────────────────────────────────────

const SERVICIOS = [
  {
    Icon: Plane,
    image: '/images/dg-transport/dg-air-transport.webp' as string | null,
    href: '/services/air-transportation',
    title: 'Transporte Aéreo',
    desc: 'Transporte aéreo de mercancías peligrosas Clase 1–9 bajo IATA DGR. Embalaje, documentación y coordinación con aerolíneas en un solo proveedor.',
    items: ['Cumplimiento IATA DGR', 'Declaración de Mercancías Peligrosas', 'Clases 1–9', 'Flete express y regular'],
  },
  {
    Icon: Truck,
    image: '/images/dg-transport/dg-ground-transport.webp' as string | null,
    href: '/services/ground-transportation',
    title: 'Transporte Terrestre',
    desc: 'Transporte carretero bajo regulación SCT en todo México y transfronterizo a EUA y Canadá. Operadores y vehículos certificados en mercancías peligrosas.',
    items: ['Cumplimiento SCT NOM', 'Operadores certificados DG', 'Transfronterizo EUA/Canadá', 'Rastreo en tiempo real'],
  },
  {
    Icon: Ship,
    image: '/images/dg-transport/dg-ocean-freight.webp' as string | null,
    href: '/services/ocean-freight',
    title: 'Flete Marítimo',
    desc: 'Envíos marítimos bajo Código IMDG para carga peligrosa a granel y en contenedor. Gestión portuaria completa y documentación aduanera.',
    items: ['Cumplimiento Código IMDG', 'FCL y LCL', 'Puerto a puerto / puerta a puerta', 'Manifiesto de materiales peligrosos'],
  },
  {
    Icon: Package,
    image: '/images/dg-transport/dg-specialized-packaging.webp' as string | null,
    href: '/services/dg-packaging',
    title: 'Embalaje para Mercancías Peligrosas',
    desc: 'Embalaje certificado ONU suministrado, preparado y validado para todas las clases de peligro. Conforme a IATA, IMDG y ADR.',
    items: ['Envases certificados ONU', 'Todas las clases de peligro', 'Embalaje interior y exterior', 'Verificación de compatibilidad'],
  },
  {
    Icon: FileText,
    image: '/images/dg-transport/dg-documentation-services.webp' as string | null,
    href: '/services/documentation-services',
    title: 'Servicios de Documentación',
    desc: 'Preparación completa de declaraciones DG, certificaciones del embarcador, revisión de HDS y documentación regulatoria para todos los modos de transporte.',
    items: ['Declaración de Mercancías Peligrosas', 'Preparación y revisión de HDS', 'Certificación del embarcador', 'Documentación multimodal'],
  },
];

const PROCESO = [
  {
    num: '01',
    Icon: Search,
    title: 'Clasificación',
    desc: 'Identificamos el Número ONU, Nombre de Embarque Apropiado, clase de peligro y grupo de embalaje bajo las normativas IATA, IMDG y SCT.',
  },
  {
    num: '02',
    Icon: Tag,
    title: 'Identificación',
    desc: 'Asignación de etiquetas de peligro, marcas de manejo y toda la identificación de bulto requerida, en plena conformidad regulatoria.',
  },
  {
    num: '03',
    Icon: Package,
    title: 'Embalaje',
    desc: 'Selección y suministro de embalaje certificado ONU adecuado al material, cantidad y modo de transporte.',
  },
  {
    num: '04',
    Icon: ClipboardList,
    title: 'Marcado y Etiquetado',
    desc: 'Aplicación de todas las etiquetas, marcas y plaquetas obligatorias conforme a la normativa modal aplicable.',
  },
  {
    num: '05',
    Icon: FileText,
    title: 'Documentación',
    desc: 'Elaboración de la Declaración de Mercancías Peligrosas, Hojas de Datos de Seguridad, documentación de respuesta a emergencias y permisos de transporte.',
  },
  {
    num: '06',
    Icon: Route,
    title: 'Transporte',
    desc: 'Ejecución coordinada por transportistas certificados, con verificación de cumplimiento en cada punto de transferencia.',
  },
];

const POR_QUE_GGM = [
  { Icon: Award,         title: 'Especialistas Desde 2006',          desc: 'Casi dos décadas dedicados exclusivamente a la logística de mercancías peligrosas en México y América del Norte.' },
  { Icon: GraduationCap, title: 'Escuela Certificada IATA CBTA',      desc: 'Proveedor autorizado IATA de Capacitación y Evaluación Basada en Competencias para personal de mercancías peligrosas.' },
  { Icon: Globe,         title: 'Operaciones Transfronterizas',        desc: 'Corredores logísticos transfronterizos consolidados: México–EUA–Canadá, con equipos de cumplimiento bilingüe.' },
  { Icon: Package,       title: 'Soluciones de Embalaje ONU',          desc: 'Suministro y preparación interna de embalaje certificado ONU para todas las clases de peligro y modos de transporte.' },
  { Icon: Radiation,     title: 'Licencia para Material Radiactivo',   desc: 'Autorización de la CNSNS para el transporte y manejo de materiales radiactivos Clase 7.' },
  { Icon: ShieldCheck,   title: 'Cumplimiento como Prioridad',         desc: 'Cada envío es revisado por especialistas DG certificados antes de moverse. Tolerancia cero al incumplimiento.' },
  { Icon: Users,         title: 'Personal Especializado en DG',        desc: 'Todo el personal cuenta con certificación IATA, IMDG o SCT. Sin generalistas — solo expertos en mercancías peligrosas.' },
  { Icon: Truck,         title: 'Flota Dedicada para DG',              desc: 'Vehículos equipados con sistemas de plaqueteo, kits anticontaminación y protocolos de respuesta a emergencias DG.' },
];

const INDUSTRIAS = [
  { Icon: FlaskConical, label: 'Química' },
  { Icon: Droplets,     label: 'Petróleo y Gas' },
  { Icon: Car,          label: 'Automotriz' },
  { Icon: Plane,        label: 'Aerolíneas' },
  { Icon: Package,      label: 'Agentes de Carga' },
  { Icon: Stethoscope,  label: 'Salud' },
  { Icon: Factory,      label: 'Manufactura Industrial' },
];

const SEGURIDAD = [
  { Icon: ShieldCheck, title: 'Cumplimiento Regulatorio',  desc: 'Cada envío se valida contra el IATA DGR, el Código IMDG, ADR y SCT antes de su despacho.' },
  { Icon: BadgeCheck,  title: 'Personal Certificado',      desc: 'Nuestro equipo cuenta con certificaciones activas de IATA, IHMM y SQA, renovadas anualmente.' },
  { Icon: Lock,        title: 'Gestión de Riesgos',        desc: 'Auditorías previas al envío, revisión de HDS y verificaciones de compatibilidad eliminan la exposición al incumplimiento.' },
  { Icon: CheckCircle, title: 'Integridad Operativa',      desc: 'Documentación de cadena de custodia y seguimiento en tiempo real desde el origen hasta la entrega final.' },
];

// ── Página ────────────────────────────────────────────────────────────────────

export const TransporteMercanciasPeligrosasPage = () => {
  const { setLanguage } = useLanguage();

  // Sync language context with this route
  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Transporte de Mercancías Peligrosas en México | Global Gate México',
    description: 'Transporte seguro y conforme de mercancías peligrosas por vía aérea, terrestre y marítima. Especialistas certificados IATA, IMDG y SCT en México y Norteamérica.',
    canonical: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas' },
      { lang: 'en', href: 'https://globalgatemexico.com/dangerous-goods-transportation' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dangerous-goods-transportation' },
    ],
  });

  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-white">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-[#060e1c] pt-[106px]">

        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/dg-transport/dg-hero-main.webp"
            alt="Flota de transporte de mercancías peligrosas"
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1c]/98 via-[#060e1c]/85 to-[#060e1c]/60" />
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '36px 36px' }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent z-10" />

        <Container className="relative z-20 w-full pb-20 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-[10px] text-accent/80 uppercase tracking-[0.28em] mb-5 font-black">
                Aéreo · Terrestre · Marítimo
              </p>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                Transporte Seguro y Conforme<br />
                de <span className="text-primary">Mercancías Peligrosas</span><br />
                en Todo México
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:pl-10 lg:border-l lg:border-white/10"
            >
              <p className="text-base md:text-lg text-white/70 font-normal leading-relaxed mb-8 max-w-lg">
                Ayudamos a las empresas a transportar materiales peligrosos de forma segura, eficiente y conforme a la normativa nacional e internacional, por vía aérea, terrestre y marítima.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/85 hover:shadow-[0_0_24px_rgba(7,56,223,0.5)] transition-all duration-200"
                >
                  Solicitar Cotización
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border border-white/25 text-white hover:border-white/60 hover:bg-white/5 transition-all duration-200"
                >
                  Hablar con un Especialista
                </button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-white/10">
                {[
                  { label: 'Desde 2006' },
                  { label: 'Certificación IATA' },
                  { label: 'Licencia para Material Radiactivo' },
                  { label: 'Especialistas DG' },
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

      {/* ── 2. SERVICIOS ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Soluciones Integradas</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Soluciones Integrales para el Transporte de Mercancías Peligrosas
            </h2>
            <p className="text-secondary leading-relaxed text-[15px]">
              Global Gate México ofrece soluciones logísticas especializadas para materiales peligrosos, incluyendo clasificación, embalaje, documentación, almacenamiento y transporte.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-black/8">
            {SERVICIOS.map(({ Icon: SIcon, image, href, title, desc, items }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className={cn(
                  'group flex flex-col h-full transition-all duration-300 border-b border-black/8',
                  i % 2 === 0 && 'sm:border-r sm:border-black/8 lg:border-r-0',
                  i % 3 !== 2 && 'lg:border-r lg:border-black/8',
                )}>
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
                        Ver más <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. PROCESO ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#f8f9fc] border-y border-black/5">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Nuestra Metodología</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Cómo Transportamos Mercancías Peligrosas con Seguridad
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              Cada envío sigue un proceso riguroso de seis pasos. Ningún paso se omite. Ningún envío avanza sin validación previa.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8">
            {PROCESO.map(({ num, Icon: PIcon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="group bg-white p-8 xl:p-10 h-full hover:bg-[#060e1c] transition-colors duration-300">
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

          <FadeIn delay={0.4} className="mt-12 text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">
              Si no pasa la validación — no avanza.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── Galería fotográfica ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 h-64 sm:h-80">
        {[
          { src: '/images/dg-transport/dg-warehouse-01.webp',     alt: 'Operaciones en almacén de mercancías peligrosas' },
          { src: '/images/dg-transport/dg-operations-team.webp',  alt: 'Equipo de operaciones DG de Global Gate México' },
          { src: '/images/dg-transport/dg-field-operations.webp', alt: 'Operaciones en campo y transporte DG' },
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

      {/* ── 4. POR QUÉ GGM ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-16">
            <Eyebrow>Nuestras Credenciales</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5">
              Por Qué las Empresas Eligen a Global Gate México
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              No todos los proveedores logísticos son especialistas en mercancías peligrosas. Nosotros sí lo somos.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-black/8">
            {POR_QUE_GGM.map(({ Icon: WIcon, title, desc }, i) => (
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

      {/* ── 5. INDUSTRIAS ───────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-28 bg-[#060e1c]">
        <Container>
          <FadeIn className="max-w-2xl mb-14">
            <Eyebrow light>Sectores que Atendemos</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
              Especializados en los Sectores Industriales más Exigentes
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed">
              Desde fabricantes de productos químicos hasta distribuidores farmacéuticos, conocemos los requisitos regulatorios específicos de su industria.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {INDUSTRIAS.map(({ Icon: IIcon, label }, i) => (
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

      {/* ── 6. SEGURIDAD ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-[#070f1c] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            <FadeIn direction="left">
              <Eyebrow light>Nuestro Compromiso</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">
                Seguridad y Cumplimiento Primero. <span className="text-primary">Siempre.</span>
              </h2>
              <p className="text-white/55 text-[15px] leading-relaxed mb-8 max-w-lg">
                En la logística de mercancías peligrosas no hay margen de error. Operamos bajo los marcos regulatorios más estrictos e integramos el cumplimiento normativo en cada acción, decisión y envío.
              </p>
              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.15em]">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-white/30">IATA · IMDG · ADR · SCT · CNSNS</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-4">
              {SEGURIDAD.map(({ Icon: SIcon, title, desc }, i) => (
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

      {/* ── 7. CTA FINAL ────────────────────────────────────────────────────── */}
      <section id="dgt-contact" className="bg-white border-t border-black/5">
        <div className="bg-primary py-20 lg:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <Container className="relative z-10 text-center">
            <FadeIn>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black mb-4">
                Logística Especializada en DG
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">
                ¿Necesita Transportar Mercancías Peligrosas?
              </h2>
              <p className="text-white/65 text-[15px] max-w-xl mx-auto mb-10 leading-relaxed">
                Nuestros especialistas certificados en mercancías peligrosas están listos para revisar su envío y elaborar un plan logístico con respaldo normativo completo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={scrollToContact}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-white text-primary hover:bg-white/90 hover:shadow-lg transition-all duration-200"
                >
                  Contáctenos
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] bg-transparent border-2 border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-200"
                >
                  Solicitar Cotización
                </button>
              </div>
            </FadeIn>
          </Container>
        </div>
      </section>

    </div>
  );
};
