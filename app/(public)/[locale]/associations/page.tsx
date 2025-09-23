// app/[locale]/associations/page.tsx
import { getTranslations } from "next-intl/server";
import { AssociationCard } from "@/components/AssociationCard";
import { getAssociations } from "@/lib/cms/associations";
import { log } from "console";

// export const revalidate = 300; // revalidate every 5 minutes (tune as needed)

export default async function AssociationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("AssociationsPage");
  const associations = await getAssociations(
    {
      fields: [
        "id",
        "status",
        "name",
        "slug",
        "color",
        { logo: ["id", "height", "width"] },
        { translations: ["summary"] },
      ],

      sort: ["name"],
      filter: { status: { _eq: "published" } },
    },
    locale,
  );

  log(associations);

  return (
    <div className="container px-4 py-12 mx-auto">
      <h1 className="mb-10 text-5xl text-center text-highlight">
        {t("associationsHeader")}
      </h1>
      {associations.length === 0 ? (
        <p className="text-center text-fg-primary">{t("noAssociations")}</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {associations.map((asso) => (
            <AssociationCard
              key={asso.id}
              id={asso.id}
              name={asso.name}
              logoW={asso.logoWidth}
              logoH={asso.logoHeight}
              summary={asso.summary}
              logoUrl={asso.logoUrl}
              slug={asso.slug}
              color={asso.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}
