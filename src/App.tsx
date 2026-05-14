import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ServicesPage, AboutPage, TrainingPage } from './pages/Internal';
import { DangerousGoodsTransportationPage } from './pages/DangerousGoodsTransportation';
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
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
        <CookieConsent />
      </Router>
    </LanguageProvider>
  );
}
