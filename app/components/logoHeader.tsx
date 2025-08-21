// import Image from "next/image";
// import Link from "next/link";
//
// export type Association = {
//   name: string;
//   href: string;
//   logoSrc: string;
// };
//
// export type AssociationRowsProps = {
//   /** Items to render */
//   items: Association[];
//   /** Fixed pixel diameter for each circular logo. Default: 100 */
//   size?: number;
//   /** Gap between logos in pixels. Default: 16 */
//   gap?: number;
//   /** Additional wrapper classes */
//   className?: string;
// };
//
// function chunk<T>(arr: readonly T[], n: number): T[][] {
//   const out: T[][] = [];
//   for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
//   return out;
// }
//
// export default function AssociationRows({
//   items,
//   size = 100,
//   gap = 16,
//   className = "",
// }: AssociationRowsProps) {
//   const offset = (size + gap) / 2; // half-shift for the staggered layout
//
//   return (
//     <div className={"w-full " + className}>
//       <div className="grid grid-row-4 auto-cols-fr">
//         {items.map((a, n) => (
//           <Link
//             key={a.href + a.name + n}
//             href={a.href}
//             className="group block"
//             aria-label={a.name}
//           >
//             <div
//               className="rounded-full bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
//               style={{ width: size, height: size }}
//             >
//               <Image
//                 src={a.logoSrc}
//                 alt={`${a.name} logo`}
//                 width={size}
//                 height={size}
//                 className="object-contain w-full h-full p-2"
//                 sizes={`${size}px`}
//               />
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type Association = {
  name: string;
  href: string;
  logoSrc: string;
};

export type AssociationRowsProps = {
  /** Items to render */
  items: Association[];
  /** Fixed pixel diameter for each circular logo. Default: 100 */
  size?: number;
  /** Gap between logos in pixels. Default: 16 */
  gap?: number;
  /** Additional wrapper classes */
  className?: string;
};

function chunk<T>(arr: readonly T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const anyEntry = entry as unknown as {
          contentBoxSize?: any;
          contentRect: DOMRectReadOnly;
        };
        const w = anyEntry.contentBoxSize
          ? Array.isArray(anyEntry.contentBoxSize)
            ? anyEntry.contentBoxSize[0].inlineSize
            : anyEntry.contentBoxSize.inlineSize
          : anyEntry.contentRect.width;
        setWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width } as const;
}

/**
 * Fixed-size, staggered association logos.
 * - Logos stay exactly `size` (default 100px) — no scaling.
 * - If all items fit in one row, render a single row.
 * - If not, split the list into two rows (first half / second half) and stagger the second row.
 * - If even a half won't fit, gracefully fall back to chunking into additional rows, keeping the stagger pattern.
 */
export default function AssociationRows({
  items,
  size = 100,
  gap = 16,
  className = "",
}: AssociationRowsProps) {
  const { ref, width } = useContainerWidth<HTMLDivElement>();

  // How many fixed-size logos fit per row in the current container?
  const capacity = useMemo(() => {
    if (width <= 0) return Infinity; // SSR/initial: don't split yet
    return Math.max(1, Math.floor((width + gap) / (size + gap)));
  }, [width, size, gap]);

  const rows = useMemo(() => {
    if (!Number.isFinite(capacity)) return [items];

    if (items.length <= capacity) {
      return [items];
    }

    const half = Math.ceil(items.length / 2);

    // If each half fits, do exactly two rows (staggered)
    if (half <= capacity) {
      return [items.slice(0, half), items.slice(half)];
    }

    // Fallback: more than two rows required; chunk by capacity
    return chunk(items, capacity);
  }, [items, capacity]);

  const offset = (size + gap) / 2; // half-shift for the staggered layout

  return (
    <div
      ref={ref}
      className={"w-full bg-blue-400 flex justify-center" + className}
    >
      <div>
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex flex-wrap items-center "
            style={{
              gap,
              marginBottom: gap,
              marginLeft: rowIdx % 2 === 1 ? offset : 0,
            }}
          >
            {row.map((a) => (
              <Link
                key={a.href + a.name}
                href={a.href}
                className="group block"
                aria-label={a.name}
              >
                <div
                  className="rounded-full bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                  style={{ width: size, height: size }}
                >
                  <Image
                    src={a.logoSrc}
                    alt={`${a.name} logo`}
                    width={size}
                    height={size}
                    className="object-contain w-full h-full p-2"
                    sizes={`${size}px`}
                  />
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

//----------
//
// "use client";
//
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useMemo, useRef, useState } from "react";
//
// export type Association = {
//   name: string;
//   href: string;
//   logoSrc: string;
// };
//
// export type AssociationRowsProps = {
//   /** Items to render */
//   items: Association[];
//   /** Desired columns per row on wide screens. Default: 6 */
//   perRow?: number;
//   /** Minimum pixel diameter for each circular logo. Default: 56 */
//   minSize?: number;
//   /** Maximum pixel diameter for each circular logo. Default: 128 */
//   maxSize?: number;
//   /** Gap between logos in pixels. Default: 16 */
//   gap?: number;
//   /** Enable auto-sizing so logos grow to fill the screen width. Default: true */
//   autoFit?: boolean;
//   /** Additional wrapper classes */
//   className?: string;
// };
//
// function chunk<T>(arr: readonly T[], n: number): T[][] {
//   const out: T[][] = [];
//   for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
//   return out;
// }
//
// function useContainerWidth<T extends HTMLElement>() {
//   const ref = useRef<T | null>(null);
//   const [width, setWidth] = useState(0);
//
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const ro = new ResizeObserver((entries) => {
//       for (const entry of entries) {
//         // Prefer contentBoxSize when available for accuracy
//         // Fallback to contentRect for broader support
//         const w = (entry as any).contentBoxSize
//           ? Array.isArray((entry as any).contentBoxSize)
//             ? (entry as any).contentBoxSize[0].inlineSize
//             : (entry as any).contentBoxSize.inlineSize
//           : entry.contentRect.width;
//         setWidth(w);
//       }
//     });
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);
//
//   return { ref, width } as const;
// }
//
// /**
//  * Displays associations as alternating (staggered) rows of perfectly round, equal‑sized logos.
//  * Logos automatically grow (or shrink) to fill the available width up to `maxSize`.
//  * Uses Next.js <Link> for navigation and <Image> for optimized images.
//  *
//  * Notes:
//  * - Allow remote logo hostnames in `next.config.js` (images.domains) if needed.
//  * - The stagger offset is computed from the current logo size, keeping the pattern consistent.
//  */
// export default function AssociationRows({
//   items,
//   iconWidth = 100,
//   className = "",
// }: AssociationRowsProps) {
//   const { ref, width } = useContainerWidth<HTMLDivElement>();
//
//   const offset = (computedSize + gap) / 2; // half-shift for the staggered layout
//
//   return (
//     <div ref={ref} className={"w-full " + className}>
//       {rows.map((row, rowIdx) => (
//         <div
//           key={rowIdx}
//           className="flex flex-wrap items-center"
//           style={{
//             gap,
//             marginBottom: gap,
//             marginLeft: rowIdx % 2 === 1 ? offset : 0,
//           }}
//         >
//           {row.map((a) => (
//             <Link
//               key={a.href + a.name}
//               href={a.href}
//               className="group block"
//               aria-label={a.name}
//             >
//               <div
//                 className="rounded-full bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
//                 style={{ width: computedSize, height: computedSize }}
//               >
//                 <Image
//                   src={a.logoSrc}
//                   alt={`${a.name} logo`}
//                   width={computedSize}
//                   height={computedSize}
//                   className="object-contain w-full h-full p-2"
//                   sizes={`${computedSize}px`}
//                 />
//               </div>
//             </Link>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }
//
// // import Image from "next/image";
// // import Link from "next/link";
// //
// // export type Association = {
// //   name: string;
// //   href: string;
// //   logoSrc: string;
// // };
// //
// // export type AssociationRowsProps = {
// //   /** Items to render */
// //   items: Association[];
// //   /** Logos per row (desktop). Default: 6 */
// //   perRow?: number;
// //   /** Diameter of each circular logo in pixels. Default: 64 */
// //   size?: number;
// //   /** Gap between logos in pixels. Default: 16 */
// //   gap?: number;
// //   /** Additional wrapper classes */
// //   className?: string;
// // };
// //
// // function chunk<T>(arr: readonly T[], n: number): T[][] {
// //   const out: T[][] = [];
// //   for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
// //   return out;
// // }
// //
// // /**
// //  * Displays associations as alternating (staggered) rows of perfectly round, equal‑sized logos.
// //  * Uses Next.js <Link> for each association, and <Image> for optimized logos.
// //  *
// //  * Notes:
// //  * - Allow the logo domains in `next.config.js` (images.domains) for remote images.
// //  * - The stagger offset is computed as half of (size + gap) on every other row.
// //  */
// // export default function AssociationRows({
// //   items,
// //   perRow = 6,
// //   size = 64,
// //   gap = 16,
// //   className = "",
// // }: AssociationRowsProps) {
// //   const rows = chunk(items, Math.max(1, perRow));
// //   const itemStyle: React.CSSProperties = {
// //     width: size,
// //     height: size,
// //   };
// //   const rowGapStyle: React.CSSProperties = {
// //     gap,
// //     marginBottom: gap,
// //   };
// //   const offset = (size + gap) / 2; // half-shift for staggered layout
// //
// //   return (
// //     <div className={"w-full " + className}>
// //       {rows.map((row, rowIdx) => (
// //         <div
// //           key={rowIdx}
// //           className="flex flex-wrap items-center"
// //           style={{
// //             ...rowGapStyle,
// //             marginLeft: rowIdx % 2 === 1 ? offset : 0,
// //           }}
// //         >
// //           {row.map((a) => (
// //             <Link
// //               key={a.href + a.name}
// //               href={a.href}
// //               className="group block" // for hover effects
// //               aria-label={a.name}
// //             >
// //               <div
// //                 className="rounded-full bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
// //                 style={itemStyle}
// //               >
// //                 <Image
// //                   src={a.logoSrc}
// //                   alt={`${a.name} logo`}
// //                   width={size}
// //                   height={size}
// //                   className="object-contain w-full h-full p-2"
// //                   sizes={`${size}px`}
// //                 />
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }
// //
// // /*
// // Example usage:
// //
// // */
// // // import React from "react";
// // //
// // // /**
// // //  * AlternatingLogoGrid
// // //  *
// // //  * Displays logos in two (or more) rows where every other row is offset/staggered
// // //  * by half a logo, creating an alternating alignment pattern.
// // //  *
// // //  * Features
// // //  * - Equal representation: every logo renders at the same, fixed diameter.
// // //  * - Always visible: responsive sizing via CSS clamp, plus wrapping support.
// // //  * - Round logos with safe padding, optional link wrapping, and accessible labels.
// // //  * - Works with any number of logos (defaults to 10), any number of rows.
// // //  * - Keyboard-accessible focus rings when logos are links.
// // //  *
// // //  * Tailwind is assumed to be available in the host app.
// // //  */
// // //
// // // export type LogoItem = {
// // //   src: string;
// // //   alt: string;
// // //   href?: string;
// // // };
// // //
// // // type AlternatingLogoGridProps = {
// // //   logos: LogoItem[];
// // //   /**
// // //    * Number of columns to try to place per row before wrapping.
// // //    * This controls how many logos appear per row at typical desktop widths.
// // //    * The component stays responsive and may wrap earlier on small screens.
// // //    */
// // //   columns?: number; // default 5
// // //   /**
// // //    * Number of rows to organize into. If omitted, it's computed from logo count and columns.
// // //    */
// // //   rows?: number;
// // //   /**
// // //    * Logical diameter of each circular logo container. Accepts any valid CSS length.
// // //    * Uses clamp() to stay responsive across breakpoints.
// // //    */
// // //   size?: string; // e.g., "clamp(48px, 8vw, 84px)"
// // //   /**
// // //    * Gap between logo items.
// // //    */
// // //   gap?: string; // e.g., "1rem"
// // //   /**
// // //    * Optional label shown above the grid for context.
// // //    */
// // //   heading?: string;
// // //   /**
// // //    * If true, the logos will have a subtle card-like background and shadow.
// // //    */
// // //   withCards?: boolean;
// // // };
// // //
// // // export default function AlternatingLogoGrid({
// // //   logos,
// // //   columns = 17,
// // //   rows,
// // //   size = "clamp(52px, 7.5vw, 88px)",
// // //   gap = "0.9rem",
// // //   heading,
// // //   withCards = false,
// // // }: AlternatingLogoGridProps) {
// // //   const total = logos.length;
// // //   const computedRows = rows ?? Math.ceil(total / columns);
// // //
// // //   // Distribute logos as evenly as possible across rows
// // //   const perRowBase = Math.floor(total / computedRows);
// // //   const remainder = total % computedRows; // first `remainder` rows get +1
// // //   const rowSizes = Array.from(
// // //     { length: computedRows },
// // //     (_, idx) => perRowBase + (idx < remainder ? 1 : 0),
// // //   );
// // //
// // //   const rowsData: LogoItem[][] = [];
// // //   let start = 0;
// // //   for (const sz of rowSizes) {
// // //     rowsData.push(logos.slice(start, start + sz));
// // //     start += sz;
// // //   }
// // //
// // //   return (
// // //     <section
// // //       className="w-full mx-auto max-w-6xl"
// // //       style={{
// // //         // Expose CSS vars so we can measure spacer width precisely
// // //         // and keep a single source of truth for item diameter and gaps
// // //         // regardless of breakpoint.
// // //         // Consumers may override via the `size` and `gap` props.
// // //         // @ts-expect-error -- CSS custom properties are allowed
// // //         "--logo-size": size,
// // //         "--logo-gap": gap,
// // //       }}
// // //       aria-label={heading ?? "Partner associations"}
// // //     >
// // //       {heading && (
// // //         <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-4 md:mb-6">
// // //           {heading}
// // //         </h2>
// // //       )}
// // //
// // //       <div
// // //         className="flex flex-col items-stretch"
// // //         style={{ gap: "calc(var(--logo-gap) * 1.2)" }}
// // //       >
// // //         {rowsData.map((row, rowIndex) => {
// // //           const isStaggered = rowIndex % 2 === 1; // every other row offset
// // //           return (
// // //             <div key={rowIndex} className="w-full overflow-visible">
// // //               {/* Row container */}
// // //               <div
// // //                 className="flex flex-row flex-wrap items-center"
// // //                 style={{
// // //                   columnGap: "var(--logo-gap)",
// // //                   rowGap: "var(--logo-gap)",
// // //                 }}
// // //               >
// // //                 {/* Spacer to create the half-item offset on alternating rows */}
// // //                 {isStaggered && (
// // //                   <div
// // //                     aria-hidden
// // //                     style={{
// // //                       width: "calc(var(--logo-size) / 2 + var(--logo-gap) / 2)",
// // //                       height: 0,
// // //                       flex: "0 0 auto",
// // //                     }}
// // //                   />
// // //                 )}
// // //
// // //                 {row.map((logo, i) => (
// // //                   <LogoBubble key={i} item={logo} withCard={withCards} />
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           );
// // //         })}
// // //       </div>
// // //     </section>
// // //   );
// // // }
// // //
// // // function LogoBubble({ item, withCard }: { item: LogoItem; withCard: boolean }) {
// // //   const Wrapper: React.FC<
// // //     {
// // //       children: React.ReactNode;
// // //     } & React.AnchorHTMLAttributes<HTMLAnchorElement>
// // //   > = ({ children, ...linkProps }) =>
// // //     item.href ? (
// // //       <a
// // //         {...linkProps}
// // //         href={item.href}
// // //         className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded-full"
// // //         aria-label={item.alt}
// // //       >
// // //         {children}
// // //       </a>
// // //     ) : (
// // //       <div aria-label={item.alt}>{children}</div>
// // //     );
// // //
// // //   return (
// // //     <Wrapper>
// // //       <div
// // //         className={[
// // //           "relative flex items-center justify-center rounded-full",
// // //           withCard ? "shadow-sm ring-1 ring-black/5 bg-white" : "",
// // //         ].join(" ")}
// // //         style={{
// // //           width: "var(--logo-size)",
// // //           height: "var(--logo-size)",
// // //           flex: "0 0 auto",
// // //         }}
// // //       >
// // //         <img
// // //           src={item.src}
// // //           alt={item.alt}
// // //           className="w-[78%] h-[78%] object-contain rounded-full select-none"
// // //           draggable={false}
// // //           loading="lazy"
// // //         />
// // //       </div>
// // //     </Wrapper>
// // //   );
// // // }
// // //
// // // // --- Demo usage (you can remove below in production) ---
// // // const SAMPLE_LOGOS: LogoItem[] = [
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png",
// // //     alt: "Google",
// // //   },
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
// // //     alt: "Amazon",
// // //   },
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Apple_logo_black.svg",
// // //     alt: "Apple",
// // //   },
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_N_logo.svg",
// // //     alt: "Netflix",
// // //   },
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/0/02/Stack_Overflow_logo.svg",
// // //     alt: "Stack Overflow",
// // //   },
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
// // //     alt: "JavaScript",
// // //   },
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/9/96/SVG_Logo.svg",
// // //     alt: "SVG",
// // //   },
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg",
// // //     alt: "Twitter",
// // //   },
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg",
// // //     alt: "HTML5",
// // //   },
// // //   {
// // //     src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
// // //     alt: "CSS3",
// // //   },
// // // ];
// // //
// // // export const Demo = () => (
// // //   <div className="p-6">
// // //     <AlternatingLogoGrid
// // //       heading="Our partner associations"
// // //       logos={SAMPLE_LOGOS}
// // //       columns={9}
// // //       size="clamp(56px, 8vw, 90px)"
// // //       gap="1rem"
// // //       withCards
// // //     />
// // //   </div>
// // // );
