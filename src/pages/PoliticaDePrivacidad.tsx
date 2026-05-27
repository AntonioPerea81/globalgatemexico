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

export function PoliticaDePrivacidadPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('ES'); }, []);

  usePageMeta({
    title: 'Política de Privacidad | Global Gate México',
    description: 'Política de Privacidad de Global Gate México conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y lineamientos del INAI.',
    canonical: 'https://globalgatemexico.com/politica-de-privacidad',
    lang: 'es',
    hreflang: [
      { lang: 'es', href: 'https://globalgatemexico.com/politica-de-privacidad' },
      { lang: 'en', href: 'https://globalgatemexico.com/privacy-policy' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/politica-de-privacidad' },
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
            Política de Privacidad
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
                Esta es la versión oficial y vinculante de la Política de Privacidad de Global Gate México. La{' '}
                <Link to="/privacy-policy" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  versión en inglés
                </Link>{' '}
                es de carácter informativo únicamente.
              </p>
            </div>

            <Section title="1. Identidad y Domicilio del Responsable">
              <P>
                <strong>Global Gate México, S. de R.L. de C.V.</strong> (en adelante el "Responsable"), sociedad mercantil constituida conforme a las leyes de los Estados Unidos Mexicanos, es responsable del uso y protección de sus datos personales. A continuación le informamos los términos bajo los cuales se realiza el tratamiento de su información, en cumplimiento de la{' '}
                <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</strong> ("LFPDPPP"), su Reglamento y los lineamientos del{' '}
                <strong>Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales</strong> ("INAI").
              </P>
              <div style={{ background: '#f4f6f9', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '20px 24px', marginBottom: '14px' }}>
                <p style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.9, margin: 0 }}>
                  <strong>Denominación social:</strong> Global Gate México, S. de R.L. de C.V.<br />
                  <strong>Giro o actividad:</strong> Logística de mercancías peligrosas, consultoría en cumplimiento normativo y capacitación empresarial<br />
                  <strong>País:</strong> México<br />
                  <strong>Correo electrónico:</strong>{' '}
                  <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>ggm@globalgatemexico.com</a><br />
                  <strong>Teléfono:</strong>{' '}
                  <a href="tel:+528121654040" style={{ color: '#2563eb', textDecoration: 'none' }}>+52 812 165 4040</a>
                </p>
              </div>
            </Section>

            <Section title="2. Datos Personales que se Recaban">
              <P>
                Para las finalidades señaladas en el presente aviso, el Responsable podrá recabar las siguientes categorías de datos personales:
              </P>
              <UL items={[
                'Datos de identificación: nombre completo o denominación de la empresa, puesto o cargo',
                'Datos de contacto: correo electrónico corporativo, número telefónico',
                'Datos laborales o empresariales: nombre de la empresa o razón social, sector de actividad',
                'Datos de la operación: información contenida en solicitudes de cotización, propuestas de capacitación o consultas de cumplimiento normativo',
                'Datos técnicos: dirección IP, tipo de navegador, sistema operativo y páginas visitadas, obtenidos mediante cookies y herramientas de análisis',
              ]} />
              <P>
                El Responsable no recaba datos personales sensibles en el sentido del artículo 3, fracción VI de la LFPDPPP. En caso de que esto cambie, se actualizará el presente aviso de forma previa al tratamiento.
              </P>
            </Section>

            <Section title="3. Finalidades del Tratamiento">
              <P>
                Sus datos personales serán utilizados para las siguientes <strong>finalidades primarias</strong>, necesarias para la relación jurídica y comercial que da origen a su recopilación:
              </P>
              <UL items={[
                'Atender y dar seguimiento a sus solicitudes de servicios, cotizaciones y propuestas de capacitación',
                'Prestar los servicios de logística de mercancías peligrosas, consultoría en cumplimiento normativo y capacitación',
                'Elaborar, enviar y gestionar documentación contractual, propuestas comerciales y certificados de capacitación',
                'Cumplir con las obligaciones legales, regulatorias y fiscales aplicables a nuestra actividad',
                'Mantener registros de capacitación y constancias de competencia conforme a los requisitos de la STPS, IATA y demás autoridades competentes',
              ]} />
              <P>
                De forma adicional, y si usted no manifiesta su oposición, utilizaremos sus datos para las siguientes <strong>finalidades secundarias</strong>:
              </P>
              <UL items={[
                'Informarle sobre actualizaciones normativas relevantes en materia de mercancías peligrosas',
                'Enviar comunicaciones comerciales relacionadas con nuestros servicios, programas de capacitación y novedades regulatorias',
              ]} />
              <P>
                Si no desea que sus datos sean utilizados para las finalidades secundarias antes descritas, puede manifestarlo enviando un correo a{' '}
                <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>ggm@globalgatemexico.com</a>{' '}
                con el asunto "Oposición a finalidades secundarias". La negativa no afectará la prestación de los servicios solicitados.
              </P>
            </Section>

            <Section title="4. Transferencia de Datos Personales">
              <P>
                Sus datos personales no serán transferidos a terceros sin su consentimiento previo, salvo en los siguientes supuestos permitidos por el artículo 37 de la LFPDPPP:
              </P>
              <UL items={[
                'A proveedores de servicios tecnológicos (alojamiento web, correo electrónico, análisis de datos) que actúen como encargados del tratamiento y estén obligados contractualmente a guardar confidencialidad',
                'Cuando la transferencia sea necesaria para dar cumplimiento a una obligación legal o resolución de autoridad competente',
                'Cuando sea necesaria para la celebración o ejecución de un contrato de prestación de servicios en beneficio del titular',
              ]} />
              <P>
                En ningún caso Global Gate México cederá, venderá o arrendará sus datos personales a terceros con fines comerciales propios ajenos a los aquí descritos.
              </P>
            </Section>

            <Section title="5. Ejercicio de los Derechos ARCO">
              <P>
                Usted tiene derecho a <strong>Acceder</strong> a sus datos personales en posesión del Responsable, <strong>Rectificarlos</strong> si son inexactos o incompletos, <strong>Cancelarlos</strong> cuando considere que no son necesarios para las finalidades descritas, u <strong>Oponerse</strong> al tratamiento de los mismos para fines específicos.
              </P>
              <P>
                Para ejercer cualquiera de estos derechos (derechos ARCO), deberá presentar una solicitud por escrito al correo{' '}
                <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>ggm@globalgatemexico.com</a>{' '}
                con el asunto "Solicitud ARCO", incluyendo:
              </P>
              <UL items={[
                'Su nombre completo y datos de contacto',
                'Una descripción clara del derecho que desea ejercer y los datos personales a los que refiere su solicitud',
                'Copia de un documento oficial que acredite su identidad',
                'En su caso, cualquier documento que facilite la localización de sus datos',
              ]} />
              <P>
                El Responsable dará respuesta a su solicitud en un plazo máximo de <strong>veinte días hábiles</strong> contados a partir de la fecha de recepción, conforme al artículo 32 de la LFPDPPP.
              </P>
            </Section>

            <Section title="6. Revocación del Consentimiento">
              <P>
                En cualquier momento usted puede revocar el consentimiento otorgado para el tratamiento de sus datos personales, siempre que dicha revocación no sea impedida por una obligación legal. Para ello, envíe su solicitud al correo{' '}
                <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>ggm@globalgatemexico.com</a>{' '}
                con el asunto "Revocación de consentimiento". Le informaremos sobre las consecuencias que, en su caso, podría tener la revocación respecto de la prestación de los servicios contratados.
              </P>
            </Section>

            <Section title="7. Uso de Tecnologías de Rastreo">
              <P>
                El presente sitio web utiliza cookies y tecnologías de rastreo similares con el fin de mejorar la funcionalidad del sitio y analizar el comportamiento de navegación de manera agregada y anónima. Al ingresar al sitio, se le informará sobre el uso de estas tecnologías mediante un aviso de consentimiento. Las cookies esenciales para el funcionamiento del sitio no pueden desactivarse.
              </P>
              <P>
                Usted puede configurar su navegador para bloquear o eliminar cookies; sin embargo, esto podría afectar la funcionalidad de determinadas secciones del sitio.
              </P>
            </Section>

            <Section title="8. Modificaciones al Presente Aviso">
              <P>
                El Responsable se reserva el derecho de efectuar modificaciones o actualizaciones al presente aviso de privacidad en cualquier momento, para atender novedades legislativas, políticas internas o nuevas finalidades de tratamiento. Las modificaciones estarán disponibles en esta misma página web, identificadas con la fecha de última actualización.
              </P>
            </Section>

            <Section title="9. Recursos ante el INAI">
              <P>
                Si considera que su derecho a la protección de datos personales ha sido vulnerado por alguna conducta u omisión del Responsable, o que el ejercicio de sus derechos ARCO ha sido indebidamente respondido, podrá presentar una queja o denuncia ante el{' '}
                <strong>Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)</strong> a través de su sitio oficial:{' '}
                <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  www.inai.org.mx
                </a>.
              </P>
            </Section>

            <Section title="10. Contacto">
              <P>
                Para cualquier consulta relacionada con el presente aviso de privacidad o el tratamiento de sus datos personales, comuníquese con nosotros:
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
