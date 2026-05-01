import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe, Phone, Mail, ChevronRight } from 'lucide-react';
import { Container, Button } from './UI';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.training'), href: '/training' },
    { name: t('nav.industries'), href: '#industries' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Utility Bar */}
      <div className="bg-dark text-white py-2 px-10 text-[11px] tracking-[0.05em] uppercase flex justify-between items-center hidden md:flex">
        <div>{t('nav.excellence')}</div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/globalgatemexico" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <img src={`${import.meta.env.BASE_URL}${encodeURIComponent('Instagram.png')}`} alt="Instagram" style={{ height: '18px', width: 'auto' }} />
            </a>
            <a href="https://www.linkedin.com/company/globalgatemexico" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <img src={`${import.meta.env.BASE_URL}${encodeURIComponent('LinkedIn.png')}`} alt="LinkedIn" style={{ height: '18px', width: 'auto' }} />
            </a>
          </div>
          <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-4">
            <button 
              onClick={() => setLanguage('ES')}
              className={cn("transition-colors", language === 'ES' ? "text-white font-bold" : "text-secondary hover:text-white")}
            >
              ES
            </button>
            <span className="opacity-30">|</span>
            <button 
              onClick={() => setLanguage('EN')}
              className={cn("transition-colors", language === 'EN' ? "text-white font-bold" : "text-secondary hover:text-white")}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav 
        className={cn(
          'transition-all duration-300 px-10 h-[70px] flex items-center justify-between border-b border-black/5',
          isScrolled ? 'bg-white shadow-sm' : 'bg-white'
        )}
      >
        <Link to="/" className="flex items-center">
          <img src="/GGM-SM.png" alt="Global Gate México" style={{ height: '44px', width: 'auto' }} />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            link.href.startsWith('#') ? (
              <a 
                key={link.name} 
                href={link.href}
                className="text-[13px] font-medium text-dark hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link 
                key={link.name} 
                to={link.href}
                className="text-[13px] font-medium text-dark hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('nav.contact')}
          </Button>
          <a href="https://portal.globalgatemexico.com/sign-in" target="_blank" rel="noopener noreferrer">
            <Button variant="gold" size="sm">
              {t('nav.quoteBtn')}
            </Button>
          </a>
        </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white bg-primary p-2 rounded-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-dark z-50 flex flex-col p-8 lg:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <img src="/GGM-SM.png" alt="Global Gate México" style={{ height: '44px', width: 'auto' }} />
              <button 
                className="text-white p-2 border border-white/10 rounded-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-3xl font-bold text-white hover:text-accent transition-colors flex items-center justify-between"
                    >
                      {link.name}
                      <ChevronRight className="text-accent" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-3xl font-bold text-white hover:text-accent transition-colors flex items-center justify-between"
                    >
                      {link.name}
                      <ChevronRight className="text-accent" />
                    </Link>
                  )}
                </motion.div>
              ))}
              {/* Language Switcher in Mobile Menu */}
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => setLanguage('ES')}
                  className={cn("text-xl transition-colors", language === 'ES' ? "text-white font-bold" : "text-secondary")}
                >
                  Español
                </button>
                <span className="text-secondary">|</span>
                <button 
                  onClick={() => setLanguage('EN')}
                  className={cn("text-xl transition-colors", language === 'EN' ? "text-white font-bold" : "text-secondary")}
                >
                  English
                </button>
              </div>
            </div>

            <div className="mt-auto pt-10 border-t border-white/10">
              <a href="https://portal.globalgatemexico.com/sign-in" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="gold" className="w-full py-6 text-xl" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('nav.quoteBtn')}
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
