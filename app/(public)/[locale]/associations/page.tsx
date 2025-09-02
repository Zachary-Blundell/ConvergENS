//[local]/associations
//associations-page
import { prisma } from "@/lib/db";
import { AssociationCard } from "@/components/AssociationCard";
import { getTranslations } from "next-intl/server";

const PLACEHOLDER_LOGO = "/images/placeholder.png";

export default async function AssociationsPage() {
  const t = await getTranslations("AssociationsPage");

  const groups = await prisma.association.findMany({
    select: {
      id: true,
      name: true,
      summary: true,
      logoUrl: true,
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
          {t("noAssociations")}
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {groups.map((g) => (
            <AssociationCard
              key={g.id}
              id={g.id}
              name={g.name}
              summary={g.summary} // maps blurb -> summary
              logoUrl={g.logoUrl ?? PLACEHOLDER_LOGO} // make it non-null
              slug={g.slug}
              color={g.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
