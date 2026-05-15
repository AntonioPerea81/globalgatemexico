import {
  Plane, Truck, Ship, Package, FileText,
  Search, Tag, ClipboardList, Route, CheckCircle,
  Award, GraduationCap, Globe, ShieldCheck, Users,
  BadgeCheck, Lock, Clock,
} from 'lucide-react';
import { ServicePageTemplate, ServicePageData } from './ServicePageTemplate';

// ── Air Transportation ───────────────────────────────────────────────────────

const airData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-air-transport.webp',
    eyebrow: 'IATA DGR · ICAO TI · Class 1–9 · Express & Scheduled',
    headline: 'Dangerous Goods Air Freight —',
    highlighted: 'IATA DGR Compliant.',
    sub: 'End-to-end IATA DGR air transport of hazardous materials across Mexico and worldwide. Classification, UN-certified packaging, Dangerous Goods Declaration, and airline coordination handled by certified specialists.',
  },
  overview: {
    eyebrow: 'Air Freight Solutions',
    headline: 'Complete Dangerous Goods Air Transport Service',
    paragraphs: [
      'Air transport of dangerous goods is the most tightly regulated transport mode in the world. Every shipment must be classified, packed, marked, labelled, and documented to exact IATA DGR specifications before any airline will accept it. A single error can ground your cargo, trigger regulatory fines, or result in a permanent carrier ban.',
      'Global Gate México acts as your full-service IATA DGR compliance partner — from initial classification through final delivery confirmation. Our certified team prepares the Dangerous Goods Declaration, selects the correct packing instruction, verifies quantity limits for passenger versus cargo aircraft, and coordinates acceptance directly with the carrier.',
    ],
    capabilities: [
      'IATA DGR classification and packing instruction selection',
      'Dangerous Goods Declaration (DGD) preparation and certification',
      'Class 1–9 hazardous materials — all hazard classes',
      'Passenger aircraft (PAX) and cargo aircraft only (CAO) compliance',
      'UN-certified inner and outer packaging supply',
      'Marking, labelling, and orientation arrow application',
      'Express air freight and scheduled cargo coordination',
      'Airline acceptance and NOTOC coordination',
    ],
    image: '/images/dg-transport/dg-warehouse-01.webp',
  },
  compliance: {
    headline: 'Applicable Air Transport Regulations',
    body: 'Every air shipment of dangerous goods we handle is validated against the full regulatory stack applicable to its origin, destination, and carrier — before a single label is applied.',
    standards: [
      {
        code: 'IATA DGR',
        name: 'Dangerous Goods Regulations',
        desc: 'The primary global standard for air transport of dangerous goods, updated annually. Governs classification, packing instructions, quantity limits, labelling, and documentation.',
      },
      {
        code: 'ICAO TI',
        name: 'Technical Instructions for Safe Transport by Air',
        desc: 'The binding ICAO legal framework from which IATA DGR is derived. Compliance is mandatory under international aviation law for all contracting states.',
      },
      {
        code: 'DOT 49 CFR',
        name: 'US Department of Transportation Regulations',
        desc: 'Applies to all air shipments transiting or entering the United States. Includes additional requirements beyond IATA DGR for certain materials.',
      },
      {
        code: 'AFAC / SCT',
        name: 'Mexican Civil Aviation Authority',
        desc: 'Mexican regulatory framework governing dangerous goods on commercial flights departing from or arriving at airports within Mexican territory.',
      },
    ],
  },
  process: {
    headline: 'How We Move Your Air Cargo Safely',
    body: 'Every air shipment of dangerous goods follows a strict four-step compliance workflow. No material moves to the airport until each step is completed and verified.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'DG Classification',
        desc: 'UN Number, Proper Shipping Name, Hazard Class, Packing Group, and Special Provisions identified. PAX vs. CAO quantity limits reviewed.',
      },
      {
        num: '02',
        Icon: Package,
        title: 'Packaging & Labelling',
        desc: 'IATA packing instruction applied. UN-certified packaging selected and prepared. Hazard labels, handling marks, and UN marks applied per spec.',
      },
      {
        num: '03',
        Icon: FileText,
        title: 'Documentation',
        desc: 'Shipper\'s Declaration for Dangerous Goods (DGD) prepared and certified. Emergency response information and NOTOCs coordinated.',
      },
      {
        num: '04',
        Icon: Plane,
        title: 'Airline Coordination',
        desc: 'Shipment tendered to carrier with full acceptance package. Flight booking confirmed. Tracking initiated from acceptance through final delivery.',
      },
    ],
  },
  whyGGM: {
    headline: 'The Right Partner for Dangerous Goods Air Cargo',
    body: 'Air transport of hazardous materials demands a specialist. Not a forwarder who handles DG occasionally — a team whose entire operation is built around it.',
    points: [
      {
        Icon: Award,
        title: 'IATA CBTA Certified School',
        desc: 'Authorized IATA Competency-Based Training and Assessment provider. Our staff are trained, assessed, and recertified to IATA standards.',
      },
      {
        Icon: GraduationCap,
        title: 'All 9 Hazard Classes',
        desc: 'We handle every dangerous goods hazard class including explosives (Class 1), radioactive materials (Class 7), and infectious substances (Class 6.2).',
      },
      {
        Icon: Globe,
        title: 'International Coverage',
        desc: 'Air cargo coordination to and from Mexico, the United States, Canada, Europe, and key international markets via major carriers.',
      },
      {
        Icon: ShieldCheck,
        title: 'Zero-Error Documentation',
        desc: 'Every Dangerous Goods Declaration is reviewed by a second certified DG specialist before acceptance — eliminating errors before they reach the airline.',
      },
      {
        Icon: Clock,
        title: 'Same-Day Assessment',
        desc: 'Urgent air cargo requirements accommodated with same-day DG classification assessment and documentation turnaround.',
      },
      {
        Icon: Users,
        title: 'Bilingual Compliance Team',
        desc: 'All documentation, airline coordination, and regulatory communication handled in Spanish and English by our bilingual specialists.',
      },
    ],
  },
  cta: {
    headline: 'Need to Move Dangerous Goods by Air?',
    sub: 'Our IATA-certified specialists will review your material, confirm packing requirements, and prepare your complete air cargo compliance package.',
  },
};

export const AirTransportationPage = () => <ServicePageTemplate data={airData} />;

// ── Ground Transportation ────────────────────────────────────────────────────

const groundData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-ground-transport.webp',
    eyebrow: 'SCT · NOM-002 · DOT 49 CFR · Cross-border US / Canada',
    headline: 'Dangerous Goods Road Transport —',
    highlighted: 'Certified & SCT Compliant.',
    sub: 'SCT NOM-compliant ground transport of hazardous materials across Mexico and cross-border to the United States and Canada. Certified drivers, dedicated DG fleet, real-time monitoring.',
  },
  overview: {
    eyebrow: 'Ground Transport Solutions',
    headline: 'Road Transport of Hazardous Materials Across Mexico and North America',
    paragraphs: [
      'Road transport of dangerous goods in Mexico is governed by NOM-002-SCT/2011 and a network of related SCT regulations covering classification, placarding, driver certification, vehicle standards, and emergency response. Cross-border operations into the United States and Canada add DOT 49 CFR and TDG requirements to the compliance stack.',
      'Global Gate México operates a dedicated dangerous goods fleet staffed by SCT-certified drivers with active hazardous materials endorsements. Every vehicle is equipped with the correct placards, spill containment equipment, fire suppression, and emergency response cards before a shipment moves. Our compliance team pre-screens every load against current regulations — no shortcuts.',
    ],
    capabilities: [
      'SCT NOM-002-SCT/2011 compliance for all road movements',
      'Federally certified DG drivers with hazmat endorsements',
      'Dedicated DG vehicle fleet with placards and spill kits',
      'Mexico-wide coverage including all industrial corridors',
      'Cross-border transport to the United States and Canada',
      'DOT 49 CFR and TDG compliance for cross-border shipments',
      'Real-time GPS tracking and chain-of-custody documentation',
      '24/7 emergency spill response protocols',
    ],
    image: '/images/dg-transport/dg-field-operations.webp',
  },
  compliance: {
    headline: 'Applicable Ground Transport Regulations',
    body: 'Our ground transport operations are validated against all applicable Mexican, US, and Canadian regulations before each shipment departs — covering classification, documentation, driver certification, and vehicle requirements.',
    standards: [
      {
        code: 'NOM-002-SCT',
        name: 'Mexican DG Road Transport Standard',
        desc: 'The primary Mexican standard governing classification, packaging, marking, placarding, documentation, and driver certification for hazardous materials road transport.',
      },
      {
        code: 'DOT 49 CFR',
        name: 'US Hazmat Regulations',
        desc: 'Applies to all cross-border shipments entering or transiting the United States. Includes hazmat carrier registration and specific shipping paper requirements.',
      },
      {
        code: 'TDG Act',
        name: 'Transport of Dangerous Goods Act (Canada)',
        desc: 'Canadian regulatory framework for all cross-border movements of hazardous materials into Canadian territory. Governs classification, documentation, and training.',
      },
      {
        code: 'ADR',
        name: 'International Road Transport Agreement',
        desc: 'Applied as an international reference standard for vehicle equipment specifications, driver training protocols, and emergency response requirements.',
      },
    ],
  },
  process: {
    headline: 'How We Move Dangerous Goods by Road',
    body: 'Every ground shipment undergoes a four-step compliance process before it leaves the origin. Driver, vehicle, documentation, and load are all verified before departure.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'Regulatory Assessment',
        desc: 'Material classified under SCT NOM and all applicable cross-border regulations. Route permits, bridge restrictions, and tunnel prohibitions reviewed.',
      },
      {
        num: '02',
        Icon: Truck,
        title: 'Vehicle & Driver Assignment',
        desc: 'SCT-certified driver assigned. Compliant vehicle verified for DG class. Placards installed. Spill kit, fire extinguisher, and ERI card confirmed on board.',
      },
      {
        num: '03',
        Icon: FileText,
        title: 'Documentation',
        desc: 'Shipping papers prepared per SCT/DOT requirements. Emergency response documentation completed. Driver certification and vehicle compliance records filed.',
      },
      {
        num: '04',
        Icon: Route,
        title: 'Transport & Monitoring',
        desc: 'Real-time GPS monitoring throughout transit. Chain-of-custody documentation maintained. Cross-border handoff and customs coordination handled.',
      },
    ],
  },
  whyGGM: {
    headline: 'Mexico\'s Dangerous Goods Road Transport Specialists',
    body: 'We don\'t move dangerous goods as a sideline — it\'s the only thing we do. Every driver, vehicle, and process in our fleet is purpose-built for hazardous cargo.',
    points: [
      {
        Icon: BadgeCheck,
        title: 'SCT-Certified Drivers',
        desc: 'All drivers hold active federal SCT dangerous goods certifications with hazmat endorsements, renewed on a strict annual cycle.',
      },
      {
        Icon: Truck,
        title: 'Dedicated DG Fleet',
        desc: 'Purpose-equipped vehicles with DG placards, spill containment systems, fire suppression equipment, and emergency response cards.',
      },
      {
        Icon: Globe,
        title: 'Cross-border Experience',
        desc: 'Proven logistics corridors across Mexico–US and Mexico–Canada borders, supported by bilingual compliance documentation and customs coordination.',
      },
      {
        Icon: Route,
        title: 'Mexico-wide Coverage',
        desc: 'Operations covering all major Mexican industrial corridors: Monterrey, Guadalajara, Mexico City, Puebla, and all primary border crossings.',
      },
      {
        Icon: ShieldCheck,
        title: 'Real-Time Tracking',
        desc: 'GPS monitoring and chain-of-custody documentation for every shipment, from point of origin to confirmed delivery.',
      },
      {
        Icon: Lock,
        title: '24/7 Emergency Response',
        desc: 'Emergency contacts, spill response protocols, and carrier notification procedures in place for every dangerous goods movement, around the clock.',
      },
    ],
  },
  cta: {
    headline: 'Ready to Move Dangerous Goods by Road?',
    sub: 'Our certified ground transport team will assess your load, confirm regulatory requirements, and deploy a compliant vehicle and driver for your shipment.',
  },
};

export const GroundTransportationPage = () => <ServicePageTemplate data={groundData} />;

// ── Ocean Freight ────────────────────────────────────────────────────────────

const oceanData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-ocean-freight.webp',
    eyebrow: 'IMDG Code · SOLAS · FCL & LCL · Port-to-Port',
    headline: 'Hazardous Cargo Ocean Freight —',
    highlighted: 'IMDG Code Compliant.',
    sub: 'Full IMDG Code compliance for containerized and bulk sea shipments of dangerous goods. Port coordination, hazmat manifests, stowage planning, and complete customs documentation handled end-to-end.',
  },
  overview: {
    eyebrow: 'Ocean Freight Solutions',
    headline: 'IMDG-Compliant Sea Freight for Hazardous Materials',
    paragraphs: [
      'Ocean shipping of dangerous goods requires precise IMDG Code compliance for packing, marking, labelling, placarding, stowage, segregation, and documentation. Non-compliant declarations result in port detentions, cargo rejection, vessel bans, and significant financial penalties — risks that increase with every error in the documentation chain.',
      'Global Gate México provides end-to-end IMDG compliance management for FCL and LCL dangerous goods shipments through Mexico\'s major international ports. Our certified specialists prepare the complete DG Manifest, coordinate container stowage and segregation planning, manage port acceptance, and handle all customs documentation — so your cargo ships on schedule.',
    ],
    capabilities: [
      'IMDG Code classification, packing, and stowage planning',
      'FCL (Full Container Load) and LCL (Less than Container Load)',
      'Port-to-port and door-to-door hazardous cargo service',
      'DG Manifest, Bill of Lading, and packing certificate preparation',
      'Cargo segregation and compatibility verification',
      'Marine pollutant identification and handling',
      'Port operations at Veracruz, Manzanillo, Lázaro Cárdenas, Altamira',
      'Mexican customs documentation and coordination',
    ],
    image: '/images/dg-transport/dg-operations-team.webp',
  },
  compliance: {
    headline: 'Applicable Ocean Freight Regulations',
    body: 'Every sea shipment of dangerous goods is validated against the full IMDG Code stack plus applicable port, customs, and flag-state regulations before the container is loaded.',
    standards: [
      {
        code: 'IMDG Code',
        name: 'International Maritime Dangerous Goods Code',
        desc: 'The global standard for transporting dangerous goods by sea. Covers classification, packing, marking, labelling, stowage, segregation, and documentation requirements.',
      },
      {
        code: 'SOLAS',
        name: 'Safety of Life at Sea Convention',
        desc: 'IMO convention mandating safe stowage, segregation, and handling of dangerous goods aboard all commercial vessels. Governs shipowner and shipper obligations.',
      },
      {
        code: 'MARPOL',
        name: 'Prevention of Pollution from Ships',
        desc: 'Governs the handling of marine pollutants within the IMDG Code framework. Applies to all substances classified as marine pollutants.',
      },
      {
        code: 'Port Regs',
        name: 'Mexican Port Authority Regulations',
        desc: 'Operational requirements for dangerous goods handling at Veracruz, Manzanillo, Lázaro Cárdenas, and Altamira — Mexico\'s primary international container ports.',
      },
    ],
  },
  process: {
    headline: 'How We Ship Your Dangerous Goods by Sea',
    body: 'Every ocean freight shipment goes through a four-stage compliance and coordination process — from initial IMDG classification through port delivery and cargo tracking.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'IMDG Classification',
        desc: 'UN Number, IMDG Hazard Class, Packing Group, marine pollutant status, and applicable Special Provisions identified under the current IMDG Code edition.',
      },
      {
        num: '02',
        Icon: Package,
        title: 'Packaging & Container Loading',
        desc: 'UN-certified packaging selected and prepared. Container stowage plan and cargo segregation requirements verified per IMDG Code Chapter 7.',
      },
      {
        num: '03',
        Icon: FileText,
        title: 'DG Manifest & Documentation',
        desc: 'IMDG Dangerous Goods Manifest, packing certificate, and Bill of Lading prepared. Emergency response contacts and port notifications coordinated.',
      },
      {
        num: '04',
        Icon: Ship,
        title: 'Port Coordination',
        desc: 'Container tendered at port of loading with full DG acceptance package. Customs clearance managed. Cargo tracked through to destination port delivery.',
      },
    ],
  },
  whyGGM: {
    headline: 'Your Partner for Hazardous Sea Cargo in Mexico',
    body: 'Ocean freight of dangerous goods demands deep IMDG expertise and strong port relationships. We bring both — built over nearly two decades of specialized operations.',
    points: [
      {
        Icon: Ship,
        title: 'Major Port Coverage',
        desc: 'Direct operational coverage at Veracruz, Manzanillo, Lázaro Cárdenas, and Altamira — Mexico\'s four primary international container ports.',
      },
      {
        Icon: Package,
        title: 'FCL & LCL Options',
        desc: 'Full container and less-than-container-load options for any volume of dangerous goods, from a single package to a full container of hazmat.',
      },
      {
        Icon: Globe,
        title: 'International Routes',
        desc: 'Regular service to North America, Europe, Asia, and South America via major shipping lines, with full IMDG compliance at every port of call.',
      },
      {
        Icon: FileText,
        title: 'Complete Documentation',
        desc: 'DG Manifest, Bill of Lading, packing certificate, customs documentation, and emergency response packages all prepared in-house by our specialists.',
      },
      {
        Icon: ShieldCheck,
        title: 'Stowage & Segregation',
        desc: 'Expert stowage planning and cargo segregation to IMDG Code requirements — preventing cargo rejection, port holds, and vessel compliance issues.',
      },
      {
        Icon: GraduationCap,
        title: 'IMDG Certified Specialists',
        desc: 'All ocean freight coordinators hold active IMDG Code certifications, renewed on a regular cycle in line with biennial IMDG Code amendments.',
      },
    ],
  },
  cta: {
    headline: 'Ready to Ship Dangerous Goods by Sea?',
    sub: 'Our IMDG-certified specialists will review your cargo, confirm packing and stowage requirements, and manage your complete ocean freight compliance package.',
  },
};

export const OceanFreightPage = () => <ServicePageTemplate data={oceanData} />;

// ── DG Packaging ─────────────────────────────────────────────────────────────

const packagingData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-process-packaging.webp',
    eyebrow: 'UN Certified · All Hazard Classes · IATA · IMDG · ADR · SCT',
    headline: 'UN-Certified Dangerous Goods Packaging —',
    highlighted: 'All Hazard Classes.',
    sub: 'In-house sourcing, preparation, and verification of UN-certified packaging for all nine hazard classes across air, sea, and ground transport modes. Every package leaves fully compliant.',
  },
  overview: {
    eyebrow: 'Packaging Solutions',
    headline: 'Compliant DG Packaging for Every Transport Mode and Hazard Class',
    paragraphs: [
      'Incorrect packaging is one of the most common causes of dangerous goods shipment rejection, incident, and regulatory penalty. UN-certified packaging must be matched to the specific hazard class, packing group, quantity, and transport mode — and must be prepared, closed, and marked to the exact specification of the applicable packing instruction.',
      'Global Gate México maintains in-house inventory of UN-certified drums, jerricans, boxes, and combination packaging for rapid turnaround. Our certified specialists select the correct packaging, verify performance test certificates, prepare inner packaging and cushioning, close and seal to specification, and apply all required marks and labels — before we hand your shipment to the carrier.',
    ],
    capabilities: [
      'UN-certified inner and outer packaging for all hazard classes',
      'Combination packaging, single packaging, and IBCs',
      'Performance-tested drums, jerricans, boxes, and bags',
      'Limited quantity and excepted quantity packaging',
      'IATA Packing Instruction compliance (PI 100–998)',
      'IMDG Code Chapter 4 packaging requirements',
      'ADR and SCT NOM packaging standards',
      'Custom packaging solutions for non-standard materials',
    ],
    image: '/images/dg-transport/dg-specialized-packaging.webp',
  },
  compliance: {
    headline: 'Applicable Packaging Regulations & Standards',
    body: 'Dangerous goods packaging must comply with the UN recommendations and the modal regulations of every transport mode in the shipment\'s journey. We verify against all applicable standards.',
    standards: [
      {
        code: 'UN Orange Book',
        name: 'UN Recommendations on Transport of DG',
        desc: 'The foundational global standard for dangerous goods packaging, defining performance testing requirements and the UN certification system.',
      },
      {
        code: 'IATA PI',
        name: 'IATA Packing Instructions (PI 100–998)',
        desc: 'Specific instructions governing inner and outer packaging, quantity limits, and closure requirements for every substance transported by air.',
      },
      {
        code: 'IMDG Ch.4',
        name: 'IMDG Code Packaging Requirements',
        desc: 'Comprehensive packaging requirements for sea transport including combination packaging, IBCs, and large packaging for all hazard classes.',
      },
      {
        code: 'ADR / SCT',
        name: 'Road Transport Packaging Standards',
        desc: 'ADR Chapter 4 and NOM-002-SCT/2011 packaging requirements for cross-border and domestic road transport of dangerous goods.',
      },
    ],
  },
  process: {
    headline: 'Our DG Packaging Process',
    body: 'Every package we prepare goes through a four-step selection, verification, preparation, and marking process before it is released for transport.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'Material Assessment',
        desc: 'Hazard class, packing group, net quantity, and transport mode identified. Applicable packing instruction and quantity limits confirmed.',
      },
      {
        num: '02',
        Icon: Package,
        title: 'Packaging Selection',
        desc: 'UN-certified packaging matched to requirements. Performance test certificate verified for validity. Compatibility with contents confirmed.',
      },
      {
        num: '03',
        Icon: CheckCircle,
        title: 'Preparation & Closure',
        desc: 'Inner packaging, absorbent material, cushioning, and closure prepared per specification. Quantity limits and closure torque verified.',
      },
      {
        num: '04',
        Icon: Tag,
        title: 'Marking & Verification',
        desc: 'UN marks, net quantity declarations, orientation arrows, and handling labels applied. Final compliance check before release to transport.',
      },
    ],
  },
  whyGGM: {
    headline: 'Your Dangerous Goods Packaging Specialists',
    body: 'We don\'t just supply packaging — we select it, prepare it, verify it, and take responsibility for its compliance. Every package that leaves our hands is transport-ready.',
    points: [
      {
        Icon: Package,
        title: 'In-House UN Packaging Stock',
        desc: 'Ready inventory of UN-certified drums, jerricans, fibreboard boxes, and combination packaging for rapid assessment and same-day preparation.',
      },
      {
        Icon: ShieldCheck,
        title: 'All Nine Hazard Classes',
        desc: 'Packaging solutions for every dangerous goods class including Class 1 (Explosives), Class 6 (Toxic), and Class 7 (Radioactive Materials).',
      },
      {
        Icon: Globe,
        title: 'All Transport Modes',
        desc: 'Packaging verified for IATA, IMDG, and ADR compliance simultaneously — critical for multi-modal shipments crossing multiple transport legs.',
      },
      {
        Icon: Award,
        title: 'Performance Test Certificates',
        desc: 'All UN packaging supplied with valid performance test certificates from approved testing laboratories. No uncertified packaging leaves our facility.',
      },
      {
        Icon: ClipboardList,
        title: 'Packaging Audit Services',
        desc: 'Pre-shipment packaging audits of your existing DG packaging program. We identify compliance gaps before your carrier or regulator does.',
      },
      {
        Icon: GraduationCap,
        title: 'Expert Guidance',
        desc: 'Our certified specialists advise on the most compliant and cost-effective packaging solution for your specific material, quantity, and transport route.',
      },
    ],
  },
  cta: {
    headline: 'Need UN-Certified Dangerous Goods Packaging?',
    sub: 'Our packaging specialists will identify the correct packing instruction, supply compliant packaging, and prepare your shipment to full regulatory specification.',
  },
};

export const DGPackagingPage = () => <ServicePageTemplate data={packagingData} />;

// ── Documentation Services ───────────────────────────────────────────────────

const documentationData: ServicePageData = {
  hero: {
    image: '/images/dg-transport/dg-documentation-services.webp',
    eyebrow: 'IATA · IMDG · SCT · DOT · GHS/SDS · Multi-Modal',
    headline: 'Dangerous Goods Documentation Services —',
    highlighted: 'Accurate. Certified. Multi-Modal.',
    sub: 'Professional preparation of all hazardous materials regulatory documentation — Dangerous Goods Declarations, Safety Data Sheets, shipper certifications, and compliance paperwork across all transport modes, in Spanish and English.',
  },
  overview: {
    eyebrow: 'Documentation Solutions',
    headline: 'Complete DG Documentation — The Foundation of Every Compliant Shipment',
    paragraphs: [
      'A correctly prepared Dangerous Goods Declaration is legally binding and operationally critical. Errors in documentation cause shipment rejection, regulatory fines, carrier liability, and in some cases criminal prosecution under international transport law. There is no room for approximation.',
      'Global Gate México\'s certified specialists prepare complete documentation packages for air (IATA/ICAO), sea (IMDG), and road (SCT/DOT) shipments. Every document is reviewed by a second certified professional before release. We also provide full Safety Data Sheet (SDS) services including preparation, translation, GHS formatting, and regulatory review in Spanish and English.',
    ],
    capabilities: [
      'Dangerous Goods Declaration — IATA/ICAO format (air)',
      'DG Manifest and packing certificate — IMDG format (sea)',
      'Shipping papers — SCT NOM format (Mexico road)',
      'Shipping papers — DOT 49 CFR format (US cross-border)',
      'Safety Data Sheet (SDS) preparation in GHS format',
      'SDS review, correction, and bilingual translation',
      'Shipper\'s certification and authorized signatory services',
      'Emergency response documentation (ERG, MFAG, ERI)',
    ],
    image: '/images/dg-transport/dg-warehouse-01.webp',
  },
  compliance: {
    headline: 'Documentation Standards We Work Under',
    body: 'Every document we prepare is validated against the current edition of the applicable modal regulation — not last year\'s standard, not an approximation. Current, complete, and compliant.',
    standards: [
      {
        code: 'IATA DGD',
        name: 'Shipper\'s Declaration for DG (Air)',
        desc: 'Mandatory IATA format Dangerous Goods Declaration for all air shipments of hazardous materials. Legally binding under IATA DGR and ICAO Technical Instructions.',
      },
      {
        code: 'IMDG Manifest',
        name: 'DG Manifest & Packing Certificate (Sea)',
        desc: 'Required IMDG documentation for all sea shipments of dangerous goods, including container packing certificates and emergency contact information.',
      },
      {
        code: 'SCT / DOT',
        name: 'Road Transport Shipping Papers',
        desc: 'Shipping papers required by NOM-002-SCT/2011 for domestic Mexican road movements and DOT 49 CFR for all cross-border shipments into the United States.',
      },
      {
        code: 'GHS / SDS',
        name: 'Safety Data Sheets (GHS Format)',
        desc: '16-section Safety Data Sheets prepared and reviewed to GHS/HazCom 2012 standard in Spanish and English. Includes regulatory review for accuracy.',
      },
    ],
  },
  process: {
    headline: 'How We Prepare Your DG Documentation',
    body: 'Our four-step documentation process ensures every document is classified correctly, reviewed thoroughly, and certified before it is released — with same-day turnaround available.',
    steps: [
      {
        num: '01',
        Icon: Search,
        title: 'Classification Review',
        desc: 'UN Number, Proper Shipping Name, Hazard Class, Packing Group, and Special Provisions verified against the current modal regulation edition.',
      },
      {
        num: '02',
        Icon: FileText,
        title: 'SDS Review & Preparation',
        desc: 'Existing Safety Data Sheets reviewed for accuracy and GHS compliance. New SDS prepared in 16-section GHS format in Spanish and/or English as required.',
      },
      {
        num: '03',
        Icon: ClipboardList,
        title: 'Declaration Preparation',
        desc: 'Complete regulatory documentation prepared to the applicable modal specification — IATA DGD, IMDG Manifest, SCT shipping paper, or DOT 49 CFR format.',
      },
      {
        num: '04',
        Icon: CheckCircle,
        title: 'Dual Review & Certification',
        desc: 'All documents reviewed by a second certified specialist. Final documents signed and certified by our authorized DG documentation professional.',
      },
    ],
  },
  whyGGM: {
    headline: 'Why Companies Trust Us with Their DG Documentation',
    body: 'DG documentation errors are not recoverable once a shipment is in transit. We built our documentation practice around elimination — not correction after the fact.',
    points: [
      {
        Icon: GraduationCap,
        title: 'IATA / IMDG Certified Preparers',
        desc: 'All documentation specialists hold current IATA Dangerous Goods Regulations and IMDG Code certifications. No generalists handling specialized documents.',
      },
      {
        Icon: Globe,
        title: 'Bilingual Documentation',
        desc: 'All DG declarations, SDS, and supporting compliance documents prepared in Spanish and English — covering all regulatory and commercial requirements.',
      },
      {
        Icon: Award,
        title: 'All Transport Modes',
        desc: 'Documentation specialists for air (IATA/ICAO), sea (IMDG), road (SCT/DOT), and multi-modal shipments — all under one roof.',
      },
      {
        Icon: Clock,
        title: 'Same-Day Turnaround',
        desc: 'Urgent documentation requests accommodated on a same-day basis. We understand that a missing declaration can delay an entire supply chain.',
      },
      {
        Icon: ShieldCheck,
        title: 'Dual Review Process',
        desc: 'Every document reviewed by a second certified specialist before release. A second set of certified eyes eliminates errors that single-reviewer systems miss.',
      },
      {
        Icon: ClipboardList,
        title: 'SDS Preparation & Review',
        desc: 'Full Safety Data Sheet services: preparation, translation, GHS formatting, regulatory review, and correction of non-compliant existing SDS.',
      },
    ],
  },
  cta: {
    headline: 'Need Dangerous Goods Documentation Prepared?',
    sub: 'Our certified specialists will review your material, prepare your complete documentation package, and certify every document to the applicable regulatory standard.',
  },
};

export const DocumentationServicesPage = () => <ServicePageTemplate data={documentationData} />;
