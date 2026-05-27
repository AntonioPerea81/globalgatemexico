import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Globe2, Package, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Container } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

// ── Exportable constants — import these in forms, emails, and invoices ─────
export const STC_EN_ROUTE = '/standard-trade-conditions';
export const STC_PDF_EN   = '/legal/global-gate-mexico-stc-en.pdf';

const LAST_UPDATED = 'May 26, 2026';

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
  { Icon: Globe2,        label: 'International Transport',  sub: 'Air · Sea · Ground' },
  { Icon: AlertTriangle, label: 'Dangerous Goods',          sub: 'All DG classes' },
  { Icon: Package,       label: 'Warehousing',              sub: 'Custody & dispatch' },
  { Icon: ShieldCheck,   label: 'Customs Coordination',    sub: 'Import · Export' },
];

// ── Page ───────────────────────────────────────────────────────────────────
export function StandardTradeConditionsPage() {
  const { setLanguage } = useLanguage();
  useEffect(() => { setLanguage('EN'); }, []);

  usePageMeta({
    title: 'Standard Trade Conditions | Global Gate México',
    description: 'Standard Trade Conditions governing freight forwarding, multimodal transportation, dangerous goods logistics, and international supply chain services provided by Global Gate México.',
    canonical: 'https://globalgatemexico.com/standard-trade-conditions',
    lang: 'en',
    hreflang: [
      { lang: 'en', href: 'https://globalgatemexico.com/standard-trade-conditions' },
      { lang: 'es', href: 'https://globalgatemexico.com/condiciones-estandar-de-comercio' },
      { lang: 'x-default', href: 'https://globalgatemexico.com/standard-trade-conditions' },
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
            Contractual Framework · International Freight Forwarding
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: '16px' }}>
            Standard Trade<br />Conditions
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, maxWidth: '540px', marginBottom: '20px' }}>
            The contractual framework under which Global Gate México provides freight forwarding, multimodal transport, dangerous goods logistics, and international supply chain services.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>
            Last updated: {LAST_UPDATED}
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
                This English version is provided for informational purposes only. In the event of any discrepancy, the{' '}
                <Link to="/condiciones-estandar-de-comercio" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  Spanish version
                </Link>{' '}
                shall prevail as the binding document under Mexican law.
              </p>
            </div>

            <Section title="1. Introduction and Applicability">
              <P>
                These <strong>Standard Trade Conditions</strong> ("Conditions") of <strong>Global Gate México, S. de R.L. de C.V.</strong> ("GGM") establish the contractual framework governing all freight forwarding, multimodal transportation, dangerous goods logistics, and related services, unless otherwise agreed in writing between the parties.
              </P>
              <P>
                These Conditions are based on internationally recognized freight forwarding commercial practices, aligned with the principles of the <strong>International Federation of Freight Forwarders Associations (FIATA)</strong> and the guidelines of <strong>AMACARGA</strong> (Asociación Mexicana de Agentes Navieros, Consignatarios y Agentes de Carga), adapted to the legal framework of the United Mexican States.
              </P>
              <P>
                Requesting a quotation, accepting a proposal, or engaging any GGM service constitutes acceptance of these Conditions.
              </P>
            </Section>

            <Section title="2. Scope of Services">
              <P>
                These Conditions apply to all services provided by GGM, including without limitation:
              </P>
              <UL items={[
                'Freight forwarding and transport coordination — air, ocean, and ground',
                'Dangerous goods handling, packaging, classification, and documentation (Classes 1–9) per IATA DGR, IMDG Code, and NOM-002-SCT',
                'Class 7 radioactive material logistics under CNSNS authorization',
                'Temporary warehousing, consolidation, and deconsolidation',
                'Customs coordination for import, export, and international transit operations',
                'Transport documentation management (bills of lading, air waybills, DG manifests)',
                'Dangerous goods compliance consulting and audit support',
                'Last-mile coordination and delivery of specialized or regulated cargo',
              ]} />
            </Section>

            <Section title="3. Dangerous Goods & Special Cargo">
              <P>
                The handling of dangerous goods places additional obligations on the <strong>shipper or consignor</strong> as the primary regulatory responsible party:
              </P>
              <UL items={[
                'Provide GGM in advance with the correct classification, UN number, proper shipping name, packing group, and exact quantities',
                'Ensure packages, marks, labels, and shipping documentation comply with IATA DGR, IMDG Code, DOT 49 CFR, or NOM-002-SCT as applicable to the transport mode',
                'Provide current Safety Data Sheets (SDS/HDS) for all hazardous materials',
                'Disclose any special handling conditions that may affect the movement, storage, or carriage of the goods',
                'Assume exclusive liability for consequences arising from incorrect classification, incomplete declaration, or omission of regulatory information',
              ]} />
              <P>
                GGM reserves the right to refuse or suspend handling of any shipment that does not meet applicable regulatory requirements, without incurring liability to the client.
              </P>
            </Section>

            <Section title="4. Liability & Claims">
              <P>
                GGM acts as an intermediary agent on behalf of the client vis-à-vis carriers, terminals, and operators. Its operational liability is governed by the following principles:
              </P>
              <UL items={[
                "GGM's liability for cargo loss or damage is limited to the terms of the applicable transport document or specific service agreement",
                "GGM is not liable for indirect damages, loss of profit, or business interruption, except in cases of gross negligence or willful misconduct directly attributable to GGM",
                'Force majeure events — including customs embargoes, carrier delays, strikes, or natural events — release GGM from liability to the extent applicable under law',
                'Clients are recommended to arrange appropriate cargo insurance commensurate with the nature and value of the goods',
              ]} />
              <P>
                Claims for loss or damage must be submitted in writing to GGM within the timeframes established in the applicable transport document or service contract. Late claims may be rejected without prejudice to any mandatory statutory provisions.
              </P>
            </Section>

            <Section title="5. Governing Law and Jurisdiction">
              <P>
                These Conditions are governed by the laws of the <strong>United Mexican States</strong>, including the Code of Commerce, the General Communications Law, the Civil Aviation Law, and applicable sectoral legislation governing freight forwarding and multimodal transport.
              </P>
              <P>
                For dispute resolution, the parties expressly submit to the jurisdiction of the <strong>competent courts of the Mexican Republic</strong>, waiving any other jurisdiction that may apply by reason of their present or future domicile.
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
              Official Document
            </p>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginBottom: '8px' }}>
              Full Version — PDF
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, marginBottom: '28px', maxWidth: '480px' }}>
              Download the complete official Standard Trade Conditions document for filing, legal review, and contractual reference.
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
                    Standard Trade Conditions
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>
                    Global Gate México, S. de R.L. de C.V. · PDF
                  </p>
                </div>
              </div>

              <a
                href={STC_PDF_EN}
                download="global-gate-mexico-stc-en.pdf"
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
                Download PDF
              </a>
            </div>

            <p style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
              Enquiries:{' '}
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
