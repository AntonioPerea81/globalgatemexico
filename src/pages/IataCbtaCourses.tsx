import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3,
  FileCheck2, GraduationCap, Monitor, PackageCheck, ShieldCheck, Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container, FadeIn, Eyebrow } from '../components/UI';
import { usePageMeta } from '../hooks/usePageMeta';

type CourseFunction = '7.1' | '7.3';

const INITIAL_DATES = [
  { month: 'January', days: '19–21', year: '2027', suffix: '2027-01' },
  { month: 'February', days: '16–18', year: '2027', suffix: '2027-02' },
  { month: 'April', days: '13–15', year: '2027', suffix: '2027-04' },
  { month: 'May', days: '18–20', year: '2027', suffix: '2027-05' },
  { month: 'June', days: '22–24', year: '2027', suffix: '2027-06' },
];

const RECURRENT_DATES = [
  { month: 'January', days: '27–28', year: '2027', suffix: '2027-01' },
  { month: 'February', days: '24–25', year: '2027', suffix: '2027-02' },
  { month: 'April', days: '21–22', year: '2027', suffix: '2027-04' },
  { month: 'May', days: '26–27', year: '2027', suffix: '2027-05' },
  { month: 'July', days: '7–8', year: '2027', suffix: '2027-06' },
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
    objectives: [
      'Interpret and apply the current IATA Dangerous Goods Regulations to the preparation of air cargo shipments.',
      'Identify and classify dangerous goods, including applicable limitations, quantity provisions and variations.',
      'Select compliant packaging and correctly apply marks, labels and overpack requirements.',
      'Prepare accurate shipment documentation and complete a compliant dangerous goods consignment from start to finish.',
    ],
    curriculum: [
      'Regulatory framework, stakeholder responsibilities and compliance obligations',
      'General limitations, forbidden dangerous goods, exemptions and State or Operator variations',
      'Classification, identification, UN numbers, proper shipping names and packing groups',
      'Packing instructions, package specifications and net quantity limits',
      'Marks, hazard and handling labels, and overpack requirements',
      'Shipper’s Declaration for Dangerous Goods and air waybill information',
      'Reporting requirements and communication of hazards through the transport chain',
      'Case studies, practical shipment and documentation exercises, and final assessment',
    ],
    recurrentFocus: 'Recurrent training refreshes these competencies and incorporates significant changes and amendments from the latest IATA DGR edition.',
    scopeNote: 'This function course does not include the preparation of Class 7 radioactive material consignments.',
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
    objectives: [
      'Apply the current IATA Dangerous Goods Regulations when performing a dangerous goods acceptance check.',
      'Verify the accuracy and consistency of transport documents, packaging, quantities, marks and labels.',
      'Complete the acceptance checklist while applying relevant State and Operator variations.',
      'Recognize discrepancies, determine the required corrective action and make a sound accept-or-reject decision.',
    ],
    curriculum: [
      'Regulatory framework, stakeholder responsibilities and mandatory acceptance duties',
      'General limitations and the effect of State and Operator variations',
      'Identification and classification information relevant to acceptance personnel',
      'Verification of the Dangerous Goods Declaration and air waybill information',
      'Packaging types, quantity limitations, marks, labels and overpacks',
      'Correct completion and application of the dangerous goods acceptance checklist',
      'Acceptance provisions relevant to Class 7 radioactive material shipments',
      'Discrepancy handling, simulated acceptance scenarios, case studies and final assessment',
    ],
    recurrentFocus: 'Recurrent training reinforces the acceptance process and addresses significant changes and amendments from the latest IATA DGR edition.',
    scopeNote: 'Practical exercises use simulated shipment and documentation scenarios to support operational decision-making.',
    path: 'iata-cbta-7-3',
  },
} as const;

const ATTRIBUTION_PARAMS = [
  'ref', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'li_fat_id',
] as const;

function CoursePage({ functionCode }: { functionCode: CourseFunction }) {
  const [searchParams] = useSearchParams();
  const course = COURSE_DATA[functionCode];
  const otherCode: CourseFunction = functionCode === '7.1' ? '7.3' : '7.1';
  const other = COURSE_DATA[otherCode];
  const enrollmentEnabled = import.meta.env.VITE_ENROLLMENT_ENABLED === 'true';
  const cohortPrefixes = functionCode === '7.1'
    ? { initial: '71i', recurrent: '71r' }
    : { initial: '73i', recurrent: '73r' };
  const attributionQuery = useMemo(() => {
    const attribution = new URLSearchParams();
    ATTRIBUTION_PARAMS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) attribution.set(key, value);
    });
    return attribution;
  }, [searchParams]);
  const enrollmentHref = (trainingType: 'initial' | 'recurrent', dateSuffix: string) => {
    const params = new URLSearchParams(attributionQuery);
    params.set('function', functionCode);
    params.set('cohort', `${cohortPrefixes[trainingType]}-${dateSuffix}`);
    return `/training/enrollment?${params.toString()}`;
  };
  const relatedCourseHref = useMemo(() => {
    const query = attributionQuery.toString();
    return `/training/${other.path}${query ? `?${query}` : ''}`;
  }, [attributionQuery, other.path]);

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

      <section className="py-20 lg:py-28 bg-white">
        <Container>
          <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-12 lg:gap-20 items-start">
            <FadeIn>
              <Eyebrow>Learning objectives</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-5">What you will be prepared to do</h2>
              <p className="text-secondary leading-relaxed mb-7">
                Develop the practical knowledge and judgment required to perform the responsibilities assigned to {course.label} personnel with confidence and regulatory awareness.
              </p>
              <div className="flex items-start gap-3 border-l-[3px] border-primary bg-[#f5f7fc] p-5">
                <Target size={19} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-dark/68">{course.recurrentFocus}</p>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-px bg-black/[0.07]">
              {course.objectives.map((objective, index) => (
                <FadeIn key={objective} delay={index * 0.05}>
                  <article className="h-full bg-white p-7 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">Objective</span>
                      <span className="text-2xl font-extrabold text-black/[0.09]">0{index + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-dark/72 font-medium">{objective}</p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="dates" className="py-20 lg:py-28 bg-[#f7f8fb] scroll-mt-24">
        <Container>
          <FadeIn className="max-w-3xl mb-12">
            <Eyebrow>2027 schedule</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5">Initial and recurrent course dates</h2>
            <p className="text-secondary leading-relaxed mb-7">All sessions run from 8:00 a.m. to 4:00 p.m. Eastern Time in an instructor-led live virtual classroom. Enrollment is limited to 10 participants.</p>
            <div className="flex items-center gap-3 text-sm font-bold text-dark">
              <Monitor size={18} className="text-primary" /> Select the training option that matches your current qualification
            </div>
          </FadeIn>
          <div className="grid xl:grid-cols-2 gap-7 items-start">
            <CourseDatePanel
              title="Initial training"
              detail="24 hours · Tuesday–Thursday"
              dates={INITIAL_DATES}
              weekdayLabel="Tuesday–Thursday · Eastern Time"
              enrollmentEnabled={enrollmentEnabled}
              enrollmentHref={(suffix) => enrollmentHref('initial', suffix)}
            />
            <div id="recurrent-dates" className="scroll-mt-24">
              <CourseDatePanel
                title="Recurrent training"
                detail="16 hours · Wednesday–Thursday"
                dates={RECURRENT_DATES}
                weekdayLabel="Wednesday–Thursday · Eastern Time"
                enrollmentEnabled={enrollmentEnabled}
                enrollmentHref={(suffix) => enrollmentHref('recurrent', suffix)}
                dark
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <Container>
          <FadeIn className="max-w-2xl mb-12">
            <Eyebrow>Course options and tuition</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Initial or recurrent training</h2>
            <p className="text-secondary leading-relaxed">Choose the option that matches your current experience and certification status.</p>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-6">
            <FadeIn>
              <article className="h-full bg-white border border-black/[0.08] border-t-[3px] border-t-primary p-7 md:p-9 flex flex-col shadow-[0_18px_50px_rgba(8,20,45,0.06)]">
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
                  Review available dates <ArrowRight size={15} />
                </a>
              </article>
            </FadeIn>

            <FadeIn delay={0.08}>
              <article className="h-full bg-[#07101f] text-white border border-white/[0.08] border-t-[3px] border-t-[#d6b850] p-7 md:p-9 flex flex-col shadow-[0_18px_50px_rgba(8,20,45,0.14)]">
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
                <a href="#recurrent-dates" className="mt-auto inline-flex justify-center items-center gap-2 border border-white/15 text-white px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-black hover:border-white/35 transition-colors">
                  Review recurrent dates <ArrowRight size={15} />
                </a>
              </article>
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
              <h2 className="text-3xl font-extrabold mb-8">Topics covered during the course</h2>
              <ul className="space-y-4">
                {course.curriculum.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/58"><CheckCircle2 size={17} className="text-primary shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
              <p className="mt-7 pt-6 border-t border-white/10 text-xs leading-relaxed text-white/38">{course.scopeNote}</p>
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
            <Link to={relatedCourseHref} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-black text-primary">
              View course <ArrowRight size={15} />
            </Link>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}

type CourseDate = { month: string; days: string; year: string; suffix: string };

function CourseDatePanel({
  title,
  detail,
  dates,
  weekdayLabel,
  enrollmentEnabled,
  enrollmentHref,
  dark = false,
}: {
  title: string;
  detail: string;
  dates: readonly CourseDate[];
  weekdayLabel: string;
  enrollmentEnabled: boolean;
  enrollmentHref: (suffix: string) => string;
  dark?: boolean;
}) {
  return (
    <FadeIn>
      <article className={dark ? 'bg-[#07101f] text-white p-6 md:p-8' : 'bg-white border border-black/[0.07] p-6 md:p-8'}>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className={dark ? 'text-[10px] uppercase tracking-[0.18em] text-[#d6b850] font-black mb-2' : 'text-[10px] uppercase tracking-[0.18em] text-primary font-black mb-2'}>{detail}</p>
            <h3 className="text-2xl font-extrabold">{title}</h3>
          </div>
          <span className={dark ? 'text-[9px] uppercase tracking-[0.16em] font-black text-white/40' : 'text-[9px] uppercase tracking-[0.16em] font-black text-secondary'}>Maximum 10</span>
        </div>
        <div className={dark ? 'divide-y divide-white/10 border-y border-white/10' : 'divide-y divide-black/[0.07] border-y border-black/[0.07]'}>
          {dates.map((date) => (
            <div key={date.suffix} className="grid grid-cols-[1fr_auto] gap-4 items-center py-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className={dark ? 'w-10 h-10 bg-white/[0.06] flex items-center justify-center shrink-0' : 'w-10 h-10 bg-primary/7 flex items-center justify-center shrink-0'}>
                  <CalendarDays size={18} className={dark ? 'text-[#d6b850]' : 'text-primary'} />
                </div>
                <div>
                  <p className="font-extrabold text-sm md:text-base">{date.month} {date.days}, {date.year}</p>
                  <p className={dark ? 'text-xs text-white/38 mt-1' : 'text-xs text-secondary mt-1'}>{weekdayLabel}</p>
                </div>
              </div>
              {enrollmentEnabled ? (
                <Link to={enrollmentHref(date.suffix)} className={dark ? 'inline-flex px-4 py-2 bg-[#d6b850] text-[#07101f] text-[9px] uppercase tracking-[0.16em] font-black' : 'inline-flex px-4 py-2 bg-primary text-white text-[9px] uppercase tracking-[0.16em] font-black'}>Enroll</Link>
              ) : (
                <span className={dark ? 'hidden sm:inline-flex px-3 py-1 bg-white/[0.06] text-[9px] uppercase tracking-[0.16em] font-black text-white/45' : 'hidden sm:inline-flex px-3 py-1 bg-[#f1f3f8] text-[9px] uppercase tracking-[0.16em] font-black text-dark/55'}>10 seats</span>
              )}
            </div>
          ))}
        </div>
        {enrollmentEnabled ? (
          <Link to={enrollmentHref(dates[0].suffix)} className={dark ? 'mt-6 w-full inline-flex justify-center bg-[#d6b850] text-[#07101f] px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-black' : 'mt-6 w-full inline-flex justify-center bg-primary text-white px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-black'}>
            Start secure enrollment
          </Link>
        ) : (
          <button type="button" disabled className={dark ? 'mt-6 w-full bg-white/10 text-white/45 px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-black cursor-not-allowed' : 'mt-6 w-full bg-primary/35 text-white px-6 py-4 text-[11px] uppercase tracking-[0.16em] font-black cursor-not-allowed'}>
            Online enrollment opening soon
          </button>
        )}
      </article>
    </FadeIn>
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
