import { useState, useEffect, ReactNode, FC } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  ChevronRight, ArrowRight, Play, Users, MapPin,
  ShieldAlert, BookOpen, Quote, Sparkles, Send,
  Upload, CheckCircle, FileText, Camera, Info,
  Search, Package, Tag, Route, Truck, Layers
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
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  className="px-8 py-6 text-sm" 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('hero.cta.quote')}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white hover:text-dark px-8 py-6 text-sm" 
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
                  <p className="text-primary font-black text-base md:text-lg leading-snug italic">
                    "{t('consequences.closing')}"
                  </p>
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
      <Section id="industries" className="bg-white relative overflow-hidden group">
        <div className="absolute top-0 right-1/4 w-px h-full bg-linear-to-b from-transparent via-black/5 to-transparent hidden lg:block" />
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t('industries.label')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <Reveal>
              <div className="space-y-6 bg-slate-50 p-8 border border-black/5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <ChevronRight className="text-primary shrink-0" size={18} />
                    <span className="font-bold text-[15px] uppercase tracking-widest text-dark/70">
                      {t(`target.col1.item${i}`)}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
               <div className="space-y-6 bg-slate-50 p-8 border border-black/5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <ChevronRight className="text-primary shrink-0" size={18} />
                    <span className="font-bold text-[15px] uppercase tracking-widest text-dark/70">
                      {t(`target.col2.item${i}`)}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 6. COMPLIANCE PILLARS */}
      <Section id="compliance" className="relative group bg-slate-50/50">
        <Container>
          <Reveal>
            <div className="grid lg:grid-cols-3 gap-0 shadow-3xl rounded-none border border-black/10 bg-white -mt-32 relative z-20">
              {[
                { icon: ShieldAlert, title: t('compliance.pillar1.title'), desc: t('compliance.pillar1.desc') },
                { icon: Users, title: t('compliance.pillar2.title'), desc: t('compliance.pillar2.desc') },
                { icon: BookOpen, title: t('compliance.pillar3.title'), desc: t('compliance.pillar3.desc') }
              ].map((pillar, idx) => (
                <div key={pillar.title} className="p-12 border-r last:border-r-0 border-black/10 group/pillar hover:bg-dark hover:text-white transition-all duration-500">
                  <pillar.icon size={40} className="text-primary group-hover/pillar:text-accent transition-colors mb-8" />
                  <h3 className="text-[17px] font-black uppercase tracking-tighter mb-4">{pillar.title}</h3>
                  <p className="text-inherit opacity-70 text-[14px] leading-relaxed mb-8">{pillar.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
               <p className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary">
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
                <p className="mt-12 text-[11px] font-black uppercase tracking-widest text-primary border-t border-black/5 pt-6">
                   {t('reach.keyline')}
                </p>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.3}>
              <div className="relative">
                <div className="relative z-10 p-6 bg-white shadow-3xl rounded-sm border border-black/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-6 text-center">Visual Verification</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-bg-light flex flex-col items-center justify-center p-4 text-center">
                      <ShieldAlert size={32} className="text-primary mb-2" />
                      <span className="text-[9px] font-bold uppercase leading-tight line-clamp-2">Regulatory Control</span>
                    </div>
                    <div className="aspect-square bg-bg-light flex flex-col items-center justify-center p-4 text-center">
                      <MapPin size={32} className="text-primary mb-2" />
                      <span className="text-[9px] font-bold uppercase leading-tight line-clamp-2">Real-time Visibility</span>
                    </div>
                    <div className="aspect-square bg-bg-light flex flex-col items-center justify-center p-4 text-center">
                      <Users size={32} className="text-primary mb-2" />
                      <span className="text-[9px] font-bold uppercase leading-tight line-clamp-2">Technical Team</span>
                    </div>
                    <div className="aspect-square bg-bg-light flex flex-col items-center justify-center p-4 text-center">
                      <BookOpen size={32} className="text-primary mb-2" />
                      <span className="text-[9px] font-bold uppercase leading-tight line-clamp-2">Compliance Mastery</span>
                    </div>
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

      {/* 9. CASE STUDY SECTION (Replacing News) */}
      <Section id="casestudy" className="bg-white">
        <Container>
          <Reveal>
            <div className="flex justify-between items-baseline border-b border-black/5 pb-4 mb-16 px-4">
              <h2 className="text-xl font-bold uppercase tracking-widest text-dark">{t('case.title')}</h2>
            </div>
            
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-3">
                <div className="relative aspect-video overflow-hidden border border-black/5 mb-8">
                   <img 
                    src="https://images.unsplash.com/photo-1566378246598-5b11a0ef486c?auto=format&fit=crop&q=80&w=1200" 
                    alt="Success Case" 
                    className="w-full h-full object-cover grayscale brightness-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 bg-primary px-4 py-2 text-white font-bold text-[10px] tracking-widest uppercase">Success Story</div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary">The Challenge</h4>
                  <p className="text-[14px] text-dark leading-relaxed font-bold italic">"{t('case.story')}"</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary">Our Action</h4>
                  <p className="text-[14px] text-secondary leading-relaxed">{t('case.action')}</p>
                </div>
                <div className="space-y-4 p-6 bg-slate-50 border border-black/5">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary">The Result</h4>
                  <p className="text-[15px] text-dark font-black tracking-tight">{t('case.result')}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* NEW: OBJECTIONS SECTION */}
      <Section className="bg-dark text-white py-24">
        <Container>
           <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-16 text-center">{t('objections.title')}</h2>
           <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-8 border border-white/10 hover:border-accent/40 transition-colors group">
                    <div className="flex gap-4 items-center mb-6">
                       <span className="text-secondary/30 group-hover:text-accent font-black text-4xl tracking-tighter">?</span>
                       <h4 className="font-bold text-[13px] uppercase tracking-widest group-hover:text-accent transition-colors">
                          {t(`objections.item${i}.q`)}
                       </h4>
                    </div>
                    <div className="flex gap-4 items-start">
                       <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                       <p className="text-[14px] text-secondary italic">
                          {t(`objections.item${i}.a`)}
                       </p>
                    </div>
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
                        <p className="text-dark/50 text-[11px] uppercase font-bold tracking-tighter">Quick Lead Capture</p>
                      </div>
                    </div>
                    <div className="w-px h-12 bg-black/5 ml-6" />
                    <div className={cn("flex gap-6 items-center transition-all duration-500", formStep >= 2 ? "opacity-100" : "opacity-30")}>
                      <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold", formStep === 2 ? "border-primary text-primary" : "border-black/10 text-dark/20")}>
                        02
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs">Step 2</h4>
                        <p className="text-dark/50 text-[11px] uppercase font-bold tracking-tighter">Shipment Validation</p>
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
                      <span className="text-[13px] font-bold text-dark">+52 (55) 8956-2000</span>
                    </div>
                    <div className="flex gap-4 items-center group">
                      <div className="w-10 h-10 border border-black/5 flex items-center justify-center text-secondary group-hover:text-primary group-hover:border-primary/20 transition-all">
                        <Icon name="Mail" size={18} />
                      </div>
                      <span className="text-[13px] font-bold text-dark">solutions@globalgate.mx</span>
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
                      <form className="space-y-6" onSubmit={e => { e.preventDefault(); if(formStep === 1) setFormStep(2); else setFormSubmitted(true); }}>
                        {formStep === 1 && (
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.name')}</label>
                                <input type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all rounded-none" placeholder="John Doe" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.company')}</label>
                                <input type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all rounded-none" placeholder="Global Logistics Inc." />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.email')}</label>
                                <input type="email" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all rounded-none" placeholder="john@company.com" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.phone')}</label>
                                <input type="tel" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all rounded-none" placeholder="+52 ..." />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.merchandise')}</label>
                              <input type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all rounded-none" placeholder="e.g. Lithium Batteries, Chemicals..." />
                            </div>
                            <Button variant="primary" className="w-full py-4 uppercase font-black tracking-widest text-[11px] mt-4">
                              {t('contact.btn.next')} <ArrowRight size={14} className="ml-2" />
                            </Button>
                          </div>
                        )}

                        {formStep === 2 && (
                          <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4 border-b border-black/5 pb-6">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.origin')}</label>
                                <input type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="Mexico City, MX" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.destination')}</label>
                                <input type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="Houston, TX" />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.transport')}</label>
                                <select className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all">
                                  <option value="air">{t('contact.field.transport.air')}</option>
                                  <option value="ground">{t('contact.field.transport.ground')}</option>
                                  <option value="ocean">{t('contact.field.transport.ocean')}</option>
                                  <option value="not_sure">{t('contact.field.transport.notSure')}</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.sds')}</label>
                                <div className="relative group/upload">
                                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                  <div className="w-full bg-white border border-dashed border-black/20 px-4 py-3 text-[12px] flex items-center justify-center gap-2 group-hover/upload:border-primary transition-colors">
                                    <FileText size={14} className="text-dark/40" />
                                    <span className="text-dark/60">Upload PDF</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.dims')}</label>
                                <input type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all" placeholder="100kg, 120x80x100cm" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider ml-1">{t('contact.field.photos')}</label>
                                <div className="relative group/upload">
                                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                  <div className="w-full bg-white border border-dashed border-black/20 px-4 py-3 text-[12px] flex items-center justify-center gap-2 group-hover/upload:border-primary transition-colors">
                                    <Camera size={14} className="text-dark/40" />
                                    <span className="text-dark/60">Upload Images</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase text-dark/40 tracking-wider">{t('contact.field.quantity')}</label>
                                <Info size={12} className="text-primary cursor-help" />
                              </div>
                              <textarea rows={2} required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary transition-all resize-none" placeholder={t('contact.field.quantity.helper')}></textarea>
                            </div>

                            <div className="p-4 bg-slate-50 border border-black/5 space-y-3">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" id="support" className="accent-primary" />
                                <label htmlFor="support" className="text-[11px] font-bold text-dark/70 cursor-pointer">{t('contact.field.instructionSupport')}</label>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-dark/30 tracking-widest block ml-1">{t('contact.field.instructionFile')}</label>
                                <div className="relative group/upload">
                                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                  <div className="w-full bg-white/50 border border-dashed border-black/10 px-4 py-2 text-[11px] flex items-center gap-2 group-hover/upload:border-primary transition-colors">
                                    <Upload size={12} className="text-dark/40" />
                                    <span className="text-dark/50">Upload Link</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase text-primary tracking-widest block border-b border-primary/10 pb-2">{t('contact.field.emergencyContact')}</label>
                              <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary" placeholder={t('contact.field.emergencyName')} />
                                <input type="tel" required className="w-full bg-white border border-black/10 px-4 py-3 text-[13px] outline-none focus:border-primary" placeholder={t('contact.field.emergencyPhone')} />
                              </div>
                            </div>

                            <div className="pt-4 space-y-4">
                              <div className="flex items-start gap-3">
                                <input type="checkbox" required className="mt-1 accent-primary" id="consent" />
                                <label htmlFor="consent" className="text-[11px] text-secondary leading-tight cursor-pointer">{t('contact.field.consent')}</label>
                              </div>
                              <div className="flex gap-4">
                                <button type="button" onClick={() => setFormStep(1)} className="text-[11px] font-black uppercase tracking-widest text-dark/30 hover:text-dark transition-colors">Back</button>
                                <Button variant="primary" className="flex-grow py-4 uppercase font-black tracking-widest text-[11px]">
                                  {t('contact.cta')}
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
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-12 text-center space-y-8"
                    >
                      <div className="mx-auto w-20 h-20 bg-green-50 flex items-center justify-center rounded-full">
                        <CheckCircle size={40} className="text-green-500" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black uppercase tracking-tight text-dark">{t('contact.success.title')}</h3>
                        <p className="text-secondary text-[14px] leading-relaxed max-w-sm mx-auto">
                           {t('contact.success.msg')}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-black/5">
                        <Button 
                          variant="gold" 
                          className="w-full py-5 text-[12px] font-black uppercase tracking-[0.2em]"
                          onClick={() => window.open(process.env.CALENDLY_URL || 'https://calendly.com', '_blank')}
                        >
                          {t('contact.success.cta')}
                        </Button>
                        <p className="mt-4 text-[10px] text-dark/40 font-bold uppercase tracking-widest">
                           Redirecting to scheduling platform...
                        </p>
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
