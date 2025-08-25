import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function AssociationCard({
  id,
  name,
  blurb,
  imagePath,
  slug,
  color,
}: {
  id: string;
  name: string;
  blurb: string;
  imagePath: string;
  slug: string;
  color: string;
}) {
  const t = useTranslations("AssociationsPage");

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 sm:flex-col sm:max-w-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
      {/* Content column*/}
      <div className="flex flex-col justify-between flex-1 p-4">
        {/* Logo name row*/}
        <div className="flex">
          <Image
            height={192}
            width={384}
            src={imagePath}
            alt={t("altLogo", { name })}
            // className="object-contain w-full h-48 bg-gray-200 sm:h-48 sm:w-full"
            className="relative aspect-square rounded-full bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm overflow-hidden transition-transform duration-200 group-hover:scale-105
                w-40"
          />

          <div className="flex justify-center items-center w-full ">
            <h3 className="text-center text-xl font-bold text-gray-800 dark:text-white">
              {name}
            </h3>
          </div>
        </div>

        <p className="my-5 text-sm text-gray-600 dark:text-gray-400">{blurb}</p>
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
