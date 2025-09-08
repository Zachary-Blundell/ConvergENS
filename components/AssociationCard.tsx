import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function AssociationCard({
  name,
  summary,
  logoUrl,
  slug,
  color,
}: {
  id: string;
  name: string;
  summary: string;
  logoUrl: string;
  slug: string;
  color: string;
}) {
  const t = useTranslations("AssociationsPage");

  return (
    <div className="flex flex-col w-full overflow-hidden bg-surface-2 rounded-lg shadow-lg sm:flex-col sm:max-w-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
      {/* Content column*/}
      <div className="flex flex-col justify-between flex-1 p-4">
        {/* Logo name row*/}
        <div className="flex">
          <Image
            height={192}
            width={384}
            src={logoUrl}
            alt={t("altLogo", { name })}
            className="relative aspect-square rounded-full bg-surface-2 ring-1 ring-outline shadow-sm overflow-hidden transition-transform duration-200 group-hover:scale-105
                w-40"
          />

          <div className="flex justify-center items-center w-full ">
            <h3 className="text-center text-xl text-fg-primary">{name}</h3>
          </div>
        </div>

        <p className="my-5 text-sm text-fg-muted">{summary}</p>
        <Link
          href={"/associations/" + slug}
          title={t("viewPageTitle", { name })}
          aria-label={t("viewPageAria", { name })}
          // className="self-start px-3 py-1 mt-4 text-xs font-bold text-white uppercase rounded transition-opacity hover:opacity-90"
          className="inline-block rounded-md px-6 py-3 text-sm text-center font-medium uppercase text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none"
          style={{ backgroundColor: color }}
        >
          {t("viewPage")}
        </Link>
      </div>
    </div>
  );
}
