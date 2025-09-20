//[local]/page.tsx
// homepage

import AssociationRows from "@/components/AssoRow";
import Link from "next/link";
import "@/styles/scroll.css";
import { log } from "console";
import reactStringReplace from "react-string-replace";
import { getLocale, getTranslations } from "next-intl/server";
import { getHome } from "@/lib/cms/homepage";

type SectionProps = React.PropsWithChildren<{
  id: string;
  title: React.ReactNode;
  paragraph: React.ReactNode;
}>;

function Section({ id, title, paragraph, children }: SectionProps) {
  return (
    <section id={id} className="py-12 sm:py-16 lg:py-24 w-full flex">
      <div
        className="scroll-fade my-auto mx-auto max-w-3xl bg-surface-2 border-1 border-outline border-t-outline-highlight
       bg-linear-to-t from-surface-1 to-surface-2 rounded-xl p-6 shadow-lg "
      >
        <h2 className="text-5xl text-center mb-8 text-highlight dark:text-highlight">
          {title}
        </h2>
        <p className="text-xl leading-relaxed text-justify text-fg-primary whitespace-pre-line">
          {paragraph}
        </p>
        {children}
      </div>
    </section>
  );
}

function renderHighlightOnly(s?: string) {
  if (!s) return null;
  return reactStringReplace(s, /<highlight>(.*?)<\/highlight>/g, (match, i) => (
    <span key={i} className="text-highlight">
      {match}
    </span>
  ));
}

export default async function HomePage() {
  const locale = await getLocale();
  // const tFallback = await getTranslations("Home");

  log("locale", locale);
  const home = await getHome(locale);
  // const home = await getHome("fr-FR");

  log(home);
  const t = home.translations[0];

  const apiImageUrl = process.env.DIRECTUS_API_ENDPOINT + "/assets";
  log(apiImageUrl);

  return (
    <div className="flex flex-col">
      {/* ---------------- Association Rows---------------- */}
      <AssociationRows />

      {/* ---------------- Hero ---------------- */}
      <section
        className="h-svh w-full bg-cover bg-center"
        style={{
          backgroundImage: `url('${apiImageUrl}/${home.hero_bg.id}')`,
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="px-4 text-center">
            <h1 className="text-[clamp(2.5rem,_5vw,_4rem)] text-white bg-stone-800/40 backdrop-blur-sm px-4 rounded-lg border-0">
              {renderHighlightOnly(t.hero_title)}
            </h1>
            <Link
              href="/associations"
              className="mt-6 inline-block rounded-md bg-highlight px-6 py-3 text-sm font-medium uppercase text-white transition-colors duration-300 hover:bg-highlight-400 focus:outline-none"
            >
              {t?.hero_cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- What is ConvergENS? ---------------- */}
      <Section
        id="what-is"
        title={t.section_1_title}
        paragraph={t.section_1_body}
      />

      {/* ---------------- How ConvergENS works ---------------- */}
      <Section
        id="how"
        title={t.section_2_title}
        paragraph={t.section_2_body}
      />
      {/* ---------------- About grid ---------------- */}
      <section className="container mx-auto space-y-20 px-4 py-16">
        {/* Row 1 – image left, text right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="scroll-fade-in aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <h2 className="text-2xl text-slate-800 dark:text-slate-100">
              {t.about_row1_title}
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {t.about_row1_body}
            </p>
          </div>
        </div>

        {/* Row 2 – text left, image right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="order-2 space-y-4 sm:order-1">
            <h2 className="text-2xl text-slate-800 dark:text-slate-100">
              {t.about_row2_title}
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {t.about_row2_body}
            </p>
          </div>
          <div className="scroll-fade-in order-1 aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700 sm:order-2" />
        </div>

        {/* Row 3 – image left, text right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="scroll-fade-in aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <h2 className="text-2xl text-slate-800 dark:text-slate-100">
              {t.about_row3_title}
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {t.about_row3_body}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Objectives ---------------- */}
      <Section
        id="objectives"
        title={t.section_3_title}
        paragraph={t.section_3_body}
      >
        {t.section_3_body}
        {/* <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300"> */}
        {/*   <li>{t("objectives.items.shareExperiences")}</li> */}
        {/*   <li>{t("objectives.items.poolResources")}</li> */}
        {/*   <li>{t("objectives.items.createSpaces")}</li> */}
        {/* </ul> */}
      </Section>

      {/* ---------------- Latest actions (uses GROUPS) ---------------- */}
      {/* <section className="border-t border-highlight-300 bg-highlight-100 py-16 dark:border-highlight-700 dark:bg-highlight-900"> */}
      {/*   <div className="container mx-auto px-4"> */}
      {/*     <h2 className="mb-12 text-center text-2xl text-slate-800 dark:text-slate-100"> */}
      {/*       {t.section_2_title} */}
      {/*     </h2> */}
      {/*     <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"> */}
      {/*       {GROUPS.slice(0, 3).map((g: Group) => ( */}
      {/*         <article */}
      {/*           key={g.id} */}
      {/*           className="flex flex-col rounded-md bg-surface-2 p-6 text-center shadow-sm" */}
      {/*         > */}
      {/*           <div */}
      {/*             className="mb-4 aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" */}
      {/*             style={ */}
      {/*               g.image */}
      {/*                 ? { */}
      {/*                     backgroundImage: `url('${g.image}')`, */}
      {/*                     backgroundSize: "cover", */}
      {/*                     backgroundPosition: "center", */}
      {/*                   } */}
      {/*                 : undefined */}
      {/*             } */}
      {/*           /> */}
      {/*           <h3 className="mb-2 ">{g.name}</h3> */}
      {/*           <p className="text-sm text-slate-600 dark:text-slate-300"> */}
      {/*             {g.blurb ?? t("latest.card.fallback")} */}
      {/*           </p> */}
      {/*         </article> */}
      {/*       ))} */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </section> */}
    </div>
  );
}
