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

export function TerminosDeServicioPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Términos y Condiciones de Uso | Global Gate México',
    description: 'Términos y Condiciones de Uso del sitio web y servicios de Global Gate México. Servicios de logística de mercancías peligrosas, consultoría y capacitación.',
    canonical: 'https://globalgatemexico.com/terminos-de-servicio',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/terminos-de-servicio' },
      { lang: 'en', href: 'https://globalgatemexico.com/terms-of-service' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/terminos-de-servicio' },
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
            Términos y Condiciones de Uso
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
                Esta es la versión oficial y vinculante de los Términos y Condiciones de Uso de Global Gate México. La{' '}
                <Link to="/terms-of-service" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  versión en inglés
                </Link>{' '}
                es de carácter informativo únicamente.
              </p>
            </div>

            <Section title="1. Objeto y Aceptación">
              <P>
                Los presentes Términos y Condiciones de Uso (en adelante los "Términos") regulan el acceso y uso del sitio web <strong>globalgatemexico.com</strong> (el "Sitio") y la contratación de los servicios ofrecidos por <strong>Global Gate México, S. de R.L. de C.V.</strong> (en adelante "Global Gate México" o el "Prestador").
              </P>
              <P>
                El acceso al Sitio y la solicitud de cualquier servicio implican la aceptación plena y sin reservas de los presentes Términos. Si no está de acuerdo con alguna de las condiciones aquí establecidas, le solicitamos abstenerse de utilizar este Sitio o contratar nuestros servicios.
              </P>
            </Section>

            <Section title="2. Descripción de los Servicios">
              <P>
                Global Gate México presta servicios profesionales en modalidad empresa a empresa (B2B) en las siguientes áreas:
              </P>
              <UL items={[
                'Logística de transporte de mercancías peligrosas por vía aérea, terrestre y marítima (IATA DGR, Código IMDG, NOM-002-SCT)',
                'Logística especializada de material radiactivo Clase 7 — embalaje, almacenamiento controlado y transporte multimodal',
                'Consultoría en cumplimiento normativo en materia de mercancías peligrosas',
                'Auditorías de cumplimiento y revisión de Hojas de Datos de Seguridad (HDS)',
                'Cumplimiento normativo transfronterizo México–Estados Unidos',
                'Capacitación empresarial en mercancías peligrosas conforme a metodología IATA CBTA',
                'Programas de capacitación corporativa e in situ para todos los modos de transporte',
              ]} />
              <P>
                Todos los servicios se prestan en modalidad B2B a clientes empresariales calificados y están sujetos a la celebración de un contrato de prestación de servicios o a la aceptación de una propuesta comercial por escrito.
              </P>
            </Section>

            <Section title="3. Acceso y Uso del Sitio Web">
              <P>
                El usuario se compromete a utilizar el Sitio y sus contenidos de conformidad con la legislación mexicana vigente, el presente Aviso Legal y las buenas costumbres. Quedan expresamente prohibidas las siguientes conductas:
              </P>
              <UL items={[
                'Utilizar el Sitio para fines ilícitos, fraudulentos o contrarios al orden público',
                'Intentar acceder sin autorización a sistemas, servidores o bases de datos del Prestador',
                'Reproducir, distribuir o explotar comercialmente los contenidos del Sitio sin autorización escrita',
                'Suplantar la identidad de otra persona o empresa al enviar solicitudes o formularios',
                'Proporcionar información falsa, incompleta o engañosa en cualquier formulario del Sitio',
                'Utilizar herramientas automatizadas para extraer contenido del Sitio sin consentimiento previo',
              ]} />
            </Section>

            <Section title="4. Solicitudes de Cotización y Contratación de Servicios">
              <P>
                El envío de una solicitud a través del formulario de contacto, cotización o propuesta de capacitación no constituye un contrato vinculante ni una oferta formal de servicios. Toda solicitud queda sujeta a:
              </P>
              <UL items={[
                'Revisión y aceptación por parte de Global Gate México',
                'Verificación de viabilidad regulatoria y capacidad operativa',
                'Formalización mediante contrato de prestación de servicios o propuesta comercial aceptada por escrito',
                'Las condiciones de pago establecidas en la cotización o contrato aplicable',
              ]} />
              <P>
                Global Gate México se reserva el derecho de rechazar cualquier solicitud de servicio a su entera discreción, incluyendo aquellas que presenten riesgos regulatorios, de seguridad u operativos.
              </P>
            </Section>

            <Section title="5. Obligaciones en Materia de Mercancías Peligrosas">
              <P>
                Los servicios de Global Gate México están regulados por marcos normativos complejos de carácter nacional e internacional, incluyendo las IATA DGR, el Código IMDG, el OIEA SSR-6, DOT 49 CFR, NOM-002-SCT, los requisitos de la CNSNS y la legislación mexicana aplicable. El cliente reconoce que:
              </P>
              <UL items={[
                'La clasificación, declaración y documentación correctas de las mercancías peligrosas son responsabilidad primaria del expedidor o remitente',
                'Global Gate México presta servicios de apoyo al cumplimiento normativo; la responsabilidad regulatoria final recae en la parte obligada conforme a la normativa aplicable',
                'El cliente deberá proporcionar información precisa y completa sobre la naturaleza, clasificación y cantidad de las mercancías a manejar',
                'La clasificación incorrecta o la omisión de información sobre mercancías peligrosas podrá dar lugar a la negativa del servicio y a consecuencias regulatorias para el cliente',
              ]} />
            </Section>

            <Section title="6. Capacitación y Programas Educativos">
              <P>
                Los programas de capacitación impartidos por Global Gate México están sujetos a las siguientes condiciones adicionales:
              </P>
              <UL items={[
                'Las propuestas de capacitación y la calendarización se confirman por escrito antes del inicio del programa',
                'Los certificados y constancias de competencia se expiden únicamente a los participantes que acrediten satisfactoriamente las evaluaciones correspondientes',
                'El contenido de los cursos se desarrolla conforme a la metodología IATA CBTA y los requisitos regulatorios vigentes',
                'Los programas corporativos a la medida podrán requerir un diagnóstico de necesidades previo a su desarrollo',
                'Las condiciones de cancelación o reprogramación se especifican en el contrato o propuesta de capacitación correspondiente',
              ]} />
            </Section>

            <Section title="7. Propiedad Intelectual">
              <P>
                Los materiales didácticos, contenidos de cursos, metodologías y documentación técnica desarrollados o entregados por Global Gate México son propiedad intelectual del Prestador y están protegidos conforme a la Ley Federal del Derecho de Autor. Los clientes podrán utilizar los materiales entregados exclusivamente para sus propios fines de capacitación interna, salvo acuerdo escrito en contrario.
              </P>
            </Section>

            <Section title="8. Confidencialidad">
              <P>
                Ambas partes acuerdan tratar como información confidencial los datos propios o sensibles de la otra parte que sean divulgados en el marco de la prestación de los servicios. Global Gate México no divulgará información operativa, de envíos o de cumplimiento específica del cliente a terceros, salvo que así lo exija una disposición legal o una resolución de autoridad competente.
              </P>
            </Section>

            <Section title="9. Limitación de Responsabilidad">
              <P>
                En la medida que lo permita la legislación mexicana aplicable, la responsabilidad total de Global Gate México frente a cualquier cliente por reclamaciones derivadas de la prestación de sus servicios no excederá el importe total de los honorarios efectivamente pagados por el cliente por el servicio específico que da origen a la reclamación, durante los tres (3) meses anteriores al evento.
              </P>
              <P>Global Gate México no será responsable por:</P>
              <UL items={[
                'Daños indirectos, incidentales, emergentes o de lucro cesante',
                'Sanciones regulatorias derivadas de información inexacta o incompleta proporcionada por el cliente',
                'Casos fortuitos o de fuerza mayor, incluyendo embargos regulatorios, rechazos del transportista o actos de autoridad',
                'Retrasos operativos atribuibles a factores ajenos al control del Prestador',
              ]} />
            </Section>

            <Section title="10. Modificaciones a los Presentes Términos">
              <P>
                Global Gate México se reserva el derecho de modificar los presentes Términos en cualquier momento. Las modificaciones serán publicadas en esta misma página con la fecha de actualización correspondiente. El uso continuado del Sitio o la solicitud de servicios con posterioridad a la publicación de los cambios implicará la aceptación de los Términos modificados.
              </P>
            </Section>

            <Section title="11. Legislación Aplicable y Jurisdicción">
              <P>
                Los presentes Términos y Condiciones de Uso, así como cualquier controversia derivada de su interpretación, cumplimiento o ejecución, se regirán por las leyes de los Estados Unidos Mexicanos. Para la resolución de controversias, las partes se someten expresamente a la jurisdicción de los tribunales competentes de la República Mexicana, con renuncia al fuero que pudiera corresponderles por razón de su domicilio presente o futuro.
              </P>
            </Section>

            <Section title="12. Contacto">
              <P>
                Para cualquier consulta sobre los presentes Términos y Condiciones:
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
