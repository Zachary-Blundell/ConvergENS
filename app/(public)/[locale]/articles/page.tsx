// [local]/articlesj
// ConvergENS Articles-page

import { getArticleCards } from "@/lib/cms/articles";
import { ArticleCardGrid } from "@/components/ArticleCard";
import { log } from "console";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page: string }>;
}) {
  const locale = (await params).locale;
  const { page } = await searchParams;
  log("here is the page: ", page);
  const articles = await getArticleCards(locale);
  return (
    <main className="p-6">
      <ArticleCardGrid items={articles} />
    </main>
  );
}

// app/articles/page.tsx
// import * as React from "react";
// import Link from "next/link";
// import { headers } from "next/headers";
//
// import { ArticleCardData, ArticleCardGrid } from "@/components/ArticleCard";
// import { getArticlesForIndex } from "@/lib/cms/articles";
// import { DEFAULT_LOCALE } from "@/lib/cms/utils";
//
// // ---- helpers ---------------------------------------------------------------
// function parseIntOr<TFallback extends number>(
//   v: string | string[] | undefined,
//   fallback: TFallback,
// ): number {
//   if (!v) return fallback;
//   const s = Array.isArray(v) ? v[0] : v;
//   const n = parseInt(s, 10);
//   return Number.isFinite(n) && n > 0 ? n : fallback;
// }
//
// function normalizeToArray<T>(v: T | T[] | undefined): T[] | undefined {
//   if (v == null) return undefined;
//   return Array.isArray(v) ? v : [v];
// }
//
// function parseIdsParam(
//   v: string | string[] | undefined,
// ): (string | number)[] | null {
//   if (!v) return null;
//   const raw = normalizeToArray(v)!
//     .flatMap((item) => String(item).split(","))
//     .map((s) => s.trim())
//     .filter(Boolean);
//   // keep as strings; your Directus getter accepts string | number
//   return raw.length ? raw : null;
// }
//
// function buildPageHref(page: number, current: URLSearchParams) {
//   const next = new URLSearchParams(current);
//   next.set("page", String(page));
//   return `?${next.toString()}`;
// }
//
// // ---- page -----------------------------------------------------------------
// export default async function ArticlesPage({
//   searchParams,
// }: {
//   searchParams?: Promise<{
//     page?: string | string[];
//     q?: string | string[];
//     association?: string | string[]; // association id
//     tag?: string | string[]; // supports comma-separated or repeated
//   }>;
// }) {
//   const h = headers();
//   // Pull best-effort locale from Accept-Language; fall back to DEFAULT_LOCALE
//   const acceptLang = h.get("accept-language") || DEFAULT_LOCALE;
//   const locale = acceptLang.split(",")[0] || DEFAULT_LOCALE;
//
//   const page = parseIntOr(searchParams?.page, 1);
//   const search = Array.isArray(searchParams?.q)
//     ? searchParams?.q[0]
//     : searchParams?.q || null;
//   const associationId = Array.isArray(searchParams?.association)
//     ? searchParams?.association[0]
//     : searchParams?.association || null;
//   const tagIds = parseIdsParam(searchParams?.tag);
//
//   const { items, total, limit } = await getArticlesForIndex(
//     {
//       page,
//       limit: 24,
//       search,
//       associationId,
//       tagIds,
//     },
//     locale,
//   );
//
//   const hasResults = items.length > 0;
//
//   return (
//     <main className="mx-auto max-w-6xl px-4 py-8">
//       <div className="mb-6 flex items-end justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
//           {search ? (
//             <p className="text-sm text-zinc-500 dark:text-zinc-400">
//               Search: “{search}”
//             </p>
//           ) : null}
//         </div>
//         {/* Placeholder for future filters/search UI */}
//       </div>
//
//       {hasResults ? (
//         <ArticleCardGrid items={items as ArticleCardData[]} />
//       ) : (
//         <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
//           <p className="text-zinc-600 dark:text-zinc-300">No articles found.</p>
//           <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
//             Try adjusting your filters or search query.
//           </p>
//         </div>
//       )}
//
//       {/* Pagination */}
//       {total != null && total > (page - 1) * (limit ?? 24) + items.length && (
//         <div className="mt-8 flex items-center justify-center gap-3">
//           {page > 1 && (
//             <Link
//               href={buildPageHref(
//                 page - 1,
//                 new URLSearchParams(searchParams as any),
//               )}
//               className="rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
//             >
//               Previous
//             </Link>
//           )}
//           <span className="text-sm text-zinc-500 dark:text-zinc-400">
//             Page {page}
//           </span>
//           <Link
//             href={buildPageHref(
//               page + 1,
//               new URLSearchParams(searchParams as any),
//             )}
//             className="rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
//           >
//             Next
//           </Link>
//         </div>
//       )}
//     </main>
//   );
// }
