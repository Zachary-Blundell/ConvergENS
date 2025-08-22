import Image from "next/image";
import Link from "next/link";

export type Association = {
  name: string;
  href: string;
  logoSrc: string;
};

export type AssociationRowsProps = {
  items: Association[];
  size?: number;
};

export default function AssociationRows({ items }: AssociationRowsProps) {
  const size = 512;
  return (
    <div className="hidden sm:flex flex-wrap justify-center py-4 gap-2 bg-gray-100 dark:bg-gray-900">
      {items.map((a, n) => (
        <Link
          key={`${a.name}-${n}`}
          href={a.href}
          className="group block"
          aria-label={a.name}
        >
          <div
            className="relative aspect-square rounded-full bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm overflow-hidden transition-transform duration-200 group-hover:scale-105
                w-[clamp(3.5rem,_5vw,_4rem)] max-[961px]:w-[clamp(3.5rem,_7vw,_4.5rem)] "
          >
            <Image
              src={a.logoSrc}
              alt={`${a.name} logo`}
              fill
              className="object-contain p-2"
              sizes="(max-width: 1024px) 6rem, (max-width: 1280px) 7rem, 7rem"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
