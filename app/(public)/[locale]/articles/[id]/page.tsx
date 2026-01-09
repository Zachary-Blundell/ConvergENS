// app/[locale]/articles/[id]/page.tsx
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HtmlContent from '@/components/HtmlContent';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getArticleById } from '@/lib/cms/articles';
import { EventArticleInfoFlat, EventArticleInfoRaw } from '@/lib/cms/articles.types';

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatEventRange(
  ev: EventArticleInfoFlat,
  locale: string
) {
  // If all-day, show just the date (or date range)
  if (ev.all_day) {
    const d1 = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(ev.start_at);
    const d2 = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(ev.end_at);
    return d1 === d2 ? d1 : `${d1} → ${d2}`;
  }

  // Otherwise show date + time
  const fmt = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const s = fmt.format(ev.start_at);
  const e = fmt.format(ev.end_at);
  return `${s} → ${e}`;
}


function toCursor(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function calendarEventUrl(locale: string, ev: { id: string | number; start_at: Date }) {
  const cursor = toCursor(ev.start_at);
  return `/${locale}/calendar?cursor=${encodeURIComponent(cursor)}&event=${encodeURIComponent(String(ev.id))}`;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  // Accept only positive integers
  if (!/^\d+$/.test(id)) notFound();

  const articleId = Number(id);
  // Handle huge numbers / weird edge cases
  if (!Number.isSafeInteger(articleId) || articleId <= 0) notFound();

  const article = await getArticleById({ articleId, locale });
  if (!article) notFound(); // from next/navigation

  const t = await getTranslations('ArticlesPage');

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="py-8" />
      {/* Breadcrumb / Back */}
      <div className="mb-4">
        <Link
          href={`/${locale}/articles`}
          className="text-sm text-fg-muted hover:underline"
        >
          {t('backToArticles')}
        </Link>
      </div>

      <article className="overflow-hidden rounded-2xl border border-outline bg-surface-2 shadow-sm">
        {/* Cover */}
        <div className="relative aspect-[16/9] w-full bg-surface-3">
          {article.coverUrl ? (
            <Image
              src={article.coverUrl}
              alt={article.title}
              fill
              sizes="(min-width:1024px) 1024px, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-surface-2 to-surface-3" />
          )}
        </div>
        {/* Body */}

        <div className="p-6">
          {/* Title */}
          <h1 className="text-4xl text-fg-primary">{article.title}</h1>

          {/* Meta: Editors + Date + Events */}
          <div className="mt-3 rounded-2xl bg-surface-3 p-4 text-sm text-fg-muted shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              {/* Editors */}
              <div className="min-w-0">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-muted">
                  Editors
                </p>

                {article.editors?.length ? (
                  <div className="flex flex-wrap items-center gap-3">
                    {article.editors.map((ed) => (
                      <span key={ed.id} className="inline-flex items-center gap-2">
                        {ed.slug ? (
                          <Link
                            href={`/${locale}/organisations/${ed.slug}`}
                            className="inline-flex items-center gap-2 hover:underline"
                          >
                            <span
                              className="relative inline-block h-7 w-7 overflow-hidden rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900"
                              style={{ ["--tw-ring-color" as any]: ed.color }}
                            >
                              {ed.logoUrl ? (
                                <Image
                                  src={ed.logoUrl}
                                  alt={`${ed.name} logo`}
                                  fill
                                  sizes="30px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="grid h-full w-full place-items-center text-xs font-medium text-fg-primary">
                                  {ed.name?.[0]?.toUpperCase() ?? "?"}
                                </span>
                              )}
                            </span>
                            <span className="truncate">{ed.name}</span>
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="relative inline-block h-7 w-7 overflow-hidden rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900"
                              style={{ ["--tw-ring-color" as any]: ed.color }}
                            />
                            <span className="truncate">{ed.name}</span>
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-fg-muted">No editors</p>
                )}
              </div>

              {/* Published */}
              <div className="shrink-0 sm:text-right">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-muted">
                  Published
                </p>

                <time
                  dateTime={article.published_at.toISOString()}
                  title={article.published_at.toISOString()}
                  className="text-fg-primary"
                >
                  {formatDate(article.published_at, locale)}
                </time>
              </div>
            </div>

            {/* Events */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-muted">
                Linked events
              </p>

              {article.events?.length ? (
                <div className="flex flex-wrap gap-2">
                  {article.events.map((ev) => {
                    const tooltip = formatEventRange(ev, locale);

                    return (

                      <Link
                        key={String(ev.id)}
                        title={tooltip}
                        href={calendarEventUrl(locale, ev)}
                        className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-fg-primary hover:underline"
                      >
                        <span className="truncate">{ev.title}</span>

                        {ev.all_day ? (
                          <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[11px] text-fg-muted">
                            all-day
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-fg-muted">No linked events</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-outline" />


          {/* Content (as requested) */}
          <HtmlContent className="cms-content" html={article.body} />
        </div>
      </article>
    </main>
  );
}
