// app/[locale]/articles/[id]/page.tsx
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HtmlContent from '@/components/HtmlContent';
import { getArticle } from '@/lib/cms/articles';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale || 'en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso.split('T')[0];
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const article = await getArticle(id, locale);
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

          {/* Meta: Collective + Date */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-fg-muted">
            <Link
              href={`/${locale}/collectives/${article.collective.slug}`}
              className="inline-flex items-center gap-2 hover:underline"
            >
              <span
                className="relative inline-block h-7 w-7 overflow-hidden rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900"
                style={{
                  ['--tw-ring-color' as any]: article.collective.color,
                }}
              >
                <Image
                  src={article.collective.logoUrl}
                  alt={`${article.collective.name} logo`}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
              <span>{article.collective.name}</span>
            </Link>

            <span aria-hidden>•</span>

            <time
              dateTime={article.published_at}
              title={new Date(article.published_at).toISOString()}
            >
              {formatDate(article.published_at, locale)}
            </time>
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
