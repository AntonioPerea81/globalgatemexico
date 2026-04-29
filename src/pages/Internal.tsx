import { PageHeader } from '../components/Layout';
import { Section, Container, Button } from '../components/UI';
import { ChevronRight } from 'lucide-react';
import { SERVICES } from '../constants';
import { Icon } from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader 
        title={t('page.about.title')} 
        subtitle={t('page.about.desc')} 
      />
      <Section>
        <Container>
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold uppercase">{t('page.about.mission.title')}</h2>
              <p className="text-secondary leading-relaxed italic">
                {t('page.about.mission.text1')}
              </p>
              <p className="text-secondary leading-relaxed">
                {t('page.about.mission.text2')}
              </p>
            </div>
            <div className="bg-dark p-12 text-white rounded-sm">
              <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-accent">{t('page.about.values.title')}</h3>
              <ul className="space-y-6">
                {[
                  { t: t('page.about.value1.title'), d: t('page.about.value1.desc') },
                  { t: t('page.about.value2.title'), d: t('page.about.value2.desc') },
                  { t: t('page.about.value3.title'), d: t('page.about.value3.desc') },
                  { t: t('page.about.value4.title'), d: t('page.about.value4.desc') }
                ].map(v => (
                  <li key={v.t}>
                    <h4 className="font-bold text-accent mb-1">{v.t}</h4>
                    <p className="text-white/60 text-sm">{v.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
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
