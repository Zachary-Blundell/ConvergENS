//[local]/associations
//associations-page
import { prisma } from "@/lib/db";
import { AssociationCard } from "@/components/AssociationCard";
import { getTranslations } from "next-intl/server";

export default async function AssociationsPage() {
  const t = await getTranslations("AssociationsPage");

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
        {t("associationsHeader")}
      </h1>
      {groups.length === 0 ? (
        <p className="text-center text-slate-600 dark:text-slate-400">
          t("noAssociations")
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {groups.map((g, n) => (
            //TODO: change imagePath to not be null in the database
            <AssociationCard key={n} {...g} />
          ))}
        </div>
      )}
    </div>
  );
}
