import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ alt, title }: { alt: string; title: string }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/images/ArrowStarBlack.png"
        // src="/images/ArrowStarWhite.png"
        alt={alt}
        width={40}
        height={40}
        className="rounded-md"
      />
      <span className="font-heading text-highlight text-lg">{title}</span>
    </Link>
  );
}
