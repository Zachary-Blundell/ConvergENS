//[local]/associations
//associations-page

// import AssociationCard from "@/components/AssociationCard";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const revalidate = 60; // revalidate list every minute

export type Association = {
  id: string;
  name: string;
  link: string;
  color: string;
  description: string;
};

const AssociationCard = ({
  name,
  description,
  link,
  color,
}: {
  name: string;
  description: string;
  link: string;
  color: string;
}) => (
  <div className="flex flex-col w-full overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 sm:flex-col sm:max-w-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
    {/* Cover */}
    <div
      className="h-48 bg-cover bg-center sm:h-48 sm:w-full"
      style={{ backgroundColor: color }}
      aria-label="Couverture association"
    />

    {/* Content */}
    <div className="flex flex-col justify-between flex-1 p-4">
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {name}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <Link
        href={link}
        // className="self-start px-3 py-1 mt-4 text-xs font-bold text-white uppercase rounded transition-opacity hover:opacity-90"
        className="mt-6 inline-block rounded-md px-6 py-3 text-sm font-medium uppercase text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none"
        style={{ backgroundColor: color }}
      >
        Voir la page
      </Link>
    </div>
  </div>
);

function getAssociations(): Association[] {
  // Fallback demo data for local/dev
  return [
    {
      id: "ENS Climat",
      name: "ENS Climat",
      link: "/associations/ens-climat",
      color: "#1d4ed8",
      description:
        "Rejoignez ENS Climat et participez à nos actions en faveur de la planète.",
    },
    {
      id: "agora",
      name: "Agora",
      link: "/associations/agora",
      color: "#0f766e",
      description: "Participez à la rédaction et à la vie du journal de l'ENS.",
    },
    {
      id: "solidarites",
      name: "Solidarités",
      link: "/associations/solidarites",
      color: "#7c3aed",
      description:
        "Actions solidaires et entraide entre étudiantes et étudiants.",
    },
  ];
}

export default function AssociationsPage() {
  const t = useTranslations("Nav");
  const groups = getAssociations();

  return (
    <div className="container px-4 py-12 mx-auto">
      <h1 className="mb-10 text-3xl font-bold text-center">
        Toutes les associations
      </h1>

      {groups.length === 0 ? (
        <p className="text-center text-slate-600 dark:text-slate-400">
          Chargement…
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {groups.map((g: Association) => (
            <AssociationCard key={g.name + g.id} {...g} />
          ))}
        </div>
      )}
    </div>
  );
}

// type assoLink = {
//   name: string;
//   route: string;
// };
//
// /* ---------------- Demo data ---------------- */
// const assoLinks: assoLink[] = [
//   { name: "MigrENS", route: "/en/associations/migrens" },
//   { name: "Arabisens", route: "/en/associations/arabisens" },
//   { name: "Ecocampus", route: "/en/associations/ecocampus" },
//   { name: "ECLORE", route: "/en/associations/eclore" },
// ];
//
// const AssociationCard = ({
//   name,
//   description,
//   link,
//   color,
// }: {
//   name: string;
//   description: string;
//   link: string;
//   color: string;
// }) => (
//   <div className="flex flex-col w-full overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 sm:flex-col sm:max-w-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
//     {/* Cover */}
//     <div
//       className="h-48 bg-cover bg-center sm:h-48 sm:w-full"
//       style={{ backgroundColor: color }}
//       aria-label="Couverture association"
//     />
//
//     {/* Content */}
//     <div className="flex flex-col justify-between flex-1 p-4">
//       <div>
//         <h3 className="text-xl font-bold text-gray-800 dark:text-white">
//           {name}
//         </h3>
//         <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//           {description}
//         </p>
//       </div>
//
//       <Link
//         to={link}
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{ backgroundColor: color }}
//         className="self-start px-3 py-1 mt-4 text-xs font-bold text-white uppercase rounded transition-opacity hover:opacity-90"
//       >
//         Voir la page
//       </Link>
//     </div>
//   </div>
// );
//
// export default function AssociationsPage() {
//   return (
//     <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//       <h1 className="text-2xl font-semibold">All Associations</h1>
//       <p className="mt-2 text-gray-600">
//         List of associations will be displayed here.
//       </p>
//       <ul>
//         {assoLinks.map((link: assoLink, key: number) => (
//           <Link
//             key={key}
//             href={link.route}
//             className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 mx-1 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none"
//           >
//             {link.name}
//           </Link>
//         ))}
//       </ul>
//     </section>
//   );
// }
