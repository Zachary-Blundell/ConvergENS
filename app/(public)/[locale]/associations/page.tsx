//[local]/associations
//associations-page

import { log } from "console";
import Link from "next/link";

type assoLink = {
  name: string;
  route: string;
};

/* ---------------- Demo data ---------------- */
const assoLinks: assoLink[] = [
  { name: "MigrENS", route: "/en/associations/migrens" },
  { name: "Arabisens", route: "/en/associations/arabisens" },
  { name: "Ecocampus", route: "/en/associations/ecocampus" },
  { name: "ECLORE", route: "/en/associations/eclore" },
];

export default function AssociationsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">All Associations</h1>
      <p className="mt-2 text-gray-600">
        List of associations will be displayed here.
      </p>
      <ul>
        {assoLinks.map((link: assoLink, key: number) => (
          <Link
            key={key}
            href={link.route}
            className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 mx-1 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none"
          >
            {link.name}
          </Link>
        ))}
      </ul>
    </section>
  );
}
