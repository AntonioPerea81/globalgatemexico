import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Instagram, Linkedin } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

interface SubItem { label: string; href: string; }
interface NavItem {
  id: string;
  label: string;
  href?: string;
  hash?: string;       // scroll-to anchor id on current page
  dropdown?: SubItem[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'dgt',
    label: 'Dangerous Goods Transportation',
    dropdown: [
      { label: 'Air Transportation',      href: '/services/air-transportation' },
      { label: 'Ground Transportation',   href: '/services/ground-transportation' },
      { label: 'Ocean Freight',           href: '/services/ocean-freight' },
      { label: 'DG Packaging',            href: '/services/dg-packaging' },
      { label: 'Documentation Services',  href: '/services/documentation-services' },
    ],
  },
  {
    id: 'dgc',
    label: 'DG Consulting & Compliance',
    href: '/dg-consulting-compliance',
    dropdown: [
      { label: 'DG Compliance',              href: '/dg-consulting-compliance' },
      { label: 'Regulatory Consulting',      href: '/dg-consulting-compliance' },
      { label: 'Compliance Audits',          href: '/dg-consulting-compliance' },
      { label: 'SDS Review',                 href: '/dg-consulting-compliance' },
      { label: 'Cross-Border DG Compliance', href: '/dg-consulting-compliance' },
    ],
  },
  {
    id: 'training',
    label: 'Training',
    dropdown: [
      { label: 'IATA Training',           href: '/training' },
      { label: 'IMDG Training',           href: '/training' },
      { label: 'Ground Transportation',   href: '/training' },
      { label: 'WHMIS / HazCom',          href: '/training' },
      { label: 'Corporate Training',      href: '/training' },
    ],
  },
  {
    id: 'radioactive',
    label: 'Radioactive Material Logistics',
    dropdown: [
      { label: 'Class 7 Transportation',  href: '/services' },
      { label: 'Radioactive Storage',     href: '/services' },
      { label: 'Packaging & Labelling',   href: '/services' },
      { label: 'CNSNS Compliance',        href: '/services' },
    ],
  },
  { id: 'about',   label: 'About Us', href: '/about' },
  { id: 'contact', label: 'Contact',  hash: 'contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { language, setLanguage }           = useLanguage();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1280) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function openDD(id: string) {
    clearTimeout(closeTimer.current);
    setActiveDropdown(id);
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 140);
  }
  function cancelClose() {
    clearTimeout(closeTimer.current);
  }

  function scrollToContact() {
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, mobileOpen ? 300 : 0);
  }

  // Transparent at top of page, solid dark navy once scrolled (or mobile open)
  const solid = isScrolled || mobileOpen;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Utility bar ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'hidden md:flex bg-[#070f1c] border-b border-white/5 transition-all duration-300 overflow-hidden',
          solid ? 'max-h-0 opacity-0 border-b-0' : 'max-h-10 opacity-100'
        )}
      >
        <div className="w-full px-8 lg:px-12 py-[7px] flex justify-between items-center">
          <span className="text-[9px] text-white/35 tracking-[0.18em] uppercase font-medium">
            IATA · IMDG · ADR · IATA CBTA Provider · CNSNS
          </span>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/globalgatemexico/"
                target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white/80 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={12} />
              </a>
              <a
                href="https://www.linkedin.com/company/global-gate-mexico/?viewAsMember=true"
                target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white/80 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={12} />
              </a>
            </div>
            <div className="flex items-center gap-2 border-l border-white/10 pl-4 text-[10px] tracking-widest">
              <button
                onClick={() => setLanguage('ES')}
                className={cn('transition-colors uppercase', language === 'ES' ? 'text-white font-bold' : 'text-white/35 hover:text-white/80')}
              >ES</button>
              <span className="text-white/15">|</span>
              <button
                onClick={() => setLanguage('EN')}
                className={cn('transition-colors uppercase', language === 'EN' ? 'text-white font-bold' : 'text-white/35 hover:text-white/80')}
              >EN</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ────────────────────────────────────────────────────── */}
      <nav
        className={cn(
          'h-[66px] flex items-center justify-between px-8 lg:px-12 transition-all duration-300',
          solid
            ? 'bg-[#060e1c] border-b border-white/[0.07] shadow-[0_4px_32px_rgba(0,0,0,0.45)]'
            : 'bg-transparent'
        )}
      >
        {/* Logo */}
        <Link to="/" className="shrink-0 z-10" aria-label="Global Gate México — Home">
          <img src="/GGM-SM.png" alt="Global Gate México" style={{ height: '56px', width: 'auto' }} />
        </Link>

        {/* Desktop nav items — visible at xl (≥1280 px) */}
        <div className="hidden xl:flex items-center h-full ml-6 2xl:ml-10">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className="relative h-full flex items-center"
              onMouseEnter={() => item.dropdown && openDD(item.id)}
              onMouseLeave={() => item.dropdown && scheduleClose()}
            >
              {/* Trigger */}
              {item.hash ? (
                <button
                  onClick={scrollToContact}
                  className="flex items-center gap-1 px-3 2xl:px-4 h-full text-[11px] font-semibold tracking-[0.08em] uppercase text-white/65 hover:text-white transition-colors whitespace-nowrap"
                >
                  {item.label}
                </button>
              ) : item.href && !item.dropdown ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 px-3 2xl:px-4 h-full text-[11px] font-semibold tracking-[0.08em] uppercase text-white/65 hover:text-white transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                /* dropdown trigger — Link when href present, button otherwise */
                item.href ? (
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 2xl:px-4 h-full text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors whitespace-nowrap',
                      activeDropdown === item.id ? 'text-white' : 'text-white/65 hover:text-white'
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={11}
                      className={cn(
                        'shrink-0 transition-transform duration-200',
                        activeDropdown === item.id && 'rotate-180'
                      )}
                    />
                  </Link>
                ) : (
                  <button
                    className={cn(
                      'flex items-center gap-1.5 px-3 2xl:px-4 h-full text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors whitespace-nowrap',
                      activeDropdown === item.id ? 'text-white' : 'text-white/65 hover:text-white'
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={11}
                      className={cn(
                        'shrink-0 transition-transform duration-200',
                        activeDropdown === item.id && 'rotate-180'
                      )}
                    />
                  </button>
                )
              )}

              {/* Active underline indicator */}
              {activeDropdown === item.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary"
                />
              )}

              {/* Dropdown panel */}
              {item.dropdown && (
                <AnimatePresence>
                  {activeDropdown === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14, ease: 'easeOut' }}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                      className="absolute top-full left-0 min-w-[230px] bg-[#060e1c] border border-white/[0.08] shadow-[0_20px_48px_rgba(0,0,0,0.55)] z-50"
                    >
                      {/* Accent line at top of panel */}
                      <div className="h-[2px] bg-primary w-full" />
                      <div className="py-2">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-center px-5 py-[10px] text-[10px] font-semibold tracking-[0.1em] uppercase text-white/50 hover:text-white hover:bg-white/[0.04] transition-all border-l-2 border-transparent hover:border-primary/70"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* Right side: language (scrolled only) + mobile toggle */}
        <div className="flex items-center gap-4 ml-auto xl:ml-6">

          {/* Language toggle — desktop, fades in once utility bar collapses */}
          <div
            className={cn(
              'hidden xl:flex items-center gap-2 text-[10px] tracking-widest transition-all duration-300',
              solid ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <button
              onClick={() => setLanguage('ES')}
              className={cn('uppercase transition-colors', language === 'ES' ? 'text-white font-bold' : 'text-white/35 hover:text-white/80')}
            >ES</button>
            <span className="text-white/15">|</span>
            <button
              onClick={() => setLanguage('EN')}
              className={cn('uppercase transition-colors', language === 'EN' ? 'text-white font-bold' : 'text-white/35 hover:text-white/80')}
            >EN</button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="xl:hidden text-white/80 hover:text-white p-2 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen menu ──────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            className="fixed inset-0 bg-[#060e1c] z-40 flex flex-col xl:hidden"
          >
            {/* Mobile header row */}
            <div className="flex justify-between items-center px-8 py-4 border-b border-white/[0.07] shrink-0">
              <img src="/GGM-SM.png" alt="Global Gate México" style={{ height: '46px', width: 'auto' }} />
              <button
                className="text-white/60 hover:text-white p-2 transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X size={21} />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto px-8 py-4">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.045 }}
                  className="border-b border-white/[0.06]"
                >
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.id ? null : item.id)}
                        className="w-full flex items-center justify-between py-4 text-[11px] font-bold text-white/70 uppercase tracking-[0.1em] hover:text-white transition-colors"
                      >
                        {item.label}
                        <ChevronDown
                          size={13}
                          className={cn('shrink-0 transition-transform duration-200', mobileExpanded === item.id && 'rotate-180')}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-3 pl-3 flex flex-col gap-0.5">
                              {item.dropdown.map((sub) => (
                                <Link
                                  key={sub.label}
                                  to={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="py-2.5 px-3 text-[10px] font-semibold text-white/45 hover:text-white uppercase tracking-[0.1em] border-l-2 border-primary/25 hover:border-primary/70 transition-all"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : item.hash ? (
                    <button
                      onClick={scrollToContact}
                      className="w-full text-left py-4 text-[11px] font-bold text-white/70 uppercase tracking-[0.1em] hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.href!}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-[11px] font-bold text-white/70 uppercase tracking-[0.1em] hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Mobile bottom: language only */}
            <div className="shrink-0 px-8 py-6 border-t border-white/[0.07]">
              <div className="flex items-center gap-4 text-[12px]">
                <button
                  onClick={() => setLanguage('ES')}
                  className={cn('uppercase tracking-widest transition-colors', language === 'ES' ? 'text-white font-bold' : 'text-white/35 hover:text-white/70')}
                >
                  Español
                </button>
                <span className="text-white/15">|</span>
                <button
                  onClick={() => setLanguage('EN')}
                  className={cn('uppercase tracking-widest transition-colors', language === 'EN' ? 'text-white font-bold' : 'text-white/35 hover:text-white/70')}
                >
                  English
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
