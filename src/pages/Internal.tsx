import { PageHeader } from '../components/Layout';
import { Section, Container, Button } from '../components/UI';
import { ChevronRight } from 'lucide-react';
import { SERVICES } from '../constants';
import { Icon } from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

export const ServicesPage = () => {
  const { t, language } = useLanguage();
  return (
    <div>
      <PageHeader 
        title={t('page.services.title')} 
        subtitle={t('page.services.desc')} 
      />
      <Section>
        <Container>
          <div className="grid lg:grid-cols-2 gap-16">
            {SERVICES.map((service) => (
              <div key={service.id} className="flex gap-8 group">
                <div className="shrink-0 w-16 h-16 bg-primary/5 flex items-center justify-center rounded-sm group-hover:bg-primary transition-colors">
                  <Icon name={service.icon} className="text-primary group-hover:text-white transition-colors" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{language === 'ES' ? service.titleEs || service.title : service.title}</h3>
                  <p className="text-secondary leading-relaxed mb-6">
                    {language === 'ES' ? service.descriptionEs || service.description : service.description}
                  </p>
                  <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-accent font-bold">
                    {t('page.services.specs')} <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container className="text-center">
          <h2 className="text-3xl font-bold mb-8 italic text-primary">{t('page.services.consultation')}</h2>
          <p className="text-secondary mb-10 max-w-2xl mx-auto">{t('page.services.consultation.desc')}</p>
          <Button variant="primary">{t('page.services.cta')}</Button>
        </Container>
      </Section>
    </div>
  );
};

export const AboutPage = () => {
  const METRICS = [
    { value: '19+',                  label: 'Years Specialized' },
    { value: '4',                    label: 'Strategic Locations' },
    { value: 'IATA',                 label: 'Certified Training Organization' },
    { value: 'CNSNS',                label: 'Radioactive Transport Authorization' },
    { value: 'Air · Ground · Ocean', label: 'Integrated DG Operations' },
    { value: 'Class 7',              label: 'Radioactive Material Expertise' },
  ];

  const TRUST_ORGS = ['IATA', 'COSTHA', 'DGTA', 'CNSNS'];

  return (
    <div className="bg-[#060e1c] min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-44 pb-24 lg:pt-56 lg:pb-36 overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute top-0 left-[10%] w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-[5%] w-[500px] h-[400px] rounded-full blur-[110px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(30,64,175,0.05) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-8 lg:px-12">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-[10px] font-extrabold tracking-[0.3em] uppercase text-primary mb-10"
          >
            About Global Gate Mexico
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-5xl lg:text-[4.5rem] xl:text-[5.5rem] font-black text-white leading-[1.02] tracking-[-0.025em] mb-9 max-w-4xl"
          >
            Specialized Dangerous Goods Logistics Since 2006.
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-[15px] text-white/40 leading-relaxed max-w-[520px]"
          >
            Integrated transportation, compliance and hazardous materials solutions across Mexico and international markets.
          </motion.p>

          {/* Decorative rule */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-14 flex items-center gap-3"
          >
            <div className="h-px w-20 bg-white/12" />
            <div className="h-px flex-1 bg-white/[0.035]" />
          </motion.div>
        </div>
      </section>

      {/* ── Metrics Grid ──────────────────────────────────────────────────── */}
      <section>
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.045)' }}>
            {METRICS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.52, delay: i * 0.07 }}
                className="group relative bg-[#060e1c] hover:bg-[#08121f] transition-colors duration-500 p-10 xl:p-14 cursor-default overflow-hidden"
              >
                {/* Inset glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(37,99,235,0.07) 0%, transparent 65%)' }} />

                {/* Top accent bar */}
                <div className="h-[2px] bg-primary/35 group-hover:bg-primary/75 transition-all duration-400 mb-10"
                  style={{ width: '1.5rem' }} />

                {/* Metric value */}
                <div className="text-[2.2rem] lg:text-[2.6rem] font-black text-white tracking-[-0.02em] leading-none mb-5">
                  {value}
                </div>

                {/* Label */}
                <div className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-white/28 group-hover:text-white/52 transition-colors duration-300 leading-relaxed">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Strip ───────────────────────────────────────────────────── */}
      <section className="mt-16 py-16 lg:py-20 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <p className="text-center text-[9px] font-black tracking-[0.28em] uppercase mb-9"
            style={{ color: 'rgba(255,255,255,0.18)' }}>
            Industry Affiliations &amp; Authorizations
          </p>
          <div className="flex flex-wrap items-center justify-center">
            {TRUST_ORGS.map((org, i) => (
              <div key={org} className="flex items-center">
                <span
                  className="text-[13px] font-black tracking-[0.22em] uppercase hover:text-white/48 transition-colors duration-300 cursor-default px-8 lg:px-14"
                  style={{ color: 'rgba(255,255,255,0.22)' }}
                >
                  {org}
                </span>
                {i < TRUST_ORGS.length - 1 && (
                  <span className="select-none" style={{ color: 'rgba(255,255,255,0.09)', fontSize: '5px' }}>◆</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Statement ─────────────────────────────────────────────── */}
      <section className="py-36 lg:py-52 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
          >
            {/* Vertical accent */}
            <div className="w-px h-16 mx-auto mb-14" style={{ background: 'rgba(37,99,235,0.28)' }} />

            <h2 className="text-4xl lg:text-[3.5rem] xl:text-[4.5rem] font-black text-white leading-[1.06] tracking-[-0.025em] mb-10">
              One Partner.<br />Full Dangerous Goods Control.
            </h2>

            <p className="text-[14px] lg:text-[15px] leading-[1.9] max-w-2xl mx-auto"
              style={{ color: 'rgba(255,255,255,0.32)' }}>
              From classification and packaging to transportation and regulatory compliance, Global Gate Mexico delivers integrated dangerous goods solutions with operational precision and safety at every stage.
            </p>

            {/* Bottom ornament */}
            <div className="mt-16 flex items-center justify-center gap-5">
              <div className="h-px w-20" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="w-[5px] h-[5px] rounded-full" style={{ background: 'rgba(37,99,235,0.45)' }} />
              <div className="h-px w-20" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export const TrainingPage = () => {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader 
        title={t('page.training.title')} 
        subtitle={t('page.training.desc')} 
      />
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="bg-bg-light p-10 border border-black/5">
              <h2 className="text-2xl font-bold mb-6 italic text-primary">{t('nav.training')}</h2>
              <p className="text-secondary leading-relaxed mb-8">
                {t('page.training.desc')}
              </p>
              <div className="grid gap-6">
                {[
                  'IATA Dangerous Goods Regulation (DGR)',
                  'IMDG Code (Maritime Dangerous Goods)',
                  'SCT Normatividad Mexicana (NOM-002, NOM-004)',
                  'DOT 49 CFR (US Regulations)',
                  'Operational Safety & PPE'
                ].map((course) => (
                  <div key={course} className="flex items-center gap-4 p-4 bg-white border border-black/5 hover:border-primary/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="font-bold text-sm tracking-wide uppercase">{course}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <Button variant="primary" size="lg">
                {t('page.services.cta')}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
