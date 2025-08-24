//[local]
//main-page
import AssociationRows from "@/components/AssoRow";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Group = {
  id: string;
  name: string;
  blurb?: string;
  image?: string;
};

/* ---------------- Demo data ---------------- */
const GROUPS: Group[] = [
  {
    id: "1",
    name: "Syndicat Étudiant ENS",
    blurb:
      "Mobilisations étudiantes, entraide et défense des droits sur le campus.",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "2",
    name: "Club Climat ENS",
    blurb:
      "Ateliers, conférences et actions concrètes pour la transition écologique.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "3",
    name: "Collectif Accessibilité",
    blurb:
      "Rendre l’ENS plus inclusive : accessibilité numérique et des lieux.",
    image:
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "4",
    name: "Club Presse & Journal",
    blurb:
      "Rédaction du journal étudiant, enquêtes et couverture des événements.",
    image:
      "https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "5",
    name: "Atelier Informatique Libre",
    blurb: "Install parties, sensibilisation aux logiciels libres et sécurité.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "6",
    name: "Groupe Culture & Arts",
    blurb: "Expos, concerts et ateliers ouverts à toutes et tous.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=60",
  },
];

export default function HomePage() {
  const t = useTranslations("Home");
  /* ---------------- Menu: click-outside ---------------- */
  return (
    <div className="flex flex-col">
      <AssociationRows />
      {/* ---------------- Hero ---------------- */}
      <section
        className="h-[38rem] w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="flex h-full w-full items-center justify-center bg-gray-900/50">
          <div className="px-4 text-center">
            <h1 className="text-[clamp(1.5rem,_5vw,_4rem)] tracking-tight font-extrabold text-white drop-shadow-md leading-tight">
              {t.rich("hero.title", {
                highlight: (chunks) => (
                  <span className="text-blue-400">{chunks}</span>
                ),
              })}
            </h1>
            <Link
              href="/associations"
              className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-medium uppercase text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none"
            >
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- About grid ---------------- */}
      <section className="container mx-auto space-y-20 px-4 py-16">
        {/* Row 1 – image left, text right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {t("about.row1.title")}
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {t("about.row1.body")}
            </p>
          </div>
        </div>

        {/* Row 2 – text left, image right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="order-2 space-y-4 sm:order-1">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {t("about.row2.title")}
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {t("about.row2.body")}
            </p>
          </div>
          <div className="order-1 aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700 sm:order-2" />
        </div>

        {/* Row 3 – image left, text right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {t("about.row3.title")}
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              {t("about.row3.body")}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Latest actions (uses GROUPS) ---------------- */}
      <section className="border-t border-blue-300 bg-blue-100 py-16 dark:border-blue-700 dark:bg-blue-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-semibold text-slate-800 dark:text-slate-100">
            {t("latest.title")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {GROUPS.slice(0, 3).map((g: Group) => (
              <article
                key={g.id}
                className="flex flex-col rounded-md bg-white p-6 text-center shadow-sm dark:bg-slate-800"
              >
                <div
                  className="mb-4 aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700"
                  style={
                    g.image
                      ? {
                          backgroundImage: `url('${g.image}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
                <h3 className="mb-2 font-semibold">{g.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {g.blurb ?? t("latest.card.fallback")}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
