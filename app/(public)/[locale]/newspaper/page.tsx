// [local]/newspaper
// Newspaper-page
import Image from 'next/image';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getNewspaperPage } from '@/lib/cms/newspage';
import HtmlContent from '@/components/HtmlContent';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Newspaper');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: '/agora',
    },
  };
}

// export default function NewspaperPage() {
export default async function NewspaperPage() {
  const t = await getTranslations('Newspaper');
  const lang = await getLocale();
  // I want to integrate this api data.
  const newspaper = await getNewspaperPage(lang);

  const bannerTitle = newspaper?.translations.title ?? t('banner.title');
  const bannerSubtitle =
    newspaper?.translations.subtitle ?? t('banner.subtitle');
  const bannerAlt =
    newspaper?.translations.banner_img_description ?? t('banner.alt');

  // If you want to surface API description, use it; otherwise fallback to the 3 paragraphs
  // You can also split the API description yourself if you store it as one blob.
  const description = newspaper?.translations.description ?? t('description');

  const issueTitle =
    newspaper?.translations.edition_title ?? t('issue3.heading');
  const issueQuote = newspaper?.translations.quote_box ?? t('issue3.quote');

  // Images: prefer API -> fallback to local
  const bannerImg =
    newspaper?.banner_img?.url ?? '/images/agora/agora-banner.jpg';
  const issueCoverImg =
    newspaper?.current_edition_img?.url ?? '/images/agora/agora-3.jpeg';
  const issueCoverAlt =
    newspaper?.translations.edition_img_description ?? t('issue3.cover.alt');

  const isEn = lang === 'en-US';

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="py-1" />
      {/* Bannière */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-2 ">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={bannerImg}
            alt={bannerAlt}
            fill
            priority
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-16 flex">
          <div className="bg-surface-2/50 px-4 py-1 backdrop-blur-xs rounded-lg">
            <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight">
              {bannerTitle}
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-fg-muted">
              {bannerSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Bloc central */}
      <section aria-labelledby="agora-about">
        <h2 id="agora-about" className="sr-only">
          {t('about.headingSrOnly')}
        </h2>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <HtmlContent className="cms-content" html={description} />
          {/*   <p> */}
          {/*     <strong>{bannerTitle}</strong> {aboutP1} */}
          {/*   </p> */}
          {/*   <p>{aboutP2}</p> */}
          {/*   <p>{aboutP3}</p> */}
        </div>
      </section>

      {/* Numéro courant */}
      <section aria-labelledby="issue-3" className="space-y-6">
        <header>
          <h2 id="issue-3" className="text-2xl sm:text-3xl tracking-tight">
            {issueTitle}
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Photo de Une */}
          <figure className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={issueCoverImg}
              alt={issueCoverAlt}
              width={948}
              height={1348}
              className="object-cover"
            />
            <figcaption className="sr-only">
              {t('issue3.cover.figcaptionSrOnly')}
            </figcaption>
          </figure>

          {/* Colonne droite : citation + actions */}
          <div className="space-y-6">
            <blockquote className="rounded-2xl border border-outline bg-surface-2 p-6 shadow-m">
              <p className="text-lg italic leading-relaxed">{issueQuote}</p>
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Button
                asChild
                variant="outline"
                className="w-full h-12 md:h-14 px-6 md:px-8 text-fg-primary md:text-lg tracking-wide uppercase bg-surface-3 hover:shadow-m hover:scale-105 hover:bg-surface-4"
              >
                <Link
                  href="https://www.calameo.com/read/007696511c90f6710f589"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('issue3.preview')}
                </Link>
              </Button>

              <Button
                asChild
                className="w-full h-12 md:h-14 px-6 md:px-8 text-fg-primary bg-highlight hover:bg-highlight-400 hover:shadow-l hover:scale-110 md:text-lg tracking-wide uppercase"
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
                    t('issue3.read')
                  )}
                </Link>
              </Button>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('issue3.note')}
            </p>

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
