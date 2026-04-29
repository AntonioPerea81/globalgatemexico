import { Globe, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Container } from './UI';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white border-t border-black/5 py-8">
      <Container className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[12px] text-secondary">
          &copy; {new Date().getFullYear()} {t('footer.copy')}
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            {['IATA Member', 'IMDG Certified', 'ISO 9001'].map(seal => (
              <div key={seal} className="px-3 py-1.5 border border-secondary text-[9px] font-bold uppercase tracking-wider text-secondary">
                {seal}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-6 border-l border-dark/10 pl-8 ml-4 hidden md:flex">
            <a href="#" className="text-primary text-[12px] font-bold hover:underline transition-all">{t('footer.linkedin')}</a>
            <a href="#" className="text-primary text-[12px] font-bold hover:underline transition-all">{t('footer.privacy')}</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
