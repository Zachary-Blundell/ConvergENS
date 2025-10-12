// [locale]/page.tsx — homepage

import '@/styles/scroll.css';
import Image from 'next/image';
import Link from 'next/link';
import reactStringReplace from 'react-string-replace';
import { getLocale, getTranslations } from 'next-intl/server';
import { getHome } from '@/lib/cms/homepage';
import OrganisationsRow from '@/components/OrganisationsRow';

/* ---------------- Utilities ---------------- */

function renderHighlightOnly(s?: string) {
  if (!s) return null;
  return reactStringReplace(s, /<highlight>(.*?)<\/highlight>/g, (match, i) => (
    <span key={i} className="text-highlight">
      {match}
    </span>
  ));
}

/* ---------------- Reusable Section ---------------- */

type SectionProps = {
  id: string;
  className?: string; // outer <section> classes
  title: React.ReactNode;
  paragraph?: React.ReactNode;
  children?: React.ReactNode;
};

function Section({ id, className, title, paragraph, children }: SectionProps) {
  const sectionBase =
    // allow content to grow, avoid hard h-[70vh]
    'relative z-0 w-full min-h-[60svh] md:min-h-[70svh] ' +
    // vertical rhythm
    'py-12 md:py-20 ' +
    // layout
    'flex flex-col items-center ' +
    // prevent animated children from spilling into next section
    'overflow-clip';

  return (
    <section
      id={id}
      className={`${sectionBase}${className ? ` ${className}` : ''}`}
    >
      <div className="scroll-fade w-full">
        <div className="mx-auto my-8 w-fit rounded-xl bg-surface-3 p-2 shadow-m">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl text-highlight">
            {title}
          </h2>
        </div>

        {paragraph && (
          <p className="mx-auto my-4 max-w-3xl px-4 text-center text-base sm:text-lg leading-relaxed text-fg-primary">
            {paragraph}
          </p>
        )}

        <div className="mx-auto w-full max-w-5xl px-4">{children}</div>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

export default async function HomePage() {
  const locale = await getLocale();
  const home = await getHome(locale);

  const t = home?.translations;
  const tFallback = await getTranslations('Home');

  return (
    <div className="flex w-full flex-col items-center justify-center bg-surface-1">
      {/* ---------------- Hero ---------------- */}
      {/* <Hero */}
      {/*   title="Build faster. Think clearer." */}
      {/*   subtitle="A minimal hero section with a full-bleed background image, overlay, and centered CTA." */}
      {/*   ctaText="Get Started" */}
      {/*   ctaHref="#get-started" */}
      {/*   imageUrl={home.hero_bg.url} */}
      {/* /> */}

      {/* ---------------- Hero ---------------- */}
      <section className="relative h-svh w-full">
        {home?.hero_bg.url && (
          <Image
            src={home?.hero_bg.url}
            alt=""
            fill
            priority
            className="object-cover z-0"
          />
        )}
        {/* ---------------- Organisation Rows---------------- */}
        <OrganisationsRow />

        <div className="relative bottom-10 z-10 flex h-full w-full items-center justify-center">
          <div className="px-4 text-center">
            <h1 className="text-[clamp(2.5rem,_5vw,_4rem)] text-white bg-surface-1/50 backdrop-blur-sm px-4 rounded-lg border-0">
              {renderHighlightOnly(
                t?.hero_title ? t.hero_title : tFallback.raw('hero.title'),
              )}
            </h1>
            <Link
              href="/organisations"
              className="mt-6 inline-block rounded-md bg-highlight px-6 py-3 text-sm font-medium uppercase text-white transition-colors duration-300 hover:bg-highlight-400 focus:outline-none"
            >
              {t?.hero_cta ? t.hero_cta : tFallback('hero.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- What is ConvergENS? ---------------- */}
      <Section
        id="what-is"
        title={t?.section_1_title ?? tFallback('section1.title')}
        paragraph={t?.section_1_body ?? tFallback('section1.body')}
      />

      {/* ---------------- How ConvergENS works ---------------- */}
      <Section
        id="how"
        className="bg-surface-2"
        title={t?.section_2_title ?? tFallback('section2.title')}
        paragraph={t?.section_2_body ?? tFallback('section2.body')}
      />

      {/* ---------------- About grid ---------------- */}
      <section className="container mx-auto space-y-20 px-4 py-16">
        {/* Row 1 – image left, text right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="scroll-fade-in aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <h2 className="text-2xl text-fg-primary">
              {t?.about_row1_title ?? tFallback('about.row1.title')}
            </h2>
            <p className="leading-relaxed text-fg-primary">
              {t?.about_row1_body ?? tFallback('about.row1.body')}
            </p>
          </div>
        </div>

        {/* Row 2 – text left, image right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="order-2 space-y-4 sm:order-1">
            <h2 className="text-2xl text-fg-primary">
              {t?.about_row2_title ?? tFallback('about.row2.title')}
            </h2>
            <p className="leading-relaxed text-fg-primary">
              {t?.about_row2_body ?? tFallback('about.row2.body')}
            </p>
          </div>
          <div className="scroll-fade-in order-1 aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700 sm:order-2" />
        </div>

        {/* Row 3 – image left, text right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="scroll-fade-in aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <h2 className="text-2xl text-fg-primary">
              {t?.about_row3_title ?? tFallback('about.row3.title')}
            </h2>
            <p className="leading-relaxed text-fg-primary">
              {t?.about_row3_body ?? tFallback('about.row3.body')}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Objectives ---------------- */}
      <Section
        id="objectives"
        title={t?.section_3_title ?? tFallback('section3.title')}
        paragraph={t?.section_3_body ?? tFallback('section3.body')}
      />
    </div>
  );
}
