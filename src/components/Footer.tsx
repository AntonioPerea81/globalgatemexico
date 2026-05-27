import { Container } from './UI';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { language } = useLanguage();
  const isES = language === 'ES';

  return (
    <footer className="bg-dark text-white">
      {/* Main footer body */}
      <div className="border-b border-white/10 py-14">
        <Container>
          <div className="flex flex-col md:flex-row justify-between gap-12">

            {/* Contact column */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-accent">
                {isES ? 'Contacto' : 'Contact'}
              </h4>
              <ul className="space-y-3 text-[13px] text-white/60">
                <li>
                  <a href="tel:+528121654040" className="hover:text-white transition-colors">+52 812 165 4040</a>
                </li>
                <li>
                  <a href="mailto:ggm@globalgatemexico.com" className="hover:text-white transition-colors">ggm@globalgatemexico.com</a>
                </li>
              </ul>
            </div>

            {/* Legal column */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-accent">Legal</h4>
              <ul className="space-y-3 text-[13px] text-white/60">
                {isES ? (
                  <>
                    <li>
                      <Link to="/politica-de-privacidad" className="hover:text-white transition-colors">
                        Política de Privacidad
                      </Link>
                    </li>
                    <li>
                      <Link to="/terminos-de-servicio" className="hover:text-white transition-colors">
                        Términos y Condiciones de Uso
                      </Link>
                    </li>
                    <li>
                      <Link to="/aviso-legal" className="hover:text-white transition-colors">
                        Aviso Legal
                      </Link>
                    </li>
                    <li>
                      <Link to="/condiciones-estandar-de-comercio" className="hover:text-white transition-colors">
                        Condiciones Estándar de Comercio
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                    </li>
                    <li>
                      <Link to="/legal-notice" className="hover:text-white transition-colors">Legal Notice</Link>
                    </li>
                    <li>
                      <Link to="/standard-trade-conditions" className="hover:text-white transition-colors">
                        Standard Trade Conditions
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="py-5">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} Global Gate México. {isES ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          <p className="text-[11px] text-white/20 uppercase tracking-widest">
            {isES ? 'Autoridad en Mercancías Peligrosas · México' : 'Dangerous Goods Authority · Mexico'}
          </p>
        </Container>
      </div>
    </footer>
  );
};
