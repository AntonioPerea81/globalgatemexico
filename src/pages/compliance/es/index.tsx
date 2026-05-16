import { useEffect } from 'react';
import {
  AlertTriangle, FileX, PackageX, Globe,
  ClipboardCheck, Search, BookOpen,
  FileWarning, MapPin, RefreshCw,
  ShieldCheck, Clock, Award, Users,
  Tag, FileText, Lock,
  Layers, AlertCircle, XCircle, Database,
} from 'lucide-react';
import { CompliancePageTemplate, CompliancePageData } from '../CompliancePageTemplate';
import { useLanguage } from '../../../context/LanguageContext';
import { usePageMeta } from '../../../hooks/usePageMeta';

// ── Cumplimiento DG ───────────────────────────────────────────────────────────

const cumplimientoDGData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-documentation-services.webp',
    eyebrow: 'IATA DGR · IMDG · ADR · SCT · DOT · Ciclo Completo de Cumplimiento',
    headline: 'Cumplimiento DG —',
    highlighted: 'Clasificación correcta. Cada embarque.',
    sub: 'La mayoría de los incidentes con mercancías peligrosas tienen un origen común: una clasificación errónea. Nuestro servicio de cumplimiento DG garantiza que cada embarque esté correctamente identificado, documentado y aceptado — antes de llegar al operador.',
  },
  risk: {
    headline: 'Dónde falla el cumplimiento DG',
    body: 'Los fallos en el cumplimiento de mercancías peligrosas rara vez son accidentales. Siguen patrones predecibles que emergen en el peor momento: rechazo en aceptación, retención aduanera o reporte de incidente.',
    items: [
      {
        Icon: AlertTriangle,
        title: 'Clasificación Incorrecta en Aceptación',
        desc: 'Un número ONU erróneo o una clase de peligro incorrecta genera rechazo por parte del operador, retraso del embarque y posible multa regulatoria. Reclasificar tras la entrega duplica los tiempos de gestión.',
      },
      {
        Icon: FileX,
        title: 'Documentación Rechazada en Origen',
        desc: 'Una Declaración de Mercancías Peligrosas con campos incompletos, referencia incorrecta a instrucción de embalaje o firmante no certificado es rechazada en el punto de aceptación — no en el escritorio del embarcador.',
      },
      {
        Icon: PackageX,
        title: 'Embalaje No Conforme',
        desc: 'Utilizar embalaje sin certificación ONU, una combinación interior/exterior incorrecta o una instrucción de embalaje no aplicable invalida el cumplimiento, independientemente de la exactitud del resto de la documentación.',
      },
      {
        Icon: Globe,
        title: 'Diferencias Modales Ignoradas',
        desc: 'Una sustancia clasificada bajo IATA puede tener límites de cantidad o grupos de embalaje distintos bajo IMDG o ADR. Tratar todos los modos como equivalentes genera riesgo sistemático en cada embarque.',
      },
    ],
  },
  scope: {
    eyebrow: 'Alcance del Servicio',
    headline: 'Lo que cubre nuestro Servicio de Cumplimiento DG',
    body: 'Gestionamos el ciclo completo de cumplimiento para embarques de mercancías peligrosas — desde la clasificación inicial hasta la validación final de la documentación, en todos los modos de transporte.',
    items: [
      {
        Icon: Search,
        title: 'Clasificación y Asignación de Número ONU',
        desc: 'Análisis de HDS, identificación del nombre técnico, clase de peligro, grupo de embalaje y disposiciones especiales, determinados conforme a la normativa aplicable.',
      },
      {
        Icon: ClipboardCheck,
        title: 'Preparación de la Declaración de Mercancías Peligrosas',
        desc: 'DGD IATA, Formulario Multimodal y declaración del embarcador preparados, revisados y certificados por nuestros especialistas habilitados.',
      },
      {
        Icon: PackageX,
        title: 'Revisión de Conformidad del Embalaje',
        desc: 'Verificación de instrucción de embalaje, validación de la certificación ONU, compatibilidad interior/exterior y revisión de cantidades por bulto.',
      },
      {
        Icon: Tag,
        title: 'Verificación de Marcas y Etiquetas',
        desc: 'Etiquetas de peligro, marcas de manipulación, marcas ONU y flechas de orientación revisadas contra la edición regulatoria vigente antes de la entrega al operador.',
      },
      {
        Icon: FileText,
        title: 'Mapeo de Cumplimiento Multimodal',
        desc: 'Comparación de requisitos aéreos, terrestres y marítimos por embarque, para que las diferencias por modo en límites y embalaje se apliquen correctamente en cada caso.',
      },
      {
        Icon: ClipboardCheck,
        title: 'Validación Previa al Embarque',
        desc: 'Revisión independiente y certificación por un especialista GGM antes de entregar el embarque al operador — su última barrera de cumplimiento.',
      },
    ],
  },
  why: {
    headline: 'Por qué los embarcadores confían en GGM para el cumplimiento',
    body: 'El cumplimiento es tan sólido como las personas que lo respaldan. Nuestro equipo mantiene certificaciones activas IATA, IMDG y ADR, y se forma conforme a la edición vigente — cada año.',
    points: [
      {
        Icon: Award,
        title: 'Certificados en la Edición Vigente',
        desc: 'Nuestros especialistas se capacitan y recertifican anualmente conforme a las ediciones actuales de IATA DGR, Código IMDG y ADR — no a las reglas del ciclo anterior.',
      },
      {
        Icon: ShieldCheck,
        title: 'Revisión Doble sin Excepciones',
        desc: 'Cada documento pasa por un proceso de revisión dual antes de ser firmado. Si no supera nuestra validación interna, no sale de nuestras manos.',
      },
      {
        Icon: Clock,
        title: 'Respuesta el Mismo Día',
        desc: 'Declaraciones DG estándar y revisiones de cumplimiento completadas en el mismo día hábil para embarques recibidos antes del mediodía.',
      },
      {
        Icon: Globe,
        title: 'Especialización Multimodal',
        desc: 'Un mismo equipo cubre cumplimiento aéreo, terrestre y marítimo — sin traspasos, sin brechas, sin criterios contradictorios entre modos.',
      },
    ],
  },
  cta: {
    headline: 'Elimine el riesgo de cumplimiento antes de que el embarque se mueva',
    sub: 'Nuestros especialistas certificados revisan la clasificación, documentación y embalaje de sus mercancías peligrosas — para que su embarque llegue a destino sin contratiempos.',
  },
};

// ── Consultoría Regulatoria ───────────────────────────────────────────────────

const consultoriaRegulatoriaData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-warehouse-01.webp',
    eyebrow: 'IATA DGR · Código IMDG · ADR · SCT · DOT 49 CFR · CNSNS',
    headline: 'Consultoría Regulatoria —',
    highlighted: 'La norma correcta. La edición vigente.',
    sub: 'Las regulaciones de mercancías peligrosas se actualizan cada año. Nuestro servicio de consultoría mantiene sus operaciones alineadas con los requisitos vigentes de IATA, IMDG, ADR y SCT — y traduce la complejidad normativa en pasos de cumplimiento concretos.',
  },
  risk: {
    headline: 'Cómo las brechas regulatorias generan riesgo operativo',
    body: 'La mayoría de los fallos de cumplimiento DG no son intencionales. Resultan de equipos que aplican la edición incorrecta, interpretan mal una disposición especial, o no incorporan una enmienda regulatoria ya vigente.',
    items: [
      {
        Icon: BookOpen,
        title: 'Operando con la Edición Incorrecta',
        desc: 'IATA DGR se actualiza anualmente. Las empresas que trabajan con la edición del año anterior pueden aplicar instrucciones de embalaje reemplazadas, límites de cantidad obsoletos o disposiciones especiales derogadas sin saberlo.',
      },
      {
        Icon: Layers,
        title: 'Aplicación Incorrecta de Normativa Modal',
        desc: 'Aplicar las reglas aéreas a un embarque terrestre o marítimo — o viceversa — genera errores documentales que afloran en cruces fronterizos o en aceptación con el operador.',
      },
      {
        Icon: AlertCircle,
        title: 'Disposiciones Especiales No Identificadas',
        desc: 'Las disposiciones especiales modifican o eximen requisitos estándar. Omitir una disposición aplicable puede significar costos de embalaje innecesarios o, peor, una presunción de cumplimiento incorrecta.',
      },
      {
        Icon: Globe,
        title: 'Brechas Regulatorias Transfronterizas',
        desc: 'Los embarques transfronterizos México–EUA deben cumplir simultáneamente con SCT y DOT 49 CFR. Cumplir uno mientras se incumple el otro es un error frecuente y costoso.',
      },
    ],
  },
  scope: {
    eyebrow: 'Alcance de la Consultoría',
    headline: 'Lo que cubre nuestra Consultoría Regulatoria',
    body: 'Traducimos los requisitos vigentes de IATA, IMDG, ADR, SCT y DOT en orientación operativa precisa — para sus productos, sus rutas y sus modos de transporte.',
    items: [
      {
        Icon: BookOpen,
        title: 'Análisis Regulatorio en Edición Vigente',
        desc: 'Revisamos la normativa aplicable en su edición actual e identificamos los cambios que afectan sus sustancias, rutas y modos de transporte específicos.',
      },
      {
        Icon: Search,
        title: 'Revisión de Clasificación por Producto',
        desc: 'Análisis individual por producto: número ONU, nombre de embarque apropiado, clase de peligro, grupo de embalaje, disposiciones especiales y excepciones modales.',
      },
      {
        Icon: MapPin,
        title: 'Mapeo de Cumplimiento por Ruta y Modo',
        desc: 'Para cada par origen–destino, identificamos qué regulaciones aplican y dónde existen conflictos o requisitos adicionales entre distintos modos de transporte.',
      },
      {
        Icon: RefreshCw,
        title: 'Seguimiento de Cambios Regulatorios',
        desc: 'Monitoreo continuo de enmiendas anuales IATA DGR, actualizaciones bienales del Código IMDG y avisos regulatorios SCT/DOT que afecten sus operaciones.',
      },
    ],
  },
  why: {
    headline: 'Experiencia regulatoria sin la carga estructural',
    body: 'Desarrollar una función regulatoria interna requiere inversión continua en capacitación y seguimiento edición por edición. GGM entrega ese nivel de especialización cuando lo necesita.',
    points: [
      {
        Icon: Award,
        title: 'Dominio Multirregulatorio',
        desc: 'Nuestro equipo mantiene certificaciones activas en IATA DGR, IMDG, ADR y SCT — no solo en un único marco modal.',
      },
      {
        Icon: RefreshCw,
        title: 'Alineación por Edición Anual',
        desc: 'Nos capacitamos conforme a la edición vigente en cada ciclo y actualizamos nuestra orientación consultiva en cuanto entran en vigor las enmiendas.',
      },
      {
        Icon: Users,
        title: 'Orientación Enfocada en Operaciones',
        desc: 'Nuestras recomendaciones están redactadas para equipos de operaciones, no para departamentos legales — claras, accionables y vinculadas a su perfil de producto y ruta específicos.',
      },
      {
        Icon: ShieldCheck,
        title: 'Especialización Transfronteriza',
        desc: 'La alineación regulatoria México–EUA y México–Canadá es una competencia central. Sabemos dónde están las brechas y cómo cerrarlas con precisión operativa.',
      },
    ],
  },
  cta: {
    headline: 'Deje de adivinar qué normativa aplica',
    sub: 'Nuestros consultores regulatorios identifican las reglas exactas que rigen su operación con mercancías peligrosas y le entregan una hoja de ruta de cumplimiento sin ambigüedades.',
  },
};

// ── Auditorías de Cumplimiento ────────────────────────────────────────────────

const auditoriasData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-operations-team.webp',
    eyebrow: 'IATA DGR · IMDG · ADR · SCT · Evaluaciones Internas y Pre-Auditoría',
    headline: 'Auditorías de Cumplimiento DG —',
    highlighted: 'Detecte la brecha antes que el inspector.',
    sub: 'Una auditoría de cumplimiento es la mejor defensa ante una acción regulatoria. Nuestros auditores identifican brechas documentales, errores de clasificación y deficiencias en capacitación — antes de que se conviertan en incidentes o sanciones.',
  },
  risk: {
    headline: 'Qué encuentran los auditores — y cuánto cuesta',
    body: 'Las empresas que esperan una inspección regulatoria para detectar brechas enfrentan multas, suspensiones operativas y daño reputacional que una auditoría interna previene a una fracción del costo.',
    items: [
      {
        Icon: Database,
        title: 'Registros de Clasificación Desactualizados',
        desc: 'Productos reclasificados en enmiendas recientes de IATA o IMDG pueden seguir embarcándose bajo números ONU o nombres de embarque apropiado reemplazados — una infracción directa que los auditores identifican de inmediato.',
      },
      {
        Icon: FileWarning,
        title: 'Brechas en la Documentación',
        desc: 'Certificaciones del embarcador faltantes, formato de DGD incorrecto o información de contacto de emergencia desactualizada son hallazgos frecuentes que invalidan embarques que en lo demás serían conformes.',
      },
      {
        Icon: Users,
        title: 'Personal Sin Habilitación Vigente',
        desc: 'Personal que firma declaraciones de mercancías peligrosas sin capacitación recurrente activa IATA o IMDG genera responsabilidad personal y corporativa — y está entre las infracciones más citadas por los reguladores.',
      },
      {
        Icon: PackageX,
        title: 'Registros de Embalaje No Válidos',
        desc: 'Certificados de prueba de desempeño ONU vencidos, embalaje utilizado fuera de sus especificaciones autorizadas o registros de compatibilidad interior/exterior faltantes.',
      },
    ],
  },
  scope: {
    eyebrow: 'Alcance de la Auditoría',
    headline: 'Lo que cubre una Auditoría de Cumplimiento GGM',
    body: 'Nuestras auditorías siguen una metodología estructurada basada en IATA DGR, Código IMDG y requisitos SCT — con revisión de documentación, registros de clasificación, embalaje, capacitación y procedimientos internos.',
    items: [
      {
        Icon: ClipboardCheck,
        title: 'Revisión Documental',
        desc: 'Declaraciones del embarcador, DGDs, documentación de respuesta a emergencias y procedimientos internos revisados contra los requisitos regulatorios vigentes.',
      },
      {
        Icon: Search,
        title: 'Verificación de Registros de Clasificación',
        desc: 'Número ONU, nombre de embarque apropiado, clase de peligro, grupo de embalaje y disposiciones especiales verificados en la edición actual para todas las sustancias embarcadas regularmente.',
      },
      {
        Icon: PackageX,
        title: 'Inspección de Embalaje y Etiquetado',
        desc: 'Revisión física del stock de embalaje, vigencia de la certificación ONU, inventario de etiquetas y materiales de marcado contra las instrucciones de embalaje aplicables.',
      },
      {
        Icon: Users,
        title: 'Evaluación de Registros de Capacitación',
        desc: 'Certificados de capacitación revisados por vigencia, alcance y aplicabilidad — incluyendo requisitos de función específica versus concientización general.',
      },
      {
        Icon: FileText,
        title: 'Reporte de Brechas y Plan de Acción',
        desc: 'Hallazgos documentados con referencia regulatoria específica, clasificación de riesgo y pasos de remediación priorizados que su equipo puede ejecutar de inmediato.',
      },
    ],
  },
  why: {
    headline: 'Auditores que saben qué buscan los reguladores',
    body: 'Nuestro equipo ha realizado revisiones de cumplimiento DG en operaciones farmacéuticas, químicas, energéticas y manufactureras en México y rutas transfronterizas.',
    points: [
      {
        Icon: ShieldCheck,
        title: 'Metodología de Nivel Regulatorio',
        desc: 'Nuestro protocolo de auditoría replica los criterios utilizados por inspectores de IATA, SCT y DOT — los hallazgos reflejan riesgo real de fiscalización, no preferencias internas.',
      },
      {
        Icon: FileText,
        title: 'Reportes de Brechas Accionables',
        desc: 'Cada hallazgo se cita contra el reglamento específico, edición y sección — entregando a su equipo la referencia exacta necesaria para verificar y remediar.',
      },
      {
        Icon: RefreshCw,
        title: 'Soporte Pre y Post Auditoría',
        desc: 'Acompañamos la remediación posterior a la auditoría y ofrecemos una revisión de seguimiento para confirmar el cierre de hallazgos antes de cualquier inspección regulatoria programada.',
      },
      {
        Icon: Award,
        title: 'Experiencia por Sector Industrial',
        desc: 'Perfiles DG auditados en farmacéutica, química, energía y aeroespacial — cada uno con complejidades particulares en clasificación y requisitos de embalaje.',
      },
    ],
  },
  cta: {
    headline: 'Programe su Auditoría de Cumplimiento DG',
    sub: 'Nuestros auditores identificarán cada brecha en su operación con mercancías peligrosas — antes que un regulador. Hallazgos estructurados. Plan de acción concreto. Priorizados por nivel de riesgo.',
  },
};

// ── Revisión de HDS ───────────────────────────────────────────────────────────

const revisionHDSData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-field-operations.webp',
    eyebrow: 'GHS · IATA DGR · IMDG · Datos de Transporte Sección 14 · Validación HDS',
    headline: 'Revisión de HDS —',
    highlighted: 'Datos de transporte sobre los que puede embarcar.',
    sub: 'La Hoja de Datos de Seguridad es la fuente primaria de clasificación DG — pero los errores en la Sección 14 son una de las causas más frecuentes de clasificación incorrecta. Verificamos los datos de transporte antes de que lleguen a su declaración DG.',
  },
  risk: {
    headline: 'Por qué los errores en la Sección 14 son tan costosos',
    body: 'Los embarcadores suelen aceptar los documentos HDS del proveedor sin validación independiente. Cuando la Sección 14 contiene errores, esos errores se propagan a cada declaración y etiqueta aplicada a ese producto.',
    items: [
      {
        Icon: XCircle,
        title: 'Número ONU Incorrecto en la HDS',
        desc: 'Un número ONU erróneo en la HDS del proveedor se copiará en cada DGD de ese producto — generando una declaración incorrecta sistemática en todos los embarques hasta que se detecte el error.',
      },
      {
        Icon: FileWarning,
        title: 'Datos de Transporte Desactualizados en la Sección 14',
        desc: 'Las HDS frecuentemente no se actualizan cuando cambian las ediciones de IATA DGR o IMDG. Una HDS que hace referencia a una instrucción de embalaje reemplazada es un pasivo de cumplimiento en cada embarque.',
      },
      {
        Icon: AlertTriangle,
        title: 'Clasificación Inconsistente entre HDS',
        desc: 'La misma sustancia de distintos proveedores puede listar diferentes números ONU, grupos de embalaje o clases de peligro. Sin verificación cruzada contra la normativa vigente, la discrepancia pasa desapercibida.',
      },
      {
        Icon: Globe,
        title: 'HDS de Proveedor No Verificada',
        desc: 'Las HDS de proveedores son documentación comercial, no documentos regulatorios. La Sección 14 debe verificarse de forma independiente contra IATA DGR, IMDG y ADR antes de utilizarse en declaraciones de embarque.',
      },
    ],
  },
  scope: {
    eyebrow: 'Alcance de la Revisión',
    headline: 'Lo que cubre nuestro Servicio de Revisión de HDS',
    body: 'Validamos los datos de transporte de las Hojas de Datos de Seguridad contra las ediciones vigentes de IATA DGR, Código IMDG, ADR y requisitos GHS — identificando errores, datos desactualizados e inconsistencias antes de que ingresen a la documentación de sus embarques.',
    items: [
      {
        Icon: Search,
        title: 'Verificación de Clasificación de Transporte — Sección 14',
        desc: 'Número ONU, nombre de embarque apropiado, clase de peligro, grupo de embalaje y condición de contaminante marino verificados contra las ediciones vigentes de IATA DGR e IMDG.',
      },
      {
        Icon: ClipboardCheck,
        title: 'Revisión Multimodal de Datos de Transporte',
        desc: 'Datos de transporte de la Sección 14 revisados para vía aérea (IATA), marítima (IMDG) y terrestre (ADR/SCT), identificando discrepancias modales en clasificación o grupo de embalaje.',
      },
      {
        Icon: RefreshCw,
        title: 'Validación de Vigencia de Edición',
        desc: 'Año de edición de la HDS comparado contra IATA DGR e IMDG Code vigentes, para señalar documentos que referencian instrucciones de embalaje reemplazadas o disposiciones especiales derogadas.',
      },
      {
        Icon: FileText,
        title: 'Reporte de Clasificación Corregida',
        desc: 'Cuando la Sección 14 contiene errores, emitimos un reporte escrito de corrección con los datos de clasificación precisos y la referencia regulatoria aplicable para sus registros y comunicación con el proveedor.',
      },
      {
        Icon: Database,
        title: 'Auditoría de Biblioteca de HDS',
        desc: 'Para operaciones con múltiples productos, revisamos su biblioteca completa de HDS y creamos un listado maestro de clasificación verificado para uso interno.',
      },
    ],
  },
  why: {
    headline: 'La exactitud en la clasificación comienza en la HDS',
    body: 'Nuestros especialistas están formados para leer la Sección 14 de forma crítica — no para aceptarla como dato definitivo. Verificamos contra las fuentes regulatorias primarias, no contra otras HDS.',
    points: [
      {
        Icon: ShieldCheck,
        title: 'Verificación en Fuente Primaria',
        desc: 'Validamos los datos de la Sección 14 contra el texto regulatorio primario — IATA DGR, Código IMDG, ADR — no contra bases de datos de terceros ni contra otras HDS.',
      },
      {
        Icon: Award,
        title: 'Dominio de GHS y Normativa de Transporte',
        desc: 'Nuestros revisores cuentan con certificaciones GHS y DG de transporte — lo que permite revisar simultáneamente la clasificación de peligros y los requisitos específicos de transporte.',
      },
      {
        Icon: RefreshCw,
        title: 'Actualización Anual de Biblioteca de HDS',
        desc: 'Ofrecemos ciclos recurrentes de revisión de HDS alineados con las actualizaciones de IATA DGR e IMDG — para mantener su biblioteca de clasificación siempre vigente.',
      },
      {
        Icon: Lock,
        title: 'Trazabilidad Documental Verificada',
        desc: 'Cada revisión queda documentada con la referencia regulatoria, edición y fecha de verificación — generando un registro de cumplimiento defendible ante cualquier requerimiento regulatorio.',
      },
    ],
  },
  cta: {
    headline: 'Verifique los datos de transporte de su HDS antes de que sean un problema',
    sub: 'Nuestros especialistas revisan la Sección 14 de su Hoja de Datos de Seguridad contra los requisitos vigentes de IATA DGR e IMDG — y emiten un reporte escrito de corrección para cada error identificado.',
  },
};

// ── Cumplimiento DG Transfronterizo ───────────────────────────────────────────

const cumplimientoTransfronterizoData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-ground-transport.webp',
    eyebrow: 'SCT · DOT 49 CFR · IATA DGR · IMDG · Operaciones México–Estados Unidos',
    headline: 'Cumplimiento DG Transfronterizo —',
    highlighted: 'Un embarque. Dos sistemas regulatorios.',
    sub: 'Un embarque de mercancías peligrosas que cruza la frontera México–EUA debe cumplir simultáneamente con SCT y DOT 49 CFR — y no siempre coinciden. Resolvemos los conflictos antes de que su carga llegue al puerto de entrada.',
  },
  risk: {
    headline: 'Dónde fallan los embarques transfronterizos de mercancías peligrosas',
    body: 'Los fallos de cumplimiento DG transfronterizo no ocurren en las instalaciones del embarcador — ocurren en la frontera, cuando un inspector de CBP o SCT detecta un error documental que detiene el embarque.',
    items: [
      {
        Icon: Globe,
        title: 'Conforme con SCT, No Conforme con DOT',
        desc: 'El embalaje y etiquetado que cumple plenamente con la regulación SCT mexicana puede fallar los requisitos de DOT 49 CFR en la entrada a EUA. Los dos marcos normativos no son equivalentes.',
      },
      {
        Icon: FileWarning,
        title: 'Conflictos en el Formato de la Documentación',
        desc: 'La información de respuesta a emergencias, los requisitos de marcado de vehículos y los formatos de certificación del embarcador difieren entre SCT y DOT. Un documento válido para México puede ser rechazado en la frontera con EUA.',
      },
      {
        Icon: PackageX,
        title: 'Aceptación del Embalaje en Destino',
        desc: 'La certificación ONU reconocida bajo SCT puede no ser aceptada bajo DOT para determinadas clases de materiales. Los embarques transfronterizos deben embalarse conforme al estándar más restrictivo.',
      },
      {
        Icon: RefreshCw,
        title: 'Reclasificación en Cambio de Modo',
        desc: 'Un embarque terrestre que transita a vía aérea o marítima en la frontera requiere reclasificación bajo IATA DGR o IMDG — que puede diferir de la clasificación terrestre utilizada en México.',
      },
    ],
  },
  scope: {
    eyebrow: 'Alcance del Cumplimiento',
    headline: 'Lo que cubre nuestro Servicio DG Transfronterizo',
    body: 'Preparamos su embarque de mercancías peligrosas para cumplir simultáneamente con los requisitos SCT de México y DOT de EUA — con revisión de documentación, embalaje y coordinación para el cruce fronterizo.',
    items: [
      {
        Icon: Search,
        title: 'Revisión de Clasificación Dual',
        desc: 'Número ONU, nombre de embarque apropiado, clase de peligro y grupo de embalaje verificados bajo SCT y DOT 49 CFR para identificar discrepancias antes de preparar el embarque.',
      },
      {
        Icon: FileText,
        title: 'Preparación de Documentación Transfronteriza',
        desc: 'Papeles de embarque, documentación de respuesta a emergencias y certificación del embarcador preparados para satisfacer simultáneamente los requisitos regulatorios mexicanos y estadounidenses.',
      },
      {
        Icon: PackageX,
        title: 'Evaluación de Compatibilidad del Embalaje',
        desc: 'Embalaje revisado contra los requisitos SCT y DOT. Cuando entran en conflicto, identificamos el estándar más restrictivo y recomendamos alternativas conformes.',
      },
      {
        Icon: MapPin,
        title: 'Mapeo de Cumplimiento por Puerto de Entrada',
        desc: 'Para rutas regulares, documentamos los requisitos específicos de cumplimiento en cada puerto de entrada — para que su equipo disponga de una lista de verificación por ruta, no de una guía genérica.',
      },
      {
        Icon: Globe,
        title: 'Soporte en Transición Modal',
        desc: 'Cuando embarques terrestres pasan a vía aérea o marítima en la frontera, gestionamos la reclasificación modal y la actualización documental bajo IATA DGR o IMDG.',
      },
    ],
  },
  why: {
    headline: 'Especialización transfronteriza que mantiene la carga en movimiento',
    body: 'Hemos gestionado embarques de mercancías peligrosas México–EUA y México–Canadá en los sectores farmacéutico, químico e industrial — y conocemos con precisión dónde cada marco regulatorio genera fricción operativa.',
    points: [
      {
        Icon: ShieldCheck,
        title: 'Ambos Marcos. Un Solo Equipo.',
        desc: 'Nuestros especialistas están certificados en requisitos SCT y DOT 49 CFR — sin traspasos entre un experto mexicano y uno estadounidense a mitad del proceso de su embarque.',
      },
      {
        Icon: MapPin,
        title: 'Cumplimiento a Nivel de Ruta',
        desc: 'Trabajamos con puertos de entrada específicos, no con marcos regulatorios abstractos. Nuestra orientación refleja lo que realmente ocurre en la frontera, no solo lo que dice el reglamento.',
      },
      {
        Icon: RefreshCw,
        title: 'Seguimiento de Cambios Regulatorios',
        desc: 'Las enmiendas anuales de DOT 49 CFR y las actualizaciones regulatorias SCT se monitorean e incorporan a nuestra orientación de cumplimiento en cuanto entran en vigor.',
      },
      {
        Icon: Clock,
        title: 'Revisión de Cumplimiento Previa a la Salida',
        desc: 'Ofrecemos una verificación final de cumplimiento antes de cualquier embarque transfronterizo de mercancías peligrosas — la última oportunidad de detectar un conflicto documental antes de que se convierta en una retención en frontera.',
      },
    ],
  },
  cta: {
    headline: 'Mueva mercancías peligrosas a través de la frontera sin retenciones',
    sub: 'Nuestros especialistas en DG transfronterizo preparan su embarque para cumplir simultáneamente con SCT y DOT 49 CFR — para que cruce la frontera al primer intento.',
  },
};

// ── Exportaciones de Páginas ──────────────────────────────────────────────────

export function CumplimientoDGPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Cumplimiento DG | Clasificación y Documentación | Global Gate México',
    description: 'Ciclo completo de cumplimiento para mercancías peligrosas: clasificación, validación de embalaje y declaración DG preparada por especialistas certificados IATA e IMDG.',
    canonical: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/cumplimiento-dg',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/cumplimiento-dg' },
      { lang: 'en', href: 'https://globalgatemexico.com/dg-compliance/dg-compliance' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dg-compliance/dg-compliance' },
    ],
  });
  return <CompliancePageTemplate data={cumplimientoDGData} lang="ES" />;
}

export function ConsultoriaRegulatoriaPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Consultoría Regulatoria DG | IATA · IMDG · SCT · DOT | Global Gate México',
    description: 'Consultoría especializada en normativa de mercancías peligrosas: IATA DGR, Código IMDG, DOT 49 CFR y SCT NOM. Orientación de cumplimiento en la edición vigente para sus productos y rutas.',
    canonical: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/consultoria-regulatoria',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/consultoria-regulatoria' },
      { lang: 'en', href: 'https://globalgatemexico.com/dg-compliance/regulatory-consulting' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dg-compliance/regulatory-consulting' },
    ],
  });
  return <CompliancePageTemplate data={consultoriaRegulatoriaData} lang="ES" />;
}

export function AuditoriasCumplimientoPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Auditorías de Cumplimiento DG | Internas y Pre-Inspección | Global Gate México',
    description: 'Auditorías estructuradas de cumplimiento DG para documentación, clasificación, embalaje y registros de capacitación. Reportes de brechas con planes de acción priorizados.',
    canonical: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/auditorias-cumplimiento',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/auditorias-cumplimiento' },
      { lang: 'en', href: 'https://globalgatemexico.com/dg-compliance/compliance-audits' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dg-compliance/compliance-audits' },
    ],
  });
  return <CompliancePageTemplate data={auditoriasData} lang="ES" />;
}

export function RevisionHDSPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Revisión de HDS | Clasificación de Transporte Sección 14 | Global Gate México',
    description: 'Datos de transporte de la Sección 14 verificados contra IATA DGR e IMDG vigentes. Reporte escrito de corrección para errores identificados en su biblioteca de HDS.',
    canonical: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/revision-hds',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/revision-hds' },
      { lang: 'en', href: 'https://globalgatemexico.com/dg-compliance/sds-review' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dg-compliance/sds-review' },
    ],
  });
  return <CompliancePageTemplate data={revisionHDSData} lang="ES" />;
}

export function CumplimientoTransfronterizoPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);
  usePageMeta({
    title: 'Cumplimiento DG Transfronterizo | México–EUA | SCT y DOT | Global Gate México',
    description: 'Cumplimiento DG para embarques transfronterizos México–EUA bajo SCT y DOT 49 CFR simultáneamente. Revisión de documentación, embalaje y coordinación para cruce fronterizo.',
    canonical: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/cumplimiento-dg-transfronterizo',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/es/consultoria-cumplimiento-dg/cumplimiento-dg-transfronterizo' },
      { lang: 'en', href: 'https://globalgatemexico.com/dg-compliance/cross-border-dg-compliance' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/dg-compliance/cross-border-dg-compliance' },
    ],
  });
  return <CompliancePageTemplate data={cumplimientoTransfronterizoData} lang="ES" />;
}
