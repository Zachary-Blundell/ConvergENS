import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArticleCard as TArticleCard } from '@/lib/cms/articles';
import ArticleCard from './ArticleCard';
import { cn } from '@/lib/utils';

export function ArticleCardCarousel({
  articles,
  className,
}: {
  articles: Array<TArticleCard>;
  className?: string;
}) {
  return (
    <Carousel
      // className="max-w-5/6 flex items-center"
      className={cn('max-w-5/6 flex items-center', className)}
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselPrevious />
      <CarouselContent className="-ml-1">
        {articles.map((a) => (
          <CarouselItem key={a.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <ArticleCard key={a.id} article={a} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
}
// 'use client';
//
// import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { ArticleCard } from '@/lib/cms/articles';
// // If you already have an ArticleCard component you want to reuse,
// // switch to: import { ArticleCard } from '@/components/ArticleCard';
// // and remove the InlineCard below.
//
// // ---- Types ----
// // Adjust the import path if you have ArticleCard type elsewhere
// // import type { ArticleCard as TArticleCard } from '@/lib/cms/articles';
//
// // ---- Minimal inline card (remove if you use your existing <ArticleCard />) ----
// function InlineCard({ a }: { a: ArticleCard }) {
//   return (
//     <Link
//       href={`/organisations/${a.collective.slug}/articles/${a.id}`}
//       className="block rounded-xl border border-outline hover:shadow-lg transition bg-surface"
//       aria-label={a.title}
//     >
//       <div className="relative aspect-video rounded-t-xl overflow-hidden">
//         <Image
//           src={a.coverUrl}
//           alt={a.title}
//           fill
//           sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
//           className="object-cover"
//           priority={false}
//         />
//       </div>
//       <div className="p-3">
//         <div className="mb-2 flex items-center gap-2 text-xs">
//           <span
//             className="inline-flex items-center rounded-full px-2 py-0.5 border border-outline"
//             style={{ backgroundColor: a.tag.color ?? 'transparent' }}
//           >
//             {a.tag.name}
//           </span>
//           <span className="text-fg-muted">{a.collective.name}</span>
//         </div>
//         <h3 className="text-base font-semibold line-clamp-2">{a.title}</h3>
//         <time
//           className="mt-2 block text-xs text-fg-muted"
//           dateTime={a.published_at}
//         >
//           {new Date(a.published_at).toLocaleDateString(undefined, {
//             year: 'numeric',
//             month: 'short',
//             day: '2-digit',
//           })}
//         </time>
//       </div>
//     </Link>
//   );
// }
//
// // ---- Carousel ----
// export function ArticleCardCarousel({
//   items,
//   renderItem,
//   ariaLabel = 'Article carousel',
//   autoScroll = false,
//   autoScrollMs = 6000,
// }: {
//   items: ArticleCard[];
//   /** Optional custom renderer. Defaults to InlineCard */
//   renderItem?: (a: ArticleCard) => React.ReactNode;
//   ariaLabel?: string;
//   /** Autoscroll the carousel */
//   autoScroll?: boolean;
//   autoScrollMs?: number;
// }) {
//   const containerRef = useRef<HTMLUListElement | null>(null);
//   const [canPrev, setCanPrev] = useState(false);
//   const [canNext, setCanNext] = useState(false);
//
//   const checkScrollButtons = useCallback(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     const { scrollLeft, scrollWidth, clientWidth } = el;
//     setCanPrev(scrollLeft > 0);
//     setCanNext(scrollLeft + clientWidth < scrollWidth - 1);
//   }, []);
//
//   useEffect(() => {
//     checkScrollButtons();
//   }, [items?.length, checkScrollButtons]);
//
//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     const onScroll = () => checkScrollButtons();
//     el.addEventListener('scroll', onScroll, { passive: true });
//     return () => el.removeEventListener('scroll', onScroll);
//   }, [checkScrollButtons]);
//
//   useEffect(() => {
//     if (!autoScroll) return;
//     const id = setInterval(() => {
//       const el = containerRef.current;
//       if (!el) return;
//       if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
//         // loop back
//         el.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         el.scrollBy({ left: el.clientWidth * 0.9, behavior: 'smooth' });
//       }
//     }, autoScrollMs);
//     return () => clearInterval(id);
//   }, [autoScroll, autoScrollMs]);
//
//   const next = useCallback(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     el.scrollBy({ left: el.clientWidth * 0.9, behavior: 'smooth' });
//   }, []);
//
//   const prev = useCallback(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     el.scrollBy({ left: -el.clientWidth * 0.9, behavior: 'smooth' });
//   }, []);
//
//   const Card = renderItem ?? ((a: ArticleCard) => <InlineCard a={a} />);
//
//   if (!items?.length) return null;
//
//   return (
//     <section className="relative" aria-label={ariaLabel}>
//       {/* Edge fades */}
//       <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-surface to-transparent rounded-l-xl" />
//       <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-surface to-transparent rounded-r-xl" />
//
//       {/* Controls */}
//       <div className="absolute -top-12 right-0 flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="icon"
//           aria-label="Previous"
//           onClick={prev}
//           disabled={!canPrev}
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </Button>
//         <Button
//           variant="outline"
//           size="icon"
//           aria-label="Next"
//           onClick={next}
//           disabled={!canNext}
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//
//       {/* Track */}
//       <ul
//         ref={containerRef}
//         className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-1 py-2"
//         role="listbox"
//         aria-label={ariaLabel}
//         tabIndex={0}
//       >
//         {items.map((a) => (
//           <li
//             key={a.id}
//             className="snap-start shrink-0 basis-[85%] sm:basis-[55%] md:basis-[40%] lg:basis-[32%] max-w-[480px]"
//             role="option"
//             aria-selected={false}
//           >
//             {Card(a)}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }
//
// // ---- Usage ----
// // <ArticleCardCarousel items={articles} />
// // Optional: reuse your existing <ArticleCard/> by passing a renderer
// // <ArticleCardCarousel items={articles} renderItem={(a) => <ArticleCard article={a} />} />
