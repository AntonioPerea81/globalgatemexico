import { Linkedin, Instagram } from 'lucide-react';
import { Container } from './UI';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white border-t border-black/5 py-8">
      <Container className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[12px] text-secondary">
          &copy; {new Date().getFullYear()} Global Gate México
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com/company/globalgatemexico"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://www.instagram.com/globalgatemexico"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
        </div>
      </Container>
    </footer>
  );
};
