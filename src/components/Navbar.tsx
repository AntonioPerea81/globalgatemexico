import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Instagram, Linkedin } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

interface SubItem { label: { EN: string; ES: string }; href: { EN: string; ES: string }; }
interface NavItem {
  id: string;
  label: { EN: string; ES: string };
  href?: string;
  hash?: string;
  dropdown?: SubItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: { EN: 'Home', ES: 'Inicio' },
    href: '/',
  },
  {
    id: 'dgt',
    label: { EN: 'Dangerous Goods Transportation', ES: 'Transporte de Mercancías Peligrosas' },
    dropdown: [
      { label: { EN: 'Air Transportation',     ES: 'Transporte Aéreo' },           href: { EN: '/dangerous-goods-transportation/air-transportation',    ES: '/es/transporte-mercancias-peligrosas/transporte-aereo' } },
      { label: { EN: 'Ground Transportation',  ES: 'Transporte Terrestre' },        href: { EN: '/dangerous-goods-transportation/ground-transportation',  ES: '/es/transporte-mercancias-peligrosas/transporte-terrestre' } },
      { label: { EN: 'Ocean Freight',          ES: 'Transporte Marítimo' },         href: { EN: '/dangerous-goods-transportation/ocean-freight',          ES: '/es/transporte-mercancias-peligrosas/transporte-maritimo' } },
      { label: { EN: 'DG Packaging',           ES: 'Embalaje DG' },                href: { EN: '/dangerous-goods-transportation/dg-packaging',           ES: '/es/transporte-mercancias-peligrosas/embalaje-dg' } },
      { label: { EN: 'Documentation Services', ES: 'Servicios de Documentación' }, href: { EN: '/dangerous-goods-transportation/documentation-services',  ES: '/es/transporte-mercancias-peligrosas/servicios-documentacion' } },
    ],
  },
  {
    id: 'dgc',
    label: { EN: 'DG Consulting & Compliance', ES: 'Consultoría y Cumplimiento DG' },
    href: '/dg-consulting-compliance',
    dropdown: [
      { label: { EN: 'DG Compliance',              ES: 'Cumplimiento DG' },                 href: { EN: '/dg-compliance/dg-compliance',              ES: '/es/consultoria-cumplimiento-dg/cumplimiento-dg' } },
      { label: { EN: 'Regulatory Consulting',      ES: 'Consultoría Regulatoria' },          href: { EN: '/dg-compliance/regulatory-consulting',      ES: '/es/consultoria-cumplimiento-dg/consultoria-regulatoria' } },
      { label: { EN: 'Compliance Audits',          ES: 'Auditorías de Cumplimiento' },       href: { EN: '/dg-compliance/compliance-audits',          ES: '/es/consultoria-cumplimiento-dg/auditorias-cumplimiento' } },
      { label: { EN: 'SDS Review',                 ES: 'Revisión de HDS' },                 href: { EN: '/dg-compliance/sds-review',                 ES: '/es/consultoria-cumplimiento-dg/revision-hds' } },
      { label: { EN: 'Cross-Border DG Compliance', ES: 'Cumplimiento DG Transfronterizo' }, href: { EN: '/dg-compliance/cross-border-dg-compliance', ES: '/es/consultoria-cumplimiento-dg/cumplimiento-dg-transfronterizo' } },
    ],
  },
  {
    id: 'training',
    label: { EN: 'Training', ES: 'Capacitación' },
    dropdown: [
      { label: { EN: 'IATA Training',          ES: 'Capacitación IATA' },        href: { EN: '/training', ES: '/es/capacitacion' } },
      { label: { EN: 'IMDG Training',          ES: 'Capacitación IMDG' },        href: { EN: '/training', ES: '/es/capacitacion' } },
      { label: { EN: 'Ground Transportation',  ES: 'Transporte Terrestre' },     href: { EN: '/training', ES: '/es/capacitacion' } },
      { label: { EN: 'WHMIS / HazCom',         ES: 'WHMIS / HazCom' },          href: { EN: '/training', ES: '/es/capacitacion' } },
      { label: { EN: 'Corporate Training',     ES: 'Capacitación Corporativa' }, href: { EN: '/training', ES: '/es/capacitacion' } },
    ],
  },
  {
    id: 'radioactive',
    label: { EN: 'Radioactive Material Logistics', ES: 'Logística de Material Radiactivo' },
    href: '/radioactive-material-logistics',
  },
  {
    id: 'about',
    label: { EN: 'About Us', ES: 'Nosotros' },
    href: '/about',
  },
  {
    id: 'contact',
    label: { EN: 'Contact', ES: 'Contacto' },
    hash: 'contact',
  },
];

// Route equivalents for EN ↔ ES language switching
const ROUTE_EQUIVALENTS: Record<string, { EN: string; ES: string }> = {
  '/dangerous-goods-transportation':                                       { EN: '/dangerous-goods-transportation',                                      ES: '/es/transporte-mercancias-peligrosas' },
  '/es/transporte-mercancias-peligrosas':                                  { EN: '/dangerous-goods-transportation',                                      ES: '/es/transporte-mercancias-peligrosas' },
  '/dangerous-goods-transportation/air-transportation':                    { EN: '/dangerous-goods-transportation/air-transportation',                   ES: '/es/transporte-mercancias-peligrosas/transporte-aereo' },
  '/es/transporte-mercancias-peligrosas/transporte-aereo':                 { EN: '/dangerous-goods-transportation/air-transportation',                   ES: '/es/transporte-mercancias-peligrosas/transporte-aereo' },
  '/dangerous-goods-transportation/ground-transportation':                 { EN: '/dangerous-goods-transportation/ground-transportation',                ES: '/es/transporte-mercancias-peligrosas/transporte-terrestre' },
  '/es/transporte-mercancias-peligrosas/transporte-terrestre':             { EN: '/dangerous-goods-transportation/ground-transportation',                ES: '/es/transporte-mercancias-peligrosas/transporte-terrestre' },
  '/dangerous-goods-transportation/ocean-freight':                         { EN: '/dangerous-goods-transportation/ocean-freight',                        ES: '/es/transporte-mercancias-peligrosas/transporte-maritimo' },
  '/es/transporte-mercancias-peligrosas/transporte-maritimo':              { EN: '/dangerous-goods-transportation/ocean-freight',                        ES: '/es/transporte-mercancias-peligrosas/transporte-maritimo' },
  '/dangerous-goods-transportation/dg-packaging':                          { EN: '/dangerous-goods-transportation/dg-packaging',                         ES: '/es/transporte-mercancias-peligrosas/embalaje-dg' },
  '/es/transporte-mercancias-peligrosas/embalaje-dg':                      { EN: '/dangerous-goods-transportation/dg-packaging',                         ES: '/es/transporte-mercancias-peligrosas/embalaje-dg' },
  '/dangerous-goods-transportation/documentation-services':                { EN: '/dangerous-goods-transportation/documentation-services',               ES: '/es/transporte-mercancias-peligrosas/servicios-documentacion' },
  '/es/transporte-mercancias-peligrosas/servicios-documentacion':          { EN: '/dangerous-goods-transportation/documentation-services',               ES: '/es/transporte-mercancias-peligrosas/servicios-documentacion' },
  '/dg-compliance/dg-compliance':                                          { EN: '/dg-compliance/dg-compliance',                                          ES: '/es/consultoria-cumplimiento-dg/cumplimiento-dg' },
  '/es/consultoria-cumplimiento-dg/cumplimiento-dg':                       { EN: '/dg-compliance/dg-compliance',                                          ES: '/es/consultoria-cumplimiento-dg/cumplimiento-dg' },
  '/dg-compliance/regulatory-consulting':                                  { EN: '/dg-compliance/regulatory-consulting',                                  ES: '/es/consultoria-cumplimiento-dg/consultoria-regulatoria' },
  '/es/consultoria-cumplimiento-dg/consultoria-regulatoria':               { EN: '/dg-compliance/regulatory-consulting',                                  ES: '/es/consultoria-cumplimiento-dg/consultoria-regulatoria' },
  '/dg-compliance/compliance-audits':                                      { EN: '/dg-compliance/compliance-audits',                                      ES: '/es/consultoria-cumplimiento-dg/auditorias-cumplimiento' },
  '/es/consultoria-cumplimiento-dg/auditorias-cumplimiento':               { EN: '/dg-compliance/compliance-audits',                                      ES: '/es/consultoria-cumplimiento-dg/auditorias-cumplimiento' },
  '/dg-compliance/sds-review':                                             { EN: '/dg-compliance/sds-review',                                             ES: '/es/consultoria-cumplimiento-dg/revision-hds' },
  '/es/consultoria-cumplimiento-dg/revision-hds':                          { EN: '/dg-compliance/sds-review',                                             ES: '/es/consultoria-cumplimiento-dg/revision-hds' },
  '/dg-compliance/cross-border-dg-compliance':                             { EN: '/dg-compliance/cross-border-dg-compliance',                             ES: '/es/consultoria-cumplimiento-dg/cumplimiento-dg-transfronterizo' },
  '/es/consultoria-cumplimiento-dg/cumplimiento-dg-transfronterizo':       { EN: '/dg-compliance/cross-border-dg-compliance',                             ES: '/es/consultoria-cumplimiento-dg/cumplimiento-dg-transfronterizo' },
  '/training':                                                             { EN: '/training',                                                               ES: '/es/capacitacion' },
  '/es/capacitacion':                                                      { EN: '/training',                                                               ES: '/es/capacitacion' },
  '/radioactive-material-logistics':                                       { EN: '/radioactive-material-logistics',                                         ES: '/radioactive-material-logistics' },
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { language, setLanguage }           = useLanguage();
  const navigate                            = useNavigate();
  const location                            = useLocation();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  function switchLanguage(lang: 'EN' | 'ES') {
    const equivalent = ROUTE_EQUIVALENTS[location.pathname];
    if (equivalent) navigate(equivalent[lang]);
    setLanguage(lang);
  }

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
                onClick={() => switchLanguage('ES')}
                className={cn('transition-colors uppercase', language === 'ES' ? 'text-white font-bold' : 'text-white/35 hover:text-white/80')}
              >ES</button>
              <span className="text-white/15">|</span>
              <button
                onClick={() => switchLanguage('EN')}
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

        {/* Desktop nav items */}
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
                  {item.label[language]}
                </button>
              ) : item.href && !item.dropdown ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 px-3 2xl:px-4 h-full text-[11px] font-semibold tracking-[0.08em] uppercase text-white/65 hover:text-white transition-colors whitespace-nowrap"
                >
                  {item.label[language]}
                </Link>
              ) : (
                item.href ? (
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 2xl:px-4 h-full text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors whitespace-nowrap',
                      activeDropdown === item.id ? 'text-white' : 'text-white/65 hover:text-white'
                    )}
                  >
                    {item.label[language]}
                    <ChevronDown
                      size={11}
                      className={cn('shrink-0 transition-transform duration-200', activeDropdown === item.id && 'rotate-180')}
                    />
                  </Link>
                ) : (
                  <button
                    className={cn(
                      'flex items-center gap-1.5 px-3 2xl:px-4 h-full text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors whitespace-nowrap',
                      activeDropdown === item.id ? 'text-white' : 'text-white/65 hover:text-white'
                    )}
                  >
                    {item.label[language]}
                    <ChevronDown
                      size={11}
                      className={cn('shrink-0 transition-transform duration-200', activeDropdown === item.id && 'rotate-180')}
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
                      <div className="h-[2px] bg-primary w-full" />
                      <div className="py-2">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href.EN + sub.label.EN}
                            to={sub.href[language]}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-center px-5 py-[10px] text-[10px] font-semibold tracking-[0.1em] uppercase text-white/50 hover:text-white hover:bg-white/[0.04] transition-all border-l-2 border-transparent hover:border-primary/70"
                          >
                            {sub.label[language]}
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

        {/* Right side: language toggle (scrolled) + mobile hamburger */}
        <div className="flex items-center gap-4 ml-auto xl:ml-6">

          <div
            className={cn(
              'hidden xl:flex items-center gap-2 text-[10px] tracking-widest transition-all duration-300',
              solid ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <button
              onClick={() => switchLanguage('ES')}
              className={cn('uppercase transition-colors', language === 'ES' ? 'text-white font-bold' : 'text-white/35 hover:text-white/80')}
            >ES</button>
            <span className="text-white/15">|</span>
            <button
              onClick={() => switchLanguage('EN')}
              className={cn('uppercase transition-colors', language === 'EN' ? 'text-white font-bold' : 'text-white/35 hover:text-white/80')}
            >EN</button>
          </div>

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
            {/* Mobile header */}
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
                        {item.label[language]}
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
                                  key={sub.href.EN + sub.label.EN}
                                  to={sub.href[language]}
                                  onClick={() => setMobileOpen(false)}
                                  className="py-2.5 px-3 text-[10px] font-semibold text-white/45 hover:text-white uppercase tracking-[0.1em] border-l-2 border-primary/25 hover:border-primary/70 transition-all"
                                >
                                  {sub.label[language]}
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
                      {item.label[language]}
                    </button>
                  ) : (
                    <Link
                      to={item.href!}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-[11px] font-bold text-white/70 uppercase tracking-[0.1em] hover:text-white transition-colors"
                    >
                      {item.label[language]}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Mobile bottom: language toggle */}
            <div className="shrink-0 px-8 py-6 border-t border-white/[0.07]">
              <div className="flex items-center gap-4 text-[12px]">
                <button
                  onClick={() => switchLanguage('ES')}
                  className={cn('uppercase tracking-widest transition-colors', language === 'ES' ? 'text-white font-bold' : 'text-white/35 hover:text-white/70')}
                >
                  Español
                </button>
                <span className="text-white/15">|</span>
                <button
                  onClick={() => switchLanguage('EN')}
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
