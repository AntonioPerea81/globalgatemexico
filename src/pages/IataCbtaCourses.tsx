import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3,
  FileCheck2, GraduationCap, Monitor, PackageCheck, ShieldCheck, Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { usePageMeta } from '../hooks/usePageMeta';

type CourseFunction = '7.1' | '7.3';

const INITIAL_DATES = [
  { month: 'January', days: '19–21', year: '2027' },
  { month: 'February', days: '16–18', year: '2027' },
  { month: 'April', days: '13–15', year: '2027' },
  { month: 'May', days: '18–20', year: '2027' },
  { month: 'June', days: '22–24', year: '2027' },
];

const COURSE_DATA = {
  '7.1': {
    label: 'Function 7.1',
    title: 'Preparing Dangerous Goods Consignments',
    description: 'Live virtual IATA DGR competency-based training for personnel responsible for preparing dangerous goods consignments for air transport.',
    audience: [
      'Shippers and packing personnel',
      'Manufacturers and exporters of dangerous goods',
      'Personnel responsible for classification, packing, marking or labelling',
      'Operator personnel acting as the shipper',
    ],
    curriculum: [
      'Regulatory scope, responsibilities, limitations and variations',
      'Identification and classification of dangerous goods',
      'Packing instructions, quantity limits and package selection',
      'Marks, labels and overpack requirements',
      'Dangerous Goods Declarations and air waybill information',
      'Practical shipment-preparation exercises using the current IATA DGR',
    ],
    path: 'iata-cbta-7-1',
  },
  '7.3': {
    label: 'Function 7.3',
    title: 'Accepting Dangerous Goods Consignments',
    description: 'Live virtual IATA DGR competency-based training for personnel responsible for accepting dangerous goods consignments for air transport.',
    audience: [
      'Freight forwarders and cargo agents',
      'Airline and cargo-terminal acceptance personnel',
      'Ground-handling personnel responsible for acceptance checks',
      'Supervisors overseeing dangerous goods acceptance activities',
    ],
    curriculum: [
      'Regulatory scope, responsibilities, limitations and variations',
      'Shipment documentation and package verification',
      'Use of the dangerous goods acceptance checklist',
      'Marks, labels, packaging and quantity-limit checks',
      'Identification of discrepancies and required corrective action',
      'Pre-loading information and practical acceptance exercises',
    ],
    path: 'iata-cbta-7-3',
  },
} as const;

function CoursePage({ functionCode }: { functionCode: CourseFunction }) {
  const course = COURSE_DATA[functionCode];
  const otherCode: CourseFunction = functionCode === '7.1' ? '7.3' : '7.1';
  const other = COURSE_DATA[otherCode];

  usePageMeta({
    title: `${course.label} ${course.title} | Live Virtual IATA DGR Training | GGM`,
    description: `${course.description} Initial and recurrent courses delivered in English by Global Gate México.`,
    canonical: `https://globalgatemexico.com/training/${course.path}`,
    lang: 'en',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [functionCode]);

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#030914] text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.16) 1px, transparent 0)', backgroundSize: '34px 34px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(7,56,223,.25),transparent_38%)]" />
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-12 lg:gap-16 items-center">
            <FadeIn>
              <div className="flex items-center gap-3 mb-7">
                <span className="px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-[0.2em]">{course.label}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">IATA CBTA · Live Virtual</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-[-0.035em] leading-[1.02] max-w-3xl mb-6">
                {course.title}
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-white/58 max-w-2xl mb-10">
                {course.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 max-w-3xl">
                {[
                  ['Delivery', 'Live online'],
                  ['Language', 'English'],
                  ['Time', '8:00–16:00 ET'],
                  ['Class size', 'Maximum 10'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#07101f] p-5">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/28 font-black mb-2">{label}</p>
                    <p className="text-sm font-bold text-white/85">{value}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.12} className="flex justify-center lg:justify-end">
              <aside className="relative w-full max-w-[280px] bg-white/[0.055] border border-white/10 p-7 text-center shadow-[0_28px_70px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-[#f7c844]" />
                <div className="absolute -inset-px bg-[radial-gradient(circle_at_50%_35%,rgba(247,200,68,.14),transparent_58%)] pointer-events-none" />
                <img
                  src="/IATA-CBTA_Provider_RGB.png"
                  alt="IATA Competency Training and Assessment Center Provider"
                  className="relative w-[190px] md:w-[215px] h-auto mx-auto drop-shadow-[0_16px_30px_rgba(0,0,0,0.35)]"
                />
                <div className="relative mt-5 pt-5 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-[0.22em] font-black text-[#f7c844] mb-2">Recognized training provider</p>
                  <p className="text-sm font-bold text-white/85">IATA CBTA Provider</p>
                  <p className="text-[11px] text-white/40 mt-1">Certified functions 7.1 and 7.3</p>
                </div>
              </aside>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28 bg-[#f7f8fb]">
        <Container>
          <FadeIn className="max-w-2xl mb-12">
            <Eyebrow>Choose your course</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Initial or recurrent training</h2>
            <p className="text-secondary leading-relaxed">Select the option that matches your current experience and certification status.</p>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-6">
            <FadeIn>
              <article className="h-full bg-white border border-black/[0.08] border-t-[3px] border-t-primary p-7 md:p-9 flex flex-col">
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black mb-2">Initial training</p>
                    <h3 className="text-2xl font-extrabold">CAD $1,200 <span className="text-sm text-secondary font-semibold">per participant</span></h3>
                  </div>
                  <GraduationCap className="text-primary" size={26} />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-7">
                  <Detail icon={Clock3} label="Duration" value="24 hours" />
                  <Detail icon={CalendarDays} label="Schedule" value="3 consecutive days" />
                </div>
                <p className="text-sm text-secondary leading-relaxed mb-7">No previous dangerous goods experience is required. Recommended level: Basic.</p>
                <a href="#dates" className="mt-auto inline-flex justify-center items-center gap-2 bg-primary text-white px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-black hover:bg-[#052db5] transition-colors">
                  View available dates <ArrowRight size={15} />
                </a>
              </article>
            </FadeIn>

            <FadeIn delay={0.08}>
              <article className="h-full bg-[#07101f] text-white border border-white/[0.08] border-t-[3px] border-t-[#d6b850] p-7 md:p-9 flex flex-col">
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#d6b850] font-black mb-2">Recurrent training</p>
                    <h3 className="text-2xl font-extrabold">CAD $1,000 <span className="text-sm text-white/38 font-semibold">per participant</span></h3>
                  </div>
                  <ShieldCheck className="text-[#d6b850]" size={26} />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-7">
                  <Detail icon={Clock3} label="Duration" value="16 hours" dark />
                  <Detail icon={CalendarDays} label="Schedule" value="2 consecutive days" dark />
                </div>
                <p className="text-sm text-white/48 leading-relaxed mb-7">Valid prior training for the corresponding function is required. Recommended level: Intermediate.</p>
                <Link to="/training-proposal" className="mt-auto inline-flex justify-center items-center gap-2 border border-white/15 text-white px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-black hover:border-white/35 transition-colors">
                  Request on-demand dates <ArrowRight size={15} />
                </Link>
              </article>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section id="dates" className="py-20 lg:py-28 bg-white scroll-mt-24">
        <Container>
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
            <FadeIn>
              <Eyebrow>2027 schedule</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-5">Initial course dates</h2>
              <p className="text-secondary leading-relaxed mb-7">Each session runs Tuesday through Thursday from 8:00 a.m. to 4:00 p.m. Eastern Time. Enrollment is limited to 10 participants.</p>
              <div className="flex items-center gap-3 text-sm font-bold text-dark">
                <Monitor size={18} className="text-primary" /> Instructor-led live virtual classroom
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="divide-y divide-black/[0.07] border-y border-black/[0.07]">
                {INITIAL_DATES.map((date) => (
                  <div key={date.month} className="grid grid-cols-[1fr_auto] gap-5 items-center py-5">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-primary/7 flex items-center justify-center shrink-0"><CalendarDays size={20} className="text-primary" /></div>
                      <div>
                        <p className="font-extrabold">{date.month} {date.days}, {date.year}</p>
                        <p className="text-xs text-secondary mt-1">Tuesday–Thursday · Eastern Time</p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex px-3 py-1 bg-[#f1f3f8] text-[9px] uppercase tracking-[0.16em] font-black text-dark/55">10 seats</span>
                  </div>
                ))}
              </div>
              <button type="button" disabled className="mt-7 w-full bg-primary/35 text-white px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-black cursor-not-allowed">
                Online enrollment opening soon
              </button>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28 bg-[#07101f] text-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24">
            <FadeIn>
              <Eyebrow light>Who should attend</Eyebrow>
              <h2 className="text-3xl font-extrabold mb-8">Training aligned to your assigned function</h2>
              <ul className="space-y-4">
                {course.audience.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/58"><CheckCircle2 size={17} className="text-primary shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.08}>
              <Eyebrow light>Course content</Eyebrow>
              <h2 className="text-3xl font-extrabold mb-8">Practical competency development</h2>
              <ul className="space-y-4">
                {course.curriculum.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/58"><CheckCircle2 size={17} className="text-primary shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-24 bg-white">
        <Container>
          <div className="grid md:grid-cols-3 gap-px bg-black/[0.07]">
            <InfoCard icon={BookOpen} title="IATA DGR during class">The current IATA DGR edition will be made available for participants to use during the course. Personal copies are not included in tuition.</InfoCard>
            <InfoCard icon={PackageCheck} title="Participant purchase option">Participants may purchase their own IATA DGR copy at special pricing available through GGM as a CBTA Provider.</InfoCard>
            <InfoCard icon={FileCheck2} title="Assessment and certificate">A final result of 80% or higher is required. Eligible certificates are normally valid for 24 months.</InfoCard>
          </div>
          <FadeIn className="mt-12 border border-black/[0.08] p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black mb-2">Related IATA CBTA course</p>
              <h3 className="text-xl font-extrabold">{other.label} · {other.title}</h3>
            </div>
            <Link to={`/training/${other.path}`} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-black text-primary">
              View course <ArrowRight size={15} />
            </Link>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}

function Detail({ icon: Icon, label, value, dark = false }: { icon: LucideIcon; label: string; value: string; dark?: boolean }) {
  return (
    <div className={dark ? 'border border-white/10 p-4' : 'border border-black/[0.07] p-4'}>
      <Icon size={16} className={dark ? 'text-[#d6b850] mb-3' : 'text-primary mb-3'} />
      <p className={dark ? 'text-[9px] uppercase tracking-[0.16em] text-white/28 font-black' : 'text-[9px] uppercase tracking-[0.16em] text-secondary font-black'}>{label}</p>
      <p className={dark ? 'text-sm font-bold text-white/80 mt-1' : 'text-sm font-bold mt-1'}>{value}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <FadeIn>
      <article className="h-full bg-white p-7 md:p-8">
        <Icon size={22} className="text-primary mb-5" />
        <h3 className="text-sm font-extrabold uppercase tracking-wide mb-3">{title}</h3>
        <p className="text-sm text-secondary leading-relaxed">{children}</p>
      </article>
    </FadeIn>
  );
}

export function IataCbta71Page() {
  return <CoursePage functionCode="7.1" />;
}

export function IataCbta73Page() {
  return <CoursePage functionCode="7.3" />;
}
