import { useState, useEffect, useRef, ReactNode, FC } from 'react';
// @marsidev/react-turnstile replaced by native Cloudflare explicit render (see useTurnstile below)
import { useFormSubmit } from '../hooks/useFormSubmit';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ChevronRight, ArrowRight, Play, Users, MapPin,
  ShieldAlert, BookOpen, Quote, Sparkles, Send,
  Upload, CheckCircle, FileText, Camera, Info,
  Search, Package, Tag, Route, Truck, Layers,
  Award, Globe, BadgeCheck, Shield, GraduationCap, Lock
} from 'lucide-react';
import { Section, Container, Button } from '../components/UI';
import { Icon } from '../components/Icon';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  SERVICES, STATS, INDUSTRIES, NEWS, TESTIMONIALS 
} from '../constants';
import { useLanguage } from '../context/LanguageContext';

// Native Cloudflare Turnstile types
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset:  (widgetId?: string) => void;
    };
  }
}

const CountUp = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
};

interface RevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

const Reveal: FC<RevealProps> = ({ children, direction = "up", delay = 0 }) => {
  const shouldReduce = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 28 : direction === "down" ? -28 : 0,
      x: direction === "left" ? 28 : direction === "right" ? -28 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };

  return (
    <motion.div
      variants={shouldReduce ? undefined : variants}
      initial={shouldReduce ? false : "hidden"}
      whileInView={shouldReduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

const LogisticsAnimation = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      <svg className="w-full h-full relative z-10" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* Animated Connecting Lines */}
        {[
          "M200,300 Q400,100 800,400",
          "M1000,200 Q1200,500 900,700",
          "M300,700 Q600,600 1100,800",
          "M100,500 Q500,450 1300,100"
        ].map((d, i) => (
          <g key={i}>
            <motion.path
              d={d}
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="10 10"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: [0, 0.3, 0],
                strokeDashoffset: [0, -100] 
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2
              }}
            />
            {/* Moving Hub Token */}
            <motion.circle
              r="2"
              fill="var(--color-accent, #D6B850)"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ 
                offsetDistance: "100%", 
                opacity: [0, 1, 0] 
              }}
              style={{
                offsetPath: `path("${d}")`,
                offsetRotate: "auto"
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5
              }}
            />
          </g>
        ))}

        {/* Pulsing Nodes */}
        {[
          { x: 200, y: 300 },
          { x: 800, y: 400 },
          { x: 1000, y: 200 },
          { x: 900, y: 700 },
          { x: 300, y: 700 },
          { x: 1300, y: 100 }
        ].map((node, i) => (
          <g key={`node-${i}`}>
            <circle cx={node.x} cy={node.y} r="2" fill="white" opacity="0.5" />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="8"
              stroke="white"
              strokeWidth="0.5"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2, opacity: [0, 0.4, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─── Mexico Operations Map ────────────────────────────────────────────────────

const OPERATIONS = [
  {
    id: 'monterrey',
    name: 'Monterrey',
    x: 360, y: 115,
    ops: 'Dangerous Goods Operations',
    services: 'Warehousing · Ground Transport · Training',
    flipCard: true,
  },
  {
    id: 'cdmx',
    name: 'Mexico City',
    x: 285, y: 252,
    ops: 'Air Cargo DG Operations',
    services: 'Airline Coordination · Radioactive Logistics',
    flipCard: false,
  },
  {
    id: 'guadalajara',
    name: 'Guadalajara',
    x: 212, y: 225,
    ops: 'Western Mexico Logistics Support',
    services: 'Freight Coordination · Compliance Support',
    flipCard: false,
  },
  {
    id: 'villahermosa',
    name: 'Villahermosa',
    x: 450, y: 265,
    ops: 'Oil & Gas Sector Support',
    services: 'Radioactive Material Operations',
    flipCard: true,
  },
] as const;

const NETWORK_PATHS = [
  'M 360,115 Q 322,183 285,252',
  'M 285,252 L 212,225',
  'M 285,252 Q 368,258 450,265',
  'M 360,115 Q 408,190 450,265',
];

const MEXICO_MAINLAND = 'M 92,75 L 96,62 L 170,56 L 240,60 L 285,65 L 335,68 L 375,75 L 405,82 L 422,90 L 438,107 L 444,132 L 447,162 L 451,193 L 448,222 L 451,248 L 462,265 L 478,268 L 502,258 L 525,248 L 540,234 L 547,255 L 538,278 L 523,296 L 508,310 L 490,323 L 470,332 L 448,338 L 422,332 L 400,320 L 373,310 L 350,303 L 325,296 L 298,288 L 272,278 L 248,270 L 225,260 L 205,248 L 185,236 L 168,226 L 155,218 L 140,215 L 122,218 L 108,204 L 98,187 L 90,168 L 84,148 L 80,128 L 82,104 L 87,82 Z';
const MEXICO_BAJA    = 'M 80,75 L 74,62 L 65,70 L 58,103 L 52,138 L 47,173 L 45,208 L 46,243 L 50,278 L 55,308 L 62,333 L 68,353 L 74,366 L 79,370 L 83,360 L 87,338 L 91,303 L 93,268 L 92,233 L 88,198 L 84,163 L 81,128 L 79,98 L 78,78 Z';

const MexicoMap: FC = () => {
  const [activeCity, setActiveCity] = useState<string | null>(null);

  return (
    <div className="relative w-full" style={{ aspectRatio: '560/460' }}>
      <svg
        viewBox="0 0 560 460"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.7))' }}
      >
        {/* Subtle ambient glow behind Mexico */}
        <ellipse cx="300" cy="220" rx="220" ry="160" fill="rgba(30,74,110,0.06)" />

        {/* Network lines */}
        {NETWORK_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#1e4a6e"
            strokeWidth={0.7}
            strokeDasharray="3 8"
            fill="none"
            opacity={0.55}
          />
        ))}

        {/* Mexico outline */}
        <path d={MEXICO_BAJA}     fill="#16243a" stroke="#253d5a" strokeWidth={0.9} />
        <path d={MEXICO_MAINLAND} fill="#16243a" stroke="#253d5a" strokeWidth={0.9} />

        {/* State grid lines — very subtle texture */}
        <line x1="200" y1="60" x2="200" y2="340" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />
        <line x1="310" y1="60" x2="310" y2="340" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />
        <line x1="420" y1="90" x2="420" y2="340" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />
        <line x1="90" y1="160" x2="555" y2="160" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />
        <line x1="90" y1="230" x2="555" y2="230" stroke="#1e3050" strokeWidth={0.4} strokeDasharray="2 10" />

        {/* City operational points */}
        {OPERATIONS.map((city, i) => (
          <g
            key={city.id}
            onMouseEnter={() => setActiveCity(city.id)}
            onMouseLeave={() => setActiveCity(null)}
            style={{ cursor: 'crosshair' }}
          >
            {/* Outer pulse ring */}
            <motion.circle
              cx={city.x} cy={city.y} r={8}
              fill="none"
              stroke={activeCity === city.id ? '#60a5fa' : '#3b82f6'}
              strokeWidth={0.8}
              animate={{ r: [7, 18], opacity: [0.55, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.65, ease: 'easeOut' }}
            />
            {/* Stable ring */}
            <circle cx={city.x} cy={city.y} r={6} fill="none" stroke="#1d4ed8" strokeWidth={0.7} opacity={0.7} />
            {/* Core dot */}
            <circle
              cx={city.x} cy={city.y} r={3.5}
              fill={activeCity === city.id ? '#93c5fd' : '#3b82f6'}
              style={{ transition: 'fill 0.2s' }}
            />
            {/* Hover glow */}
            {activeCity === city.id && (
              <circle cx={city.x} cy={city.y} r={10} fill="rgba(59,130,246,0.12)" />
            )}
          </g>
        ))}
      </svg>

      {/* Hover info cards — positioned over SVG */}
      {OPERATIONS.map((city) => {
        const isActive = activeCity === city.id;
        const leftPct = (city.x / 560) * 100;
        const topPct  = (city.y / 460) * 100;
        const cardLeft = city.flipCard
          ? `calc(${leftPct}% - 194px)`
          : `calc(${leftPct}% + 14px)`;

        return (
          <div
            key={city.id}
            className="absolute w-[180px] pointer-events-none"
            style={{
              left:      cardLeft,
              top:       `calc(${topPct}% - 56px)`,
              zIndex:    20,
              opacity:   isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            <div style={{
              backgroundColor: 'rgba(10,18,30,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              padding: '14px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.12)',
            }}>
              <div style={{ width: '20px', height: '1px', backgroundColor: '#3b82f6', marginBottom: '10px' }} />
              <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                {city.name}
              </p>
              <p style={{ color: '#60a5fa', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '7px' }}>
                {city.ops}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '9.5px', lineHeight: 1.55 }}>
                {city.services}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Home = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale  = useTransform(scrollYProgress, [0, 0.25], [1, 1.08]);
  const { t, language } = useLanguage();
  const shouldReduce = useReducedMotion();

  // ── Hero animation variants ────────────────────────────────────────────────
  const heroLeftVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };
  const heroRightStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18, delayChildren: 0.45 } },
  };
  const heroRightItem = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };
  const trustStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0 } },
  };
  const trustItem = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
  };

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const { isLoading: formLoading, error: formError, submit: submitLead } = useFormSubmit();

  // Must use import.meta.env.VITE_* directly — Vite replaces at build time via static pattern match
  const turnstileSiteKey: string | undefined =
    import.meta.env.VITE_TURNSTILE_SITE_KEY || undefined;

  // Refs for native Cloudflare explicit render (bypasses React wrapper entirely)
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId     = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (formSubmitted || !turnstileSiteKey) return;

    const SCRIPT_ID = 'cf-turnstile-script';

    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return;
      // Remove any stale widget before rendering
      if (turnstileWidgetId.current) {
        try { window.turnstile.remove(turnstileWidgetId.current); } catch { /* noop */ }
        turnstileWidgetId.current = undefined;
      }
      turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey:            turnstileSiteKey,
        theme:              'light',
        callback:           (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
      });
      console.log('[Turnstile] rendered, widgetId:', turnstileWidgetId.current);
    };

    if (!document.getElementById(SCRIPT_ID)) {
      // First load — inject the script
      const script = document.createElement('script');
      script.id    = SCRIPT_ID;
      script.src   = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      script.onerror = () => console.error('[Turnstile] script failed to load');
      document.head.appendChild(script);
    } else if (window.turnstile) {
      // Script already loaded from a previous step visit
      renderWidget();
    } else {
      // Script tag exists but hasn't finished loading yet
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement;
      existing.addEventListener('load', renderWidget, { once: true });
    }

    return () => {
      if (window.turnstile && turnstileWidgetId.current) {
        try { window.turnstile.remove(turnstileWidgetId.current); } catch { /* noop */ }
        turnstileWidgetId.current = undefined;
      }
    };
  }, [formSubmitted, turnstileSiteKey]);

  const resetForm = () => {
    setFormSubmitted(false);
    setTurnstileToken('');
  };

  const logoBasePath = ((import.meta as any).env?.BASE_URL || '/').replace(/\/?$/, '/');
  const logoSrc = (file: string) => `${logoBasePath}${encodeURIComponent(file)}`;

  const logos = [
    "IATA_CARGO_AGENT__1_.png",
    "ANIQ__1_.png",
    "Logo_AMACARGA_firma.png",
    "Distintivo.png",
    "COSTHA_NewLogoCMYK_Sm.png",
    "FIATA_Logo.png",
    "TIACA_OFFICIAL_LOGO-Blue-2024_24__46__68__94__96_.png",
    "aws.png",
    "WCA DGs.png",
  ];

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-dark pt-[70px]">
        {/* Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={shouldReduce ? {} : { scale: heroScale }}
          >
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000"
              alt="Logistics Warehouse"
              className="w-full h-full object-cover opacity-30 grayscale"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-r from-dark/95 via-dark/70 to-dark/40 z-10" />
          <LogisticsAnimation />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent z-20" />
        </div>

        <Container className="relative z-20 w-full py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — Headline */}
            <motion.div
              variants={shouldReduce ? undefined : heroLeftVariants}
              initial={shouldReduce ? false : 'hidden'}
              animate="visible"
            >
              <p className="text-[10px] text-accent/80 uppercase tracking-[0.25em] mb-5 font-bold">
                {t('hero.micro')}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.12] tracking-tight mb-0">
                {t('hero.title')}
              </h1>
            </motion.div>

            {/* Right — Description + CTA + Trust strip (stagger children) */}
            <motion.div
              variants={shouldReduce ? undefined : heroRightStagger}
              initial={shouldReduce ? false : 'hidden'}
              animate="visible"
              className="lg:pl-10 border-l border-white/10"
            >
              <motion.p
                variants={shouldReduce ? undefined : heroRightItem}
                className="text-base md:text-lg text-white/75 font-normal leading-relaxed mb-8 max-w-lg"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div variants={shouldReduce ? undefined : heroRightItem}>
                <Button
                  variant="primary"
                  className="px-10 py-4 text-[11px] tracking-widest uppercase font-black"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('hero.cta.quote')}
                </Button>
              </motion.div>

              {/* Trust strip — staggered bullets */}
              <motion.div
                variants={shouldReduce ? undefined : heroRightItem}
                className="mt-6 pt-6 border-t border-white/15"
              >
                <motion.div
                  variants={shouldReduce ? undefined : trustStagger}
                  className="flex flex-wrap gap-x-6 gap-y-3"
                >
                  {(['hero.trust1','hero.trust2','hero.trust3','hero.trust4'] as const).map((key) => (
                    <motion.div
                      key={key}
                      variants={shouldReduce ? undefined : trustItem}
                      className="flex items-center gap-2.5"
                    >
                      <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center shrink-0">
                        <span className="text-accent font-black leading-none" style={{ fontSize: '9px' }}>✓</span>
                      </div>
                      <span className="text-[12px] text-white/70 font-medium tracking-wide">{t(key)}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* 2. STATS SECTION */}
      <div className="bg-white py-14 border-b border-black/5 relative z-30">
        <Container>
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center justify-between">
              {STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="flex flex-col md:items-start"
                >
                  <span className="text-4xl font-extrabold text-primary mb-1">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-[11px] uppercase tracking-widest font-bold text-secondary">
                    {t(`stats.${stat.id || stat.label.toLowerCase().split(' ')[0]}`)}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </div>

      {/* INSTITUTIONAL AFFILIATIONS STRIP */}
      <div className="bg-white pt-10 pb-12 overflow-hidden border-b border-black/5">
        {/* Section label */}
        <div className="max-w-7xl mx-auto px-8 lg:px-12 mb-8">
          <p className="text-center text-[9px] font-black tracking-[0.28em] uppercase text-black/25">
            Institutional Affiliations &amp; Industry Memberships
          </p>
        </div>

        {/* Marquee — doubled set for seamless loop; 9 logos × 2 is wide enough at all viewports */}
        <div
          className="relative flex overflow-x-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <motion.div
            className="flex shrink-0 items-center whitespace-nowrap will-change-transform"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 65,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
          >
            {[...logos, ...logos].map((logo, idx) => (
              <div
                key={`${logo}-${idx}`}
                className="group flex shrink-0 items-center justify-center px-10 lg:px-14"
              >
                <img
                  src={logoSrc(logo)}
                  alt={logo.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ')}
                  className="h-[72px] w-auto max-w-none object-contain opacity-85 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-300 ease-in-out"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* NEW: EMPATHY (PROBLEM) SECTION */}
      <div className="bg-dark/5 py-24 relative overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            <Reveal direction="right">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 leading-tight">
                  Dangerous goods failures are rarely transportation problems. They are compliance failures.
                </h2>
                <p className="text-lg text-secondary mb-10 leading-relaxed font-medium">
                  Most dangerous goods shipments are rejected long before transportation begins. Incorrect classification, incomplete documentation, packaging errors, and regulatory misinterpretation create operational and legal exposure.
                </p>
                <div className="space-y-6 mb-10">
                  {[
                    'Incorrect classification',
                    'Incomplete dangerous goods documentation',
                    'Non-compliant packaging configuration',
                    'Misinterpretation of transport regulations',
                  ].map((pain) => (
                    <div key={pain} className="flex gap-4 items-start group">
                      <div className="mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                        <div className="w-2 h-2 rounded-full bg-red-600" />
                      </div>
                      <p className="text-dark/80 font-bold italic">
                        {pain}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-dark font-black uppercase tracking-widest text-[11px] border-l-2 border-primary pl-4 py-1">
                  Most shipment failures are discovered only after the cargo has already been delayed.
                </p>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <div className="relative h-full min-h-[400px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-black/[0.06]">
                <img
                  src={`${((import.meta as any).env?.BASE_URL || '/').replace(/\/?$/, '/')}${encodeURIComponent('Regulatory Picture.webp')}`}
                  alt="Dangerous Goods Regulatory Compliance Operations"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      {/* NEW: CONSEQUENCES SECTION */}
      <Section className="bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <Reveal direction="right">
              {/* Subtle rotation breaks the flat-PDF feel */}
              <div style={{ transform: 'rotate(-0.6deg)', transformOrigin: 'bottom center' }}>
                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-lg border border-black/[0.07]"
                  style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.07), 0 22px 52px rgba(0,0,0,0.15)' }}
                >
                  <img
                    src={`${((import.meta as any).env?.BASE_URL || '/').replace(/\/?$/, '/')}${encodeURIComponent('precheck-compliance.webp')}`}
                    alt="Dangerous Goods Pre-Check Compliance Validation Report"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: 'center 8%',
                      filter: 'brightness(0.93) contrast(1.05) saturate(0.80)',
                    }}
                  />
                  {/* Vignette — frames without heavy border */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 35%, rgba(0,0,0,0.14) 100%)' }}
                  />
                </div>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-dark leading-tight">
                  In dangerous goods logistics, mistakes become regulatory liabilities.
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    'Shipment rejections',
                    'Regulatory penalties',
                    'Operational delays',
                    'Customer and carrier disputes',
                  ].map((item) => (
                    <div key={item} className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center text-white font-bold text-xs">
                        !
                      </div>
                      <span className="font-bold text-dark/70 uppercase tracking-widest text-[11px] leading-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-black/5 space-y-6">
                  <Button variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                    VALIDATE YOUR DG SHIPMENT
                  </Button>
                  <div>
                    <p className="text-secondary text-base leading-relaxed">
                      Compliance costs less than operational failure.
                    </p>
                    <div className="w-10 h-1 bg-accent mt-3" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 3. ABOUT SECTION (UVP) */}
      <Section id="about" className="relative group overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-black/5 via-black/5 to-transparent hidden lg:block" />
        <Container>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <Reveal direction="right">
              <div className="overflow-hidden rounded-sm shadow-[0_6px_20px_rgba(0,0,0,0.10),_0_24px_56px_rgba(0,0,0,0.16)] border border-black/[0.05]">
                <img
                  src={`${((import.meta as any).env?.BASE_URL || '/').replace(/\/?$/, '/')}${encodeURIComponent('transportes.png')}`}
                  alt="Multimodal Dangerous Goods Transportation Operations"
                  className="w-full h-auto object-contain"
                />
              </div>
            </Reveal>
            
            <Reveal direction="left" delay={0.2}>
              <div className="space-y-8">
                <span className="text-primary text-[11px] font-black uppercase tracking-widest">
                  MULTIMODAL DG OPERATIONS
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  Authority in Dangerous Goods Logistics.
                </h2>
                <div className="pt-2 space-y-4">
                  <p className="text-2xl md:text-3xl font-extrabold text-dark leading-tight">
                    We don't simply transport dangerous goods. We engineer compliant movement across air, ground, and ocean operations.
                  </p>
                  <p className="text-base text-secondary leading-relaxed">
                    From classification and documentation to packaging validation and multimodal coordination, Global Gate Mexico manages dangerous goods shipments with operational precision and regulatory control.
                  </p>
                  <div className="w-12 h-1 bg-accent mt-4" />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 4. SERVICES SECTION */}
      <Section id="services" className="bg-bg-light/50 border-y border-black/5">
        <Container>
          <Reveal>
            <div className="flex justify-between items-baseline border-b border-black/5 pb-4 mb-16 px-4">
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-dark">{t('services.title')}</h2>
              <Link to="/services" className="text-xs font-bold text-primary hover:underline">{t('services.viewAll')}</Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: ShieldAlert },
                { icon: Layers },
                { icon: Package },
                { icon: Tag },
                { icon: FileText },
                { icon: Truck },
              ].map(({ icon: Icon }, idx) => {
                const i = idx + 1;
                const num = i < 10 ? `0${i}` : `${i}`;
                return (
                  <Reveal key={i} delay={idx * 0.07}>
                    <div className="flex flex-col gap-3 bg-white border border-black/[0.06] px-8 pt-8 pb-7 h-full transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] hover:border-black/[0.10]">
                      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                        <Icon size={22} className="text-primary" />
                      </div>
                      <span className="text-primary font-black text-sm">{num}</span>
                      <h3 className="text-[17px] font-black text-dark tracking-tight">
                        {t(`about.item${i}`)}
                      </h3>
                      <p className="text-secondary text-[13px] leading-relaxed flex-1">
                        {t(`about.item${i}.desc`)}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 5. TARGET SECTION (Replacing Industries) */}
      <Section id="industries" className="bg-white">
        <Container>
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-primary text-xs font-black uppercase tracking-widest">
                {t('industries.sublabel')}
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-3 mb-4">
                {t('industries.label')}
              </h2>
              <div className="w-12 h-1 bg-accent mx-auto" />
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              t('target.col1.item1'), t('target.col2.item1'),
              t('target.col1.item2'), t('target.col2.item2'),
              t('target.col1.item3'), t('target.col2.item3'),
            ].map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.07}>
                <div className="flex items-center gap-4 border border-black/10 px-6 py-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                  <CheckCircle size={22} className="text-primary shrink-0" />
                  <span className="font-semibold text-[15px] text-dark">
                    {item}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. COMPLIANCE PILLARS */}
      <Section id="compliance" className="bg-slate-100 border-y border-black/5">
        <Container>
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-extrabold text-dark leading-tight mb-4">
                {t('compliance.heading')}
              </h2>
              <p className="text-secondary text-base max-w-xl mx-auto mb-5">
                {t('compliance.subheading')}
              </p>
              <div className="w-12 h-1 bg-accent mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Award,          key: 'cred1' },
                { icon: Globe,          key: 'cred2' },
                { icon: BadgeCheck,     key: 'cred3' },
                { icon: Shield,         key: 'cred4' },
                { icon: GraduationCap,  key: 'cred5' },
                { icon: Lock,           key: 'cred6' },
              ].map(({ icon: Icon, key }, idx) => (
                <Reveal key={key} delay={idx * 0.07}>
                  <div className="flex gap-4 items-start bg-white border border-black/8 p-6 hover:shadow-md transition-shadow duration-300">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold text-dark mb-1">
                        {t(`compliance.${key}.title`)}
                      </h3>
                      <p className="text-secondary text-[13px] leading-relaxed">
                        {t(`compliance.${key}.desc`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-secondary font-black text-[11px] uppercase tracking-[0.3em]">
                {t('authority.closing')}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 7. REACH SECTION (The Process) */}
      <Section id="reach" className="bg-slate-50 overflow-hidden pt-10 border-t border-black/5">
        <Container>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <Reveal direction="right">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-primary" />
                  <span className="text-primary uppercase tracking-widest font-bold text-sm">{t('reach.label')}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight tracking-tighter">
                  {t('reach.title')}
                </h2>
                <div className="space-y-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="flex gap-6 group cursor-pointer"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="font-bold text-xs">{i}</span>
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-widest text-sm mb-2">{t(`reach.hub${i}.city`)}</h4>
                        <p className="text-secondary text-sm leading-relaxed">{t(`reach.hub${i}.desc`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 border-t border-black/5 pt-6 space-y-5">
                  <p className="text-[11px] font-black uppercase tracking-widest text-primary">
                    {t('reach.keyline')}
                  </p>
                  <Button
                    variant="primary"
                    className="uppercase tracking-widest text-[11px]"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {t('hero.cta.secondary')} <ArrowRight size={14} className="ml-2" />
                  </Button>
                </div>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.3}>
              <div className="relative">
                <div className="relative z-10 p-6 bg-white shadow-3xl rounded-sm border border-black/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-6 text-center">Visual Verification</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Regulatory Control',  pos: '0% 0%'    },
                      { label: 'Real-time Visibility', pos: '100% 0%'  },
                      { label: 'Technical Team',       pos: '0% 100%'  },
                      { label: 'Compliance Mastery',   pos: '100% 100%'},
                    ].map(({ label, pos }) => (
                      <div
                        key={label}
                        className="aspect-square overflow-hidden relative"
                        style={{
                          backgroundImage: `url(${((import.meta as any).env?.BASE_URL || '/').replace(/\/?$/, '/')}${encodeURIComponent('Process GGM.png')})`,
                          backgroundSize: '200% 200%',
                          backgroundPosition: pos,
                        }}
                      >
                        <div className="absolute inset-0 bg-dark/10" />
                        <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase text-white tracking-wider leading-tight">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Decorative dots */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 blur-2xl -z-10" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 8. TESTIMONIALS */}
      <Section className="bg-bg-light relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 to-bg-light pointer-events-none" />
        <Container className="relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">{t('testimonials.title')}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t_item, idx) => (
                <Reveal key={t_item.name} delay={idx * 0.15}>
                  <div className="bg-white p-10 border border-black/5 hover:shadow-xl transition-shadow duration-500">
                    <p className="text-[14px] text-dark/80 mb-8 italic leading-relaxed">
                      "{language === 'ES' ? t_item.quoteEs || t_item.quote : t_item.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <img src={t_item.image} alt={t_item.name} className="w-10 h-10 rounded-full object-cover grayscale" referrerPolicy="no-referrer" />
                      <div>
                        <h5 className="font-bold text-[11px] uppercase tracking-widest">{t_item.name}</h5>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                          {language === 'ES' ? t_item.roleEs || t_item.role : t_item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* OBJECTIONS SECTION */}
      <Section className="bg-slate-100 py-24">
        <Container>
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-dark mb-4">{t('objections.title')}</h2>
              <div className="w-12 h-1 bg-accent mx-auto" />
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-center h-full flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 text-xl font-bold">?</div>
                  <h4 className="font-bold text-[15px] text-dark">
                    "{t(`objections.item${i}.q`)}"
                  </h4>
                  <p className="text-[14px] text-primary leading-relaxed">
                    {t(`objections.item${i}.a`)}.
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 10. CONTACT SECTION */}
      <section id="contact" className="relative overflow-hidden" style={{ backgroundColor: '#0b1320' }}>

        {/* Subtle top edge accent */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.3), transparent)' }} />

        <Container>
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 py-20 lg:py-28">

            {/* ── LEFT: FORM ─────────────────────────────────────────────── */}
            <Reveal direction="right">
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header */}
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-5" style={{ color: '#3b82f6' }}>
                      OPERATIONAL INQUIRY
                    </p>
                    <h2 className="text-3xl md:text-[2.2rem] font-extrabold leading-tight tracking-tight mb-4" style={{ color: 'rgba(255,255,255,0.93)' }}>
                      Tell Us About Your Needs
                    </h2>
                    <p className="text-[14px] leading-relaxed mb-10 border-l-2 pl-5" style={{ color: 'rgba(255,255,255,0.42)', borderColor: 'rgba(59,130,246,0.4)' }}>
                      Not sure where to start? Send us a brief message and our team will help you identify the right logistics or compliance solution.
                    </p>

                    {/* Form */}
                    <form
                      className="space-y-5"
                      onSubmit={async e => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const step2 = new FormData();
                        step2.set('quantity', fd.get('message') as string);
                        const ok = await submitLead(
                          {
                            name:        fd.get('name')             as string,
                            company:     fd.get('company')          as string,
                            email:       fd.get('email')            as string,
                            phone:       fd.get('phone')            as string,
                            merchandise: fd.get('service_interest') as string,
                          },
                          step2,
                          turnstileToken
                        );
                        if (ok) setFormSubmitted(true);
                      }}
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.32)' }}>Full Name</label>
                          <input name="name" type="text" required placeholder="John Doe"
                            className="w-full px-4 py-3 text-[13px] outline-none transition-all"
                            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.85)' }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                            onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.32)' }}>Company</label>
                          <input name="company" type="text" required placeholder="Acero Global S.A."
                            className="w-full px-4 py-3 text-[13px] outline-none transition-all"
                            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.85)' }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                            onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.32)' }}>Email</label>
                          <input name="email" type="email" required placeholder="operations@company.com"
                            className="w-full px-4 py-3 text-[13px] outline-none transition-all"
                            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.85)' }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                            onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.32)' }}>Phone / WhatsApp</label>
                          <input name="phone" type="tel" required placeholder="+52 81 xxxx xxxx"
                            className="w-full px-4 py-3 text-[13px] outline-none transition-all"
                            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.85)' }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                            onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.32)' }}>Service Interest</label>
                        <select name="service_interest" required
                          className="w-full px-4 py-3 text-[13px] outline-none transition-all appearance-none"
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.75)' }}
                          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'; }}
                          onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                        >
                          <option value="" disabled selected style={{ backgroundColor: '#0b1320' }}>Select a service area…</option>
                          <option value="Dangerous Goods Transportation"   style={{ backgroundColor: '#0b1320' }}>Dangerous Goods Transportation</option>
                          <option value="Radioactive Material Logistics"   style={{ backgroundColor: '#0b1320' }}>Radioactive Material Logistics</option>
                          <option value="DG Consulting & Compliance"       style={{ backgroundColor: '#0b1320' }}>DG Consulting &amp; Compliance</option>
                          <option value="Training"                         style={{ backgroundColor: '#0b1320' }}>Training</option>
                          <option value="Warehousing"                      style={{ backgroundColor: '#0b1320' }}>Warehousing</option>
                          <option value="Other / Not Sure Yet"             style={{ backgroundColor: '#0b1320' }}>Other / Not Sure Yet</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.32)' }}>Message</label>
                        <textarea name="message" rows={4} placeholder="Briefly describe your logistics or compliance need…"
                          className="w-full px-4 py-3 text-[13px] outline-none transition-all resize-none"
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.85)' }}
                          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                          onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                        />
                      </div>

                      {/* Consent */}
                      <div className="flex items-start gap-3 pt-1">
                        <input type="checkbox" id="consent" required className="mt-0.5 shrink-0" style={{ accentColor: '#3b82f6' }} />
                        <label htmlFor="consent" className="text-[11px] leading-snug cursor-pointer" style={{ color: 'rgba(255,255,255,0.38)' }}>
                          I agree to the processing of my data according to the Privacy Policy.
                        </label>
                      </div>

                      {/* Turnstile */}
                      {turnstileSiteKey ? (
                        <div className="flex justify-start">
                          <div ref={turnstileContainerRef} />
                        </div>
                      ) : null}

                      {formError && (
                        <p className="text-red-400 text-[11px] font-bold">{formError}</p>
                      )}

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={formLoading || (!!turnstileSiteKey && !turnstileToken)}
                        className="w-full py-4 text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-300 disabled:opacity-40 mt-1"
                        style={{
                          backgroundColor: '#0f2744',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.88)',
                        }}
                        onMouseEnter={e => {
                          if (!formLoading) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1a3a5c';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(59,130,246,0.2)';
                          }
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0f2744';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }}
                      >
                        {formLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending…
                          </span>
                        ) : 'Send Message'}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex flex-col gap-8 py-8"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ border: '1px solid rgba(59,130,246,0.4)', backgroundColor: 'rgba(59,130,246,0.08)' }}>
                        <CheckCircle size={22} style={{ color: '#60a5fa' }} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: '#60a5fa' }}>Submission Confirmed</p>
                        <p className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>We'll be in touch within 4 business hours.</p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <a href="tel:+528121654040" className="flex items-center gap-3 group transition-colors">
                        <Icon name="Phone" size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <span className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>+52 812 165 4040</span>
                      </a>
                      <a href="mailto:ggm@globalgatemexico.com" className="flex items-center gap-3 group transition-colors">
                        <Icon name="Mail" size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <span className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>ggm@globalgatemexico.com</span>
                      </a>
                    </div>
                    <button
                      onClick={resetForm}
                      className="self-start text-[11px] font-black uppercase tracking-widest transition-colors"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'; }}
                    >
                      ← Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>

            {/* ── RIGHT: MEXICO OPERATIONS MAP ───────────────────────────── */}
            <Reveal direction="left" delay={0.15}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-3" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  NATIONAL COVERAGE · MEXICO
                </p>
                <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Hover over an operational hub to view service coverage.
                </p>
                <div
                  className="relative overflow-visible"
                  style={{
                    backgroundColor: '#0d1828',
                    border: '1px solid rgba(255,255,255,0.07)',
                    padding: '16px',
                  }}
                >
                  {/* Corner marks */}
                  <div className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: '1px solid rgba(59,130,246,0.4)', borderLeft: '1px solid rgba(59,130,246,0.4)' }} />
                  <div className="absolute top-0 right-0 w-3 h-3" style={{ borderTop: '1px solid rgba(59,130,246,0.4)', borderRight: '1px solid rgba(59,130,246,0.4)' }} />
                  <div className="absolute bottom-0 left-0 w-3 h-3" style={{ borderBottom: '1px solid rgba(59,130,246,0.4)', borderLeft: '1px solid rgba(59,130,246,0.4)' }} />
                  <div className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: '1px solid rgba(59,130,246,0.4)', borderRight: '1px solid rgba(59,130,246,0.4)' }} />

                  <MexicoMap />

                  {/* City legend */}
                  <div className="mt-4 pt-4 grid grid-cols-2 gap-x-6 gap-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {OPERATIONS.map((city) => (
                      <div key={city.id} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#3b82f6' }} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.38)' }}>{city.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </Container>

        {/* ── BOTTOM CONTACT STRIP ─────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 py-8 divide-x" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              {[
                { icon: 'MessageCircle', label: 'WhatsApp', value: '+52 812 165 4040',           href: 'https://wa.me/528121654040' },
                { icon: 'Mail',          label: 'Email',     value: 'ggm@globalgatemexico.com',   href: 'mailto:ggm@globalgatemexico.com' },
                { icon: 'Clock',         label: 'Response Time', value: 'Within 4 Business Hours', href: null },
                { icon: 'Calendar',      label: 'Office Hours',  value: 'Mon–Fri  8:00–18:00 CST', href: null },
              ].map(({ icon, label, value, href }, i) => (
                <div key={i} className="px-6 first:pl-0 last:pr-0 flex items-center gap-4">
                  <Icon name={icon} size={16} style={{ color: 'rgba(59,130,246,0.6)', flexShrink: 0 }} />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</p>
                    {href ? (
                      <a href={href} className="text-[12px] font-semibold transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.9)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'; }}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.65)' }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>

      </section>
    </>
  );
};
