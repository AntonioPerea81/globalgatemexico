import { useEffect } from 'react';
import { Container } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

const LAST_UPDATED = 'May 26, 2026';

// ─────────────────────────────────────────────────────────────────────────────
// Shared prose helpers
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export function PrivacyPolicyPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'Privacy Policy | Global Gate México',
    description: 'Privacy Policy for Global Gate México — how we collect, use, and protect your personal data in compliance with applicable data protection regulations.',
    canonical: 'https://globalgatemexico.com/privacy-policy',
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
            Privacy Policy
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

            <Section title="1. Introduction">
              <P>
                Global Gate México, S. de R.L. de C.V. ("Global Gate México", "we", "us", or "our") is committed to protecting the privacy and security of your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you interact with our website at <strong>globalgatemexico.com</strong> or use our services.
              </P>
              <P>
                By using our website or submitting information through our contact, quotation, or training request forms, you acknowledge that you have read and understood this Privacy Policy.
              </P>
            </Section>

            <Section title="2. Data Controller">
              <P>
                The data controller responsible for your personal data is:
              </P>
              <div style={{ background: '#f4f6f9', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '20px 24px', marginBottom: '14px' }}>
                <p style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.8, margin: 0 }}>
                  <strong>Global Gate México, S. de R.L. de C.V.</strong><br />
                  Dangerous Goods Logistics &amp; Compliance<br />
                  Mexico<br />
                  Email: <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>ggm@globalgatemexico.com</a><br />
                  Phone: <a href="tel:+528121654040" style={{ color: '#2563eb', textDecoration: 'none' }}>+52 812 165 4040</a>
                </p>
              </div>
            </Section>

            <Section title="3. Information We Collect">
              <P>We may collect the following categories of personal data:</P>
              <UL items={[
                'Contact information: name, job title, company name, email address, phone number',
                'Inquiry data: details submitted through contact, quotation, or training proposal forms',
                'Technical data: IP address, browser type, operating system, pages visited, and usage data collected through cookies and analytics tools',
                'Communication data: records of correspondence when you contact us by email or through our website',
              ]} />
            </Section>

            <Section title="4. How We Use Your Information">
              <P>We use the personal data we collect for the following purposes:</P>
              <UL items={[
                'To respond to your inquiries, quotation requests, and training proposal submissions',
                'To provide dangerous goods logistics, compliance consulting, and training services',
                'To send relevant service information and follow-up communications',
                'To improve our website functionality and user experience',
                'To comply with applicable legal and regulatory obligations',
                'To protect the security and integrity of our systems and services',
              ]} />
            </Section>

            <Section title="5. Legal Basis for Processing">
              <P>
                We process your personal data on the following legal bases:
              </P>
              <UL items={[
                'Contractual necessity: processing required to fulfill a service request or quotation you have submitted',
                'Legitimate interests: improving our services, preventing fraud, and maintaining secure systems',
                'Legal obligation: compliance with applicable Mexican and international data protection regulations',
                'Consent: where you have explicitly provided consent for specific processing activities',
              ]} />
            </Section>

            <Section title="6. Data Sharing and Disclosure">
              <P>
                We do not sell, rent, or trade your personal data to third parties. We may share your information in the following limited circumstances:
              </P>
              <UL items={[
                'Service providers: trusted third-party vendors who assist in operating our website and delivering services (e.g., email delivery, hosting, analytics), bound by confidentiality obligations',
                'Legal compliance: when required by applicable law, court order, or governmental authority',
                'Business transfers: in connection with a merger, acquisition, or sale of assets, subject to appropriate data protection obligations',
              ]} />
            </Section>

            <Section title="7. Data Retention">
              <P>
                We retain personal data for as long as necessary to fulfill the purposes described in this Privacy Policy, or as required by applicable legal and regulatory obligations. Inquiry and quotation records are generally retained for a period of five (5) years in accordance with Mexican commercial regulations.
              </P>
            </Section>

            <Section title="8. Cookies and Tracking Technologies">
              <P>
                Our website uses cookies and similar tracking technologies to improve functionality and analyze traffic. You may control cookie preferences through our cookie consent notice displayed upon your first visit. Essential cookies required for site operation cannot be disabled.
              </P>
            </Section>

            <Section title="9. Your Rights">
              <P>Subject to applicable law, you have the right to:</P>
              <UL items={[
                'Access the personal data we hold about you',
                'Request correction of inaccurate or incomplete data',
                'Request erasure of your personal data where no legitimate purpose exists for continued processing',
                'Object to or restrict certain processing activities',
                'Withdraw consent at any time where processing is based on consent',
                'Lodge a complaint with the relevant data protection authority',
              ]} />
              <P>
                To exercise any of these rights, please contact us at <a href="mailto:ggm@globalgatemexico.com" style={{ color: '#2563eb', textDecoration: 'none' }}>ggm@globalgatemexico.com</a>.
              </P>
            </Section>

            <Section title="10. Data Security">
              <P>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include encrypted communications, access controls, and regular security assessments.
              </P>
            </Section>

            <Section title="11. International Data Transfers">
              <P>
                Our services may involve the transfer of data to third-party service providers located outside of Mexico. Where such transfers occur, we ensure that appropriate safeguards are in place in accordance with applicable data protection law.
              </P>
            </Section>

            <Section title="12. Changes to This Policy">
              <P>
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The updated version will be indicated by a revised "Last updated" date at the top of this page. We encourage you to review this policy periodically.
              </P>
            </Section>

            <Section title="13. Contact">
              <P>
                For questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact:
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
