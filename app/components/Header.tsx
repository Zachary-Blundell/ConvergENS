import Link from "next/link";

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
