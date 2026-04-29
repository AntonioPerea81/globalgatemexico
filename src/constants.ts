import { Service, Stat, Industry, Testimonial, NewsItem } from './types';

export const SERVICES: (Service & { titleEs?: string; descriptionEs?: string })[] = [
  {
    id: 'dg-transport',
    title: 'Dangerous Goods Transportation',
    titleEs: 'Transporte de Mercancías Peligrosas',
    description: 'Expert cross-border handling and transport of hazardous materials according to international standards.',
    descriptionEs: 'Manejo y transporte transfronterizo experto de materiales peligrosos según estándares internacionales.',
    icon: 'Truck'
  },
  {
    id: 'compliance',
    title: 'Regulatory Compliance Consulting',
    titleEs: 'Consultoría en Cumplimiento Normativo',
    description: 'Specialized guidance on SCT, SEMARNAT, and international regulatory frameworks.',
    descriptionEs: 'Orientación especializada sobre la SCT, SEMARNAT y marcos regulatorios internacionales.',
    icon: 'ShieldCheck'
  },
  {
    id: 'packaging',
    title: 'Specialized Packaging',
    titleEs: 'Embalaje Especializado',
    description: 'UN-certified packaging solutions tailored for specific chemical and radioactive requirements.',
    descriptionEs: 'Soluciones de embalaje certificadas por la ONU adaptadas a requisitos químicos y radiactivos específicos.',
    icon: 'Box'
  },
  {
    id: 'training',
    title: 'Training & Certification',
    titleEs: 'Capacitación y Certificación',
    description: 'Comprehensive programs for IATA, IMDG, and TDG certifications.',
    descriptionEs: 'Programas integrales para las certificaciones IATA, IMDG y TDG.',
    icon: 'GraduationCap'
  },
  {
    id: 'logistics',
    title: 'Cross-Border Logistics',
    titleEs: 'Logística Transfronteriza',
    description: 'Seamless integration between Mexico, USA, and Canada for critical industrial operations.',
    descriptionEs: 'Integración perfecta entre México, EE. UU. y Canadá para operaciones industriales críticas.',
    icon: 'Globe'
  },
  {
    id: 'storage',
    title: 'Storage & Handling',
    titleEs: 'Almacenamiento y Manejo',
    description: 'Secure facilities equipped for specialized hazardous material management.',
    descriptionEs: 'Instalaciones seguras equipadas para la gestión especializada de materiales peligrosos.',
    icon: 'Warehouse'
  },
  {
    id: 'radioactive',
    title: 'Radioactive Material Support',
    titleEs: 'Soporte para Material Radiactivo',
    description: 'Technical expertise in the transportation and management of radioactive materials.',
    descriptionEs: 'Experiencia técnica en el transporte y gestión de materiales radiactivos.',
    icon: 'Radiation'
  },
  {
    id: 'freight',
    title: 'Freight Coordination',
    titleEs: 'Coordinación de Flete',
    description: 'Strategic planning and execution of complex international freight movements.',
    descriptionEs: 'Planificación estratégica y ejecución de movimientos de carga internacionales complejos.',
    icon: 'Navigation'
  }
];

export const STATS: (Stat & { id: string })[] = [
  { id: 'experience', label: 'Years of Experience', value: 20, suffix: '+' },
  { id: 'companies', label: 'Clients Served', value: 150, suffix: '+' },
  { id: 'acceptance', label: 'Shipment Acceptance', value: 98, suffix: '%' },
  { id: 'training', label: 'Training Sessions', value: 1200, suffix: '+' },
];

export const INDUSTRIES: (Industry & { nameEs?: string })[] = [
  { name: 'Chemical', nameEs: 'Química', icon: 'FlaskConical' },
  { name: 'Aerospace', nameEs: 'Aeroespacial', icon: 'Plane' },
  { name: 'Oil & Gas', nameEs: 'Petróleo y Gas', icon: 'Droplets' },
  { name: 'Manufacturing', nameEs: 'Manufactura', icon: 'Factory' },
  { name: 'Healthcare & Pharma', nameEs: 'Salud y Farmacéutica', icon: 'Stethoscope' },
  { name: 'Energy', nameEs: 'Energía', icon: 'Zap' },
  { name: 'Industrial Supply', nameEs: 'Suministro Industrial', icon: 'Hammer' },
  { name: 'Regulated E-commerce', nameEs: 'E-commerce Regulado', icon: 'ShoppingBag' }
];

export const TESTIMONIALS: (Testimonial & { quoteEs?: string; roleEs?: string })[] = [
  {
    name: 'Roberto Sanchez',
    role: 'Operations Manager',
    roleEs: 'Gerente de Operaciones',
    company: 'ChemLogix Mexico',
    quote: 'Global Gate Mexico has been instrumental in our cross-border compliance strategy. Their technical depth is unparalleled.',
    quoteEs: 'Global Gate México ha sido fundamental en nuestra estrategia de cumplimiento transfronterizo. Su profundidad técnica no tiene paralelo.',
    image: 'https://picsum.photos/seed/person1/100/100'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Safety Director',
    roleEs: 'Directora de Seguridad',
    company: 'AeroSpace Solutions',
    quote: 'Their training programs are comprehensive and practical. They don\'t just teach rules; they teach safety culture.',
    quoteEs: 'Sus programas de capacitación son integrales y prácticos. No solo enseñan reglas; enseñan cultura de seguridad.',
    image: 'https://picsum.photos/seed/person2/100/100'
  },
  {
    name: 'Mark Thompson',
    role: 'Logistics Lead',
    roleEs: 'Líder de Logística',
    company: 'US Energy Corp',
    quote: 'Precision and response time are key in our industry. Global Gate delivers both consistently across the border.',
    quoteEs: 'La precisión y el tiempo de respuesta son clave en nuestra industria. Global Gate cumple con ambos de manera constante a través de la frontera.',
    image: 'https://picsum.photos/seed/person3/100/100'
  }
];

export const NEWS: (NewsItem & { titleEs?: string; excerptEs?: string })[] = [
  {
    id: '1',
    date: 'Oct 15, 2025',
    title: 'New Regulatory Updates for TDG 2025',
    titleEs: 'Nuevas Actualizaciones Regulatorias para TDG 2025',
    excerpt: 'Stay ahead of the curve with the latest changes in Mexican transportation of dangerous goods...',
    excerptEs: 'Manténgase a la vanguardia con los últimos cambios en el transporte mexicano de mercancías peligrosas...',
    image: 'https://picsum.photos/seed/logistics1/600/400'
  },
  {
    id: '2',
    date: 'Oct 02, 2025',
    title: 'Expanding Our Reach: New Houston Hub',
    titleEs: 'Ampliando Nuestro Alcance: Nuevo Centro en Houston',
    excerpt: 'Strategic expansion to better serve our cross-border clients with faster response times...',
    excerptEs: 'Expansión estratégica para servir mejor a nuestros clientes transfronterizos con tiempos de respuesta más rápidos...',
    image: 'https://picsum.photos/seed/port/600/400'
  },
  {
    id: '3',
    date: 'Sep 21, 2025',
    title: 'Safety First: Radioactive Handling Best Practices',
    titleEs: 'La Seguridad es Primero: Mejores Prácticas en el Manejo de Radiactivos',
    excerpt: 'A technical guide to minimizing risk during specialized material transit...',
    excerptEs: 'Una guía técnica para minimizar el riesgo durante el tránsito de material especializado...',
    image: 'https://picsum.photos/seed/safety/600/400'
  }
];
