// [locale]/page.tsx — homepage

import '@/styles/scroll.css';
import Image from 'next/image';
import Link from 'next/link';
import reactStringReplace from 'react-string-replace';
import { getLocale, getTranslations } from 'next-intl/server';
import { getHome } from '@/lib/cms/homepage';
import CollectiveRows from '@/components/CollectivesRow';
import Hero from '@/components/hero-section';

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
        {/* ---------------- Collective Rows---------------- */}
        <CollectiveRows />

        <div className="relative bottom-10 z-10 flex h-full w-full items-center justify-center">
          <div className="px-4 text-center">
            <h1 className="text-[clamp(2.5rem,_5vw,_4rem)] text-white bg-surface-1/50 backdrop-blur-sm px-4 rounded-lg border-0">
              {renderHighlightOnly(
                t?.hero_title ? t.hero_title : tFallback.raw('hero.title'),
              )}
            </h1>
            <Link
              href="/collectives"
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
////[local]/page.tsx
//// homepage
//
//import Link from 'next/link';
//import '@/styles/scroll.css';
//import reactStringReplace from 'react-string-replace';
//import { getLocale, getTranslations } from 'next-intl/server';
//import { getHome } from '@/lib/cms/homepage';
//import CollectiveRows from '@/components/CollectivesRow';
//import { ChevronRight } from 'lucide-react';
//import Image from 'next/image';
//import { TextEffect } from '@/components/ui/text-effect';
//import { AnimatedGroup } from '@/components/ui/animated-group';
//import { Button } from '@/components/ui/button';
//
//type SectionProps = React.PropsWithChildren<{
//  id: string;
//  className?: string;
//  title: React.ReactNode;
//  paragraph: React.ReactNode;
//}>;
//
//function Section({ id, className, title, paragraph, children }: SectionProps) {
//  const sectionBase =
//    'w-full h-[70vh] flex flex-col items-center justify-center py-10';
//
//  return (
//    <section
//      id={id}
//      className={`${sectionBase}${className ? ` ${className}` : ''}`}
//    >
//      <div className="scroll-fade">
//        <div className="w-fit p-2 bg-surface-3 rounded-xl shadow-m mx-auto my-10">
//          <h2 className="text-5xl text-center text-highlight">{title}</h2>
//        </div>
//
//        {paragraph && (
//          <p className="text-xl leading-relaxed text-center text-fg-primary whitespace-pre-line my-4 w-3/4 mx-auto">
//            {paragraph}
//          </p>
//        )}
//
//        {children}
//      </div>
//    </section>
//  );
//}
//
//function renderHighlightOnly(s?: string) {
//  if (!s) return null;
//  return reactStringReplace(s, /<highlight>(.*?)<\/highlight>/g, (match, i) => (
//    <span key={i} className="text-highlight">
//      {match}
//    </span>
//  ));
//}
//const transitionVariants = {
//  item: {
//    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
//    visible: {
//      opacity: 1,
//      filter: 'blur(0px)',
//      y: 0,
//      transition: { type: 'spring', bounce: 0.3, duration: 1.5 },
//    },
//  },
//};
//
//export default async function HomePage() {
//  const locale = await getLocale();
//
//  const home = await getHome(locale);
//
//  const t = home?.translations;
//  const tFallback = await getTranslations('Home');
//
//  const titleNode = renderHighlightOnly(
//    t?.hero_title ?? tFallback.raw('hero.title'),
//  );
//  const ctaLabel = t?.hero_cta ?? tFallback('hero.cta');
//
//  return (
//    <div className="flex flex-col items-center justify-center w-full bg-surface-1">
//      <div
//        aria-hidden
//        className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
//      >
//        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
//        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
//        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
//      </div>
//
//      <section className="relative">
//        <div className="relative pt-24 md:pt-36">
//          {/* masked background image (uses your CMS image) */}
//          {home?.hero_bg?.url && (
//            <AnimatedGroup
//              variants={{
//                container: { visible: { transition: { delayChildren: 1 } } },
//                item: {
//                  hidden: { opacity: 0, y: 20 },
//                  visible: {
//                    opacity: 1,
//                    y: 0,
//                    transition: { type: 'spring', bounce: 0.3, duration: 2 },
//                  },
//                },
//              }}
//              className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32"
//            >
//              <Image
//                src={home.hero_bg.url}
//                alt=""
//                className="hidden size-full dark:block object-cover"
//                width={3276}
//                height={4095}
//                priority
//              />
//              <Image
//                src={home.hero_bg.url}
//                alt=""
//                className="size-full object-cover dark:hidden"
//                width={3276}
//                height={4095}
//                priority
//              />
//            </AnimatedGroup>
//          )}
//
//          {/* subtle vignette to boost contrast */}
//          <div
//            aria-hidden
//            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,hsl(var(--surface-2)/0.85)_75%)]"
//          />
//
//          {/* optional overlay rows; non-blocking so CTAs stay clickable */}
//          <CollectiveRows />
//
//          {/* headline + subcopy + CTAs */}
//          <div className="mx-auto max-w-7xl px-6">
//            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
//              <TextEffect
//                preset="fade-in-blur"
//                speedSegment={0.3}
//                as="h1"
//                className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
//              >
//                {titleNode}
//              </TextEffect>
//
//              {/* optional subcopy if you add 'hero_sub' later */}
//              {t?.hero_sub && (
//                <TextEffect
//                  per="line"
//                  preset="fade-in-blur"
//                  speedSegment={0.3}
//                  delay={0.5}
//                  as="p"
//                  className="mx-auto mt-8 max-w-2xl text-balance text-lg"
//                >
//                  {t.hero_sub}
//                </TextEffect>
//              )}
//
//              {/* CTA buttons (primary uses your /collectives) */}
//              <AnimatedGroup
//                variants={{
//                  container: {
//                    visible: {
//                      transition: {
//                        staggerChildren: 0.05,
//                        delayChildren: 0.75,
//                      },
//                    },
//                  },
//                  ...transitionVariants,
//                }}
//                className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
//              >
//                <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
//                  <Button
//                    asChild
//                    size="lg"
//                    className="rounded-xl px-5 text-base"
//                  >
//                    <Link href="/collectives">
//                      <span className="text-nowrap">{ctaLabel}</span>
//                    </Link>
//                  </Button>
//                </div>
//
//                {/* Secondary CTA: point wherever you like or remove */}
//                {/* <Button asChild size="lg" variant="ghost" className="h-10.5 rounded-xl px-5">
//                  <Link href="/calendar">
//                    <span className="text-nowrap">{t('seeEvents')}</span>
//                  </Link>
//                </Button> */}
//              </AnimatedGroup>
//            </div>
//          </div>
//
//          {/* framed app preview zone — keep form, swap to your assets if desired */}
//          <AnimatedGroup
//            variants={{
//              container: {
//                visible: {
//                  transition: { staggerChildren: 0.05, delayChildren: 0.75 },
//                },
//              },
//              ...transitionVariants,
//            }}
//          >
//            <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
//              <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
//                {/* swap these two images to whatever “product shot” you have,
//                    or remove this whole block if you don’t need a mockup */}
//                <Image
//                  className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block object-cover"
//                  src="/mail2.png"
//                  alt=""
//                  width={2700}
//                  height={1440}
//                />
//                <Image
//                  className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden object-cover"
//                  src="/mail2-light.png"
//                  alt=""
//                  width={2700}
//                  height={1440}
//                />
//              </div>
//            </div>
//          </AnimatedGroup>
//        </div>
//      </section>
//
//      {/* hover-reveal link section (kept from example; points to your route) */}
//      <section className="bg-background pb-16 pt-16 md:pb-32">
//        <div className="group relative m-auto max-w-5xl px-6">
//          <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
//            <Link
//              href="/collectives"
//              className="block text-sm duration-150 hover:opacity-75"
//            >
//              <span>{ctaLabel}</span>
//              <ChevronRight className="ml-1 inline-block size-3" />
//            </Link>
//          </div>
//        </div>
//      </section>
//
//      {/* ---------------- What is ConvergENS? ---------------- */}
//      <Section
//        id="what-is"
//        title={
//          t?.section_1_title ? t.section_1_title : tFallback('section1.title')
//        }
//        paragraph={
//          t?.section_1_body ? t.section_1_body : tFallback('section1.body')
//        }
//      />
//      {/* ---------------- How ConvergENS works ---------------- */}
//      <Section
//        id="how"
//        className="bg-surface-2"
//        title={
//          t?.section_2_title ? t.section_2_title : tFallback('section2.title')
//        }
//        paragraph={
//          t?.section_2_body ? t.section_2_body : tFallback('section2.body')
//        }
//      />
//      {/* ---------------- About grid ---------------- */}
//      <section className="container mx-auto space-y-20 px-4 py-16">
//        {/* Row 1 – image left, text right */}
//        <div className="grid items-center gap-10 sm:grid-cols-2">
//          <div className="scroll-fade-in aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
//          <div className="space-y-4">
//            <h2 className="text-2xl text-fg-primary">
//              {t?.about_row1_title
//                ? t.about_row1_title
//                : tFallback('about.row1.title')}
//            </h2>
//            <p className="leading-relaxed text-fg-primary">
//              {t?.about_row1_body
//                ? t.about_row1_body
//                : tFallback('about.row1.body')}
//            </p>
//          </div>
//        </div>
//
//        {/* Row 2 – text left, image right */}
//        <div className="grid items-center gap-10 sm:grid-cols-2">
//          <div className="order-2 space-y-4 sm:order-1">
//            <h2 className="text-2xl text-fg-primary">
//              {t?.about_row2_title
//                ? t.about_row2_title
//                : tFallback('about.row2.title')}
//            </h2>
//            <p className="leading-relaxed text-fg-primary">
//              {t?.about_row2_body
//                ? t.about_row2_body
//                : tFallback('about.row2.body')}
//            </p>
//          </div>
//          <div className="scroll-fade-in order-1 aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700 sm:order-2" />
//        </div>
//
//        {/* Row 3 – image left, text right */}
//        <div className="grid items-center gap-10 sm:grid-cols-2">
//          <div className="scroll-fade-in aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
//          <div className="space-y-4">
//            <h2 className="text-2xl text-fg-primary">
//              {t?.about_row3_title
//                ? t.about_row3_title
//                : tFallback('about.row3.title')}
//            </h2>
//            <p className="leading-relaxed text-fg-primary">
//              {t?.about_row3_body
//                ? t.about_row3_body
//                : tFallback('about.row3.body')}
//            </p>
//          </div>
//        </div>
//      </section>
//      {/* ---------------- Objectives ---------------- */}
//      <Section
//        id="objectives"
//        title={
//          t?.section_3_title ? t.section_3_title : tFallback('section3.title')
//        }
//        paragraph={
//          t?.section_3_body ? t.section_3_body : tFallback('section3.body')
//        }
//      >
//        {t?.section_3_body ? t.section_3_body : tFallback('section3.body')}
//        {/* <ul className="list-disc pl-5 space-y-2 text-fg-primary"> */}
//        {/*   <li>{t("objectives.items.shareExperiences")}</li> */}
//        {/*   <li>{t("objectives.items.poolResources")}</li> */}
//        {/*   <li>{t("objectives.items.createSpaces")}</li> */}
//        {/* </ul> */}
//      </Section>
//      {/* ---------------- Latest actions (uses GROUPS) ---------------- */}
//      {/* <section className="border-t border-highlight-300 bg-highlight-100 py-16 dark:border-highlight-700 dark:bg-highlight-900"> */}
//      {/*   <div className="container mx-auto px-4"> */}
//      {/*     <h2 className="mb-12 text-center text-2xl text-fg-primary"> */}
//      {/*       {t.section_2_title} */}
//      {/*     </h2> */}
//      {/*     <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"> */}
//      {/*       {GROUPS.slice(0, 3).map((g: Group) => ( */}
//      {/*         <article */}
//      {/*           key={g.id} */}
//      {/*           className="flex flex-col rounded-md bg-surface-2 p-6 text-center shadow-sm" */}
//      {/*         > */}
//      {/*           <div */}
//      {/*             className="mb-4 aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" */}
//      {/*             style={ */}
//      {/*               g.image */}
//      {/*                 ? { */}
//      {/*                     backgroundImage: `url('${g.image}')`, */}
//      {/*                     backgroundSize: "cover", */}
//      {/*                     backgroundPosition: "center", */}
//      {/*                   } */}
//      {/*                 : undefined */}
//      {/*             } */}
//      {/*           /> */}
//      {/*           <h3 className="mb-2 ">{g.name}</h3> */}
//      {/*           <p className="text-sm text-fg-primary"> */}
//      {/*             {g.blurb ?? t("latest.card.fallback")} */}
//      {/*           </p> */}
//      {/*         </article> */}
//      {/*       ))} */}
//      {/*     </div> */}
//      {/*   </div> */}
//      {/* </section> */}
//    </div>
//  );
//}
