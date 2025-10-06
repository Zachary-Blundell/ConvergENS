import { getCollectiveBadges } from '@/lib/cms/collectives';
import Image from 'next/image';
import Link from 'next/link';

export default async function CollectiveRows() {
  const assoBadges = await getCollectiveBadges();

  if (assoBadges !== null) {
    return (
      <div className="relative hidden z-10 sm:flex flex-wrap justify-center p-4 gap-2 w-fit mx-auto bg-surface-4/50 rounded-full">
        {assoBadges.map((a, n) => (
          <Link
            key={`${a.name}-${n}`}
            href={`/collectives/${a.slug}`}
            className="group block"
            aria-label={a.name}
          >
            <div
              className="relative aspect-square rounded-full bg-surface-2 ring-1 ring-surface-4 shadow-sm overflow-hidden transition-transform duration-200 group-hover:scale-105
                w-[clamp(3.5rem,_5vw,_4rem)] max-[961px]:w-[clamp(3.5rem,_7vw,_4.5rem)] "
            >
              <Image
                src={a.logoUrl}
                alt={`${a.name} logo`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 6rem, (max-width: 1280px) 7rem, 7rem"
              />
            </div>
          </Link>
        ))}
      </div>
    );
  } else {
    return <></>;
  }
}
