import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ServicesPage, AboutPage, TrainingPage } from './pages/Internal';
import { DangerousGoodsTransportationPage } from './pages/DangerousGoodsTransportation';
import {
  AirTransportationPage,
  GroundTransportationPage,
  OceanFreightPage,
  DGPackagingPage,
  DocumentationServicesPage,
} from './pages/services';
import { DGConsultingCompliancePage } from './pages/DGConsultingCompliance';
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
            <Route path="/services/air-transportation"    element={<AirTransportationPage />} />
            <Route path="/services/ground-transportation" element={<GroundTransportationPage />} />
            <Route path="/services/ocean-freight"         element={<OceanFreightPage />} />
            <Route path="/services/dg-packaging"          element={<DGPackagingPage />} />
            <Route path="/services/documentation-services" element={<DocumentationServicesPage />} />
            <Route path="/dg-consulting-compliance"         element={<DGConsultingCompliancePage />} />
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
