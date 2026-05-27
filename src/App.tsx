import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ServicesPage, AboutPage, AcercaPage } from './pages/Internal';
import { TrainingPage } from './pages/Training';
import { CapacitacionPage } from './pages/Capacitacion';
import { DangerousGoodsTransportationPage } from './pages/DangerousGoodsTransportation';
import {
  AirTransportationPage,
  GroundTransportationPage,
  OceanFreightPage,
  DGPackagingPage,
  DocumentationServicesPage,
} from './pages/services';
import {
  TransporteAereoPage,
  TransporteTerrestrePage,
  TransporteMaritimoPage,
  EmbalajeDGPage,
  ServiciosDocumentacionPage,
} from './pages/services/es';
import { DGConsultingCompliancePage } from './pages/DGConsultingCompliance';
import { RadioactiveMaterialLogisticsPage } from './pages/RadioactiveMaterialLogistics';
import { LogisticaMaterialRadiacticoPage } from './pages/LogisticaMaterialRadiactivo';
import { TransporteMercanciasPeligrosasPage } from './pages/TransporteMercanciasPeligrosas';
import {
  DGCompliancePage,
  RegulatoryConsultingPage,
  ComplianceAuditsPage,
  SDSReviewPage,
  CrossBorderDGPage,
} from './pages/compliance';
import {
  CumplimientoDGPage,
  ConsultoriaRegulatoriaPage,
  AuditoriasCumplimientoPage,
  RevisionHDSPage,
  CumplimientoTransfronterizoPage,
} from './pages/compliance/es';
import { ContactPage } from './pages/Contact';
import { ContactoPage } from './pages/Contacto';
import { RequestQuotePage } from './pages/RequestQuote';
import { SolicitarCotizacionPage } from './pages/SolicitarCotizacion';
import { TrainingProposalPage } from './pages/TrainingProposal';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy';
import { LegalNoticePage } from './pages/LegalNotice';
import { TermsOfServicePage } from './pages/TermsOfService';
import { PoliticaDePrivacidadPage } from './pages/PoliticaDePrivacidad';
import { AvisoLegalPage } from './pages/AvisoLegal';
import { TerminosDeServicioPage } from './pages/TerminosDeServicio';
import { StandardTradeConditionsPage } from './pages/StandardTradeConditions';
import { CondicionesEstandarDeComercioPage } from './pages/CondicionesEstandarDeComercio';
import { DangerousGoodsGroundTransportationPage } from './pages/DangerousGoodsGroundTransportation';
import { TransporteTerrestreMercanciasPeligrosasPage } from './pages/TransporteTerrestreMercanciasPeligrosas';
import { ShipmentTrackingPage } from './pages/ShipmentTracking';
import { Layout } from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';
import { CookieConsent } from './components/CookieConsent';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dangerous-goods-transportation" element={<DangerousGoodsTransportationPage />} />
            <Route path="/es/transporte-mercancias-peligrosas" element={<TransporteMercanciasPeligrosasPage />} />
            <Route path="/services/air-transportation"    element={<AirTransportationPage />} />
            <Route path="/services/ground-transportation" element={<GroundTransportationPage />} />
            <Route path="/services/ocean-freight"         element={<OceanFreightPage />} />
            <Route path="/services/dg-packaging"          element={<DGPackagingPage />} />
            <Route path="/services/documentation-services" element={<DocumentationServicesPage />} />
            <Route path="/dangerous-goods-transportation/air-transportation"    element={<AirTransportationPage />} />
            <Route path="/dangerous-goods-transportation/ground-transportation" element={<GroundTransportationPage />} />
            <Route path="/dangerous-goods-transportation/ocean-freight"         element={<OceanFreightPage />} />
            <Route path="/dangerous-goods-transportation/dg-packaging"          element={<DGPackagingPage />} />
            <Route path="/dangerous-goods-transportation/documentation-services" element={<DocumentationServicesPage />} />
            <Route path="/es/transporte-mercancias-peligrosas/transporte-aereo"        element={<TransporteAereoPage />} />
            <Route path="/es/transporte-mercancias-peligrosas/transporte-terrestre"    element={<TransporteTerrestrePage />} />
            <Route path="/es/transporte-mercancias-peligrosas/transporte-maritimo"     element={<TransporteMaritimoPage />} />
            <Route path="/es/transporte-mercancias-peligrosas/embalaje-dg"             element={<EmbalajeDGPage />} />
            <Route path="/es/transporte-mercancias-peligrosas/servicios-documentacion" element={<ServiciosDocumentacionPage />} />
            <Route path="/dg-consulting-compliance"                      element={<DGConsultingCompliancePage />} />
            <Route path="/dg-compliance/dg-compliance"               element={<DGCompliancePage />} />
            <Route path="/dg-compliance/regulatory-consulting"        element={<RegulatoryConsultingPage />} />
            <Route path="/dg-compliance/compliance-audits"            element={<ComplianceAuditsPage />} />
            <Route path="/dg-compliance/sds-review"                   element={<SDSReviewPage />} />
            <Route path="/dg-compliance/cross-border-dg-compliance"   element={<CrossBorderDGPage />} />
            <Route path="/es/consultoria-cumplimiento-dg/cumplimiento-dg"              element={<CumplimientoDGPage />} />
            <Route path="/es/consultoria-cumplimiento-dg/consultoria-regulatoria"      element={<ConsultoriaRegulatoriaPage />} />
            <Route path="/es/consultoria-cumplimiento-dg/auditorias-cumplimiento"      element={<AuditoriasCumplimientoPage />} />
            <Route path="/es/consultoria-cumplimiento-dg/revision-hds"                element={<RevisionHDSPage />} />
            <Route path="/es/consultoria-cumplimiento-dg/cumplimiento-dg-transfronterizo" element={<CumplimientoTransfronterizoPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/acerca"   element={<AcercaPage />} />
            <Route path="/radioactive-material-logistics" element={<RadioactiveMaterialLogisticsPage />} />
            <Route path="/logistica-material-radiactivo" element={<LogisticaMaterialRadiacticoPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/es/capacitacion" element={<CapacitacionPage />} />
            <Route path="/contact"  element={<ContactPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/request-quote" element={<RequestQuotePage />} />
            <Route path="/solicitar-cotizacion" element={<SolicitarCotizacionPage />} />
            <Route path="/training-proposal" element={<TrainingProposalPage />} />
            <Route path="/privacy-policy"          element={<PrivacyPolicyPage />} />
            <Route path="/legal-notice"            element={<LegalNoticePage />} />
            <Route path="/terms-of-service"        element={<TermsOfServicePage />} />
            <Route path="/politica-de-privacidad"          element={<PoliticaDePrivacidadPage />} />
            <Route path="/aviso-legal"                     element={<AvisoLegalPage />} />
            <Route path="/terminos-de-servicio"            element={<TerminosDeServicioPage />} />
            <Route path="/standard-trade-conditions"       element={<StandardTradeConditionsPage />} />
            <Route path="/condiciones-estandar-de-comercio" element={<CondicionesEstandarDeComercioPage />} />
            <Route path="/dangerous-goods-ground-transportation" element={<DangerousGoodsGroundTransportationPage />} />
            <Route path="/transporte-terrestre-mercancias-peligrosas" element={<TransporteTerrestreMercanciasPeligrosasPage />} />
            <Route path="/shipment-tracking" element={<ShipmentTrackingPage />} />
            <Route path="*"         element={<Home />} />
          </Routes>
        </Layout>
        <CookieConsent />
      </Router>
    </LanguageProvider>
  );
}
