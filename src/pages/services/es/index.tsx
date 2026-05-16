import { useEffect } from 'react';
import {
  Plane, Truck, Ship, Package, FileText,
  Search, Tag, ClipboardList, Route, CheckCircle,
  Award, GraduationCap, Globe, ShieldCheck, Users,
  BadgeCheck, Lock, Clock,
} from 'lucide-react';
import { ServicePageTemplate, ServicePageData } from '../ServicePageTemplate';
import { useLanguage } from '../../../context/LanguageContext';
import { usePageMeta } from '../../../hooks/usePageMeta';

// ── Transporte Aéreo ─────────────────────────────────────────────────────────

const transporteAereoData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-air-transport.webp',
    eyebrow: 'IATA DGR · ICAO TI · Clases 1–9 · Express y Regular',
    headline: 'Transporte Aéreo de Mercancías Peligrosas —',
    highlighted: 'Bajo IATA DGR.',
    sub: 'Transporte aéreo IATA DGR de materiales peligrosos en México y a todo el mundo, de extremo a extremo. Clasificación, embalaje certificado ONU, Declaración de Mercancías Peligrosas y coordinación con aerolíneas, todo a cargo de especialistas certificados.',
  },
  overview: {
    eyebrow: 'Soluciones de Flete Aéreo',
    headline: 'Servicio Completo de Transporte Aéreo de Mercancías Peligrosas',
    paragraphs: [
      'El transporte aéreo de mercancías peligrosas es el modo de transporte con mayor nivel de regulación en el mundo. Cada envío debe clasificarse, embalarse, marcarse, etiquetarse y documentarse con exactitud conforme a las especificaciones del IATA DGR antes de que cualquier aerolínea lo acepte. Un solo error puede inmovilizar la carga, generar multas regulatorias o derivar en una prohibición permanente del transportista.',
      'Global Gate México actúa como su socio integral de cumplimiento IATA DGR — desde la clasificación inicial hasta la confirmación de entrega final. Nuestro equipo certificado elabora la Declaración de Mercancías Peligrosas, selecciona la instrucción de embalaje correcta, verifica los límites de cantidad para aeronaves de pasajeros frente a aeronaves de carga exclusiva, y coordina la aceptación directamente con el transportista.',
    ],
    capabilities: [
      'Clasificación IATA DGR y selección de instrucción de embalaje',
      'Elaboración y certificación de la Declaración de Mercancías Peligrosas (DGD)',
      'Materiales peligrosos Clases 1–9 — todas las clases de peligro',
      'Cumplimiento para aeronaves de pasajeros (PAX) y de carga exclusiva (CAO)',
      'Suministro de embalaje interior y exterior certificado ONU',
      'Aplicación de etiquetas de peligro, marcas de manejo y flechas de orientación',
      'Coordinación de flete aéreo express y regular',
      'Coordinación de aceptación con aerolíneas y NOTOC',
    ],
    image: '/images/dg-transport/dg-warehouse-01.webp',
  },
  compliance: {
    headline: 'Normativa Aplicable al Transporte Aéreo',
    body: 'Cada envío aéreo de mercancías peligrosas que gestionamos se valida contra toda la normativa aplicable a su origen, destino y transportista — antes de aplicar una sola etiqueta.',
    standards: [
      {
        code: 'IATA DGR',
        name: 'Reglamentación de Mercancías Peligrosas',
        desc: 'Norma global primaria para el transporte aéreo de mercancías peligrosas, actualizada anualmente. Rige la clasificación, instrucciones de embalaje, límites de cantidad, etiquetado y documentación.',
      },
      {
        code: 'ICAO TI',
        name: 'Instrucciones Técnicas para el Transporte Seguro por Vía Aérea',
        desc: 'Marco jurídico vinculante de la OACI del que se deriva el IATA DGR. Su cumplimiento es obligatorio bajo el derecho de la aviación internacional para todos los estados contratantes.',
      },
      {
        code: 'DOT 49 CFR',
        name: 'Reglamentación del Depto. de Transporte de EUA',
        desc: 'Aplica a todos los envíos aéreos que transitan o ingresan a los Estados Unidos. Incluye requisitos adicionales al IATA DGR para ciertos materiales.',
      },
      {
        code: 'AFAC / SCT',
        name: 'Autoridad de Aviación Civil Mexicana',
        desc: 'Marco regulatorio mexicano que rige las mercancías peligrosas en vuelos comerciales que parten o llegan a aeropuertos en territorio mexicano.',
      },
    ],
  },
  process: {
    headline: 'Cómo Transportamos su Carga Aérea con Seguridad',
    body: 'Cada envío aéreo de mercancías peligrosas sigue un estricto proceso de cumplimiento de cuatro pasos. Ningún material llega al aeropuerto antes de completar y verificar cada etapa.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'Clasificación DG',
        desc: 'Identificación del Número ONU, Nombre de Embarque Apropiado, Clase de Peligro, Grupo de Embalaje y Disposiciones Especiales. Revisión de límites de cantidad PAX vs. CAO.',
      },
      {
        num: '02',
        Icon: Package,
        title: 'Embalaje y Etiquetado',
        desc: 'Aplicación de la instrucción de embalaje IATA. Selección y preparación de embalaje certificado ONU. Etiquetas de peligro, marcas de manejo y marcas ONU aplicadas conforme a especificación.',
      },
      {
        num: '03',
        Icon: FileText,
        title: 'Documentación',
        desc: 'Elaboración y certificación de la Declaración del Embarcador para Mercancías Peligrosas (DGD). Coordinación de información de respuesta a emergencias y NOTOCs.',
      },
      {
        num: '04',
        Icon: Plane,
        title: 'Coordinación con la Aerolínea',
        desc: 'Envío entregado al transportista con el paquete completo de aceptación. Reserva de vuelo confirmada. Rastreo iniciado desde la aceptación hasta la entrega final.',
      },
    ],
  },
  whyGGM: {
    headline: 'El Socio Correcto para Carga Aérea de Mercancías Peligrosas',
    body: 'El transporte aéreo de materiales peligrosos exige un especialista. No un agente de carga que maneja DG ocasionalmente — un equipo cuya operación completa está diseñada para ello.',
    points: [
      {
        Icon: Award,
        title: 'Escuela Certificada IATA CBTA',
        desc: 'Proveedor autorizado de Capacitación y Evaluación Basada en Competencias IATA. Nuestro personal está capacitado, evaluado y recertificado bajo los estándares IATA.',
      },
      {
        Icon: GraduationCap,
        title: 'Las 9 Clases de Peligro',
        desc: 'Gestionamos todas las clases de mercancías peligrosas, incluyendo explosivos (Clase 1), materiales radiactivos (Clase 7) y sustancias infecciosas (Clase 6.2).',
      },
      {
        Icon: Globe,
        title: 'Cobertura Internacional',
        desc: 'Coordinación de carga aérea hacia y desde México, Estados Unidos, Canadá, Europa y mercados internacionales clave a través de las principales aerolíneas.',
      },
      {
        Icon: ShieldCheck,
        title: 'Documentación Sin Errores',
        desc: 'Cada Declaración de Mercancías Peligrosas es revisada por un segundo especialista DG certificado antes de la aceptación — eliminando errores antes de que lleguen a la aerolínea.',
      },
      {
        Icon: Clock,
        title: 'Evaluación en el Mismo Día',
        desc: 'Requisitos de carga aérea urgente atendidos con evaluación de clasificación DG y emisión de documentación en el mismo día hábil.',
      },
      {
        Icon: Users,
        title: 'Equipo de Cumplimiento Bilingüe',
        desc: 'Toda la documentación, coordinación con aerolíneas y comunicación regulatoria gestionada en español e inglés por nuestros especialistas bilingüe.',
      },
    ],
  },
  cta: {
    headline: '¿Necesita Transportar Mercancías Peligrosas por Vía Aérea?',
    sub: 'Nuestros especialistas certificados por IATA revisarán su material, confirmarán los requisitos de embalaje y prepararán su paquete completo de cumplimiento para carga aérea.',
  },
};

export function TransporteAereoPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Transporte Aéreo de Mercancías Peligrosas | Global Gate México',
    description: 'Transporte aéreo IATA DGR de materiales peligrosos Clases 1–9 en México y todo el mundo. Declaración DG, embalaje certificado ONU y coordinación con aerolíneas.',
    canonical: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/transporte-aereo',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/transporte-aereo' },
      { lang: 'en', href: 'https://globalgatemexico.com/dangerous-goods-transportation/air-transportation' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dangerous-goods-transportation/air-transportation' },
    ],
  });
  return <ServicePageTemplate data={transporteAereoData} lang="ES" />;
}

// ── Transporte Terrestre ──────────────────────────────────────────────────────

const transporteTerrestreData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-ground-transport.webp',
    eyebrow: 'SCT · NOM-002 · DOT 49 CFR · Transfronterizo EUA / Canadá',
    headline: 'Transporte Terrestre de Mercancías Peligrosas —',
    highlighted: 'Certificado y Conforme a SCT.',
    sub: 'Transporte carretero conforme a la NOM-SCT de materiales peligrosos en todo México y transfronterizo a los Estados Unidos y Canadá. Operadores certificados, flota dedicada DG y monitoreo en tiempo real.',
  },
  overview: {
    eyebrow: 'Soluciones de Transporte Terrestre',
    headline: 'Transporte Carretero de Materiales Peligrosos en México y Norteamérica',
    paragraphs: [
      'El transporte carretero de mercancías peligrosas en México está regido por la NOM-002-SCT/2011 y una red de regulaciones SCT relacionadas que abarcan clasificación, plaqueteo, certificación de conductores, estándares vehiculares y respuesta a emergencias. Las operaciones transfronterizas hacia los Estados Unidos y Canadá suman los requisitos del DOT 49 CFR y del TDG al marco de cumplimiento.',
      'Global Gate México opera una flota dedicada de mercancías peligrosas con operadores certificados por la SCT y con habilitación activa en materiales peligrosos. Cada vehículo está equipado con los plaqueteos correctos, contenedores de derrames, supresión de incendios y fichas de respuesta a emergencias antes de que un envío se movilice. Nuestro equipo de cumplimiento prefiltra cada carga contra la normativa vigente — sin atajos.',
    ],
    capabilities: [
      'Cumplimiento NOM-002-SCT/2011 para todos los movimientos terrestres',
      'Operadores DG certificados federalmente con habilitación para materiales peligrosos',
      'Flota vehicular dedicada DG con plaqueteos y kits de derrames',
      'Cobertura en todo México, incluyendo todos los corredores industriales',
      'Transporte transfronterizo a los Estados Unidos y Canadá',
      'Cumplimiento DOT 49 CFR y TDG para envíos transfronterizos',
      'Rastreo GPS en tiempo real y documentación de cadena de custodia',
      'Protocolos de respuesta a derrames de emergencia 24/7',
    ],
    image: '/images/dg-transport/dg-field-operations.webp',
  },
  compliance: {
    headline: 'Normativa Aplicable al Transporte Terrestre',
    body: 'Nuestras operaciones de transporte terrestre se validan contra toda la normativa mexicana, estadounidense y canadiense aplicable antes de que cada envío parta — cubriendo clasificación, documentación, certificación de conductores y requisitos vehiculares.',
    standards: [
      {
        code: 'NOM-002-SCT',
        name: 'Norma Mexicana de Transporte Terrestre DG',
        desc: 'Norma mexicana primaria que rige la clasificación, embalaje, marcado, plaqueteo, documentación y certificación de conductores para el transporte carretero de materiales peligrosos.',
      },
      {
        code: 'DOT 49 CFR',
        name: 'Reglamentación de Hazmat de EUA',
        desc: 'Aplica a todos los envíos transfronterizos que ingresan o transitan por los Estados Unidos. Incluye registro de transportistas de hazmat y requisitos específicos de documentos de embarque.',
      },
      {
        code: 'TDG Act',
        name: 'Ley de Transporte de Mercancías Peligrosas (Canadá)',
        desc: 'Marco regulatorio canadiense para todos los movimientos transfronterizos de materiales peligrosos hacia territorio canadiense. Rige clasificación, documentación y capacitación.',
      },
      {
        code: 'ADR',
        name: 'Acuerdo Internacional de Transporte Carretero',
        desc: 'Aplicado como norma de referencia internacional para especificaciones de equipo vehicular, protocolos de capacitación de conductores y requisitos de respuesta a emergencias.',
      },
    ],
  },
  process: {
    headline: 'Cómo Transportamos Mercancías Peligrosas por Carretera',
    body: 'Cada envío terrestre pasa por un proceso de cumplimiento de cuatro pasos antes de salir del origen. Operador, vehículo, documentación y carga se verifican antes de la salida.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'Evaluación Regulatoria',
        desc: 'Material clasificado bajo la SCT NOM y toda la normativa transfronteriza aplicable. Revisión de permisos de ruta, restricciones de puentes y prohibiciones en túneles.',
      },
      {
        num: '02',
        Icon: Truck,
        title: 'Asignación de Vehículo y Operador',
        desc: 'Operador certificado SCT asignado. Vehículo conforme verificado para la clase DG. Plaqueteos instalados. Kit de derrames, extintor y ficha de respuesta a emergencias confirmados a bordo.',
      },
      {
        num: '03',
        Icon: FileText,
        title: 'Documentación',
        desc: 'Documentos de embarque elaborados conforme a los requisitos SCT/DOT. Documentación de respuesta a emergencias completada. Registros de certificación del operador y cumplimiento vehicular archivados.',
      },
      {
        num: '04',
        Icon: Route,
        title: 'Transporte y Monitoreo',
        desc: 'Monitoreo GPS en tiempo real durante el tránsito. Documentación de cadena de custodia mantenida. Transferencia transfronteriza y coordinación aduanera gestionadas.',
      },
    ],
  },
  whyGGM: {
    headline: 'Especialistas en Transporte Terrestre de Mercancías Peligrosas en México',
    body: 'No transportamos mercancías peligrosas como actividad secundaria — es lo único que hacemos. Cada operador, vehículo y proceso de nuestra flota está diseñado para carga peligrosa.',
    points: [
      {
        Icon: BadgeCheck,
        title: 'Operadores Certificados SCT',
        desc: 'Todos los operadores cuentan con certificaciones federales activas de la SCT en mercancías peligrosas con habilitación de hazmat, renovadas con un ciclo anual estricto.',
      },
      {
        Icon: Truck,
        title: 'Flota Dedicada DG',
        desc: 'Vehículos equipados específicamente con plaqueteos DG, sistemas de contención de derrames, equipo de supresión de incendios y fichas de respuesta a emergencias.',
      },
      {
        Icon: Globe,
        title: 'Experiencia Transfronteriza',
        desc: 'Corredores logísticos comprobados en las fronteras México–EUA y México–Canadá, respaldados por documentación de cumplimiento bilingüe y coordinación aduanera.',
      },
      {
        Icon: Route,
        title: 'Cobertura en Todo México',
        desc: 'Operaciones que cubren todos los principales corredores industriales mexicanos: Monterrey, Guadalajara, Ciudad de México, Puebla y todos los principales cruces fronterizos.',
      },
      {
        Icon: ShieldCheck,
        title: 'Rastreo en Tiempo Real',
        desc: 'Monitoreo GPS y documentación de cadena de custodia para cada envío, desde el punto de origen hasta la entrega confirmada.',
      },
      {
        Icon: Lock,
        title: 'Respuesta a Emergencias 24/7',
        desc: 'Contactos de emergencia, protocolos de respuesta a derrames y procedimientos de notificación al transportista en vigor para cada movimiento de mercancías peligrosas, las 24 horas.',
      },
    ],
  },
  cta: {
    headline: '¿Listo para Transportar Mercancías Peligrosas por Carretera?',
    sub: 'Nuestro equipo de transporte terrestre certificado evaluará su carga, confirmará los requisitos regulatorios y asignará un vehículo y operador conformes para su envío.',
  },
};

export function TransporteTerrestrePage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Transporte Terrestre de Mercancías Peligrosas | Global Gate México',
    description: 'Transporte carretero NOM-SCT de materiales peligrosos en todo México y transfronterizo a EUA y Canadá. Operadores certificados y flota dedicada DG.',
    canonical: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/transporte-terrestre',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/transporte-terrestre' },
      { lang: 'en', href: 'https://globalgatemexico.com/dangerous-goods-transportation/ground-transportation' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dangerous-goods-transportation/ground-transportation' },
    ],
  });
  return <ServicePageTemplate data={transporteTerrestreData} lang="ES" />;
}

// ── Transporte Marítimo ───────────────────────────────────────────────────────

const transporteMaritimoData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-ocean-freight.webp',
    eyebrow: 'Código IMDG · SOLAS · FCL y LCL · Puerto a Puerto',
    headline: 'Flete Marítimo de Carga Peligrosa —',
    highlighted: 'Bajo Código IMDG.',
    sub: 'Cumplimiento completo del Código IMDG para envíos marítimos de mercancías peligrosas en contenedor y a granel. Coordinación portuaria, manifiestos de hazmat, planificación de estiba y documentación aduanera gestionados de extremo a extremo.',
  },
  overview: {
    eyebrow: 'Soluciones de Flete Marítimo',
    headline: 'Flete Marítimo Bajo Código IMDG para Materiales Peligrosos',
    paragraphs: [
      'El transporte marítimo de mercancías peligrosas exige cumplimiento preciso del Código IMDG en embalaje, marcado, etiquetado, plaqueteo, estiba, segregación y documentación. Las declaraciones no conformes generan retenciones en puertos, rechazo de carga, prohibiciones en buques y penalizaciones económicas significativas — riesgos que aumentan con cada error en la cadena documental.',
      'Global Gate México proporciona gestión integral del cumplimiento IMDG para envíos de mercancías peligrosas FCL y LCL a través de los principales puertos internacionales de México. Nuestros especialistas certificados elaboran el Manifiesto DG completo, coordinan la planificación de estiba y segregación de contenedores, gestionan la aceptación en puerto y tramitan toda la documentación aduanera — para que su carga zarpe en el plazo previsto.',
    ],
    capabilities: [
      'Clasificación, embalaje y planificación de estiba bajo Código IMDG',
      'FCL (Contenedor Completo) y LCL (Carga Consolidada)',
      'Servicio de carga peligrosa puerta a puerta y puerto a puerto',
      'Elaboración de Manifiesto DG, Conocimiento de Embarque y certificado de embalaje',
      'Verificación de segregación de carga y compatibilidad',
      'Identificación y manejo de contaminantes marinos',
      'Operaciones portuarias en Veracruz, Manzanillo, Lázaro Cárdenas, Altamira',
      'Documentación y coordinación para aduanas mexicanas',
    ],
    image: '/images/dg-transport/dg-operations-team.webp',
  },
  compliance: {
    headline: 'Normativa Aplicable al Flete Marítimo',
    body: 'Cada envío marítimo de mercancías peligrosas se valida contra el marco completo del Código IMDG, más la normativa portuaria, aduanera y de estado de bandera aplicable antes de cargar el contenedor.',
    standards: [
      {
        code: 'Código IMDG',
        name: 'Código Marítimo Internacional de Mercancías Peligrosas',
        desc: 'Norma global para el transporte de mercancías peligrosas por vía marítima. Cubre clasificación, embalaje, marcado, etiquetado, estiba, segregación y requisitos de documentación.',
      },
      {
        code: 'SOLAS',
        name: 'Convenio para la Seguridad de la Vida Humana en el Mar',
        desc: 'Convenio de la OMI que exige la estiba, segregación y manejo seguros de mercancías peligrosas a bordo de todos los buques comerciales. Rige las obligaciones del armador y el expedidor.',
      },
      {
        code: 'MARPOL',
        name: 'Prevención de la Contaminación por Buques',
        desc: 'Rige el manejo de contaminantes marinos dentro del marco del Código IMDG. Aplica a todas las sustancias clasificadas como contaminantes marinos.',
      },
      {
        code: 'Reg. Portuaria',
        name: 'Regulaciones de la Autoridad Portuaria Mexicana',
        desc: 'Requisitos operativos para el manejo de mercancías peligrosas en Veracruz, Manzanillo, Lázaro Cárdenas y Altamira — los principales puertos internacionales de contenedores de México.',
      },
    ],
  },
  process: {
    headline: 'Cómo Embarcamos sus Mercancías Peligrosas por Vía Marítima',
    body: 'Cada envío de flete marítimo pasa por un proceso de cumplimiento y coordinación de cuatro etapas — desde la clasificación IMDG inicial hasta la entrega en puerto de destino.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'Clasificación IMDG',
        desc: 'Número ONU, Clase de Peligro IMDG, Grupo de Embalaje, condición de contaminante marino y Disposiciones Especiales identificados bajo la edición vigente del Código IMDG.',
      },
      {
        num: '02',
        Icon: Package,
        title: 'Embalaje y Carga del Contenedor',
        desc: 'Embalaje certificado ONU seleccionado y preparado. Plan de estiba y requisitos de segregación de carga verificados conforme al Capítulo 7 del Código IMDG.',
      },
      {
        num: '03',
        Icon: FileText,
        title: 'Manifiesto DG y Documentación',
        desc: 'Manifiesto de Mercancías Peligrosas IMDG, certificado de embalaje y Conocimiento de Embarque elaborados. Contactos de respuesta a emergencias y notificaciones portuarias coordinados.',
      },
      {
        num: '04',
        Icon: Ship,
        title: 'Coordinación Portuaria',
        desc: 'Contenedor entregado en el puerto de carga con el paquete completo de aceptación DG. Despacho aduanero gestionado. Carga rastreada hasta la entrega en el puerto de destino.',
      },
    ],
  },
  whyGGM: {
    headline: 'Su Socio para Carga Peligrosa Marítima en México',
    body: 'El flete marítimo de mercancías peligrosas exige profunda experiencia en el Código IMDG y sólidas relaciones portuarias. Aportamos ambas — construidas durante casi dos décadas de operaciones especializadas.',
    points: [
      {
        Icon: Ship,
        title: 'Cobertura en Puertos Principales',
        desc: 'Cobertura operativa directa en Veracruz, Manzanillo, Lázaro Cárdenas y Altamira — los cuatro principales puertos internacionales de contenedores de México.',
      },
      {
        Icon: Package,
        title: 'Opciones FCL y LCL',
        desc: 'Contenedor completo y carga consolidada para cualquier volumen de mercancías peligrosas, desde un solo bulto hasta un contenedor completo de hazmat.',
      },
      {
        Icon: Globe,
        title: 'Rutas Internacionales',
        desc: 'Servicio regular a Norteamérica, Europa, Asia y Sudamérica a través de las principales líneas navieras, con cumplimiento IMDG completo en cada escala.',
      },
      {
        Icon: FileText,
        title: 'Documentación Completa',
        desc: 'Manifiesto DG, Conocimiento de Embarque, certificado de embalaje, documentación aduanera y paquetes de respuesta a emergencias elaborados en casa por nuestros especialistas.',
      },
      {
        Icon: ShieldCheck,
        title: 'Estiba y Segregación',
        desc: 'Planificación experta de estiba y segregación de carga conforme al Código IMDG — previniendo rechazos de carga, retenciones en puertos y problemas de cumplimiento de buques.',
      },
      {
        Icon: GraduationCap,
        title: 'Especialistas Certificados IMDG',
        desc: 'Todos los coordinadores de flete marítimo cuentan con certificaciones activas del Código IMDG, renovadas en el ciclo regular de enmiendas bienales.',
      },
    ],
  },
  cta: {
    headline: '¿Listo para Embarcar Mercancías Peligrosas por Vía Marítima?',
    sub: 'Nuestros especialistas certificados por IMDG revisarán su carga, confirmarán los requisitos de embalaje y estiba, y gestionarán su paquete completo de cumplimiento para flete marítimo.',
  },
};

export function TransporteMaritimoPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Flete Marítimo de Mercancías Peligrosas | Global Gate México',
    description: 'Flete marítimo bajo Código IMDG para carga peligrosa FCL y LCL. Gestión portuaria, manifiesto DG y documentación aduanera en los principales puertos de México.',
    canonical: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/transporte-maritimo',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/transporte-maritimo' },
      { lang: 'en', href: 'https://globalgatemexico.com/dangerous-goods-transportation/ocean-freight' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dangerous-goods-transportation/ocean-freight' },
    ],
  });
  return <ServicePageTemplate data={transporteMaritimoData} lang="ES" />;
}

// ── Embalaje DG ───────────────────────────────────────────────────────────────

const embalajeDGData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-process-packaging.webp',
    eyebrow: 'Certificado ONU · Todas las Clases de Peligro · IATA · IMDG · ADR · SCT',
    headline: 'Embalaje Certificado ONU para Mercancías Peligrosas —',
    highlighted: 'Todas las Clases de Peligro.',
    sub: 'Suministro, preparación y verificación interna de embalaje certificado ONU para las nueve clases de peligro en los modos de transporte aéreo, marítimo y terrestre. Cada bulto sale totalmente conforme.',
  },
  overview: {
    eyebrow: 'Soluciones de Embalaje',
    headline: 'Embalaje DG Conforme para Todo Modo de Transporte y Clase de Peligro',
    paragraphs: [
      'El embalaje incorrecto es una de las causas más frecuentes de rechazo de envíos, incidentes y sanciones regulatorias en mercancías peligrosas. El embalaje certificado ONU debe coincidir con la clase de peligro específica, el grupo de embalaje, la cantidad y el modo de transporte — y debe prepararse, cerrarse y marcarse con exactitud conforme a la instrucción de embalaje aplicable.',
      'Global Gate México mantiene inventario interno de tambores, bidones, cajas y embalajes combinados certificados ONU para un servicio ágil. Nuestros especialistas certificados seleccionan el embalaje correcto, verifican los certificados de prueba de desempeño, preparan el embalaje interior y el material de amortiguamiento, cierran y sellan conforme a especificación, y aplican todas las marcas y etiquetas requeridas — antes de entregar su envío al transportista.',
    ],
    capabilities: [
      'Embalaje interior y exterior certificado ONU para todas las clases de peligro',
      'Embalajes combinados, simples y GRG (IBC)',
      'Tambores, bidones, cajas y sacos aprobados en pruebas de desempeño',
      'Embalajes de cantidad limitada y cantidad exceptuada',
      'Cumplimiento de Instrucciones de Embalaje IATA (PI 100–998)',
      'Requisitos de embalaje del Capítulo 4 del Código IMDG',
      'Normas de embalaje ADR y NOM-SCT',
      'Soluciones de embalaje personalizadas para materiales no estándar',
    ],
    image: '/images/dg-transport/dg-specialized-packaging.webp',
  },
  compliance: {
    headline: 'Normativa y Estándares de Embalaje Aplicables',
    body: 'El embalaje de mercancías peligrosas debe cumplir con las recomendaciones ONU y la normativa modal de cada modo de transporte en el trayecto del envío. Verificamos contra todos los estándares aplicables.',
    standards: [
      {
        code: 'Libro Naranja ONU',
        name: 'Recomendaciones ONU sobre Transporte de MP',
        desc: 'Norma global fundamental para el embalaje de mercancías peligrosas, que define los requisitos de prueba de desempeño y el sistema de certificación ONU.',
      },
      {
        code: 'IATA PI',
        name: 'Instrucciones de Embalaje IATA (PI 100–998)',
        desc: 'Instrucciones específicas que rigen el embalaje interior y exterior, límites de cantidad y requisitos de cierre para cada sustancia transportada por vía aérea.',
      },
      {
        code: 'IMDG Cap.4',
        name: 'Requisitos de Embalaje del Código IMDG',
        desc: 'Requisitos integrales de embalaje para transporte marítimo, incluyendo embalaje combinado, GRG y embalaje de gran tamaño para todas las clases de peligro.',
      },
      {
        code: 'ADR / SCT',
        name: 'Normas de Embalaje para Transporte Carretero',
        desc: 'Requisitos de embalaje del Capítulo 4 del ADR y NOM-002-SCT/2011 para el transporte carretero transfronterizo y doméstico de mercancías peligrosas.',
      },
    ],
  },
  process: {
    headline: 'Nuestro Proceso de Embalaje DG',
    body: 'Cada bulto que preparamos pasa por un proceso de cuatro pasos de selección, verificación, preparación y marcado antes de ser liberado para el transporte.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'Evaluación del Material',
        desc: 'Clase de peligro, grupo de embalaje, cantidad neta y modo de transporte identificados. Instrucción de embalaje aplicable y límites de cantidad confirmados.',
      },
      {
        num: '02',
        Icon: Package,
        title: 'Selección del Embalaje',
        desc: 'Embalaje certificado ONU asignado a los requisitos. Certificado de prueba de desempeño verificado en cuanto a vigencia. Compatibilidad con el contenido confirmada.',
      },
      {
        num: '03',
        Icon: CheckCircle,
        title: 'Preparación y Cierre',
        desc: 'Embalaje interior, material absorbente, amortiguamiento y cierre preparados conforme a especificación. Límites de cantidad y par de cierre verificados.',
      },
      {
        num: '04',
        Icon: Tag,
        title: 'Marcado y Verificación',
        desc: 'Marcas ONU, declaraciones de cantidad neta, flechas de orientación y etiquetas de manejo aplicadas. Verificación final de cumplimiento antes de la liberación al transporte.',
      },
    ],
  },
  whyGGM: {
    headline: 'Sus Especialistas en Embalaje para Mercancías Peligrosas',
    body: 'No solo suministramos embalaje — lo seleccionamos, preparamos, verificamos y asumimos la responsabilidad de su cumplimiento. Cada bulto que sale de nuestras instalaciones está listo para el transporte.',
    points: [
      {
        Icon: Package,
        title: 'Inventario Interno de Embalaje ONU',
        desc: 'Inventario disponible de tambores, bidones, cajas de cartón y embalajes combinados certificados ONU para evaluación rápida y preparación en el mismo día.',
      },
      {
        Icon: ShieldCheck,
        title: 'Las Nueve Clases de Peligro',
        desc: 'Soluciones de embalaje para cada clase de mercancías peligrosas, incluyendo Clase 1 (Explosivos), Clase 6 (Tóxicos) y Clase 7 (Materiales Radiactivos).',
      },
      {
        Icon: Globe,
        title: 'Todos los Modos de Transporte',
        desc: 'Embalaje verificado simultáneamente para cumplimiento IATA, IMDG y ADR — indispensable para envíos multimodales con múltiples tramos de transporte.',
      },
      {
        Icon: Award,
        title: 'Certificados de Prueba de Desempeño',
        desc: 'Todo el embalaje ONU suministrado con certificados de prueba de desempeño vigentes de laboratorios aprobados. Sin embalaje no certificado sale de nuestras instalaciones.',
      },
      {
        Icon: ClipboardList,
        title: 'Servicios de Auditoría de Embalaje',
        desc: 'Auditorías de embalaje previas al envío de su programa DG existente. Identificamos brechas de cumplimiento antes que su transportista o regulador.',
      },
      {
        Icon: GraduationCap,
        title: 'Orientación Experta',
        desc: 'Nuestros especialistas certificados asesoran sobre la solución de embalaje más conforme y rentable para su material, cantidad y ruta de transporte específicos.',
      },
    ],
  },
  cta: {
    headline: '¿Necesita Embalaje Certificado ONU para Mercancías Peligrosas?',
    sub: 'Nuestros especialistas en embalaje identificarán la instrucción de embalaje correcta, suministrarán embalaje conforme y prepararán su envío según la especificación regulatoria completa.',
  },
};

export function EmbalajeDGPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Embalaje para Mercancías Peligrosas Certificado ONU | Global Gate México',
    description: 'Embalaje certificado ONU para las 9 clases de peligro en transporte aéreo, marítimo y terrestre. Selección, preparación y verificación por especialistas certificados en México.',
    canonical: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/embalaje-dg',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/embalaje-dg' },
      { lang: 'en', href: 'https://globalgatemexico.com/dangerous-goods-transportation/dg-packaging' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dangerous-goods-transportation/dg-packaging' },
    ],
  });
  return <ServicePageTemplate data={embalajeDGData} lang="ES" />;
}

// ── Servicios de Documentación ────────────────────────────────────────────────

const serviciosDocumentacionData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-documentation-services.webp',
    eyebrow: 'IATA · IMDG · SCT · DOT · GHS/HDS · Multimodal',
    headline: 'Servicios de Documentación para Mercancías Peligrosas —',
    highlighted: 'Precisa. Certificada. Multimodal.',
    sub: 'Elaboración profesional de toda la documentación regulatoria de materiales peligrosos — Declaraciones de Mercancías Peligrosas, Hojas de Datos de Seguridad, certificaciones del embarcador y documentación de cumplimiento para todos los modos de transporte, en español e inglés.',
  },
  overview: {
    eyebrow: 'Soluciones de Documentación',
    headline: 'Documentación DG Completa — La Base de Todo Envío Conforme',
    paragraphs: [
      'Una Declaración de Mercancías Peligrosas correctamente elaborada es jurídicamente vinculante y operativamente crítica. Los errores en la documentación provocan rechazo del envío, multas regulatorias, responsabilidad del transportista y, en algunos casos, persecución penal bajo el derecho de transporte internacional. No hay margen para la aproximación.',
      'Los especialistas certificados de Global Gate México elaboran paquetes de documentación completos para envíos aéreos (IATA/ICAO), marítimos (IMDG) y terrestres (SCT/DOT). Cada documento es revisado por un segundo profesional certificado antes de su emisión. También proporcionamos servicios completos de Hoja de Datos de Seguridad (HDS), incluyendo elaboración, traducción, formato GHS y revisión regulatoria en español e inglés.',
    ],
    capabilities: [
      'Declaración de Mercancías Peligrosas — formato IATA/ICAO (aéreo)',
      'Manifiesto DG y certificado de embalaje — formato IMDG (marítimo)',
      'Documentos de embarque — formato NOM-SCT (terrestre México)',
      'Documentos de embarque — formato DOT 49 CFR (transfronterizo EUA)',
      'Elaboración de Hoja de Datos de Seguridad (HDS) en formato GHS',
      'Revisión, corrección y traducción bilingüe de HDS',
      'Certificación del embarcador y servicios de signatario autorizado',
      'Documentación de respuesta a emergencias (ERG, MFAG, ERI)',
    ],
    image: '/images/dg-transport/dg-warehouse-01.webp',
  },
  compliance: {
    headline: 'Estándares de Documentación Bajo los que Operamos',
    body: 'Cada documento que elaboramos se valida contra la edición vigente de la normativa modal aplicable — no el estándar del año pasado, no una aproximación. Actual, completo y conforme.',
    standards: [
      {
        code: 'IATA DGD',
        name: 'Declaración del Embarcador para MP (Aéreo)',
        desc: 'Declaración de Mercancías Peligrosas en formato IATA obligatoria para todos los envíos aéreos de materiales peligrosos. Jurídicamente vinculante bajo el IATA DGR y las Instrucciones Técnicas de la OACI.',
      },
      {
        code: 'Manifiesto IMDG',
        name: 'Manifiesto DG y Certificado de Embalaje (Marítimo)',
        desc: 'Documentación IMDG requerida para todos los envíos marítimos de mercancías peligrosas, incluyendo certificados de embalaje en contenedor e información de contacto de emergencia.',
      },
      {
        code: 'SCT / DOT',
        name: 'Documentos de Embarque para Transporte Carretero',
        desc: 'Documentos de embarque requeridos por la NOM-002-SCT/2011 para movimientos terrestres domésticos en México y el DOT 49 CFR para todos los envíos transfronterizos a Estados Unidos.',
      },
      {
        code: 'GHS / HDS',
        name: 'Hojas de Datos de Seguridad (Formato GHS)',
        desc: 'Hojas de Datos de Seguridad de 16 secciones elaboradas y revisadas bajo el estándar GHS/HazCom 2012 en español e inglés. Incluye revisión regulatoria para verificación de exactitud.',
      },
    ],
  },
  process: {
    headline: 'Cómo Elaboramos su Documentación DG',
    body: 'Nuestro proceso documental de cuatro pasos garantiza que cada documento esté correctamente clasificado, revisado a fondo y certificado antes de su emisión — con servicio en el mismo día disponible.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'Revisión de Clasificación',
        desc: 'Número ONU, Nombre de Embarque Apropiado, Clase de Peligro, Grupo de Embalaje y Disposiciones Especiales verificados contra la edición vigente de la normativa modal.',
      },
      {
        num: '02',
        Icon: FileText,
        title: 'Revisión y Elaboración de HDS',
        desc: 'Hojas de Datos de Seguridad existentes revisadas en cuanto a exactitud y cumplimiento GHS. Nueva HDS elaborada en formato GHS de 16 secciones en español y/o inglés.',
      },
      {
        num: '03',
        Icon: ClipboardList,
        title: 'Elaboración de la Declaración',
        desc: 'Documentación regulatoria completa elaborada conforme a la especificación modal aplicable — Declaración DGD IATA, Manifiesto IMDG, documento de embarque SCT o formato DOT 49 CFR.',
      },
      {
        num: '04',
        Icon: CheckCircle,
        title: 'Revisión Dual y Certificación',
        desc: 'Todos los documentos revisados por un segundo especialista certificado. Documentos finales firmados y certificados por nuestro profesional autorizado de documentación DG.',
      },
    ],
  },
  whyGGM: {
    headline: 'Por Qué las Empresas nos Confían su Documentación DG',
    body: 'Los errores en la documentación DG no son recuperables una vez que un envío está en tránsito. Construimos nuestra práctica documental sobre la eliminación — no la corrección posterior.',
    points: [
      {
        Icon: GraduationCap,
        title: 'Preparadores Certificados IATA/IMDG',
        desc: 'Todos los especialistas en documentación cuentan con certificaciones actuales del IATA DGR y el Código IMDG. Sin generalistas gestionando documentos especializados.',
      },
      {
        Icon: Globe,
        title: 'Documentación Bilingüe',
        desc: 'Todas las declaraciones DG, HDS y documentos de cumplimiento elaborados en español e inglés — cubriendo todos los requisitos regulatorios y comerciales.',
      },
      {
        Icon: Award,
        title: 'Todos los Modos de Transporte',
        desc: 'Especialistas en documentación para aéreo (IATA/ICAO), marítimo (IMDG), terrestre (SCT/DOT) y envíos multimodales — todo bajo un mismo techo.',
      },
      {
        Icon: Clock,
        title: 'Entrega en el Mismo Día',
        desc: 'Solicitudes urgentes de documentación atendidas el mismo día hábil. Entendemos que una declaración faltante puede retrasar toda una cadena de suministro.',
      },
      {
        Icon: ShieldCheck,
        title: 'Proceso de Revisión Dual',
        desc: 'Cada documento revisado por un segundo especialista certificado antes de su emisión. Un segundo par de ojos certificados elimina errores que los sistemas de revisión única no detectan.',
      },
      {
        Icon: ClipboardList,
        title: 'Elaboración y Revisión de HDS',
        desc: 'Servicios completos de Hoja de Datos de Seguridad: elaboración, traducción, formato GHS, revisión regulatoria y corrección de HDS existentes no conformes.',
      },
    ],
  },
  cta: {
    headline: '¿Necesita que Elaboremos su Documentación de Mercancías Peligrosas?',
    sub: 'Nuestros especialistas certificados revisarán su material, prepararán su paquete completo de documentación y certificarán cada documento conforme al estándar regulatorio aplicable.',
  },
};

export function ServiciosDocumentacionPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Servicios de Documentación para Mercancías Peligrosas | Global Gate México',
    description: 'Elaboración profesional de Declaraciones DG, HDS, manifiestos IMDG y documentos SCT/DOT para todos los modos de transporte. Bilingüe y con revisión dual certificada.',
    canonical: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/servicios-documentacion',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/transporte-mercancias-peligrosas/servicios-documentacion' },
      { lang: 'en', href: 'https://globalgatemexico.com/dangerous-goods-transportation/documentation-services' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dangerous-goods-transportation/documentation-services' },
    ],
  });
  return <ServicePageTemplate data={serviciosDocumentacionData} lang="ES" />;
}
