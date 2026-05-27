import { useEffect } from 'react';
import { Container } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

const LAST_UPDATED = 'May 26, 2026';

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

export function LegalNoticePage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'Legal Notice | Global Gate México',
    description: 'Legal Notice for Global Gate México — company identification, regulatory compliance, and intellectual property information.',
    canonical: 'https://globalgatemexico.com/legal-notice',
    lang: 'en',
  });

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#060e1c',
        paddingTop: '106px',
        paddingBottom: '52px',
        position: 'relative',
        borderBottom: '2px solid #2563eb',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.08) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }} />
        <Container className="relative">
          <p style={{ fontSize: '10px', color: 'rgba(96,165,250,0.8)', textTransform: 'uppercase', letterSpacing: '0.26em', fontWeight: 800, marginBottom: '14px' }}>
            Legal Documentation
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '12px' }}>
            Legal Notice
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
            Last updated: {LAST_UPDATED}
          </p>
        </Container>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div style={{ padding: '64px 0 96px' }}>
        <Container>
          <div style={{ maxWidth: '720px' }}>

            <Section title="1. Company Identification">
              <div style={{ background: '#f4f6f9', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '20px 24px', marginBottom: '14px' }}>
                <p style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.9, margin: 0 }}>
                  <strong>Legal Entity:</strong> Global Gate México, S. de R.L. de C.V.<br />
                  <strong>Trade Name:</strong> Global Gate México<br />
                  <strong>Country of Incorporation:</strong> Mexico<br />
                  <strong>Activity:</strong> Dangerous Goods Logistics, Compliance Consulting &amp; Regulatory Training<br />
                  <strong>Email:</strong>{' '}
                  <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    ggm@globalgatemexico.com
                  </a><br />
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+528121654040" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    +52 812 165 4040
                  </a><br />
                  <strong>Website:</strong>{' '}
                  <a href="https://globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    globalgatemexico.com
                  </a>
                </p>
              </div>
            </Section>

            <Section title="2. Website Purpose">
              <P>
                This website is operated by Global Gate México, S. de R.L. de C.V. for informational and commercial purposes related to our dangerous goods logistics, compliance consulting, and training services.
              </P>
              <P>
                The content published on this website — including service descriptions, credentials, regulatory guidance, and training information — is intended for professional and corporate audiences in the logistics, manufacturing, and regulated industries.
              </P>
            </Section>

            <Section title="3. Intellectual Property">
              <P>
                All content on this website, including but not limited to text, graphics, logos, images, training materials descriptions, regulatory frameworks, and the overall compilation of content, is the property of Global Gate México, S. de R.L. de C.V. and is protected under applicable Mexican and international intellectual property laws.
              </P>
              <P>
                Unauthorized reproduction, distribution, modification, or use of any content from this website — in whole or in part — without the prior written consent of Global Gate México is strictly prohibited.
              </P>
              <UL items={[
                'The name "Global Gate México" and its associated logotype are registered trade identifiers',
                'Certification marks and regulatory body logos (IATA, IHMM, ICAO, SQA, CNSNS) are the property of their respective issuing organizations and are used solely to identify valid accreditations held by Global Gate México',
                'Third-party trademarks referenced on this website belong to their respective owners',
              ]} />
            </Section>

            <Section title="4. Accuracy of Information">
              <P>
                Global Gate México makes every reasonable effort to ensure the accuracy and currency of the information published on this website. However, we provide no warranty, express or implied, regarding the completeness, accuracy, or fitness for purpose of the content.
              </P>
              <P>
                Regulatory information, transport requirements, and compliance standards referenced on this website are subject to revision by the relevant authorities. Users should verify applicable regulations directly with the issuing body before relying on this information for operational or compliance purposes.
              </P>
            </Section>

            <Section title="5. Limitation of Liability">
              <P>
                To the maximum extent permitted by applicable law, Global Gate México shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:
              </P>
              <UL items={[
                'Use of or reliance on information published on this website',
                'Errors, omissions, or inaccuracies in website content',
                'Temporary or permanent unavailability of the website',
                'Unauthorized access to or alteration of your data',
              ]} />
            </Section>

            <Section title="6. External Links">
              <P>
                This website may contain links to third-party websites, including regulatory bodies, certification registries, and partner organizations. These links are provided for informational convenience only. Global Gate México does not endorse, control, or assume responsibility for the content, privacy practices, or availability of any linked external websites.
              </P>
            </Section>

            <Section title="7. Regulatory Credentials">
              <P>
                Global Gate México holds the following active regulatory accreditations and certifications, each independently verifiable through the issuing body:
              </P>
              <UL items={[
                'IATA CBTA Authorized Provider — verified in the IATA CBTA Certified Companies Registry',
                'STPS External Training Agent — registered with the Secretaría del Trabajo y Previsión Social, Mexico',
                'IATA Certified Dangerous Goods Instructor — individual certification held by lead instructors',
                'DGSA — Dangerous Goods Safety Adviser certification issued by the Scottish Qualifications Authority (SQA)',
                'CDGP — Certified Dangerous Goods Professional issued by the Institute of Hazardous Materials Management (IHMM)',
                'CNSNS Authorization — applicable to radioactive material transport and handling operations',
              ]} />
            </Section>

            <Section title="8. Governing Law">
              <P>
                This Legal Notice and any disputes arising from the use of this website shall be governed by and construed in accordance with the laws of the United Mexican States. Any disputes shall be subject to the exclusive jurisdiction of the competent courts of Mexico.
              </P>
            </Section>

            <Section title="9. Contact">
              <P>
                For legal inquiries regarding this website or our operations, please contact:
              </P>
              <P>
                <strong>Global Gate México, S. de R.L. de C.V.</strong><br />
                Email: <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>ggm@globalgatemexico.com</a><br />
                Phone: <a href="tel:+528121654040" style={{ color: '#2563eb', textDecoration: 'none' }}>+52 812 165 4040</a>
              </P>
            </Section>

          </div>
        </Container>
      </div>

    </div>
  );
}
