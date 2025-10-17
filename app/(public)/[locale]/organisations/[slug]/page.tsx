// app/[locale]/collectives/[slug]/page.tsx
import { getCollectiveBySlug } from '@/lib/cms/collectives';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, Mail, Phone } from 'lucide-react';
import { Separator } from '@radix-ui/react-select';
import HtmlContent from '@/components/HtmlContent';
import { ArticleCardCarousel } from '@/components/ArticleCarousel';

export default async function CollectivePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const assoc = await getCollectiveBySlug(slug, locale);

  if (!assoc) notFound();

  return (
    // Main column
    <div className="container mt-12 mx-auto max-w-5xl px-4 py-8 ">
      <div className="flex flex-row justify-between ">
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
        {assoc.socials.length > 0 ? (
          <aside className="lg:col-span-1">
            <div className="p-4 rounded-xl border">
              <h2 className="text-fg-primary uppercase tracking-wide">
                Socials
              </h2>

              <ul className="mt-3 space-y-2">
                {assoc.socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex max-w-full items-center gap-2 truncate text-sm hover:underline"
                    >
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: 'var(--brand)' }}
                      />
                      <span className="truncate">
                        {prettyPlatform(s.platform)}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : (
          <></>
        )}
      </div>

      <Separator className="my-8" />

      {/* Main content */}
      {assoc.description ? (
        <div
          className="w-full px-10 py-2 bg-surface-3 border-2 border-outline border-t-outline-highlight
       rounded-xl hshadow-lg "
        >
          {/* Description */}
          <HtmlContent className="cms-content " html={assoc.description} />
        </div>
      ) : (
        <div className="flex bg-surface-3 w-100 h-50 items-center rounded-md mx-auto">
          <p className="mx-auto my-4 max-w-3xl px-4 text-center text-base sm:text-lg leading-relaxed text-fg-primary">
            This organisation has not yet provided a description in English.
          </p>
        </div>
      )}
      {assoc.articles.length > 0 ? (
        <section>
          <h2 className="p-5 text-center text-3xl sm:text-4xl md:text-5xl text-highlight">
            Latest Articles
          </h2>
          <div className="h-1 w-24 bg-highlight mx-auto mb-2 rounded" />
          <ArticleCardCarousel articles={assoc.articles} className="my-8 " />
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
