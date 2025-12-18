// app/[locale]/collectives/[slug]/page.tsx
import { getCollectiveBySlug } from '@/lib/cms/collectives';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, Mail, Phone } from 'lucide-react';
import { Separator } from '@radix-ui/react-select';
import HtmlContent from '@/components/HtmlContent';
import { ArticleCardCarousel } from '@/components/ArticleCarousel';
import { getTranslations } from 'next-intl/server';

export default async function CollectivePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('OrganisationsPage');
  const assoc = await getCollectiveBySlug(slug, locale);


  if (!assoc) notFound();

  return (
    // Main column
    <div className="container mt-12 mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col min-[600px]:flex-row gap-1 justify-between ">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Logo */}
          {assoc.logoUrl ? (
            <div className="shrink-0">
              <Image
                src={assoc.logoUrl}
                alt={`${assoc.name} logo`}
                width={96}
                height={96}
                className="rounded-lg border"
                priority
              />
            </div>
          ) : (
            <div
              className="flex h-24 w-24 items-center justify-center rounded-lg border text-xl font-semibold"
              aria-hidden
            >
              {assoc.name}
            </div>
          )}

          {/* Title + Summary + CTAs */}
          <div className="min-w-0 ">
            <h1 className="text-3xl tracking-tight">{assoc.name}</h1>
            {assoc.summary && (
              <p className="mt-1 text-muted-foreground">{assoc.summary}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {assoc.website && (
                <Button asChild>
                  <a
                    href={assoc.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Visit website
                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              {assoc.email && (
                <Button variant="outline" asChild>
                  <a href={`mailto:${assoc.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </a>
                </Button>
              )}
              {assoc.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${assoc.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Sidebar */}
        {assoc.socials.length > 0 && (
          <aside className="mt-4 sm:mt-0 lg:col-span-1">
            <div className="rounded-2xl bg-surface-3/70 shadow-lg p-4 border border-border-subtle">
              <h2 className="text-fg-primary text-lg uppercase tracking-wide">
                {t('socials')}
              </h2>

              <ul className="mt-3 space-y-2.5">
                {assoc.socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-border-subtle/70 bg-surface-1 px-3 py-2 text-sm transition hover:border-[var(--brand)]/80 hover:bg-surface-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-fg-primary">
                          {prettyPlatform(s.type)}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-8 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>

      <Separator className="my-8" />

      {/* Main content */}
      {assoc.description ? (
        <div
          className="w-full px-10 py-2 bg-surface-3 border-2 border-outline border-t-outline-highlight
       rounded-xl shadow-sm" >
          {/* Description */}
          <HtmlContent className="cms-content " html={assoc.description} />
        </div>
      ) : (
        <div className="flex bg-surface-3 w-full py-10 items-center rounded-md mx-auto">
          <p className="mx-auto my-4 max-w-3xl px-4 text-center text-base sm:text-lg leading-relaxed text-fg-primary">
            {t('noDescriptionForLocale')}
          </p>
        </div>
      )}
      {assoc.articles.length > 0 ? (
        <section>
          <h2 className="p-5 text-center text-3xl sm:text-4xl md:text-5xl text-highlight">
            {t('latestArticles')}
          </h2>
          <div className="h-1 w-24 bg-highlight mx-auto mb-2 rounded" />
          <ArticleCardCarousel articles={assoc.articles} className="my-8 w-full" />
        </section>
      ) : (
        <></>
      )}
    </div>
  );
}

/* ---------- small helpers ---------- */

function prettyPlatform(p: string) {
  return p.charAt(0).toUpperCase() + p.slice(1);
}
