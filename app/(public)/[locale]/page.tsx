//[local]
//main-page

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Group = {
  id: string;
  name: string;
  blurb?: string;
  image?: string;
};

/* ---------------- Demo data ---------------- */
const GROUPS: Group[] = [
  {
    id: "1",
    name: "Syndicat Étudiant ENS",
    blurb:
      "Mobilisations étudiantes, entraide et défense des droits sur le campus.",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "2",
    name: "Club Climat ENS",
    blurb:
      "Ateliers, conférences et actions concrètes pour la transition écologique.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "3",
    name: "Collectif Accessibilité",
    blurb:
      "Rendre l’ENS plus inclusive : accessibilité numérique et des lieux.",
    image:
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "4",
    name: "Club Presse & Journal",
    blurb:
      "Rédaction du journal étudiant, enquêtes et couverture des événements.",
    image:
      "https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "5",
    name: "Atelier Informatique Libre",
    blurb: "Install parties, sensibilisation aux logiciels libres et sécurité.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "6",
    name: "Groupe Culture & Arts",
    blurb: "Expos, concerts et ateliers ouverts à toutes et tous.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=60",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  /* ---------------- Menu: click-outside ---------------- */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuOpen) return;
      const target = event.target as Node | null;
      if (
        navRef.current &&
        target &&
        !navRef.current.contains(target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="flex flex-col">
      {/* ---------------- Hero ---------------- */}
      <section
        className="h-[38rem] w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="flex h-full w-full items-center justify-center bg-gray-900/50">
          <div className="px-4 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow lg:text-5xl">
              Fédérons les <span className="text-blue-400">luttes</span> et les
              talents de l’ENS
            </h1>
            <Link
              href="/associations"
              className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-medium uppercase text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none"
            >
              Découvrir les associations
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- About grid ---------------- */}
      <section className="container mx-auto space-y-20 px-4 py-16">
        {/* Row 1 – image left, text right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Rassembler les associations
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              Convergence des Luttes met en réseau les clubs, syndicats et
              collectifs de l’ENS pour qu’ils se découvrent, collaborent et
              partagent leurs ressources au même endroit.
            </p>
          </div>
        </div>

        {/* Row 2 – text left, image right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="order-2 space-y-4 sm:order-1">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Publier et partager facilement
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              Chaque collectif dispose d’un espace sécurisé où il peut tenir son
              profil à jour et publier articles ou actualités, sans compétence
              technique particulière.
            </p>
          </div>
          <div className="order-1 aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700 sm:order-2" />
        </div>

        {/* Row 3 – image left, text right */}
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Simple, accessible et à but non lucratif
            </h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              Le projet est porté bénévolement : une plateforme légère, à faible
              coût, respectueuse des standards d’accessibilité et ouverte à
              toutes les bonnes volontés.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Latest actions (uses GROUPS) ---------------- */}
      <section className="border-t border-blue-300 bg-blue-100 py-16 dark:border-blue-700 dark:bg-blue-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Retrouvez nos dernières actions communes
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {GROUPS.slice(0, 3).map((g) => (
              <article
                key={g.id}
                className="flex flex-col rounded-md bg-white p-6 text-center shadow-sm dark:bg-slate-800"
              >
                <div
                  className="mb-4 aspect-[16/9] rounded-md bg-slate-200 dark:bg-slate-700"
                  style={
                    g.image
                      ? {
                          backgroundImage: `url('${g.image}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
                <h3 className="mb-2 font-semibold">{g.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {g.blurb ??
                    "Résumé court de l’initiative proposée par l’une des associations membres."}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// "use client";
// // export default function HomePage() {
// //   return (
// //     <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
// //       <h1 className="text-3xl font-semibold tracking-tight">Welcome 👋</h1>
// //       <p className="mt-2 text-gray-600">
// //         This page is rendered inside the shared layout (Header · Footer).
// //       </p>
// //     </section>
// //   );
// // }
// interface EventTarget {
//     addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
//     dispatchEvent(evt: Event): boolean;
//     removeEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
// }
//
// interface SyntheticEvent {
//     bubbles: boolean;
//     cancelable: boolean;
//     currentTarget: EventTarget;
//     defaultPrevented: boolean;
//     eventPhase: number;
//     isTrusted: boolean;
//     nativeEvent: Event;
//     preventDefault(): void;
//     stopPropagation(): void;
//     target: EventTarget;
//     timeStamp: Date;
//     type: string;
// }
//
// import React, { useState, useEffect, useRef } from "react";
//
// const HomePage = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [setGroups] = useState([]);
//
//   const navRef = useRef(null);
//   const toggleBtnRef = useRef(null);
//
//   /* ---------------- Menu: click‑outside ---------------- */
//   useEffect(() => {
//     function handleClickOutside(event: SyntheticEvent) {
//       if (!menuOpen) return;
//       if (
//         navRef.current &&
//         !navRef.current.contains(event.target) &&
//         toggleBtnRef.current &&
//         !toggleBtnRef.current.contains(event.target)
//       ) {
//         setMenuOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen]);
//
//   /* ---------------- Fetch groups once ---------------- */
//   useEffect(() => {
//     let mounted = true;
//     fetchGroups().then((data) => {
//       if (mounted) setGroups(data.groups);
//     });
//     return () => {
//       mounted = false;
//     };
//   }, []);
//
//   return (
//     <div className="flex flex-col">
//       {/* ---------------- Hero ---------------- */}
//       <section
//         className="w-full bg-center bg-cover h-[38rem]"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1600&q=80')",
//         }}
//       >
//         <div className="flex items-center justify-center w-full h-full bg-gray-900/50">
//           <div className="px-4 text-center">
//             <h1 className="text-3xl font-extrabold tracking-tight text-white lg:text-5xl drop-shadow">
//               Fédérons les <span className="text-blue-400">luttes</span> et les
//               talents de l’ENS
//             </h1>
//             <Link
//               type="button"
//               className="px-6 py-3 mt-6 text-sm font-medium text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none"
//               to="/associations"
//             >
//               Découvrir les associations
//             </Link>
//           </div>
//         </div>
//       </section>
//
//       {/* ---------------- About grid ---------------- */}
//       <section className="container px-4 py-16 mx-auto space-y-20">
//         {/* Row 1 – image left, text right */}
//         <div className="grid items-center gap-10 sm:grid-cols-2">
//           <div className="rounded-md bg-slate-200 dark:bg-slate-700 aspect-[16/9]" />
//
//           <div className="space-y-4">
//             <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
//               Rassembler les associations
//             </h2>
//             <p className="leading-relaxed text-slate-700 dark:text-slate-300">
//               Convergence des Luttes met en réseau les clubs, syndicats et
//               collectifs de l’ENS pour qu’ils se découvrent, collaborent et
//               partagent leurs ressources au même endroit.
//             </p>
//           </div>
//         </div>
//
//         {/* Row 2 – text left, image right */}
//         <div className="grid items-center gap-10 sm:grid-cols-2">
//           <div className="order-2 space-y-4 sm:order-1">
//             <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
//               Publier et partager facilement
//             </h2>
//             <p className="leading-relaxed text-slate-700 dark:text-slate-300">
//               Chaque collectif dispose d’un espace sécurisé où il peut tenir son
//               profil à jour et publier articles ou actualités, sans compétence
//               technique particulière.
//             </p>
//           </div>
//
//           <div className="order-1 rounded-md bg-slate-200 dark:bg-slate-700 aspect-[16/9] sm:order-2" />
//         </div>
//
//         {/* Row 3 – image left, text right */}
//         <div className="grid items-center gap-10 sm:grid-cols-2">
//           <div className="rounded-md bg-slate-200 dark:bg-slate-700 aspect-[16/9]" />
//
//           <div className="space-y-4">
//             <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
//               Simple, accessible et à but non lucratif
//             </h2>
//             <p className="leading-relaxed text-slate-700 dark:text-slate-300">
//               Le projet est porté bénévolement : une plateforme légère, à faible
//               coût, respectueuse des standards d’accessibilité et ouverte à
//               toutes les bonnes volontés.
//             </p>
//           </div>
//         </div>
//       </section>
//
//       {/* ---------------- Latest actions ---------------- */}
//       <section className="py-16 border-t bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700">
//         <div className="container px-4 mx-auto">
//           <h2 className="mb-12 text-2xl font-semibold text-center text-slate-800 dark:text-slate-100">
//             Retrouvez nos dernières actions communes
//           </h2>
//
//           <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 3 }).map((_, idx) => (
//               <article
//                 key={idx}
//                 className="flex flex-col p-6 text-center bg-white rounded-md shadow-sm dark:bg-slate-800"
//               >
//                 <div className="mb-4 rounded-md bg-slate-200 dark:bg-slate-700 aspect-[16/9]" />
//                 <h3 className="mb-2 font-semibold">Titre de l’action</h3>
//                 <p className="text-sm text-slate-600 dark:text-slate-300">
//                   Résumé court de l’initiative proposée par l’une des
//                   associations membres.
//                 </p>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };
//
// export default HomePage;
