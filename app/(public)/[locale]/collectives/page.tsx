// app/[locale]/collectives/page.tsx
import { getTranslations } from "next-intl/server";
import { getCollectives } from "@/lib/cms/collectives";
import { log } from "console";
import { CollectiveCard } from "@/components/CollectiveCard";

export default async function CollectivesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("CollectivesPage");
  const collectives = await getCollectives(
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

  log(collectives);

  return (
    <div className="container px-4 py-12 mx-auto">
      <h1 className="mb-10 text-5xl text-center text-highlight">
        {t("collectivesHeader")}
      </h1>
      {collectives.length === 0 ? (
        <p className="text-center text-fg-primary">{t("noCollectives")}</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {collectives.map((asso) => (
            <CollectiveCard
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
