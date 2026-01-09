'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CardArticleFlat } from '@/lib/cms/articles.types';

/** Simple classnames combiner (avoids bringing in a util dependency) */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function editorHref(slug: string) {
  const s = slug.trim();
  if (!s) return null;
  if (s.toLowerCase() === 'convergens') return '/';
  return `/organisations/${s}`;
}

export type ArticleCardProps = {
  article: CardArticleFlat;
  /** Optional href override. Defaults to `/articles/{id}` */
  href?: string;
  /** Extra wrapper classes */
  className?: string;
  /** Forward Next/Image priority for LCP optimization when needed */
  imagePriority?: boolean;
  /** Preload sizes for responsive images */
  imageSizes?: string;
};

export default function ArticleCard({
  article,
  className,
  imagePriority,
  imageSizes = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw',
}: ArticleCardProps) {
  const router = useRouter();
  const linkHref = `/articles/${article.id}`;

  const { coverUrl, coverDescription, title, tag, editors } = article;

  // Tag styles: prefer provided color, fall back to neutral
  const tagStyle: React.CSSProperties | undefined = tag?.color
    ? {
      backgroundColor: tag.color,
      color: '#fff',
      borderColor: 'rgba(255,255,255,0.4)',
    }
    : undefined;

  const handleClick = () => router.push(linkHref);
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(linkHref);
    }
  };

  const primaryEditor = editors[0] ?? null;
  const remainingCount = Math.max(0, editors.length - 1);

  return (
    <div
      role="link"
      aria-label={title}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-outline bg-surface-2 shadow-sm transition hover:shadow-lg hover:bg-surface-3 hover:text-fg-muted cursor-pointer',
        className,
      )}
    >
      {/* Cover image area */}
      <div className="relative">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-3">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={coverDescription?.trim() || title || 'Article cover'}
              fill
              priority={imagePriority}
              sizes={imageSizes}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-surface-2 to-surface-3" />
          )}

          {/* Tag badge overlay */}
          {tag?.name ? (
            <span
              className={cn(
                'absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
                tag.color
                  ? 'backdrop-contrast-125'
                  : 'bg-white/90 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-700',
              )}
              style={tagStyle}
            >
              {tag.name}
            </span>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-3 p-4">
        <h3 className="line-clamp-2 text-fg-primary">{title}</h3>

        {/* Editors footer */}
        {editors.length > 0 ? (
          <div className="mt-auto flex items-center justify-between gap-3 text-fg-muted">
            {/* stacked logos */}
            <div className="flex items-center">
              {editors.slice(0, 3).map((ed, idx) => {
                const ringVars = ed.color
                  ? ({ ['--tw-ring-color' as any]: ed.color } as React.CSSProperties)
                  : undefined;

                return (
                  <span
                    key={ed.id}
                    className={cn(
                      'relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900',
                      ed.color ? undefined : 'ring-outline',
                      idx === 0 ? '' : '-ml-2',
                    )}
                    style={ringVars}
                    aria-hidden={idx !== 0 ? true : undefined}
                    title={ed.name}
                  >
                    {ed.logoUrl ? (
                      <Image
                        src={ed.logoUrl}
                        alt={ed.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        className="absolute inset-0"
                        style={{ backgroundColor: ed.color ?? '#e5e7eb' }}
                      />
                    )}
                  </span>
                );
              })}

              {editors.length > 3 ? (
                <span className="ml-2 text-xs opacity-80">+{editors.length - 3}</span>
              ) : null}
            </div>

            {/* primary editor link + +N */}
            <div className="min-w-0 text-sm">
              {primaryEditor ? (
                <Link
                  href={editorHref(primaryEditor.slug) ?? '#'}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="hover:underline relative z-10 truncate"
                  title={primaryEditor.name}
                >
                  {primaryEditor.name}
                </Link>
              ) : (
                <span>Editor</span>
              )}

              {remainingCount > 0 ? (
                <span className="ml-1 opacity-80">+{remainingCount}</span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Skeleton variant to use while loading */
export function ArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse overflow-hidden rounded-2xl border-2 border-outline',
        className,
      )}
    >
      <div className="aspect-[16/9] w-full bg-surface-2" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-surface-2" />
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-surface-2" />
            <div className="-ml-2 h-8 w-8 rounded-full bg-surface-2" />
            <div className="-ml-2 h-8 w-8 rounded-full bg-surface-2" />
          </div>
          <div className="h-3 w-32 rounded bg-surface-2" />
        </div>
      </div>
    </div>
  );
}

/** Small grid helper for quick testing in isolation */
export function ArticleCardGrid({ items }: { items: CardArticleFlat[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => (
        <ArticleCard key={String(a.id)} article={a} />
      ))}
    </div>
  );
}
