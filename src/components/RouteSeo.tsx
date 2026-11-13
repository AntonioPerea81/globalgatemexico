import { useLocation } from 'react-router-dom';
import { usePageMeta, type HreflangEntry } from '../hooks/usePageMeta';

const SITE_URL = 'https://www.globalgatemexico.com';

const languagePairs: Array<[string, string]> = [
  ['/dangerous-goods-transportation', '/es/transporte-mercancias-peligrosas'],
  ['/dangerous-goods-transportation/air-transportation', '/es/transporte-mercancias-peligrosas/transporte-aereo'],
  ['/dangerous-goods-transportation/ground-transportation', '/es/transporte-mercancias-peligrosas/transporte-terrestre'],
  ['/dangerous-goods-transportation/ocean-freight', '/es/transporte-mercancias-peligrosas/transporte-maritimo'],
  ['/dangerous-goods-transportation/dg-packaging', '/es/transporte-mercancias-peligrosas/embalaje-dg'],
  ['/dangerous-goods-transportation/documentation-services', '/es/transporte-mercancias-peligrosas/servicios-documentacion'],
  ['/dg-compliance/dg-compliance', '/es/consultoria-cumplimiento-dg/cumplimiento-dg'],
  ['/dg-compliance/regulatory-consulting', '/es/consultoria-cumplimiento-dg/consultoria-regulatoria'],
  ['/dg-compliance/compliance-audits', '/es/consultoria-cumplimiento-dg/auditorias-cumplimiento'],
  ['/dg-compliance/sds-review', '/es/consultoria-cumplimiento-dg/revision-hds'],
  ['/dg-compliance/cross-border-dg-compliance', '/es/consultoria-cumplimiento-dg/cumplimiento-dg-transfronterizo'],
  ['/about', '/acerca'],
  ['/radioactive-material-logistics', '/logistica-material-radiactivo'],
  ['/training', '/es/capacitacion'],
  ['/contact', '/contacto'],
  ['/request-quote', '/solicitar-cotizacion'],
  ['/dangerous-goods-ground-transportation', '/transporte-terrestre-mercancias-peligrosas'],
  ['/dg-pre-check', '/revision-previa-dg'],
];

function alternatesFor(pathname: string): HreflangEntry[] | undefined {
  const pair = languagePairs.find(([en, es]) => en === pathname || es === pathname);
  if (!pair) return undefined;
  const [en, es] = pair;
  return [
    { lang: 'en', href: `${SITE_URL}${en === '/' ? '' : en}` },
    { lang: 'es', href: `${SITE_URL}${es === '/' ? '' : es}` },
    { lang: 'x-default', href: `${SITE_URL}${en === '/' ? '' : en}` },
  ];
}

export function RouteSeo() {
  const { pathname } = useLocation();
  const normalizedPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  const isSpanish = pathname.startsWith('/es/') || [
    '/acerca', '/contacto', '/solicitar-cotizacion', '/logistica-material-radiactivo',
    '/transporte-terrestre-mercancias-peligrosas', '/politica-de-privacidad',
    '/aviso-legal', '/terminos-de-servicio', '/condiciones-estandar-de-comercio',
    '/rastreo-de-embarques', '/revision-previa-dg',
  ].includes(pathname);

  const isDgConsulting = normalizedPath === '/dg-consulting-compliance';

  usePageMeta({
    title: isDgConsulting
      ? 'Dangerous Goods Compliance Consulting in Mexico | GGM'
      : 'Global Gate Mexico | Dangerous Goods Logistics & Compliance',
    description: isDgConsulting
      ? 'Get dangerous goods compliance support in Mexico. GGM provides regulatory consulting, compliance audits, SDS reviews and cross-border guidance. Book a consultation.'
      : 'Global Gate Mexico — premium dangerous goods logistics, ADN/IATA/IMDG compliance consulting, and regulatory training across Mexico and North America.',
    canonical: `${SITE_URL}${normalizedPath}`,
    hreflang: alternatesFor(pathname),
    lang: isSpanish ? 'es' : 'en',
  });

  return null;
}
