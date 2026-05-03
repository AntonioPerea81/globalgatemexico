import { useState, useEffect, ReactNode, FC } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
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
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0
    },
    visible: { opacity: 1, y: 0, x: 0 }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
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

export const Home = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const { t, language } = useLanguage();

  const [formStep, setFormStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [step1Data, setStep1Data] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const { isLoading: formLoading, error: formError, submit: submitLead } = useFormSubmit();
  const turnstileSiteKey = (import.meta as any).env?.VITE_TURNSTILE_SITE_KEY as string | undefined;

  const resetForm = () => {
    setFormStep(1);
    setFormSubmitted(false);
    setStep1Data({});
    setTurnstileToken('');
  };

  const logos = [
    "IATA_CARGO_AGENT__1_.png",
    "ANIQ__1_.png",
    "Logo_AMACARGA_firma.png",
    "Distintivo.png",
    "COSTHA_NewLogoCMYK_Sm.png",
    "FIATA_Logo.png",
    "TIACA_OFFICIAL_LOGO-Blue-2024_24__46__68__94__96_.png",
    "aws.png",
    "WCA DGs.png"
  ];
  const logoBasePath = ((import.meta as any).env?.BASE_URL || '/').replace(/\/?$/, '/');
  const logoSrc = (file: string) => `${logoBasePath}${encodeURIComponent(file)}`;

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center overflow-hidden bg-dark pt-[70px]">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000" 
            alt="Logistics Warehouse" 
            className="w-full h-full object-cover opacity-40 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-dark via-dark/60 to-transparent z-10" />
          
          {/* Animated Paths & Nodes */}
          <LogisticsAnimation />

          {/* Bottom Gradient Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent z-20" />
        </div>
        
        <Container className="relative z-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mb-6 font-bold">
                {t('hero.micro')}
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tighter mb-4">
                {t('hero.title')}
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:mb-6 lg:pl-12 border-l border-white/10"
            >
              <div className="flex gap-4 items-start mb-8">
                <div className="mt-1.5 shrink-0">
                  <div className="w-8 h-[2px] bg-white" />
                  <div className="w-[2px] h-8 bg-white ml-0" />
                </div>
                <p className="text-xl md:text-2xl text-white font-medium leading-tight max-w-md">
                  {t('hero.subtitle')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  className="px-8 py-5 text-[11px]"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('hero.cta.quote')}
                </Button>
                <Button
                  variant="white"
                  className="px-8 py-5 text-[11px] border border-white/20"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('hero.cta.secondary')}
                </Button>
              </div>
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

      {/* NEW: LOGO SCROLLING BANNER */}
      <div className="bg-white py-12 overflow-hidden border-b border-black/5">
        <Reveal>
          <div className="relative flex overflow-x-hidden">
            <motion.div
              className="flex shrink-0 gap-16 items-center whitespace-nowrap px-8 will-change-transform"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 38,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
                ease: "linear",
              }}
            >
              {[...logos, ...logos].map((logo, idx) => (
                <div
                  key={`${logo}-${idx}`}
                  className="flex shrink-0 items-center justify-center px-6"
                >
                  <img
                    src={logoSrc(logo)}
                    alt={logo.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ')}
                    className="h-[80px] w-auto max-w-none object-contain"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </Reveal>
      </div>

      {/* NEW: EMPATHY (PROBLEM) SECTION */}
      <div className="bg-dark/5 py-24 relative overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            <Reveal direction="right">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 leading-tight">
                  {t('empathy.title')}
                </h2>
                <p className="text-lg text-secondary mb-10 leading-relaxed font-medium">
                  {t('empathy.subtitle')}
                </p>
                <div className="space-y-6 mb-10">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className="mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                        <div className="w-2 h-2 rounded-full bg-red-600" />
                      </div>
                      <p className="text-dark/80 font-bold italic">
                        {t(`empathy.pain${i}`)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-dark font-black uppercase tracking-widest text-[11px] border-l-2 border-primary pl-4 py-1">
                  {t('empathy.closing')}
                </p>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <div className="relative h-full min-h-[400px] bg-white shadow-2xl overflow-hidden">
                <img
                  src={`${((import.meta as any).env?.BASE_URL || '/').replace(/\/?$/, '/')}${encodeURIComponent('Regulatory Picture.jpeg')}`}
                  alt="Regulatory Compliance"
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
              <div className="aspect-[4/5] bg-bg-light overflow-hidden">
                <img
                  src={`${((import.meta as any).env?.BASE_URL || '/').replace(/\/?$/, '/')}${encodeURIComponent('books rejections.jpeg')}`}
                  alt="Compliance Books"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-dark leading-tight">
                  {t('consequences.title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center text-white font-bold text-xs">
                        !
                      </div>
                      <span className="font-bold text-dark/70 uppercase tracking-widest text-[11px] leading-tight">
                        {t(`consequences.item${i}`)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-black/5 space-y-6">
                  <Button variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                    {t('hero.cta.quote')}
                  </Button>
                  <div>
                    <p className="text-secondary text-base leading-relaxed">
                      {t('consequences.closing')}
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
              <div className="overflow-hidden shadow-2xl">
                <img
                  src={`${((import.meta as any).env?.BASE_URL || '/').replace(/\/?$/, '/')}${encodeURIComponent('transportes.jpeg')}`}
                  alt="Logistics Operations"
                  className="w-full h-auto object-contain"
                />
              </div>
            </Reveal>
            
            <Reveal direction="left" delay={0.2}>
              <div className="space-y-8">
                <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} /> {t('about.label')}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  {language === 'EN' ? (
                    <>Authority in <span className="text-primary italic">Dangerous Goods Logistics</span>.</>
                  ) : (
                    <>Autoridad en <span className="text-primary italic">Logística de Mercancías Peligrosas</span>.</>
                  )}
                </h2>
                <div className="pt-2 space-y-4">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">
                    {language === 'EN' ? 'Our Solution' : 'Nuestra Solución'}
                  </span>
                  <p className="text-2xl md:text-3xl font-extrabold text-dark leading-tight">
                    {t('about.title')}
                  </p>
                  <p className="text-base text-secondary leading-relaxed">
                    {t('about.subtitle')}
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
                    <div className="flex flex-col gap-4 bg-white border border-black/5 p-8 group hover:shadow-lg transition-shadow duration-300 h-full">
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
                      <Link
                        to="/services"
                        className="text-primary text-[13px] font-bold flex items-center gap-1 hover:gap-2 transition-all duration-200 mt-2"
                      >
                        {language === 'EN' ? 'Learn More' : 'Ver más'} <ArrowRight size={14} />
                      </Link>
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

      {/* 10. CONTACT SECTION - Redesigned 2-Step Validated Shipment Form */}
      <Section id="contact" className="bg-white border-t border-black/5 relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-1/3 h-px bg-linear-to-r from-transparent to-primary/20" />
        <Container>
          <div className="grid lg:grid-cols-2 gap-20">
            <Reveal direction="right">
              <div>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-4">
                   {t('finalcta.support')}
                </p>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tighter">{t('contact.title')}</h2>
                <p className="text-dark/80 text-[16px] font-bold italic mb-10 leading-relaxed max-w-md border-l-4 border-accent pl-6">{t('contact.subtitle')}</p>
                
                {!formSubmitted && (
                  <div className="hidden lg:block space-y-8 mt-12">
                    <div className={cn("flex gap-6 items-center transition-all duration-500", formStep >= 1 ? "opacity-100" : "opacity-30")}>
                      <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold", formStep === 1 ? "border-primary text-primary" : "border-green-500 bg-green-500 text-white")}>
                        {formStep > 1 ? <CheckCircle size={20} /> : "01"}
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs">Step 1</h4>
                        <p className="text-dark/50 text-[11px] uppercase font-bold tracking-tighter">Contact Information</p>
                      </div>
                    </div>
                    <div className="w-px h-12 bg-black/5 ml-6" />
                    <div className={cn("flex gap-6 items-center transition-all duration-500", formStep >= 2 ? "opacity-100" : "opacity-30")}>
                      <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold", formStep === 2 ? "border-primary text-primary" : "border-black/10 text-dark/20")}>
                        02
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs">Step 2</h4>
                        <p className="text-dark/50 text-[11px] uppercase font-bold tracking-tighter">Shipment Technical Details</p>
                      </div>
                    </div>
                  </div>
                )}

                {formSubmitted && (
                  <div className="space-y-6">
                    <div className="flex gap-4 items-center group">
                      <div className="w-10 h-10 border border-black/5 flex items-center justify-center text-secondary group-hover:text-primary group-hover:border-primary/20 transition-all">
                        <Icon name="Phone" size={18} />
                      </div>
                      <span className="text-[13px] font-bold text-dark">+52 812 165 4040</span>
                    </div>
                    <div className="flex gap-4 items-center group">
                      <div className="w-10 h-10 border border-black/5 flex items-center justify-center text-secondary group-hover:text-primary group-hover:border-primary/20 transition-all">
                        <Icon name="Mail" size={18} />
                      </div>
                      <span className="text-[13px] font-bold text-dark">ggm@globalgatemexico.com</span>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
            
            <Reveal direction="left" delay={0.2}>
              <div className="bg-bg-light border border-black/5 shadow-inner overflow-hidden">
                <AnimatePresence mode="wait">
                  {!formSubmitted ? (
                    <motion.div 
                      key={formStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-8"
                    >
                      <form className="space-y-6" onSubmit={async e => {
                        e.preventDefault();
                        if (formStep === 1) {
                          const fd = new FormData(e.currentTarget);
                          setStep1Data(Object.fromEntries(fd.entries()) as Record<string, string>);
                          setFormStep(2);
                        } else {
                          const fd = new FormData(e.currentTarget);
                          const ok = await submitLead(step1Data as any, fd, turnstileToken);
                          if (ok) setFormSubmitted(true);
                        }
                      }}>
                        {formStep === 1 && (
                          <div className="space-y-5">
                            {/* Step 1 header */}
                            <div className="pb-4 border-b border-black/5">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{t('contact.step1.eyebrow')}</p>
                              <p className="text-[11px] text-dark/40 mt-1">{t('contact.step1.helper')}</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.name')}</label>
                                <input name="name" type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="John Doe" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.company')}</label>
                                <input name="company" type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="Global Logistics Inc." />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.email')}</label>
                                <input name="email" type="email" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="john@company.com" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.phone')}</label>
                                <input name="phone" type="tel" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="+52 ..." />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.merchandise')}</label>
                              <input name="merchandise" type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="e.g. Lithium Batteries, Flammable Chemicals…" />
                            </div>
                            <Button variant="primary" className="w-full py-4 uppercase font-black tracking-widest text-[11px] mt-2">
                              {t('contact.btn.next')} <ArrowRight size={14} className="ml-2" />
                            </Button>
                          </div>
                        )}

                        {formStep === 2 && (
                          <div className="space-y-6">
                            {/* Step 2 header */}
                            <div className="pb-4 border-b border-black/5">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{t('contact.step2.eyebrow')}</p>
                              <p className="text-[11px] text-dark/40 mt-1">{t('contact.step2.helper')}</p>
                            </div>

                            {/* Route */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.origin')}</label>
                                <input name="origin" type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="Mexico City, MX" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.destination')}</label>
                                <input name="destination" type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="Houston, TX" />
                              </div>
                            </div>

                            {/* Transport + SDS */}
                            <div className="grid md:grid-cols-2 gap-5">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.transport')}</label>
                                <select name="transport" className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all">
                                  <option value="air">{t('contact.field.transport.air')}</option>
                                  <option value="ground">{t('contact.field.transport.ground')}</option>
                                  <option value="ocean">{t('contact.field.transport.ocean')}</option>
                                  <option value="not_sure">{t('contact.field.transport.notSure')}</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.sds')}</label>
                                <div className="relative group/upload">
                                  <input name="sds" type="file" accept=".pdf,.doc,.docx" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                  <div className="w-full bg-white border border-dashed border-black/20 px-4 py-3.5 text-[12px] flex items-center justify-center gap-2 group-hover/upload:border-primary group-hover/upload:bg-primary/[0.02] transition-all">
                                    <FileText size={14} className="text-primary/40 shrink-0" />
                                    <span className="text-dark/50 font-medium">Upload SDS / TDS</span>
                                  </div>
                                </div>
                                <p className="text-[9px] text-dark/35 leading-snug px-1">{t('contact.field.sds.helper')}</p>
                              </div>
                            </div>

                            {/* Dims + Photos */}
                            <div className="grid md:grid-cols-2 gap-5">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.dims')}</label>
                                <input name="dims" type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="e.g. 100 kg · 120×80×100 cm" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.photos')}</label>
                                <div className="relative group/upload">
                                  <input name="photos" type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                  <div className="w-full bg-white border border-dashed border-black/20 px-4 py-3.5 text-[12px] flex items-center justify-center gap-2 group-hover/upload:border-primary group-hover/upload:bg-primary/[0.02] transition-all">
                                    <Camera size={14} className="text-primary/40 shrink-0" />
                                    <span className="text-dark/50 font-medium">Upload Photos</span>
                                  </div>
                                </div>
                                <p className="text-[9px] text-dark/35 leading-snug px-1">{t('contact.field.photos.helper')}</p>
                              </div>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase text-dark/50 tracking-wider ml-1">{t('contact.field.quantity')}</label>
                              <textarea name="quantity" rows={2} required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all resize-none" placeholder={t('contact.field.quantity.helper')} />
                            </div>

                            {/* Instruction support */}
                            <div className="p-4 bg-slate-50 border border-black/5 space-y-3">
                              <div className="flex items-start gap-3">
                                <input name="instruction_support" type="checkbox" id="support" className="mt-0.5 accent-primary shrink-0" />
                                <label htmlFor="support" className="text-[11px] font-bold text-dark/70 cursor-pointer leading-snug">{t('contact.field.instructionSupport')}</label>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-dark/30 tracking-widest block ml-1">{t('contact.field.instructionFile')}</label>
                                <div className="relative group/upload">
                                  <input name="instruction_file" type="file" accept=".pdf,.doc,.docx" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                  <div className="w-full bg-white border border-dashed border-black/10 px-4 py-2.5 text-[11px] flex items-center gap-2 group-hover/upload:border-primary transition-colors">
                                    <Upload size={12} className="text-dark/35 shrink-0" />
                                    <span className="text-dark/45 font-medium">Upload Document</span>
                                  </div>
                                </div>
                                <p className="text-[9px] text-dark/30 leading-snug px-1">{t('contact.field.instructionFile.helper')}</p>
                              </div>
                            </div>

                            {/* Emergency contact */}
                            <div className="space-y-3">
                              <div className="border-b border-primary/10 pb-2">
                                <label className="text-[10px] font-black uppercase text-primary tracking-widest block">{t('contact.field.emergencyContact')}</label>
                                <p className="text-[10px] text-dark/40 mt-1 leading-snug">{t('contact.field.emergencyContactHelper')}</p>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <input name="emergency_name" type="text" className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder={t('contact.field.emergencyName')} />
                                <input name="emergency_phone" type="tel" className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder={t('contact.field.emergencyPhone')} />
                              </div>
                            </div>

                            {/* Consent + submit */}
                            <div className="pt-2 space-y-4 border-t border-black/5">
                              <div className="flex items-start gap-3 pt-2">
                                <input type="checkbox" required className="mt-0.5 accent-primary shrink-0" id="consent" />
                                <label htmlFor="consent" className="text-[11px] text-dark/50 leading-snug cursor-pointer">{t('contact.field.consent')}</label>
                              </div>
                              {turnstileSiteKey && (
                                <div className="flex justify-center">
                                  <Turnstile
                                    siteKey={turnstileSiteKey}
                                    onSuccess={(token) => setTurnstileToken(token)}
                                    onExpire={() => setTurnstileToken('')}
                                    options={{ theme: 'light' }}
                                  />
                                </div>
                              )}
                              {formError && (
                                <p className="text-red-500 text-[11px] font-bold text-center">{formError}</p>
                              )}
                              <div className="flex gap-4">
                                <button type="button" onClick={() => setFormStep(1)} className="text-[11px] font-black uppercase tracking-widest text-dark/30 hover:text-dark transition-colors shrink-0">← Back</button>
                                <Button variant="primary" className="flex-grow py-4 uppercase font-black tracking-widest text-[11px]" disabled={formLoading || (!!turnstileSiteKey && !turnstileToken)}>
                                  {formLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                      <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                      </svg>
                                      Uploading documents &amp; validating…
                                    </span>
                                  ) : t('contact.cta')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="flex flex-col items-center text-center px-8 py-16 gap-8"
                    >
                      {/* Icon */}
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                          <CheckCircle size={36} className="text-accent" strokeWidth={1.5} />
                        </div>
                        <div className="absolute inset-0 rounded-full border border-accent/20 scale-125" />
                      </div>

                      {/* Copy */}
                      <div className="space-y-3 max-w-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                          Submission Confirmed
                        </p>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-dark leading-tight">
                          {t('contact.success.title')}
                        </h3>
                        <p className="text-dark/60 text-[13px] leading-relaxed">
                          {t('contact.success.msg')}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                        <Link to="/" className="flex-1">
                          <Button variant="outline" className="w-full py-3 text-[11px]">
                            Return Home
                          </Button>
                        </Link>
                        <Button variant="primary" className="flex-1 py-3 text-[11px]" onClick={resetForm}>
                          Submit Another
                        </Button>
                      </div>

                      {/* Contact */}
                      <div className="w-full max-w-xs border-t border-black/8 pt-5 space-y-1.5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-dark/30 mb-3 text-center">
                          Direct Contact
                        </p>
                        <a href="tel:+528121654040" className="flex items-center justify-center gap-2 text-[13px] font-bold text-dark/60 hover:text-primary transition-colors">
                          +52 812 165 4040
                        </a>
                        <a href="mailto:ggm@globalgatemexico.com" className="flex items-center justify-center gap-2 text-[13px] font-bold text-dark/60 hover:text-primary transition-colors">
                          ggm@globalgatemexico.com
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
};
