// "use client";
//
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
//
// export type LinkItem = { href: string; label: string };
// export type HeaderProps = { links?: LinkItem[]; localePrefix?: string };
//
// const DEFAULT_LINKS: LinkItem[] = [
//   { href: "/associations", label: "Associations" },
//   { href: "/articles", label: "Articles" },
//   { href: "/calendar", label: "Calendar" },
//   { href: "/newspaper", label: "Newspaper" },
// ];
//
// export default function Header({
//   links = DEFAULT_LINKS,
//   localePrefix = "/en",
// }: HeaderProps) {
//   const pathname = usePathname();
//   const [menuOpen, setMenuOpen] = useState(false);
//
//   return (
//     <header className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50 backdrop-blur supports-[backdrop-filter]:bg-blue-50/60 dark:border-black dark:bg-blue-900 dark:supports-[backdrop-filter]:bg-neutral-900/60">
//       {/* Skip link for a11y */}
//       <a
//         href="#main"
//         className="sr-only focus:not-sr-only focus:absolute focus:inset-x-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-white dark:focus:bg-white dark:focus:text-neutral-900"
//       >
//         Skip to content
//       </a>
//
//       <div className="container mx-auto flex items-center justify-between px-4 py-3">
//         <div className="flex items-center gap-3">
//           <Link
//             href={`${localePrefix}/`}
//             className="font-semibold tracking-tight text-neutral-900 outline-none ring-0 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-neutral-500 dark:text-neutral-100 dark:focus-visible:ring-neutral-400"
//           >
//             ConvergENS
//           </Link>
//         </div>
//
//         {/* Desktop nav */}
//         <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
//           {links.map((link) => {
//             const joined = `${localePrefix}${link.href.startsWith("/") ? link.href : "/" + link.href}`;
//             const isActive = pathname?.startsWith(joined);
//             return (
//               <Link
//                 href={joined}
//                 key={link.href}
//                 className={[
//                   "rounded-xl px-3 py-2 text-sm font-medium outline-none transition-colors",
//                   "text-neutral-700 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-500",
//                   "dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-400",
//                   isActive
//                     ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
//                     : "",
//                 ].join(" ")}
//               >
//                 {link.label}
//               </Link>
//             );
//           })}
//           <ThemeToggle />
//         </nav>
//
//         {/* Mobile controls */}
//         <div className="flex items-center gap-2 md:hidden">
//           <ThemeToggle compact />
//           <button
//             type="button"
//             onClick={() => setMenuOpen((v) => !v)}
//             aria-expanded={menuOpen}
//             aria-label="Toggle navigation menu"
//             className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white/70 outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-400"
//           >
//             <BurgerIcon open={menuOpen} />
//           </button>
//         </div>
//       </div>
//
//       {/* Mobile menu panel */}
//       <div
//         className={`md:hidden ${
//           menuOpen ? "block" : "hidden"
//         } border-t border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90`}
//       >
//         <nav aria-label="Mobile" className="container mx-auto px-2 py-2">
//           {links.map((link) => {
//             const href = `${localePrefix}${link.href.startsWith("/") ? link.href : "/" + link.href}`;
//             const isActive = pathname?.startsWith(href);
//             return (
//               <Link
//                 href={href}
//                 key={link.href}
//                 onClick={() => setMenuOpen(false)}
//                 className={[
//                   "block rounded-xl px-3 py-2 text-sm font-medium",
//                   "text-neutral-700 hover:bg-neutral-100",
//                   "dark:text-neutral-300 dark:hover:bg-neutral-800",
//                   isActive
//                     ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
//                     : "",
//                 ].join(" ")}
//               >
//                 {link.label}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>
//     </header>
//   );
// }

/**
 * Theme toggle that persists to localStorage and toggles the <html> class.
 * Requires tailwind.config.js with:  module.exports = { darkMode: 'class', ... }
 */
// function ThemeToggle({ compact = false }: { compact?: boolean }) {
//   const [mounted, setMounted] = useState(false);
//   const [isDark, setIsDark] = useState(false);
//
//   // Read initial theme on mount (system preferred if nothing stored)
//   useEffect(() => {
//     const root = document.documentElement;
//     const stored = (localStorage.getItem("convergens-theme") || "system") as
//       | "light"
//       | "dark"
//       | "system";
//
//     const prefersDark =
//       window.matchMedia &&
//       window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const startDark = stored === "dark" || (stored === "system" && prefersDark);
//
//     applyTheme(startDark ? "dark" : "light");
//     setIsDark(startDark);
//     setMounted(true);
//
//     // Update if system preference changes *and* user selected system
//     const mq = window.matchMedia("(prefers-color-scheme: dark)");
//     const onChange = (e: MediaQueryListEvent) => {
//       const saved = (localStorage.getItem("convergens-theme") || "system") as
//         | "light"
//         | "dark"
//         | "system";
//       if (saved === "system") {
//         applyTheme(e.matches ? "dark" : "light");
//         setIsDark(e.matches);
//       }
//     };
//     mq.addEventListener?.("change", onChange);
//     return () => mq.removeEventListener?.("change", onChange);
//   }, []);
//
//   function applyTheme(theme: "light" | "dark") {
//     const root = document.documentElement;
//     if (theme === "dark") root.classList.add("dark");
//     else root.classList.remove("dark");
//   }
//
//   function toggle() {
//     const next = !isDark;
//     setIsDark(next);
//     applyTheme(next ? "dark" : "light");
//     localStorage.setItem("convergens-theme", next ? "dark" : "light");
//   }
//
//   if (!mounted) {
//     // Avoid hydration mismatch
//     return (
//       <span
//         aria-hidden
//         className={
//           compact ? "inline-block h-9 w-9" : "inline-block h-9 w-[6.5rem]"
//         }
//       />
//     );
//   }
//
//   return (
//     <div className="relative">
//       <button
//         type="button"
//         onClick={toggle}
//         aria-pressed={isDark}
//         aria-label="Toggle dark mode"
//         className={[
//           "group inline-flex items-center justify-center gap-2 rounded-xl border outline-none transition-colors focus-visible:ring-2",
//           compact
//             ? "h-9 w-9 border-neutral-200 bg-white/70 hover:bg-neutral-100 focus-visible:ring-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-400"
//             : "h-9 border-neutral-200 bg-white/70 px-3 hover:bg-neutral-100 focus-visible:ring-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-400",
//         ].join(" ")}
//       >
//         {/* Icon */}
//         {isDark ? <MoonIcon /> : <SunIcon />}
//         {!compact && (
//           <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
//             {isDark ? "Dark" : "Light"}
//           </span>
//         )}
//       </button>
//
//       {/* Optional: system switch via context menu (press and hold) could be added later */}
//     </div>
//   );
// }
//
// function BurgerIcon({ open }: { open: boolean }) {
//   return (
//     <svg
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       aria-hidden="true"
//     >
//       <path
//         d={open ? "M6 6L18 18M6 18L18 6" : "M3 6H21M3 12H21M3 18H21"}
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }
//
// function SunIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       width="16"
//       height="16"
//       aria-hidden="true"
//       className="text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100"
//     >
//       <path
//         fill="currentColor"
//         d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1ZM12 4a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1ZM4 13a1 1 0 1 1 0-2H3a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2H3a1 1 0 1 1 0 2h1Zm17 0a1 1 0 1 1 0-2h1a1 1 0 1 1 0-2h-1a1 1 0 1 1 0 2h1a1 1 0 1 1 0 2h-1ZM5.05 19.364a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.415 1.414l-.708.707a1 1 0 0 1-1.414 0ZM16.828 7.586a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.415 1.414l-.708.707a1 1 0 0 1-1.414 0ZM18.95 19.364a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414ZM7.172 7.586a1 1 0 0 1-1.414 0L5.05 6.879A1 1 0 1 1 6.465 5.464l.707.707a1 1 0 0 1 0 1.415Z"
//       />
//     </svg>
//   );
// }
//
// function MoonIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       width="16"
//       height="16"
//       aria-hidden="true"
//       className="text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100"
//     >
//       <path
//         fill="currentColor"
//         d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
//       />
//     </svg>
//   );
// }
// ------
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export type LinkItem = { href: string; label: string };

export type HeaderProps = { links?: LinkItem[] };

const DEFAULT_LINKS: LinkItem[] = [
  { href: "/associations", label: "Associations" },
  { href: "/articles", label: "Articles" },
  { href: "/calendar", label: "Calendar" },
  { href: "/newspaper", label: "Newspaper" },
];

export default function Header({ links = DEFAULT_LINKS }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-slate-900/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <ThemeToggle />
        <Link href="/en/" className="font-semibold">
          ConvergENS
        </Link>
        {links.map((link) => (
          <Link
            href={"/en/" + link.href}
            key={link.href}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
// -------
// // components/Header.tsx
// "use client";
//
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
//
// const nav = [
//   { href: "/", label: "Home", exact: true },
//   { href: "/associations", label: "Associations" },
//   { href: "/articles", label: "Articles" },
//   { href: "/calendar", label: "Calendar" },
//   { href: "/newspaper", label: "Newspaper" },
// ];
//
// export default function Header() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);
//
//   const isActive = (href: string, exact?: boolean) =>
//     exact ? pathname === href : pathname.startsWith(href);
//
//   const base =
//     "block px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus-visible:ring";
//   const active = "bg-gray-900 text-white";
//   const inactive = "text-gray-700 hover:bg-gray-100";
//
//   return (
//     <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           <Link href="/" className="flex items-center gap-2">
//             <span
//               aria-hidden
//               className="inline-block h-8 w-8 rounded-xl bg-gray-900"
//             />
//             <span className="font-semibold">YourApp</span>
//           </Link>
//
//           {/* Desktop nav */}
//           <nav
//             className="hidden md:flex md:items-center md:gap-2"
//             aria-label="Primary"
//           >
//             {nav.map((n) => (
//               <Link
//                 key={n.href}
//                 href={n.href}
//                 className={`${base} ${isActive(n.href, n.exact) ? active : inactive}`}
//               >
//                 {n.label}
//               </Link>
//             ))}
//           </nav>
//
//           {/* Mobile menu button */}
//           <button
//             type="button"
//             className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring"
//             aria-controls="mobile-menu"
//             aria-expanded={open}
//             onClick={() => setOpen((v) => !v)}
//           >
//             <span className="sr-only">Open main menu</span>
//             <svg
//               viewBox="0 0 24 24"
//               className="h-6 w-6"
//               fill="none"
//               stroke="currentColor"
//             >
//               {open ? (
//                 <path
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               ) : (
//                 <path
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>
//
//       {/* Mobile nav */}
//       {open && (
//         <nav
//           id="mobile-menu"
//           className="md:hidden border-t"
//           aria-label="Primary"
//         >
//           <div className="space-y-1 px-4 py-3">
//             {nav.map((n) => (
//               <Link
//                 key={n.href}
//                 href={n.href}
//                 className={`${base} ${isActive(n.href, n.exact) ? active : inactive}`}
//                 onClick={() => setOpen(false)}
//               >
//                 {n.label}
//               </Link>
//             ))}
//           </div>
//         </nav>
//       )}
//     </header>
//   );
// }
