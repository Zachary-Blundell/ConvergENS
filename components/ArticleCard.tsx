"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

/** Simple classnames combiner (avoids bringing in a util dependency) */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Minimal shape expected by this card (matches your getter's ArticleCard) */
export type ArticleCardData = {
  id: string;
  title: string;
  coverUrl: string | null;
  coverWidth: number | null;
  coverHeight: number | null;
  tag: {
    id: string | null;
    name: string | null;
    color: string | null;
  };
  collective: {
    id: string | null;
    name: string | null;
    slug: string | null;
    color: string | null;
    logoUrl: string | null;
    logoWidth: number | null;
    logoHeight: number | null;
  };
  published_at?: string | null;
};

export type ArticleCardProps = {
  article: ArticleCardData;
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
  href,
  className,
  imagePriority,
  imageSizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw",
}: ArticleCardProps) {
  const router = useRouter();
  const linkHref = href ?? `/articles/${article.id}`;

  const { coverUrl } = article;

  // Tag styles: prefer provided color, fall back to neutral
  const tagStyle: React.CSSProperties | undefined = article.tag.color
    ? {
        backgroundColor: article.tag.color,
        // light text for darker backgrounds; simple heuristic
        color: "#fff",
        borderColor: "rgba(255,255,255,0.4)",
      }
    : undefined;

  const handleClick = () => router.push(linkHref);
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(linkHref);
    }
  };
  // Use collective color for the ring around the logo
  const collectiveRingColor = article.collective?.color ?? null;
  const ringVars = collectiveRingColor
    ? ({
        ["--tw-ring-color" as any]: collectiveRingColor,
      } as React.CSSProperties)
    : undefined;

  return (
    <div
      role="link"
      aria-label={article.title}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-outline bg-surface-2 shadow-sm transition hover:shadow-lg hover:bg-surface-3 hover:text-fg-muted cursor-pointer",
        className,
      )}
    >
      <div className="relative">
        {/* Cover image area */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-3">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={article.title || "Article cover"}
              fill
              priority={imagePriority}
              sizes={imageSizes}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-surface-2 to-surface-3" />
          )}

          {/* Tag badge overlay */}
          {article.tag?.name ? (
            <span
              className={cn(
                "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                article.tag.color
                  ? "backdrop-contrast-125"
                  : "bg-white/90 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-700",
              )}
              style={tagStyle}
            >
              {article.tag.name}
            </span>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-3 p-4 ">
        <h3 className="line-clamp-2 text-fg-primary ">{article.title}</h3>
        {/* Collective chip */}
        {/* {(article.collective?.name || article.collective?.slug) && ( */}
        <div className="mt-auto inline-flex gap-2 text-2xl text-fg-muted">
          {article.collective.logoUrl ? (
            <span
              className={cn(
                "relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900",
                collectiveRingColor ? undefined : "ring-outline",
              )}
              style={ringVars}
            >
              <Image
                src={article.collective.logoUrl}
                alt={article.collective.name ?? "Collective logo"}
                fill
                sizes="24px"
                className="object-cover"
              />
            </span>
          ) : (
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: article.collective.color ?? "#e5e7eb",
              }}
              aria-hidden
            />
          )}

          {article.collective.slug ? (
            <Link
              href={`/collectives/${article.collective.slug}`}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="hover:underline relative z-10"
            >
              {article.collective.name ?? article.collective.slug}
            </Link>
          ) : (
            <span>{article.collective.name ?? "Collective"}</span>
          )}
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

/** Skeleton variant to use while loading */
export function ArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse overflow-hidden rounded-2xl border-2 border-outline",
        className,
      )}
    >
      <div className="aspect-[16/9] w-full bg-surface-2" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-surface-2" />
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 w-5 rounded-full bg-surface-2" />
          <div className="h-3 w-32 rounded bg-surface-2" />
        </div>
      </div>
    </div>
  );
}

/** Small grid helper for quick testing in isolation */
export function ArticleCardGrid({ items }: { items: ArticleCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}
