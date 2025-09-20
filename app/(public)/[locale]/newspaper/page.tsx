// [local]/newspaper
// Newspaper-page
import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Newspaper");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
      url: "/agora",
    },
  };
}

// export default function NewspaperPage() {
export default async function NewspaperPage() {
  const t = await getTranslations("Newspaper");
  const lang = await getLocale();
  const isEn = lang === "en-US";

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Bannière */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-2 ">
        {/* Background image (Photo 1) */}
        <div className="absolute inset-0">
          <Image
            src="/images/agora/agora-banner.jpg"
            alt={t("banner.alt")}
            fill
            priority
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-16 flex">
          <div className="bg-surface-2/50 px-4 py-1 backdrop-blur-xs rounded-lg">
            <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight">
              {t("banner.title")}
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-fg-muted">
              {t("banner.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Bloc central */}
      <section aria-labelledby="agora-about">
        <h2 id="agora-about" className="sr-only">
          {t("about.headingSrOnly")}
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>{t("banner.title")}</strong> {t("about.p1")}
          </p>
          <p>{t("about.p2")}</p> <p>{t("about.p3")}</p>
        </div>
      </section>

      {/* Numéro 3 */}
      <section aria-labelledby="issue-3" className="space-y-6">
        <header>
          <h2 id="issue-3" className="text-2xl sm:text-3xl tracking-tight">
            {t("issue3.heading")}
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Photo de Une (Photo 2) */}
          <figure className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src="/images/agora/agora-3.jpeg"
              alt={t("issue3.cover.alt")}
              fill
              className="object-cover"
            />
            <figcaption className="sr-only">
              {t("issue3.cover.figcaptionSrOnly")}
            </figcaption>
          </figure>

          {/* Colonne droite : citation + actions */}
          <div className="space-y-6">
            <blockquote className="rounded-2xl border border-outline bg-surface-2 p-6 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
              <p className="text-lg italic leading-relaxed">
                {t("issue3.quote")}
              </p>
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Button
                asChild
                variant={"outline"}
                className="w-full h-12 md:h-14 px-6 md:px-8 text-fg-primary md:text-lg tracking-wide uppercase"
              >
                <Link
                  href="https://www.calameo.com/read/007696511c90f6710f589"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("issue3.preview")}
                </Link>
              </Button>

              <Button
                asChild
                className="w-full h-12 md:h-14 px-6 md:px-8 text-fg-primary bg-highlight hover:bg-highlight-400 md:text-lg tracking-wide uppercase"
              >
                <Link
                  href="https://www.helloasso.com/associations/ecocampus-ens-ulm/formulaires/3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {isEn ? (
                    <span className="inline-flex flex-col items-center leading-none">
                      <span className="block text-xl md:text-2xl font-semibold normal-case">
                        READ*
                      </span>
                      <span className="block text-[10px] md:text-xs opacity-90 normal-case">
                        pay-what-you-want
                      </span>
                    </span>
                  ) : (
                    t("issue3.read")
                  )}
                </Link>
              </Button>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t("issue3.note")}
            </p>
            {/* Disclaimer (English only) */}
            {isEn && (
              <div
                role="note"
                aria-live="polite"
                className="rounded-2xl border border-outline bg-surface-2 p-4 shadow-sm text-sm text-fg-muted dark:bg-neutral-900 dark:border-neutral-800"
              >
                * For our non-French-reading friends: this newspaper is
                currently available in French only.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
