import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ServicesPage, AboutPage } from './pages/Internal';
import { TrainingPage } from './pages/Training';
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
            <Route path="/training" element={<TrainingPage />} />
            <Route path="*"         element={<Home />} />
          </Routes>
        </Layout>
        <CookieConsent />
      </Router>
    </LanguageProvider>
  );
}
