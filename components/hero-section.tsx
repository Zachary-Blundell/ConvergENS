import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

export type HeroProps = {
  /** Main headline */
  title: ReactNode;
  /** Supporting text */
  subtitle?: ReactNode;
  /** CTA button label */
  ctaText?: string;
  /** CTA link */
  ctaHref?: string;
  /** Background image URL */
  imageUrl: string;
  /** Optional: place content below CTA (e.g., logos) */
  children?: ReactNode;
};

export default function Hero({
  title,
  subtitle,
  ctaText = 'Learn more',
  ctaHref = '#',
  imageUrl,
  children,
}: HeroProps) {
  return (
    <section className="relative isolate min-h-[80vh] h-svh w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={imageUrl}
          width={1920}
          height={1080}
          alt="Background"
          className="h-full w-full object-cover"
        />
        {/* gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/10" />
      </div>

      {/* Decorative blur blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-1/2 h-[40rem] w-[40rem] -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,255,255,0.25), rgba(255,255,255,0))',
        }}
      />

      {/* Content */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-28 text-center sm:px-8 lg:px-10">
        <h1 className="text-balance text-4xl tracking-tight text-white drop-shadow sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {ctaText && (
            <Link
              href={ctaHref}
              aria-label={
                typeof ctaText === 'string' ? ctaText : 'Call to action'
              }
              className="rounded-2xl px-6 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-white/20 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              style={{
                background:
                  'linear-gradient(to bottom right, rgba(255,255,255,0.22), rgba(255,255,255,0.06))',
              }}
            >
              {ctaText}
            </Link>
          )}
        </div>

        {children ? (
          <div className="mt-8 w-full max-w-4xl">{children}</div>
        ) : null}
      </div>

      {/* Safe area padding for small screens */}
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </section>
  );
}
