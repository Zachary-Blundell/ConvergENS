import Image from 'next/image';
import Link from 'next/link';

type Props = { alt: string; title: string };

export default function Logo({ alt, title }: Props) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={title}>
      {/* Show black logo in light mode */}
      <Image
        src="/images/ArrowStarBlack.png"
        alt={alt}
        width={40}
        height={40}
        className="rounded-md block dark:hidden"
        priority
      />
      {/* Show white logo in dark mode */}
      <Image
        src="/images/ArrowStarWhite.png"
        alt={alt}
        width={40}
        height={40}
        className="rounded-md hidden dark:block"
        priority
      />
      <span className="font-heading text-highlight text-lg">{title}</span>
    </Link>
  );
}
