import {
  AlertTriangle, FileX, PackageX, Globe,
  ClipboardCheck, Search, ShieldAlert, BookOpen,
  FileWarning, MapPin, RefreshCw, BadgeCheck,
  ShieldCheck, Clock, Award, Users,
  CheckCircle, Tag, FileText, Lock,
  Layers, AlertCircle, XCircle, Database,
} from 'lucide-react';
import { CompliancePageTemplate, CompliancePageData } from './CompliancePageTemplate';

// ── DG Compliance ─────────────────────────────────────────────────────────────

const dgComplianceData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-documentation-services.webp',
    eyebrow: 'IATA DGR · IMDG · ADR · SCT · DOT · Full-Cycle Compliance',
    headline: 'DG Compliance —',
    highlighted: 'Right Classification. Every Shipment.',
    sub: 'Most dangerous goods incidents trace back to a single error: wrong classification. Our DG compliance service ensures every shipment is correctly identified, documented, and accepted — before it reaches the carrier.',
  },
  risk: {
    headline: 'Where DG Compliance Breaks Down',
    body: 'Dangerous goods compliance failures are rarely random. They follow predictable patterns that surface at the worst possible moment — acceptance rejection, customs hold, or incident report.',
    items: [
      {
        Icon: AlertTriangle,
        title: 'Wrong Classification at Acceptance',
        desc: 'Incorrect UN number or hazard class leads to carrier rejection, shipment delay, and potential regulatory fine. Reclassification after tendering doubles handling time.',
      },
      {
        Icon: FileX,
        title: 'Documentation Rejected at Origin',
        desc: 'A Dangerous Goods Declaration with missing fields, wrong packing instruction reference, or uncertified signatory is rejected at check-in — not at the shipper\'s desk.',
      },
      {
        Icon: PackageX,
        title: 'Non-Compliant Packaging',
        desc: 'Using non-UN-certified packaging, wrong inner/outer combination, or mismatched packing instruction voids compliance regardless of how accurate the paperwork is.',
      },
      {
        Icon: Globe,
        title: 'Modal Differences Overlooked',
        desc: 'A substance classified under IATA rules may have different quantity limits or packing groups under IMDG or ADR. Treating all modes as equivalent creates systematic risk.',
      },
    ],
  },
  scope: {
    eyebrow: 'Service Scope',
    headline: 'What Our DG Compliance Service Covers',
    body: 'We handle the full compliance lifecycle for dangerous goods shipments — from first classification through final documentation sign-off, across all transport modes.',
    items: [
      {
        Icon: Search,
        title: 'Classification & UN Number Assignment',
        desc: 'SDS analysis, technical name identification, hazard class, packing group, and special provisions determined per applicable regulations.',
      },
      {
        Icon: ClipboardCheck,
        title: 'Dangerous Goods Declaration Preparation',
        desc: 'IATA DGD, Multimodal Dangerous Goods Form, and shipper\'s declaration prepared, reviewed, and certified by our qualified specialists.',
      },
      {
        Icon: PackageX,
        title: 'Packaging Compliance Review',
        desc: 'Packing instruction verification, UN certification check, inner/outer packaging compatibility, and quantity per package validation.',
      },
      {
        Icon: Tag,
        title: 'Marking & Labelling Verification',
        desc: 'Hazard labels, handling marks, UN marks, and orientation arrows reviewed against the applicable regulation edition before tendering.',
      },
      {
        Icon: FileText,
        title: 'Multi-Modal Compliance Mapping',
        desc: 'Air, ground, and ocean requirements compared for each shipment so mode-specific differences in limits and packing are correctly applied.',
      },
      {
        Icon: CheckCircle,
        title: 'Pre-Shipment Compliance Sign-Off',
        desc: 'Independent review and certification by a GGM specialist before the shipment is tendered — your final compliance gate.',
      },
    ],
  },
  why: {
    headline: 'Why Shippers Trust GGM for Compliance',
    body: 'Compliance is only as strong as the people behind it. Our team holds active IATA, IMDG, and ADR certifications and trains to the current edition — every year.',
    points: [
      {
        Icon: Award,
        title: 'Current-Edition Certified',
        desc: 'Our specialists train and recertify annually to the current IATA DGR, IMDG Code, and ADR editions — not last cycle\'s rules.',
      },
      {
        Icon: ShieldCheck,
        title: 'Zero-Tolerance Review Policy',
        desc: 'Every document goes through a dual-review process before sign-off. If it doesn\'t pass our internal check, it doesn\'t leave our desk.',
      },
      {
        Icon: Clock,
        title: 'Same-Day Turnaround',
        desc: 'Standard DG declarations and compliance reviews completed within the same business day for shipments submitted before noon.',
      },
      {
        Icon: Globe,
        title: 'Multi-Modal Expertise',
        desc: 'One team covers air, ground, and ocean compliance — no handoffs, no gaps, no conflicting advice between transport modes.',
      },
    ],
  },
  cta: {
    headline: 'Eliminate Compliance Risk Before the Shipment Moves',
    sub: 'Our certified specialists review your dangerous goods classification, documentation, and packaging — so your shipment reaches its destination without delay.',
  },
};

// ── Regulatory Consulting ─────────────────────────────────────────────────────

const regulatoryConsultingData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-warehouse-01.webp',
    eyebrow: 'IATA DGR · IMDG Code · ADR · SCT · DOT · CNSNS',
    headline: 'Regulatory Consulting —',
    highlighted: 'The Right Rule. The Right Edition.',
    sub: 'Dangerous goods regulations change every year. Our consulting service keeps your operations aligned with current IATA, IMDG, ADR, and SCT requirements — and translates regulatory complexity into actionable compliance steps.',
  },
  risk: {
    headline: 'How Regulatory Gaps Create Operational Risk',
    body: 'Most DG compliance failures are not intentional — they result from teams applying the wrong edition, misreading a special provision, or missing a regulatory amendment that took effect mid-year.',
    items: [
      {
        Icon: BookOpen,
        title: 'Operating on the Wrong Edition',
        desc: 'IATA DGR updates annually. Companies using last year\'s edition may unknowingly apply superseded packing instructions, outdated quantity limits, or removed special provisions.',
      },
      {
        Icon: Layers,
        title: 'Modal Regulation Misapplication',
        desc: 'Applying air rules to a ground or ocean shipment — or vice versa — creates documentation errors that surface at border crossings or carrier acceptance.',
      },
      {
        Icon: AlertCircle,
        title: 'Special Provisions Missed',
        desc: 'Special provisions modify or exempt standard requirements. Missing an applicable SP can mean unnecessary packaging costs or, worse, an incorrect compliance assumption.',
      },
      {
        Icon: Globe,
        title: 'Cross-Border Regulatory Gaps',
        desc: 'Mexico-US cross-border shipments must comply with both SCT and DOT regulations simultaneously. Complying with one while violating the other is a common and costly error.',
      },
    ],
  },
  scope: {
    eyebrow: 'Consulting Scope',
    headline: 'What Our Regulatory Consulting Covers',
    body: 'We translate current IATA, IMDG, ADR, SCT, and DOT requirements into clear operational guidance — for your products, your routes, and your transport modes.',
    items: [
      {
        Icon: BookOpen,
        title: 'Current-Edition Regulatory Analysis',
        desc: 'We review applicable regulations in their current edition and flag changes that affect your specific substances, routes, and modes.',
      },
      {
        Icon: Search,
        title: 'Substance-Specific Classification Review',
        desc: 'Per-product analysis including UN number, PSN, hazard class, packing group, special provisions, and mode-specific exceptions.',
      },
      {
        Icon: MapPin,
        title: 'Route & Modal Compliance Mapping',
        desc: 'For each origin-destination pair, we identify which regulations apply and where conflicts or additional requirements exist between modes.',
      },
      {
        Icon: RefreshCw,
        title: 'Regulatory Change Monitoring',
        desc: 'Ongoing tracking of annual IATA DGR amendments, IMDG Code biennial updates, and SCT/DOT regulatory notices that affect your operations.',
      },
    ],
  },
  why: {
    headline: 'Regulatory Expertise Without the Overhead',
    body: 'Building an internal regulatory function requires continuous training investment and edition-by-edition tracking. GGM delivers that expertise on demand.',
    points: [
      {
        Icon: Award,
        title: 'Multi-Regulation Expertise',
        desc: 'Our team holds active certifications across IATA DGR, IMDG, ADR, and SCT — not just one modal framework.',
      },
      {
        Icon: RefreshCw,
        title: 'Annual Edition Alignment',
        desc: 'We train to current editions every cycle and immediately update our consulting guidance when amendments take effect.',
      },
      {
        Icon: Users,
        title: 'Operations-Focused Advice',
        desc: 'Our recommendations are written for operations teams, not legal departments — clear, actionable, and tied to your specific product and route profile.',
      },
      {
        Icon: ShieldCheck,
        title: 'Cross-Border Specialization',
        desc: 'Mexico-US and Mexico-Canada regulatory alignment is a core competency — we know where the gaps are and how to close them.',
      },
    ],
  },
  cta: {
    headline: 'Stop Guessing Which Regulation Applies',
    sub: 'Our regulatory consultants identify the exact rules that govern your dangerous goods operation and give you a clear compliance roadmap — no ambiguity.',
  },
};

// ── Compliance Audits ─────────────────────────────────────────────────────────

const complianceAuditsData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-operations-team.webp',
    eyebrow: 'IATA DGR · IMDG · ADR · SCT · Internal & Pre-Audit Assessments',
    headline: 'DG Compliance Audits —',
    highlighted: 'Find the Gap Before the Inspector Does.',
    sub: 'A compliance audit is your best defense against regulatory enforcement action. Our auditors identify documentation gaps, classification errors, and training deficiencies before they become incidents or fines.',
  },
  risk: {
    headline: 'What Auditors Find — And What It Costs',
    body: 'Companies that wait for a regulatory inspection to discover compliance gaps face fines, operational shutdowns, and reputational damage that internal audits prevent at a fraction of the cost.',
    items: [
      {
        Icon: Database,
        title: 'Outdated Classification Records',
        desc: 'Products reclassified in recent IATA or IMDG amendments may still be shipped under superseded UN numbers or PSNs — a direct violation auditors catch immediately.',
      },
      {
        Icon: FileWarning,
        title: 'Documentation Gaps',
        desc: 'Missing shipper certifications, incorrect DGD format, or outdated emergency contact information are common findings that invalidate otherwise-compliant shipments.',
      },
      {
        Icon: Users,
        title: 'Unqualified Personnel',
        desc: 'Staff signing dangerous goods declarations without current IATA or IMDG recurrent training creates personal and corporate liability — and is among the most frequently cited violations.',
      },
      {
        Icon: PackageX,
        title: 'Invalid Packaging Records',
        desc: 'UN performance test certificates that have expired, packaging used beyond its authorized specifications, or missing inner/outer compatibility records.',
      },
    ],
  },
  scope: {
    eyebrow: 'Audit Scope',
    headline: 'What a GGM Compliance Audit Covers',
    body: 'Our audits follow a structured methodology based on IATA DGR, IMDG Code, and SCT requirements — covering documentation, classification records, packaging, training, and internal procedures.',
    items: [
      {
        Icon: ClipboardCheck,
        title: 'Documentation Review',
        desc: 'Shipper\'s declarations, DGDs, emergency response documentation, and internal SOPs reviewed against current regulatory requirements.',
      },
      {
        Icon: Search,
        title: 'Classification Records Verification',
        desc: 'UN number, PSN, hazard class, packing group, and special provisions verified against current editions for all regularly shipped substances.',
      },
      {
        Icon: PackageX,
        title: 'Packaging & Labelling Inspection',
        desc: 'Physical review of packaging stock, UN certification currency, label inventory, and marking materials against applicable packing instructions.',
      },
      {
        Icon: Users,
        title: 'Training Records Assessment',
        desc: 'Training certificates reviewed for currency, scope, and applicability — including function-specific versus general awareness requirements.',
      },
      {
        Icon: FileText,
        title: 'Gap Report & Remediation Plan',
        desc: 'Findings documented with specific regulatory reference, risk rating, and prioritized remediation steps your team can act on immediately.',
      },
    ],
  },
  why: {
    headline: 'Auditors Who Know What Regulators Look For',
    body: 'Our audit team has conducted DG compliance reviews for pharmaceutical, chemical, energy, and manufacturing operations across Mexico and cross-border routes.',
    points: [
      {
        Icon: ShieldCheck,
        title: 'Regulatory-Grade Methodology',
        desc: 'Our audit protocol mirrors the checklists used by IATA, SCT, and DOT inspectors — so findings reflect actual enforcement risk, not internal preferences.',
      },
      {
        Icon: FileText,
        title: 'Actionable Gap Reports',
        desc: 'Every finding is cited against the specific regulation, edition, and section — giving your team the exact reference needed to verify and remediate.',
      },
      {
        Icon: RefreshCw,
        title: 'Pre- and Post-Audit Support',
        desc: 'We support remediation after the audit and offer a follow-up review to confirm findings are closed before any scheduled regulatory inspection.',
      },
      {
        Icon: Award,
        title: 'Industry-Specific Experience',
        desc: 'Pharmaceutical, chemical, energy, and aerospace DG profiles audited — each with unique classification complexity and packaging requirements.',
      },
    ],
  },
  cta: {
    headline: 'Schedule Your DG Compliance Audit',
    sub: 'Our auditors will identify every gap in your dangerous goods operation — before a regulator does. Structured findings. Clear remediation plan. Prioritized by risk.',
  },
};

// ── SDS Review ────────────────────────────────────────────────────────────────

const sdsReviewData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-field-operations.webp',
    eyebrow: 'GHS · IATA DGR · IMDG · Section 14 Transport Data · SDS Validation',
    headline: 'SDS Review —',
    highlighted: 'Transport Data You Can Actually Ship On.',
    sub: 'A Safety Data Sheet is the primary source of dangerous goods classification data — but SDS Section 14 errors are among the most common causes of mis-classification. We verify the transport data before it reaches your DG declaration.',
  },
  risk: {
    headline: 'Why SDS Section 14 Errors Are So Costly',
    body: 'Shippers often accept supplier SDS documents at face value. When Section 14 contains errors, those errors propagate into every declaration and label applied to that product.',
    items: [
      {
        Icon: XCircle,
        title: 'Wrong UN Number on the SDS',
        desc: 'An incorrect UN number on a supplier SDS will be copied into every DGD for that product — creating systemic mis-declaration across all shipments until the error is caught.',
      },
      {
        Icon: FileWarning,
        title: 'Outdated Section 14 Transport Data',
        desc: 'SDS documents are frequently not updated when IATA DGR or IMDG editions change. An SDS referencing a superseded packing instruction is a compliance liability in every shipment.',
      },
      {
        Icon: AlertTriangle,
        title: 'Inconsistent Classification Across SDSs',
        desc: 'The same substance from different suppliers may list different UN numbers, packing groups, or hazard classes. Without cross-referencing against current regulations, the discrepancy goes undetected.',
      },
      {
        Icon: Globe,
        title: 'Unverified Supplier SDS',
        desc: 'Supplier SDS documents are not regulatory documents — they are commercial documentation. Section 14 must be independently verified against IATA DGR, IMDG, and ADR before use in declarations.',
      },
    ],
  },
  scope: {
    eyebrow: 'Review Scope',
    headline: 'What Our SDS Review Service Covers',
    body: 'We validate Safety Data Sheet transport data against current IATA DGR, IMDG Code, ADR, and GHS requirements — identifying errors, outdated data, and inconsistencies before they enter your shipping documentation.',
    items: [
      {
        Icon: Search,
        title: 'Section 14 Transport Classification Verification',
        desc: 'UN number, Proper Shipping Name, hazard class, packing group, and marine pollutant status verified against current IATA DGR and IMDG editions.',
      },
      {
        Icon: ClipboardCheck,
        title: 'Multi-Modal Transport Data Check',
        desc: 'Section 14 transport data reviewed for air (IATA), sea (IMDG), and ground (ADR/SCT) to identify mode-specific discrepancies in classification or packing group.',
      },
      {
        Icon: RefreshCw,
        title: 'Edition Currency Validation',
        desc: 'SDS edition year compared against the current IATA DGR and IMDG Code to flag documents referencing superseded packing instructions or discontinued special provisions.',
      },
      {
        Icon: FileText,
        title: 'Corrected Classification Report',
        desc: 'Where Section 14 contains errors, we provide a written correction report with the accurate classification data and regulatory reference for your records and supplier communication.',
      },
      {
        Icon: Database,
        title: 'SDS Library Classification Audit',
        desc: 'For operations with multiple products, we review your full SDS library and create a verified classification master list for internal use.',
      },
    ],
  },
  why: {
    headline: 'Classification Accuracy Starts at the SDS',
    body: 'Our specialists are trained to read SDS Section 14 data critically — not accept it as fact. We cross-reference against primary regulation sources, not other SDS documents.',
    points: [
      {
        Icon: ShieldCheck,
        title: 'Primary Source Verification',
        desc: 'We verify Section 14 data against the primary regulatory text — IATA DGR, IMDG Code, ADR — not third-party databases or other SDS documents.',
      },
      {
        Icon: Award,
        title: 'GHS & Transport Regulation Expertise',
        desc: 'Our reviewers hold GHS and DG transport certifications — enabling review of both hazard classification and transport-specific requirements simultaneously.',
      },
      {
        Icon: RefreshCw,
        title: 'Annual SDS Library Updates',
        desc: 'We offer recurring SDS review cycles aligned with IATA DGR and IMDG edition updates — ensuring your classification library stays current.',
      },
      {
        Icon: Lock,
        title: 'Documented Verification Trail',
        desc: 'Each review is documented with the regulatory reference, edition, and verification date — providing a defensible compliance record for regulatory inquiries.',
      },
    ],
  },
  cta: {
    headline: 'Verify Your SDS Transport Data Before It Becomes a Problem',
    sub: 'Our specialists review Safety Data Sheet Section 14 transport classification against current IATA DGR and IMDG requirements — and provide a written correction report for any errors found.',
  },
};

// ── Cross-Border DG Compliance ────────────────────────────────────────────────

const crossBorderData: CompliancePageData = {
  hero: {
    image: '/images/dg-transport/dg-ground-transport.webp',
    eyebrow: 'SCT · DOT 49 CFR · IATA DGR · IMDG · Mexico-US Cross-Border',
    headline: 'Cross-Border DG Compliance —',
    highlighted: 'One Shipment. Two Regulatory Systems.',
    sub: 'A dangerous goods shipment crossing the Mexico-US border must comply with both SCT and DOT regulations simultaneously — and they don\'t always agree. We resolve the conflicts before your cargo reaches the port of entry.',
  },
  risk: {
    headline: 'Where Cross-Border DG Shipments Fail',
    body: 'Cross-border dangerous goods failures don\'t happen at the shipper\'s facility — they happen at the border, when a CBP or SCT inspector finds a documentation mismatch that stops the shipment.',
    items: [
      {
        Icon: Globe,
        title: 'SCT-Compliant but DOT Non-Compliant',
        desc: 'Packaging and labelling that fully complies with Mexican SCT regulations may still fail DOT 49 CFR requirements at US entry. The two frameworks are not equivalent.',
      },
      {
        Icon: FileWarning,
        title: 'Documentation Format Conflicts',
        desc: 'Emergency response information, placarding requirements, and shipper certification formats differ between SCT and DOT. A document valid for Mexico may be rejected at the US border.',
      },
      {
        Icon: PackageX,
        title: 'Packaging Acceptance at Destination',
        desc: 'UN certification recognized under SCT may not be accepted under DOT for certain material classes. Cross-border shipments must be packaged to the more restrictive standard.',
      },
      {
        Icon: RefreshCw,
        title: 'Multimodal Reclassification',
        desc: 'A ground shipment that transitions to air or ocean at the border requires reclassification under IATA DGR or IMDG rules — which may differ from the ground-transport classification used in Mexico.',
      },
    ],
  },
  scope: {
    eyebrow: 'Compliance Scope',
    headline: 'What Our Cross-Border DG Service Covers',
    body: 'We prepare your dangerous goods shipment to meet both Mexican SCT and US DOT requirements simultaneously — with documentation, packaging review, and border-crossing coordination.',
    items: [
      {
        Icon: Search,
        title: 'Dual-Regulation Classification Review',
        desc: 'UN number, PSN, hazard class, and packing group verified under both SCT and DOT 49 CFR to identify discrepancies before shipment preparation.',
      },
      {
        Icon: FileText,
        title: 'Cross-Border Documentation Preparation',
        desc: 'Shipping papers, emergency response documentation, and shipper\'s certification prepared to satisfy both Mexican and US regulatory requirements.',
      },
      {
        Icon: PackageX,
        title: 'Packaging Compatibility Assessment',
        desc: 'Packaging reviewed against both SCT and DOT requirements. Where they conflict, we identify the more restrictive standard and recommend compliant alternatives.',
      },
      {
        Icon: MapPin,
        title: 'Port of Entry Compliance Mapping',
        desc: 'For regular routes, we document the specific compliance requirements at each port of entry — so your team has a route-specific checklist, not a general guideline.',
      },
      {
        Icon: Globe,
        title: 'Air & Ocean Mode Transition Support',
        desc: 'When ground shipments transition to air or ocean at the border, we handle the modal reclassification and documentation update under IATA DGR or IMDG.',
      },
    ],
  },
  why: {
    headline: 'Cross-Border Expertise That Keeps Cargo Moving',
    body: 'We have supported Mexico-US and Mexico-Canada dangerous goods shipments across pharmaceutical, chemical, and industrial sectors — learning where each framework creates friction.',
    points: [
      {
        Icon: ShieldCheck,
        title: 'Both Frameworks, One Team',
        desc: 'Our specialists are certified in both SCT and DOT 49 CFR requirements — no hand-off between a Mexican expert and a US expert halfway through your shipment.',
      },
      {
        Icon: MapPin,
        title: 'Route-Level Compliance Detail',
        desc: 'We work with specific ports of entry, not abstract regulatory frameworks. Our guidance reflects what actually happens at the border, not just what the regulation says.',
      },
      {
        Icon: RefreshCw,
        title: 'Regulatory Change Tracking',
        desc: 'Annual DOT 49 CFR amendments and SCT regulatory updates are monitored and incorporated into our compliance guidance as they take effect.',
      },
      {
        Icon: Clock,
        title: 'Pre-Departure Compliance Review',
        desc: 'We offer a final compliance check before any cross-border dangerous goods shipment departs — the last opportunity to catch a documentation conflict before it becomes a border hold.',
      },
    ],
  },
  cta: {
    headline: 'Move Dangerous Goods Across the Border Without the Hold',
    sub: 'Our cross-border DG specialists prepare your shipment to meet both SCT and DOT requirements simultaneously — so it clears the border on the first attempt.',
  },
};

// ── Page Exports ──────────────────────────────────────────────────────────────

export const DGCompliancePage = () => <CompliancePageTemplate data={dgComplianceData} />;
export const RegulatoryConsultingPage = () => <CompliancePageTemplate data={regulatoryConsultingData} />;
export const ComplianceAuditsPage = () => <CompliancePageTemplate data={complianceAuditsData} />;
export const SDSReviewPage = () => <CompliancePageTemplate data={sdsReviewData} />;
export const CrossBorderDGPage = () => <CompliancePageTemplate data={crossBorderData} />;
