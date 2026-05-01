import { Container } from './UI';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const logosSrc = `${(import.meta as any).env?.BASE_URL || '/'}${encodeURIComponent('Logos SM.png')}`;

const SocialIcon = ({ href, label, position }: { href: string; label: string; position: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="hover:opacity-70 transition-opacity"
  >
    <div
      style={{
        width: '36px',
        height: '36px',
        backgroundImage: `url(${logosSrc})`,
        backgroundSize: '200% 100%',
        backgroundPosition: position,
        backgroundRepeat: 'no-repeat',
      }}
    />
  </a>
);

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-dark text-white">
      {/* Main footer body */}
      <div className="border-b border-white/10 py-14">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Brand column */}
            <div className="space-y-5">
              <img src="/GGM-SM.png" alt="Global Gate México" style={{ height: '40px', width: 'auto' }} />
              <p className="text-[13px] text-white/50 leading-relaxed max-w-xs">
                Specialized dangerous goods logistics and compliance from Mexico to the world.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <SocialIcon href="https://www.instagram.com/globalgatemexico" label="Instagram" position="0% 50%" />
                <SocialIcon href="https://www.linkedin.com/company/globalgatemexico" label="LinkedIn" position="100% 50%" />
              </div>
            </div>

            {/* Contact column */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-accent">Contact</h4>
              <ul className="space-y-3 text-[13px] text-white/60">
                <li>
                  <a href="tel:+528121654040" className="hover:text-white transition-colors">+52 812 165 4040</a>
                </li>
                <li>
                  <a href="mailto:ggm@globalgatemexico.com" className="hover:text-white transition-colors">ggm@globalgatemexico.com</a>
                </li>
                <li className="text-white/40">Monterrey, Nuevo León, México</li>
              </ul>
            </div>

            {/* Legal column */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-accent">Legal</h4>
              <ul className="space-y-3 text-[13px] text-white/60">
                <li>
                  <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/legal-notice" className="hover:text-white transition-colors">Legal Notice</Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                </li>
              </ul>
            </div>

          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="py-5">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} Global Gate México. All rights reserved.
          </p>
          <p className="text-[11px] text-white/20 uppercase tracking-widest">
            Dangerous Goods Authority · Mexico
          </p>
        </Container>
      </div>
    </footer>
  );
};
