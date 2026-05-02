import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'ES';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.industries': 'Industries',
    'nav.compliance': 'Compliance',
    'nav.training': 'Training',
    'nav.contact': 'Contact',
    'nav.news': 'News',
    'nav.quote': 'Request a Quote',
    'nav.quoteBtn': 'QUOTE HERE',
    'nav.excellence': 'Operational Excellence • Global Reach',

    // Hero
    'hero.title': '"If your DG shipment doesn’t comply, it doesn’t move."',
    'hero.subtitle': 'Avoid rejections, fines, and delays in your dangerous goods shipments from Mexico to anywhere in the world. Full compliance. Zero margin for error.',
    'hero.micro': 'For companies that cannot afford compliance mistakes.',
    'hero.cta.quote': 'Schedule Free Diagnostic (30 min)',
    'hero.cta.secondary': 'Check My Shipment',
    'hero.cta.training': 'Training Services',

    // Empathy (Problem)
    'empathy.title': 'The problem is not transportation. It’s compliance.',
    'empathy.subtitle': 'Most dangerous goods shipments don’t fail because of logistics. They fail because they don’t comply.',
    'empathy.pain1': 'Incorrect classification',
    'empathy.pain2': 'Incomplete documentation',
    'empathy.pain3': 'Non-compliant packaging',
    'empathy.pain4': 'Misinterpretation of regulations',
    'empathy.closing': 'You only discover the problem when it’s already too late.',

    // Consequences
    'consequences.title': 'In dangerous goods, mistakes are not operational. They are legal.',
    'consequences.item1': 'Shipment rejections',
    'consequences.item2': 'Fines and penalties',
    'consequences.item3': 'Client dissatisfaction',
    'consequences.item4': 'Lost time and money',
    'consequences.closing': 'Compliance seems expensive… until you don’t have it.',

    // Stats
    'stats.experience': 'Years of Experience',
    'stats.companies': 'Companies Served',
    'stats.countries': 'Countries Reached',
    'stats.training': 'Training Sessions',
    'stats.shipments': 'Specialized Shipments',

    // About (Solution)
    'about.label': 'WE ENSURE ACCEPTANCE',
    'about.title': 'We don’t move dangerous goods. We ensure they are accepted.',
    'about.subtitle': 'Before your shipment moves, we already know if it will be accepted or rejected.',
    'about.item1': 'Dangerous Goods Classification',
    'about.item1.desc': 'We determine whether your product is regulated as Dangerous Goods under applicable transport regulations.',
    'about.item2': 'Product Identification',
    'about.item2.desc': 'We assign the correct UN Number, Proper Shipping Name, hazard class, and packing group for transport.',
    'about.item3': 'UN Packaging Selection',
    'about.item3.desc': 'We select the proper UN-certified packaging based on quantity, packaging type, and mode of transport.',
    'about.item4': 'Marking & Labelling Compliance',
    'about.item4.desc': 'We apply all required hazard labels, handling marks, and package identification in full compliance.',
    'about.item5': 'Documentation Preparation',
    'about.item5.desc': 'We prepare the Dangerous Goods Declaration and all mandatory transport documentation accurately.',
    'about.item6': 'Transportation Execution',
    'about.item6.desc': 'We coordinate safe and compliant ground, air, or ocean transportation through authorized carriers.',
    'about.cta': 'How We Work',
    'about.quote': '"We don\'t just move cargo; we manage the risks that others avoid."',
    'about.quote.author': '— Industrial Compliance Board',

    // Services
    'services.title': 'Specialized Capabilities',
    'services.viewAll': 'VIEW ALL SERVICES →',

    // Industries (Target)
    'industries.sublabel': 'IS THIS FOR YOU?',
    'industries.label': 'This is for you if:',
    'industries.reach': 'Expertise Areas',
    'industries.mapLabel': 'Global Reach',
    'target.col1.item1': 'You export dangerous goods',
    'target.col1.item2': 'You need compliance certainty',
    'target.col1.item3': 'You lack internal DG expertise',
    'target.col2.item1': 'You’ve experienced rejections',
    'target.col2.item2': 'You have urgent shipments',
    'target.col2.item3': 'You face regulatory uncertainty',

    // Compliance (Authority)
    'compliance.heading': 'Certified compliance. Not theory.',
    'compliance.subheading': 'The only company in Mexico certified as IATA CBTA Provider and IATA Cargo Agent.',
    'compliance.cred1.title': 'DGTA Board Member',
    'compliance.cred1.desc': 'DGTA member and delegate to the UN Sub-Committee of Experts on the Transport of Dangerous Goods.',
    'compliance.cred2.title': 'Certified DG Professional (CDGP)',
    'compliance.cred2.desc': 'Certified by the Institute of Hazardous Materials Management (IHMM), USA. Internationally recognized dangerous goods certification.',
    'compliance.cred3.title': 'DG Safety Advisor (DGSA)',
    'compliance.cred3.desc': 'Certified by the Scottish Qualifications Authority (SQA), UK. Qualified to advise on the transport of dangerous goods according to ADR and RID.',
    'compliance.cred4.title': 'IATA Certified DG Trainer',
    'compliance.cred4.desc': 'Authorized by IATA to train and certify personnel in the safe handling and transport of dangerous goods by air.',
    'compliance.cred5.title': 'IATA CBTA Provider',
    'compliance.cred5.desc': 'Authorized IATA Competency-Based Training and Assessment provider for dangerous goods personnel certification.',
    'compliance.cred6.title': 'IATA Cargo Agent',
    'compliance.cred6.desc': 'Certified IATA Cargo Agent, authorized to handle and coordinate international air freight shipments.',
    'authority.closing': 'No one has these credentials as a DG Authority in Mexico.',

    // Reach (Process)
    'reach.label': 'NO MARGIN FOR ERROR',
    'reach.title': 'A simple process. No margin for error.',
    'reach.hub1.city': '1. Diagnostic',
    'reach.hub1.desc': 'We analyze your product and destination.',
    'reach.hub2.city': '2. Preparation',
    'reach.hub2.desc': 'We prepare packages for transport according to regulations.',
    'reach.hub3.city': '3. Validation',
    'reach.hub3.desc': 'We verify compliance before shipping.',
    'reach.hub4.city': '4. Execution',
    'reach.hub4.desc': 'We coordinate transport.',
    'reach.keyline': "If it doesn’t pass validation, it doesn’t move forward.",

    // Objections
    'objections.title': "What you’re probably thinking",
    'objections.item1.q': "Too expensive",
    'objections.item1.a': "More expensive is a rejected shipment",
    'objections.item2.q': "We already have a provider",
    'objections.item2.a': "Do they guarantee compliance or just transport?",
    'objections.item3.q': "We’re not sure",
    'objections.item3.a': "That’s why we start with a diagnostic",

    // Testimonials
    'testimonials.title': 'Professional Trust',

    // News
    'news.title': 'Latest Insights',
    'news.viewAll': 'VIEW ALL NEWS →',

    // Contact (Final CTA)
    'finalcta.support': '24/7 EXPERT SUPPORT',
    'contact.title': 'Validate Your Dangerous Goods Shipment',
    'contact.subtitle': 'Share your shipment details and our specialists will review the compliance requirements before transport.',
    'contact.field.name': 'Full Name',
    'contact.field.company': 'Company',
    'contact.field.email': 'Corporate Email',
    'contact.field.phone': 'Phone Number',
    'contact.field.merchandise': 'Type of Merchandise',
    'contact.btn.next': 'Next – Validate Shipment',
    'contact.field.origin': 'Origin (City / Country)',
    'contact.field.destination': 'Destination (City / Country)',
    'contact.field.transport': 'Mode of Transport',
    'contact.field.transport.air': 'Air',
    'contact.field.transport.ground': 'Ground',
    'contact.field.transport.ocean': 'Ocean',
    'contact.field.transport.notSure': 'Not Sure',
    'contact.field.sds': 'SDS or Technical Data Sheet',
    'contact.field.dims': 'Weight and Dimensions',
    'contact.field.photos': 'Photos of product and packaging',
    'contact.field.quantity': 'Net quantity per inner packaging or UN specification packaging',
    'contact.field.quantity.helper': 'Example: 10 boxes with 3 bottles each, 5 L per bottle',
    'contact.field.instructionSupport': 'I need support completing the instruction letter',
    'contact.field.instructionFile': 'Instruction letter (optional)',
    'contact.field.emergencyContact': '24-Hour Emergency Contact (Optional)',
    'contact.field.emergencyContactHelper': 'If available, please provide the emergency contact information. If not, our team will request it during the compliance review.',
    'contact.field.emergencyName': 'Contact Name',
    'contact.field.emergencyPhone': 'Contact Phone',
    'contact.field.details': 'Type of Merchandise...',
    'contact.field.consent': 'I agree to the privacy policy.',
    'contact.cta': 'Validate My DG Shipment',
    'contact.success.title': 'Shipment Details Received',
    'contact.success.msg': 'Thank you. Our team will review your dangerous goods shipment details and supporting documents. If additional information is required, we will contact you directly.',
    'contact.success.cta': 'Book My Call Now',

    // Footer
    'footer.copy': 'Global Gate Mexico. Specialized Logistics & Compliance.',
    'footer.linkedin': 'LinkedIn',
    'footer.privacy': 'Privacy Policy',

    // Internal Pages
    'page.about.title': 'About Us',
    'page.about.desc': 'The authority in specialized logistics and hazardous material compliance in Mexico.',
    'page.about.mission.title': 'Mission & Integrity',
    'page.about.mission.text1': '"To provide total security and regulatory peace of mind to our clients by managing the world\'s most sensitive cargo through technical excellence and operational precision."',
    'page.about.mission.text2': 'Global Gate Mexico was founded on the principle that dangerous goods require more than just transport—they require deep technical understanding. Today, we are the preferred partner for chemical, energy, and healthcare industries across the North American corridor.',
    'page.about.values.title': 'Our Core Values',
    'page.about.value1.title': 'Safety First',
    'page.about.value1.desc': 'Zero-compromise approach to risk management.',
    'page.about.value2.title': 'Technical Mastery',
    'page.about.value2.desc': 'Deep expertise in international regulatory frameworks.',
    'page.about.value3.title': 'Operational Precision',
    'page.about.value3.desc': 'Flawless execution in every shipment.',
    'page.about.value4.title': 'Integrity',
    'page.about.value4.desc': 'Transparent communication and ethical compliance.',

    'page.services.title': 'Our Services',
    'page.services.desc': 'Specialized solutions for the safe transport and management of dangerous goods and industrial materials.',
    'page.services.cta': 'Schedule a Consultation',
    'page.services.consultation': 'Need a tailored compliance strategy?',
    'page.services.consultation.desc': 'Our consulting team specializes in interpreting complex regulatory frameworks for SCT and global logistics corridors.',
    'page.services.specs': 'Technical Specifications',
    'page.training.title': 'Specialized Training',
    'page.training.desc': 'International certification and regulatory courses for handling dangerous goods and industrial safety.',
  },
  ES: {
    // Navbar
    'nav.home': 'Inicio',
    'nav.about': 'Nosotros',
    'nav.services': 'Servicios',
    'nav.industries': 'Industrias',
    'nav.compliance': 'Cumplimiento',
    'nav.training': 'Cursos',
    'nav.contact': 'Contacto',
    'nav.news': 'Noticias',
    'nav.quote': 'Solicitar Cotización',
    'nav.quoteBtn': 'COTIZA AQUÍ',
    'nav.excellence': 'Excelencia Operativa • Alcance Global',

    // Hero
    'hero.title': '"Si su envío de mercancías peligrosas no cumple, no se mueve."',
    'hero.subtitle': 'Evite rechazos, multas y retrasos en sus envíos de mercancías peligrosas desde México a cualquier parte del mundo. Cumplimiento total. Cero margen de error.',
    'hero.micro': 'Para empresas que no pueden permitirse errores de cumplimiento.',
    'hero.cta.quote': 'Agendar Diagnóstico Gratuito (30 min)',
    'hero.cta.secondary': 'Verificar mi Envío',
    'hero.cta.training': 'Servicios de Capacitación',

    // Empathy (Problem)
    'empathy.title': 'El problema no es el transporte. Es el cumplimiento.',
    'empathy.subtitle': 'La mayoría de los envíos de mercancías peligrosas no fallan por la logística. Fallan porque no cumplen con la normativa.',
    'empathy.pain1': 'Clasificación incorrecta',
    'empathy.pain2': 'Documentación incompleta',
    'empathy.pain3': 'Embalaje no conforme',
    'empathy.pain4': 'Mala interpretación de las regulaciones',
    'empathy.closing': 'Solo descubres el problema cuando ya es demasiado tarde.',

    // Consequences
    'consequences.title': 'En mercancías peligrosas, los errores no son operativos. Son legales.',
    'consequences.item1': 'Rechazos de envíos',
    'consequences.item2': 'Multas y sanciones',
    'consequences.item3': 'Insatisfacción del cliente',
    'consequences.item4': 'Pérdida de tiempo y dinero',
    'consequences.closing': 'El cumplimiento parece caro... hasta que no lo tienes.',

    // Stats
    'stats.experience': 'Años de Experiencia',
    'stats.companies': 'Empresas Atendidas',
    'stats.countries': 'Países Alcanzados',
    'stats.training': 'Sesiones de Capacitación',
    'stats.shipments': 'Envíos Especializados',

    // About (Solution)
    'about.label': 'ASEGURAMOS LA ACEPTACIÓN',
    'about.title': 'No movemos mercancías peligrosas. Aseguramos que sean aceptadas.',
    'about.subtitle': 'Antes de que su envío se mueva, ya sabemos si será aceptado o rechazado.',
    'about.item1': 'Clasificación de Mercancías Peligrosas',
    'about.item1.desc': 'Determinamos si su producto está regulado como Mercancía Peligrosa bajo las regulaciones de transporte aplicables.',
    'about.item2': 'Identificación de Configuración de Envío',
    'about.item2.desc': 'Asignamos el número ONU correcto, nombre de embarque apropiado, clase de peligro y grupo de embalaje para el transporte.',
    'about.item3': 'Selección de Embalaje ONU',
    'about.item3.desc': 'Seleccionamos el embalaje certificado ONU correcto según la cantidad, tipo de embalaje y modo de transporte.',
    'about.item4': 'Cumplimiento de Marcado y Etiquetado',
    'about.item4.desc': 'Aplicamos todas las etiquetas de riesgo, marcas de manejo e identificación de paquete requeridas en pleno cumplimiento.',
    'about.item5': 'Preparación de Documentación',
    'about.item5.desc': 'Preparamos la Declaración de Mercancías Peligrosas y toda la documentación de transporte obligatoria con precisión.',
    'about.item6': 'Ejecución del Transporte',
    'about.item6.desc': 'Coordinamos el transporte terrestre, aéreo o marítimo seguro y conforme a través de transportistas autorizados.',
    'about.cta': 'Cómo Trabajamos',
    'about.quote': '"No solo movemos carga; gestionamos los riesgos que otros evitan."',
    'about.quote.author': '— Junta de Cumplimiento Industrial',

    // Services
    'services.title': 'Capacidades Especializadas',
    'services.viewAll': 'VER TODOS LOS SERVICIOS →',

    // Industries (Target)
    'industries.sublabel': '¿ES ESTO PARA USTED?',
    'industries.label': 'Esto es para usted si:',
    'industries.reach': 'Áreas de Experiencia',
    'industries.mapLabel': 'Alcance Global',
    'target.col1.item1': 'Exporta mercancías peligrosas',
    'target.col1.item2': 'Necesita certeza de cumplimiento',
    'target.col1.item3': 'Carece de experiencia interna en DG',
    'target.col2.item1': 'Ha experimentado rechazos',
    'target.col2.item2': 'Tiene envíos urgentes',
    'target.col2.item3': 'Enfrenta incertidumbre regulatoria',

    // Compliance (Authority)
    'compliance.heading': 'Cumplimiento certificado. No teoría.',
    'compliance.subheading': 'La única empresa en México certificada como IATA CBTA Provider e IATA Cargo Agent.',
    'compliance.cred1.title': 'Miembro del Consejo DGTA',
    'compliance.cred1.desc': 'Miembro de la DGTA y delegado ante el Subcomité de Expertos de la ONU sobre el Transporte de Mercancías Peligrosas.',
    'compliance.cred2.title': 'Profesional Certificado DG (CDGP)',
    'compliance.cred2.desc': 'Certificado por el Institute of Hazardous Materials Management (IHMM), EUA. Certificación de mercancías peligrosas reconocida internacionalmente.',
    'compliance.cred3.title': 'Asesor de Seguridad DG (DGSA)',
    'compliance.cred3.desc': 'Certificado por la Scottish Qualifications Authority (SQA), Reino Unido. Calificado para asesorar el transporte de mercancías peligrosas conforme al ADR y RID.',
    'compliance.cred4.title': 'Instructor Certificado IATA DG',
    'compliance.cred4.desc': 'Autorizado por IATA para capacitar y certificar personal en el manejo y transporte seguro de mercancías peligrosas por vía aérea.',
    'compliance.cred5.title': 'IATA CBTA Provider',
    'compliance.cred5.desc': 'Proveedor autorizado IATA de Capacitación y Evaluación Basada en Competencias para la certificación de personal DG.',
    'compliance.cred6.title': 'IATA Cargo Agent',
    'compliance.cred6.desc': 'Agente de Carga IATA certificado, autorizado para gestionar y coordinar envíos internacionales de carga aérea.',
    'authority.closing': 'Nadie tiene estas credenciales como Autoridad DG en México.',

    // Reach (Process)
    'reach.label': 'SIN MARGEN DE ERROR',
    'reach.title': 'Un proceso sencillo. Sin margen de error.',
    'reach.hub1.city': '1. Diagnóstico',
    'reach.hub1.desc': 'Analizamos su producto y destino.',
    'reach.hub2.city': '2. Preparación',
    'reach.hub2.desc': 'Preparamos los paquetes para su transporte conforme a las regulaciones.',
    'reach.hub3.city': '3. Validación',
    'reach.hub3.desc': 'Verificamos el cumplimiento antes del envío.',
    'reach.hub4.city': '4. Ejecución',
    'reach.hub4.desc': 'Coordinamos el transporte.',
    'reach.keyline': 'Si no pasa la validación, no avanza.',

    // Objections
    'objections.title': 'Lo que probablemente esté pensando',
    'objections.item1.q': "¿Demasiado caro?",
    'objections.item1.a': "Más caro es un envío rechazado",
    'objections.item2.q': "¿Ya tenemos un proveedor?",
    'objections.item2.a': "¿Garantizan el cumplimiento o solo el transporte?",
    'objections.item3.q': "¿No estamos seguros?",
    'objections.item3.a': "Por eso empezamos con un diagnóstico",

    // Testimonials
    'testimonials.title': 'Confianza Profesional',

    // News
    'news.title': 'Últimas Perspectivas',
    'news.viewAll': 'VER TODAS LAS NOTICIAS →',

    // Contact (Final CTA)
    'finalcta.support': 'SOPORTE EXPERTO 24/7',
    'contact.title': 'Valide su Envío de Mercancías Peligrosas',
    'contact.subtitle': 'Comparta los detalles de su envío y nuestros especialistas revisarán los requisitos de cumplimiento antes del transporte.',
    'contact.field.name': 'Nombre Completo',
    'contact.field.company': 'Empresa',
    'contact.field.email': 'Correo Corporativo',
    'contact.field.phone': 'Número de Teléfono',
    'contact.field.merchandise': 'Tipo de Mercancía',
    'contact.btn.next': 'Siguiente – Validar Envío',
    'contact.field.origin': 'Origen (Ciudad / País)',
    'contact.field.destination': 'Destino (Ciudad / País)',
    'contact.field.transport': 'Modo de Transporte',
    'contact.field.transport.air': 'Aéreo',
    'contact.field.transport.ground': 'Terrestre',
    'contact.field.transport.ocean': 'Marítimo',
    'contact.field.transport.notSure': 'No estoy seguro',
    'contact.field.sds': 'HDS o Hoja de Datos Técnicos',
    'contact.field.dims': 'Peso y Dimensiones',
    'contact.field.photos': 'Fotos del producto y embalaje',
    'contact.field.quantity': 'Cantidad neta por embalaje interior o embalaje de especificación ONU',
    'contact.field.quantity.helper': 'Ejemplo: 10 cajas con 3 botellas cada una, 5 L por botella',
    'contact.field.instructionSupport': 'Necesito apoyo para completar la carta de instrucciones',
    'contact.field.instructionFile': 'Carta de instrucciones (opcional)',
    'contact.field.emergencyContact': 'Contacto de Emergencia 24 Horas (Opcional)',
    'contact.field.emergencyContactHelper': 'Si está disponible, proporcione la información del contacto de emergencia. De lo contrario, nuestro equipo la solicitará durante la revisión de cumplimiento.',
    'contact.field.emergencyName': 'Nombre del Contacto',
    'contact.field.emergencyPhone': 'Teléfono del Contacto',
    'contact.field.details': 'Tipo de Mercancía...',
    'contact.field.consent': 'Acepto la política de privacidad.',
    'contact.cta': 'Validar mi Envío de DG',
    'contact.success.title': 'Detalles del Envío Recibidos',
    'contact.success.msg': 'Gracias. Nuestro equipo revisará los detalles de su envío de mercancías peligrosas y los documentos adjuntos. Si se requiere información adicional, nos comunicaremos con usted directamente.',
    'contact.success.cta': 'Agendar mi Llamada Ahora',

    // Footer
    'footer.copy': 'Global Gate México. Logística y Cumplimiento Especializados.',
    'footer.linkedin': 'LinkedIn',
    'footer.privacy': 'Política de Privacidad',

    // Internal Pages
    'page.about.title': 'Nosotros',
    'page.about.desc': 'La autoridad en logística especializada y cumplimiento de materiales peligrosos en México.',
    'page.about.mission.title': 'Misión e Integridad',
    'page.about.mission.text1': '"Brindar total seguridad y tranquilidad regulatoria a nuestros clientes gestionando la carga más sensible del mundo mediante la excelencia técnica y la precisión operativa."',
    'page.about.mission.text2': 'Global Gate México se fundó sobre el principio de que las mercancías peligrosas requieren más que solo transporte: requieren un profundo entendimiento técnico. Hoy, somos el socio preferido de las industrias química, energética y de salud en todo el corredor de América del Norte.',
    'page.about.values.title': 'Nuestros Valores Centrales',
    'page.about.value1.title': 'La Seguridad Primero',
    'page.about.value1.desc': 'Enfoque sin compromisos en la gestión de riesgos.',
    'page.about.value2.title': 'Maestría Técnica',
    'page.about.value2.desc': 'Profunda experiencia en marcos regulatorios internacionales.',
    'page.about.value3.title': 'Precisión Operativa',
    'page.about.value3.desc': 'Ejecución impecable en cada envío.',
    'page.about.value4.title': 'Integridad',
    'page.about.value4.desc': 'Comunicación transparente y cumplimiento ético.',

    'page.services.title': 'Nuestros Servicios',
    'page.services.desc': 'Soluciones especializadas para el transporte y gestión segura de mercancías peligrosas y materiales industriales.',
    'page.services.cta': 'Programar una Consulta',
    'page.services.consultation': '¿Necesita una estrategia de cumplimiento a medida?',
    'page.services.consultation.desc': 'Nuestro equipo de consultoría se especializa en interpretar marcos regulatorios complejos para la SCT y los corredores logísticos globales.',
    'page.services.specs': 'Especificaciones Técnicas',
    'page.training.title': 'Capacitación Especializada',
    'page.training.desc': 'Cursos de certificación internacional y normativa para el manejo de mercancías peligrosas y seguridad industrial.',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
