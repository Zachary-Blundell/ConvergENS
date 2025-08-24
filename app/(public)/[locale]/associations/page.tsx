//[local]/associations
//associations-page
import { prisma } from "@/lib/db";
import { AssociationCard } from "@/components/AssociationCard";

// NOTE: your schema field is `summary`, not `blurb`.
// And `id` is a String (cuid), not a number.
export default async function AssociationsPage() {
  const groups = await prisma.association.findMany({
    select: {
      id: true,
      name: true,
      blurb: true,
      imagePath: true,
      slug: true,
      color: true,
    },
    orderBy: { name: "asc" },
  });

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
          {groups.map((g, n) => (
            <AssociationCard key={n} {...g} />
          ))}
        </div>
      )}
    </div>
  );
}
//
//
//import { AssociationCard } from "@/components/AssociationCard";
//import { useTranslations } from "next-intl";
//import { prisma } from "@/lib/db";
//
//type Association = {
//  id: number;
//  name: string;
//  blurb: string;
//  imagePath: string;
//  slug: string;
//  color: string;
//};
//
//
//export default async function AssociationsPage() {
//  const t = useTranslations("Nav");
//  const groups: Association[]= await prisma.association.findMany({
//    select: {
//      id: true,
//      name: true,
//      blurb: true,
//      imagePath: true,
//      slug: true,
//      color: true,
//    },
//    orderBy: {
//      name: "asc",
//    },
//  });
//
//  return (
//    <div className="container px-4 py-12 mx-auto">
//      <h1 className="mb-10 text-3xl font-bold text-center">
//        Toutes les associations
//      </h1>
//
//      {groups.length === 0 ? (
//        <p className="text-center text-slate-600 dark:text-slate-400">
//          Chargement…
//        </p>
//      ) : (
//        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
//          {groups.map((g: Association, n: number) => (
//            <AssociationCard key={n} {...g} />
//          ))}
//        </div>
//      )}
//    </div>
//  );
//}
