export default function SitemapPage() {
  return <div>Sitemap Page - CMS not configured</div>;
}

// app/(public)/[locale]/sitemap/page.tsx
// import Link from "next/link";
// import type { Metadata } from "next";
// import { getAllArticleLinks } from "@/lib/cms/articles"; // -> [{ id, title }]
// import { getAllCollectiveSlugs } from "@/lib/cms/collectives"; // -> string[]
//
// export const metadata: Metadata = {
//   title: "Sitemap",
// };
//
// export const revalidate = 3600; // 1h
//
// type ArticleLink = { id: string; title: string };
//
// export default async function SitemapPage({
//   params,
// }: {
//   params: { locale: string };
// }) {
//   const { locale } = params;
//
//   const [articles, collectives] = await Promise.all([
//     getAllArticleLinks(locale), // assumes localized titles
//     getAllCollectiveSlugs(locale), // slugs per locale if applicable
//   ]);
//
//   const P = (p: string) => `/${locale}${p}`;
//
//   return (
//     <main className="container mx-auto px-4 py-12">
//       <h1 className="mb-8 text-4xl font-semibold">Sitemap</h1>
//
//       {/* Core */}
//       <section className="mb-10 space-y-2">
//         <h2 className="text-2xl">Core</h2>
//         <ul className="list-disc pl-6 text-lg">
//           <li>
//             <Link className="hover:underline" href={P("")}>
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link className="hover:underline" href={P("/collectives")}>
//               Collectives
//             </Link>
//           </li>
//           <li>
//             <Link className="hover:underline" href={P("/articles")}>
//               Articles
//             </Link>
//           </li>
//           <li>
//             <Link className="hover:underline" href={P("/calendar")}>
//               Calendar
//             </Link>
//           </li>
//           <li>
//             <Link className="hover:underline" href={P("/newspaper")}>
//               Newspaper
//             </Link>
//           </li>
//         </ul>
//       </section>
//
//       {/* Collectives (FIRST) */}
//       <section className="mb-10 space-y-2">
//         <h2 className="text-2xl">Collectives</h2>
//         {collectives.length === 0 ? (
//           <p className="text-fg-muted">No collectives yet.</p>
//         ) : (
//           <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
//             {collectives.map((slug) => (
//               <li key={slug}>
//                 <Link
//                   className="hover:underline"
//                   href={P(`/collectives/${slug}`)}
//                 >
//                   {slug}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//
//       {/* Articles */}
//       <section className="space-y-2">
//         <h2 className="text-2xl">Articles</h2>
//         {(articles as ArticleLink[]).length === 0 ? (
//           <p className="text-fg-muted">No articles yet.</p>
//         ) : (
//           <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
//             {(articles as ArticleLink[]).map((a) => (
//               <li key={a.id}>
//                 <Link className="hover:underline" href={P(`/articles/${a.id}`)}>
//                   {a.title || `Article ${a.id}`}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </main>
//   );
// }
// // // app/(public)/[locale]/sitemap/page.tsx
// // import Link from "next/link";
// //
// // export const revalidate = 3600; // cache for 1h
// //
// // // TODO: wire to your CMS
// // async function getArticleIds(): Promise<string[]> {
// //   return ["123", "456"]; // placeholder
// // }
// // async function getCollectiveSlugs(): Promise<string[]> {
// //   return ["green-club-paris", "ecocampus-ens"]; // placeholder
// // }
// //
// // export default async function SitemapPage({
// //   params,
// // }: {
// //   params: { locale: string };
// // }) {
// //   const { locale } = params;
// //   const [articleIds, collectiveSlugs] = await Promise.all([
// //     getArticleIds(),
// //     getCollectiveSlugs(),
// //   ]);
// //
// //   const P = (p: string) => `/${locale}${p}`;
// //
// //   return (
// //     <main className="container mx-auto px-4 py-12">
// //       <h1 className="mb-8 text-4xl font-semibold">Sitemap</h1>
// //
// //       <section className="space-y-2 mb-10">
// //         <h2 className="text-2xl">Core</h2>
// //         <ul className="list-disc pl-6 text-lg">
// //           <li>
// //             <Link className="hover:underline" href={P("")}>
// //               Home
// //             </Link>
// //           </li>
// //           <li>
// //             <Link className="hover:underline" href={P("/articles")}>
// //               Articles
// //             </Link>
// //           </li>
// //           <li>
// //             <Link className="hover:underline" href={P("/calendar")}>
// //               Calendar
// //             </Link>
// //           </li>
// //           <li>
// //             <Link className="hover:underline" href={P("/collectives")}>
// //               Collectives
// //             </Link>
// //           </li>
// //           <li>
// //             <Link className="hover:underline" href={P("/newspaper")}>
// //               Newspaper
// //             </Link>
// //           </li>
// //         </ul>
// //       </section>
// //
// //       <section className="space-y-2 mb-10">
// //         <h2 className="text-2xl">Articles</h2>
// //         {articleIds.length === 0 ? (
// //           <p className="text-fg-muted">No articles yet.</p>
// //         ) : (
// //           <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
// //             {articleIds.map((id) => (
// //               <li key={id}>
// //                 <Link className="hover:underline" href={P(`/articles/${id}`)}>
// //                   Article {id}
// //                 </Link>
// //               </li>
// //             ))}
// //           </ul>
// //         )}
// //       </section>
// //
// //       <section className="space-y-2">
// //         <h2 className="text-2xl">Collectives</h2>
// //         {collectiveSlugs.length === 0 ? (
// //           <p className="text-fg-muted">No collectives yet.</p>
// //         ) : (
// //           <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
// //             {collectiveSlugs.map((slug) => (
// //               <li key={slug}>
// //                 <Link
// //                   className="hover:underline"
// //                   href={P(`/collectives/${slug}`)}
// //                 >
// //                   {slug}
// //                 </Link>
// //               </li>
// //             ))}
// //           </ul>
// //         )}
// //       </section>
// //     </main>
// //   );
// // }
