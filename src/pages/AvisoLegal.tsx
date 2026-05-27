import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

const ULTIMA_ACTUALIZACION = '26 de mayo de 2026';

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
    <ul style={{ margin: '8px 0 14px 0', paddingLeft: '0', listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
          <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '13px', marginTop: '2px', flexShrink: 0 }}>—</span>
          <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function AvisoLegalPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Aviso Legal | Global Gate México',
    description: 'Aviso Legal de Global Gate México — identificación del responsable del sitio, propiedad intelectual, acreditaciones vigentes y condiciones de uso del contenido.',
    canonical: 'https://globalgatemexico.com/aviso-legal',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/aviso-legal' },
      { lang: 'en', href: 'https://globalgatemexico.com/legal-notice' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/aviso-legal' },
    ],
  });

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#060e1c', paddingTop: '106px', paddingBottom: '52px',
        position: 'relative', borderBottom: '2px solid #2563eb',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.08) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }} />
        <Container className="relative">
          <p style={{ fontSize: '10px', color: 'rgba(96,165,250,0.8)', textTransform: 'uppercase', letterSpacing: '0.26em', fontWeight: 800, marginBottom: '14px' }}>
            Documentación Legal
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '12px' }}>
            Aviso Legal
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
            Última actualización: {ULTIMA_ACTUALIZACION}
          </p>
        </Container>
      </div>

      {/* ── Cuerpo ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: '64px 0 96px' }}>
        <Container>
          <div style={{ maxWidth: '720px' }}>

            {/* Nota de versión */}
            <div style={{
              background: '#f4f6f9', border: '1px solid #e5e7eb',
              borderLeft: '3px solid #2563eb', borderRadius: '4px',
              padding: '14px 18px', marginBottom: '44px',
            }}>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Esta es la versión oficial y vinculante del Aviso Legal de Global Gate México. La{' '}
                <Link to="/legal-notice" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  versión en inglés
                </Link>{' '}
                es de carácter informativo únicamente.
              </p>
            </div>

            <Section title="1. Identificación del Responsable del Sitio">
              <div style={{ background: '#f4f6f9', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '20px 24px', marginBottom: '14px' }}>
                <p style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.9, margin: 0 }}>
                  <strong>Denominación social:</strong> Global Gate México, S. de R.L. de C.V.<br />
                  <strong>Nombre comercial:</strong> Global Gate México<br />
                  <strong>Objeto social:</strong> Logística de mercancías peligrosas, consultoría en cumplimiento normativo y capacitación empresarial<br />
                  <strong>País de constitución:</strong> México<br />
                  <strong>Correo electrónico:</strong>{' '}
                  <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>ggm@globalgatemexico.com</a><br />
                  <strong>Teléfono:</strong>{' '}
                  <a href="tel:+528121654040" style={{ color: '#2563eb', textDecoration: 'none' }}>+52 812 165 4040</a><br />
                  <strong>Sitio web:</strong>{' '}
                  <a href="https://globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>globalgatemexico.com</a>
                </p>
              </div>
            </Section>

            <Section title="2. Objeto del Sitio Web">
              <P>
                El presente sitio web es operado por Global Gate México, S. de R.L. de C.V. con fines informativos y comerciales relacionados con sus servicios de logística de mercancías peligrosas, consultoría en cumplimiento normativo y capacitación empresarial.
              </P>
              <P>
                El contenido publicado en este sitio —incluyendo descripciones de servicios, información sobre acreditaciones, marcos regulatorios y programas de capacitación— está dirigido a empresas, operadores logísticos, fabricantes y profesionales del sector de transporte de mercancías peligrosas.
              </P>
            </Section>

            <Section title="3. Derechos de Propiedad Intelectual">
              <P>
                La totalidad de los contenidos del presente sitio web —incluyendo textos, gráficos, logotipos, imágenes, diseños, metodologías, marcos de cumplimiento normativo y la compilación general del sitio— son propiedad de Global Gate México, S. de R.L. de C.V. y están protegidos conforme a la{' '}
                <strong>Ley Federal del Derecho de Autor</strong>, la{' '}
                <strong>Ley de la Propiedad Industrial</strong> y demás legislación aplicable en México y en los tratados internacionales de los que México es parte.
              </P>
              <P>
                Queda expresamente prohibida la reproducción, distribución, modificación, comunicación pública o cualquier otra forma de explotación —total o parcial— del contenido de este sitio sin contar con la autorización previa y por escrito de Global Gate México.
              </P>
              <UL items={[
                'La denominación "Global Gate México" y sus logotipos son identificadores comerciales protegidos',
                'Las marcas y logotipos de organismos reguladores y certificadores (IATA, IHMM, ICAO, SQA, CNSNS, STPS) son propiedad de sus respectivos titulares y se utilizan únicamente para acreditar certificaciones y acreditaciones vigentes obtenidas por Global Gate México',
                'Las marcas de terceros mencionadas en este sitio pertenecen a sus respectivos propietarios',
              ]} />
            </Section>

            <Section title="4. Condiciones de Uso del Contenido">
              <P>
                El acceso a este sitio web es libre y gratuito. El usuario se compromete a hacer un uso lícito, diligente y correcto del sitio, de acuerdo con la legislación aplicable, las buenas costumbres y el presente Aviso Legal.
              </P>
              <P>
                Queda prohibido utilizar el sitio o sus contenidos para:
              </P>
              <UL items={[
                'Actividades contrarias a la ley, al orden público o a las buenas costumbres',
                'Reproducir o difundir el contenido con fines comerciales sin autorización del Responsable',
                'Obtener información de terceros de forma ilícita o mediante engaño',
                'Introducir o difundir programas informáticos maliciosos o cualquier contenido que afecte la integridad del sitio',
              ]} />
            </Section>

            <Section title="5. Exactitud y Vigencia de la Información">
              <P>
                Global Gate México realiza sus mejores esfuerzos para mantener la información publicada en este sitio actualizada y precisa. Sin embargo, el Responsable no garantiza la completitud, exactitud, vigencia ni idoneidad de dicha información para un propósito determinado.
              </P>
              <P>
                La información regulatoria, los requisitos de transporte y los estándares de cumplimiento normativo contenidos en este sitio están sujetos a modificaciones por parte de las autoridades competentes. Se recomienda a los usuarios verificar la normativa vigente directamente con los organismos emisores antes de aplicarla en sus operaciones.
              </P>
            </Section>

            <Section title="6. Exclusión de Responsabilidad">
              <P>
                En la medida permitida por la legislación mexicana vigente, Global Gate México no será responsable por:
              </P>
              <UL items={[
                'Daños o perjuicios derivados del uso o de la imposibilidad de uso del sitio web',
                'Errores u omisiones en el contenido publicado',
                'Indisponibilidad temporal o permanente del sitio por causas ajenas al Responsable',
                'El contenido de sitios web de terceros enlazados desde este sitio',
                'Daños derivados de la interceptación o alteración de comunicaciones por parte de terceros',
              ]} />
            </Section>

            <Section title="7. Acreditaciones y Certificaciones Vigentes">
              <P>
                Global Gate México cuenta con las siguientes acreditaciones y certificaciones activas, verificables a través de los organismos emisores correspondientes:
              </P>
              <UL items={[
                'Proveedor Autorizado IATA CBTA — verificable en el registro oficial de empresas certificadas IATA',
                'Agente Capacitador Externo ante la STPS — registro conforme a la Ley Federal del Trabajo',
                'Instructor Certificado IATA en Mercancías Peligrosas — certificación individual de instructores',
                'DGSA – Asesor en Seguridad para el Transporte de Mercancías Peligrosas, emitida por la Scottish Qualifications Authority (SQA)',
                'CDGP – Certified Dangerous Goods Professional, emitida por el Institute of Hazardous Materials Management (IHMM)',
                'Autorización CNSNS — para operaciones de transporte y manejo de material radiactivo',
              ]} />
            </Section>

            <Section title="8. Legislación Aplicable y Jurisdicción">
              <P>
                El presente Aviso Legal y cualquier controversia derivada del uso de este sitio web se regirán e interpretarán conforme a las leyes de los Estados Unidos Mexicanos. Para la resolución de cualquier conflicto, las partes se someten expresamente a la jurisdicción de los tribunales competentes de la República Mexicana, renunciando a cualquier otro fuero que pudiera corresponderles.
              </P>
            </Section>

            <Section title="9. Contacto">
              <P>
                Para consultas legales sobre este sitio web o nuestras operaciones:
              </P>
              <P>
                <strong>Global Gate México, S. de R.L. de C.V.</strong><br />
                Correo: <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>ggm@globalgatemexico.com</a><br />
                Teléfono: <a href="tel:+528121654040" style={{ color: '#2563eb', textDecoration: 'none' }}>+52 812 165 4040</a>
              </P>
            </Section>

          </div>
        </Container>
      </div>

    </div>
  );
}
