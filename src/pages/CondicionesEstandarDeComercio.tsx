import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Globe2, Package, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Container } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Exportable constants — import these in forms, emails, and invoices ─────
export const STC_ES_ROUTE = '/condiciones-estandar-de-comercio';
export const STC_PDF_ES   = '/legal/global-gate-mexico-stc-es.pdf';

const ULTIMA_ACTUALIZACION = '26 de mayo de 2026';

// ── Shared prose helpers ───────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '52px' }}>
      <h2 style={{
        fontSize: '15px', fontWeight: 800, color: '#0f172a',
        letterSpacing: '-0.01em', marginBottom: '16px',
        paddingBottom: '10px', borderBottom: '1px solid #e5e7eb',
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.75, marginBottom: '14px' }}>
      {children}
    </p>
  );
}

function UL({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '8px 0 14px 0', paddingLeft: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
          <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '13px', marginTop: '2px', flexShrink: 0 }}>—</span>
          <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const SCOPE_ITEMS = [
  { Icon: Globe2,        label: 'Transporte internacional',  sub: 'Aéreo · Marítimo · Terrestre' },
  { Icon: AlertTriangle, label: 'Mercancías peligrosas',    sub: 'Todas las clases DG' },
  { Icon: Package,       label: 'Almacenamiento',            sub: 'Custodia y despacho' },
  { Icon: ShieldCheck,   label: 'Coordinación aduanera',   sub: 'Importación · Exportación' },
];

// ── Page ───────────────────────────────────────────────────────────────────
export function CondicionesEstandarDeComercioPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Condiciones Estándar de Comercio | Global Gate México',
    description: 'Condiciones Estándar de Comercio de Global Gate México — régimen contractual para agenciamiento de carga, transporte multimodal, mercancías peligrosas y logística internacional.',
    canonical: 'https://globalgatemexico.com/condiciones-estandar-de-comercio',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/condiciones-estandar-de-comercio' },
      { lang: 'en', href: 'https://globalgatemexico.com/standard-trade-conditions' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/condiciones-estandar-de-comercio' },
    ],
  });

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#060e1c', paddingTop: '106px', paddingBottom: '56px',
        position: 'relative', borderBottom: '2px solid #2563eb',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.08) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }} />
        <Container className="relative">
          <p style={{ fontSize: '10px', color: 'rgba(96,165,250,0.8)', textTransform: 'uppercase', letterSpacing: '0.26em', fontWeight: 800, marginBottom: '14px' }}>
            Marco Contractual · Agenciamiento de Carga Internacional
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: '16px' }}>
            Condiciones Estándar<br />de Comercio
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, maxWidth: '540px', marginBottom: '20px' }}>
            Régimen contractual bajo el cual Global Gate México presta sus servicios de agenciamiento de carga, transporte multimodal, manejo de mercancías peligrosas y logística internacional.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>
            Última actualización: {ULTIMA_ACTUALIZACION}
          </p>
        </Container>
      </div>

      {/* ── Scope strip ──────────────────────────────────────────────────── */}
      <div style={{ background: '#0a1628', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Container>
          <div className="flex flex-wrap">
            {SCOPE_ITEMS.map(({ Icon, label, sub }, i) => (
              <div key={i} style={{
                flex: '1 1 160px', padding: '18px 24px',
                borderRight: i < SCOPE_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <Icon size={15} color="rgba(96,165,250,0.5)" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#fff' }}>{label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '64px 0 80px' }}>
        <Container>
          <div style={{ maxWidth: '720px' }}>

            {/* Governing-version note */}
            <div style={{
              background: '#f4f6f9', border: '1px solid #e5e7eb',
              borderLeft: '3px solid #2563eb', borderRadius: '4px',
              padding: '14px 18px', marginBottom: '44px',
            }}>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Esta es la versión oficial vinculante de las Condiciones Estándar de Comercio de Global Gate México. La{' '}
                <Link to="/standard-trade-conditions" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  versión en inglés
                </Link>{' '}
                es de carácter informativo. En caso de discrepancia, prevalecerá la presente versión en español.
              </p>
            </div>

            <Section title="1. Introducción y Aplicabilidad">
              <P>
                Las presentes <strong>Condiciones Estándar de Comercio</strong> ("Condiciones") de <strong>Global Gate México, S. de R.L. de C.V.</strong> ("GGM") establecen el marco contractual que regula la prestación de todos los servicios de agenciamiento de carga, transporte multimodal, logística de mercancías peligrosas y servicios conexos, salvo acuerdo escrito en contrario suscrito entre las partes.
              </P>
              <P>
                Estas Condiciones se fundamentan en las prácticas comerciales reconocidas internacionalmente para el agenciamiento de carga, alineadas con los principios de la <strong>Federación Internacional de Asociaciones de Transitarios y Afines (FIATA)</strong> y los criterios de la <strong>Asociación Mexicana de Agentes Navieros, Consignatarios y Agentes de Carga (AMACARGA)</strong>, adaptadas al marco jurídico de los Estados Unidos Mexicanos.
              </P>
              <P>
                La solicitud de cotización, la aceptación de una propuesta o la contratación de cualquier servicio de GGM implica la aceptación plena de las presentes Condiciones por parte del cliente.
              </P>
            </Section>

            <Section title="2. Servicios Cubiertos">
              <P>
                Las presentes Condiciones aplican a la totalidad de los servicios prestados por GGM, incluyendo sin limitación:
              </P>
              <UL items={[
                'Agenciamiento y coordinación de transporte de carga aérea, marítima y terrestre',
                'Manejo, embalaje, clasificación y documentación de mercancías peligrosas (Clases 1–9) conforme a IATA DGR, Código IMDG y NOM-002-SCT',
                'Logística especializada de material radiactivo Clase 7 bajo autorización de la CNSNS',
                'Almacenamiento temporal, consolidación y desconsolidación de carga',
                'Coordinación de trámites aduaneros de importación, exportación y tránsito internacional',
                'Gestión de documentación de transporte (conocimientos de embarque, guías aéreas, manifiestos DG)',
                'Consultoría en cumplimiento normativo para mercancías peligrosas y apoyo en auditorías',
                'Coordinación de última milla y entrega de mercancías especializadas o reguladas',
              ]} />
            </Section>

            <Section title="3. Mercancías Peligrosas y Carga Especial">
              <P>
                El manejo de mercancías peligrosas implica obligaciones adicionales para el <strong>expedidor o remitente</strong>, quien como responsable primario conforme a la normativa aplicable deberá:
              </P>
              <UL items={[
                'Proporcionar oportunamente la clasificación correcta de la mercancía, número ONU, nombre técnico de embarque, grupo de embalaje y cantidades exactas',
                'Garantizar que embalajes, marcas, etiquetas y documentación de expedición cumplan con IATA DGR, Código IMDG, DOT 49 CFR o NOM-002-SCT según el modo de transporte',
                'Entregar las Hojas de Datos de Seguridad (HDS/SDS) vigentes para todas las sustancias peligrosas',
                'Declarar verazmente cualquier condición especial que pueda afectar el manejo, almacenamiento o transporte de la mercancía',
                'Asumir la responsabilidad exclusiva por las consecuencias derivadas de clasificación errónea, declaración incompleta u omisión de información regulatoria',
              ]} />
              <P>
                GGM se reserva el derecho de rechazar o suspender el manejo de cualquier carga que no cumpla con los requisitos regulatorios aplicables, sin que ello genere responsabilidad frente al cliente.
              </P>
            </Section>

            <Section title="4. Responsabilidad y Reclamaciones">
              <P>
                GGM actúa como agente intermediario del cliente frente a transportistas, terminales y operadores. Su responsabilidad operativa se rige por los siguientes principios:
              </P>
              <UL items={[
                'La responsabilidad de GGM por pérdida o daño a la mercancía se limita a los términos del documento de transporte aplicable o al contrato específico de prestación de servicios',
                'GGM no responde por daños indirectos, lucro cesante o pérdida de mercado, salvo dolo o negligencia grave imputable al Operador',
                'Los eventos de fuerza mayor —incluyendo restricciones aduaneras, huelgas, fenómenos naturales o demoras de transportistas— exoneran a GGM de responsabilidad en la medida aplicable',
                'Se recomienda a los clientes contratar seguro de carga adecuado para la naturaleza y valor de las mercancías',
              ]} />
              <P>
                Las reclamaciones por pérdida o daño deben presentarse por escrito a GGM dentro de los plazos establecidos en el documento de transporte o contrato aplicable. La presentación extemporánea podrá dar lugar a su inadmisión, sin perjuicio de las disposiciones imperativas de la ley.
              </P>
            </Section>

            <Section title="5. Legislación Aplicable y Jurisdicción">
              <P>
                Las presentes Condiciones se rigen por las leyes de los <strong>Estados Unidos Mexicanos</strong>, incluyendo el Código de Comercio, la Ley de Vías Generales de Comunicación, la Ley de Aviación Civil y demás legislación sectorial aplicable a la actividad de agenciamiento de carga y transporte multimodal.
              </P>
              <P>
                Para la resolución de controversias, las partes se someten expresamente a la jurisdicción de los <strong>tribunales competentes de la República Mexicana</strong>, con renuncia al fuero que pudiera corresponderles por razón de su domicilio presente o futuro.
              </P>
            </Section>

          </div>
        </Container>
      </div>

      {/* ── PDF Download ─────────────────────────────────────────────────── */}
      <div style={{ background: '#060e1c', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 0 72px' }}>
        <Container>
          <div style={{ maxWidth: '720px' }}>
            <p style={{ fontSize: '10px', color: 'rgba(96,165,250,0.7)', textTransform: 'uppercase', letterSpacing: '0.26em', fontWeight: 800, marginBottom: '10px' }}>
              Documento Oficial
            </p>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginBottom: '8px' }}>
              Versión Completa en PDF
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, marginBottom: '28px', maxWidth: '480px' }}>
              Descargue el documento oficial íntegro de las Condiciones Estándar de Comercio de Global Gate México para archivo, revisión legal y referencia contractual.
            </p>

            {/* Download card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '6px',
              padding: '22px 26px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 260px' }}>
                <div style={{
                  width: '42px', height: '42px', flexShrink: 0,
                  background: 'rgba(37,99,235,0.18)',
                  border: '1px solid rgba(37,99,235,0.28)',
                  borderRadius: '5px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={19} color="rgba(96,165,250,0.9)" />
                </div>
                <div>
                  <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                    Condiciones Estándar de Comercio
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>
                    Global Gate México, S. de R.L. de C.V. · PDF
                  </p>
                </div>
              </div>

              <a
                href={STC_PDF_ES}
                download
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 20px',
                  background: '#2563eb',
                  color: '#fff',
                  fontSize: '11px', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  textDecoration: 'none', borderRadius: '3px', flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
              >
                <Download size={12} />
                Descargar PDF
              </a>
            </div>

            <p style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
              Consultas:{' '}
              <a href="mailto:ggm@globalgatemexico.com" style={{ color: 'rgba(96,165,250,0.55)', textDecoration: 'none' }}>
                ggm@globalgatemexico.com
              </a>
              {' '}· +52 812 165 4040
            </p>
          </div>
        </Container>
      </div>

    </div>
  );
}
