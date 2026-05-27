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

export function TermsOfServicePage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'Terms of Service | Global Gate México',
    description: 'Terms of Service for Global Gate México — conditions governing the use of our website and professional dangerous goods logistics and compliance services.',
    canonical: 'https://globalgatemexico.com/terms-of-service',
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
            Terms of Service
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

            <Section title="1. Acceptance of Terms">
              <P>
                By accessing and using the website at <strong>globalgatemexico.com</strong> or engaging the services of Global Gate México, S. de R.L. de C.V. ("Global Gate México", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use this website or request our services.
              </P>
              <P>
                These Terms of Service govern your use of our website and describe the conditions under which we provide dangerous goods logistics, compliance consulting, radioactive material handling, and training services.
              </P>
            </Section>

            <Section title="2. Description of Services">
              <P>Global Gate México provides professional B2B services including:</P>
              <UL items={[
                'Dangerous goods transportation logistics — air, ground, and maritime (IATA DGR, IMDG, SCT)',
                'Class 7 radioactive material logistics — packaging, controlled storage, and multimodal transport',
                'DG compliance consulting and regulatory advisory services',
                'Compliance audits and Safety Data Sheet (SDS/HDS) review',
                'Cross-border dangerous goods compliance (Mexico–USA)',
                'IATA CBTA competency-based dangerous goods training programs',
                'Corporate and onsite DG training delivery — all transport modes',
              ]} />
              <P>
                All services are provided on a B2B basis to qualified corporate clients, freight forwarders, manufacturers, and logistics operators. Services are subject to a separate formal service agreement or accepted quotation.
              </P>
            </Section>

            <Section title="3. Website Use">
              <P>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. Prohibited uses include:</P>
              <UL items={[
                'Transmitting any content that is unlawful, fraudulent, threatening, or harmful',
                'Attempting to gain unauthorized access to any part of the website or its underlying systems',
                'Using automated tools to scrape, index, or extract content without prior written consent',
                'Misrepresenting your identity or affiliation when submitting inquiries or requests',
                'Submitting false or misleading information through our contact or quotation forms',
              ]} />
            </Section>

            <Section title="4. Quotation and Service Requests">
              <P>
                Submitting a request through our contact form, quotation form, or training proposal form does not constitute a binding agreement. All service requests are subject to:
              </P>
              <UL items={[
                'Review and acceptance by Global Gate México',
                'Confirmation of regulatory feasibility and operational capacity',
                'Execution of a formal service agreement or accepted written proposal',
                'Payment terms as specified in the applicable quotation or contract',
              ]} />
              <P>
                Global Gate México reserves the right to decline any service request at its sole discretion, including requests that present regulatory, safety, or operational concerns.
              </P>
            </Section>

            <Section title="5. Regulatory Compliance Obligations">
              <P>
                Our services are governed by complex international and national regulatory frameworks including IATA DGR, IMDG Code, IAEA SSR-6, DOT 49 CFR, NOM-002-SCT, CNSNS requirements, and applicable Mexican law. The client acknowledges that:
              </P>
              <UL items={[
                'The accurate classification, declaration, and documentation of dangerous goods is the primary responsibility of the shipper or consignor',
                'Global Gate México provides compliance support and advisory services — final regulatory accountability rests with the regulated party',
                'Clients must provide accurate and complete information regarding the nature, classification, and quantity of goods to be handled',
                'Misclassification or incomplete disclosure of dangerous goods may result in service refusal and potential regulatory consequences',
              ]} />
            </Section>

            <Section title="6. Training Services — Specific Terms">
              <P>
                Training programs delivered by Global Gate México are subject to the following additional conditions:
              </P>
              <UL items={[
                'Training proposals and scheduling are confirmed in writing prior to delivery',
                'Certificates and competency records are issued only upon successful completion of applicable assessments',
                'Training content is developed in accordance with IATA CBTA methodology and applicable regulatory requirements',
                'Client-specific programs may require a needs assessment prior to program development',
                'Cancellation or rescheduling policies are specified in the applicable training agreement',
              ]} />
            </Section>

            <Section title="7. Intellectual Property">
              <P>
                All training materials, course content, documentation templates, compliance frameworks, and methodologies developed or provided by Global Gate México remain the intellectual property of Global Gate México, S. de R.L. de C.V. unless otherwise agreed in writing. Client organizations may use delivered materials solely for internal training purposes.
              </P>
            </Section>

            <Section title="8. Confidentiality">
              <P>
                Both parties agree to treat as confidential any proprietary or sensitive business information exchanged in connection with service delivery. Global Gate México will not disclose client-specific operational, shipment, or compliance information to third parties except as required by law or regulatory obligation.
              </P>
            </Section>

            <Section title="9. Limitation of Liability">
              <P>
                To the fullest extent permitted by applicable law, Global Gate México's aggregate liability to any client for any claim arising out of or in connection with the provision of services shall not exceed the total fees paid by the client for the specific service giving rise to the claim in the three (3) months preceding the event.
              </P>
              <P>
                Global Gate México shall not be liable for:
              </P>
              <UL items={[
                'Indirect, incidental, or consequential damages',
                'Loss of revenue, profit, or business opportunity',
                'Regulatory penalties resulting from client-provided inaccurate or incomplete dangerous goods information',
                'Force majeure events including regulatory embargoes, carrier refusals, or acts of government authority',
              ]} />
            </Section>

            <Section title="10. Indemnification">
              <P>
                You agree to indemnify and hold harmless Global Gate México, its directors, officers, employees, and contractors from any claims, damages, penalties, or expenses (including reasonable legal fees) arising from:
              </P>
              <UL items={[
                'Your breach of these Terms of Service',
                'Inaccurate or incomplete dangerous goods information provided to Global Gate México',
                'Your violation of applicable dangerous goods regulations',
                'Unauthorized use of our website or services',
              ]} />
            </Section>

            <Section title="11. Modifications to Terms">
              <P>
                Global Gate México reserves the right to modify these Terms of Service at any time. Updated terms will be published at this URL with a revised "Last updated" date. Continued use of our website or services following publication of changes constitutes acceptance of the revised terms.
              </P>
            </Section>

            <Section title="12. Governing Law and Jurisdiction">
              <P>
                These Terms of Service shall be governed by and construed in accordance with the laws of the United Mexican States. Any disputes arising from or related to these terms or our services shall be subject to the exclusive jurisdiction of the competent courts of Mexico, without regard to conflict of law principles.
              </P>
            </Section>

            <Section title="13. Contact">
              <P>
                For questions or concerns regarding these Terms of Service, please contact:
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
