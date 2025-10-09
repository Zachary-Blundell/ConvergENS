import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export function OrganisationCard({
  name,
  summary,
  logoUrl,
  logoW,
  logoH,
  slug,
  color,
}: {
  id: string;
  name: string;
  summary: string;
  logoUrl: string;
  logoW: number;
  logoH: number;
  slug: string;
  color: string;
}) {
  const t = useTranslations('OrganisationsPage');

  // ---------- Contrast helpers ----------
  function hexToRgb(hex: string) {
    const h = hex.replace('#', '');
    const full =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    const num = parseInt(full, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  function srgbToLinear(c: number) {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  }
  function luminance({ r, g, b }: { r: number; g: number; b: number }) {
    const R = srgbToLinear(r);
    const G = srgbToLinear(g);
    const B = srgbToLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
  function contrastRatio(hexBg: string, hexFg: string) {
    const L1 = luminance(hexToRgb(hexBg));
    const L2 = luminance(hexToRgb(hexFg));
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  function safeRatio(fn: () => number) {
    try {
      const v = fn();
      return Number.isFinite(v) ? Number(v.toFixed(2)) : NaN;
    } catch {
      return NaN;
    }
  }
  function pickText(hexBg: string) {
    const ratioWhite = safeRatio(() => contrastRatio(hexBg, '#ffffff'));
    const ratioBlack = safeRatio(() => contrastRatio(hexBg, '#000000'));
    if (isNaN(ratioWhite) || isNaN(ratioBlack)) return '#ffffff'; // fallback
    return ratioBlack >= ratioWhite ? '#000000' : '#ffffff';
  }

  const bg = color || '#ffffff';
  const hoverBg = '#FF621F';
  const textColor = pickText(bg);
  const textColorHover = pickText(hoverBg);

  return (
    <div className="relative group flex w-full flex-col mt-12 rounded-lg bg-surface-2 shadow-lg transition delay-150 duration-300 ease-in-out md:hover:-translate-y-1 md:hover:scale-110">
      {/* Mobile logo (centered, inside flow) */}
      <div className="sm:hidden -mt-10 mb-2 flex justify-center">
        <Image
          height={logoH}
          width={logoW}
          src={logoUrl}
          alt={t('altLogo', { name })}
          // className="h-24 w-24 bg-surface-2 ring-2 ring-outline shadow-lg transition-transform duration-200"
        />
      </div>

      {/* Desktop/Tablet floating logo */}
      <div className="hidden sm:block absolute -top-12 -left-6 z-10">
        <Image
          height={logoH}
          width={logoW}
          src={logoUrl}
          alt={t('altLogo', { name })}
          className="h-24 w-24 rounded-full bg-surface-2 ring-2 ring-outline shadow-lg transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col sm:flex-none justify-between flex-1 p-4">
        <div className="flex justify-center items-center w-full">
          <h3 className="text-center text-xl text-fg-primary px-15">{name}</h3>
        </div>

        <p className="my-5 text-sm text-fg-muted">{summary}</p>

        <Link
          href={'/organisations/' + slug}
          title={t('viewPageTitle', { name })}
          aria-label={t('viewPageAria', { name })}
          className="
            inline-block rounded-md px-6 py-3 text-sm text-center font-medium uppercase
            focus:outline-none transition-colors duration-200
            bg-[var(--btn-bg)] hover:bg-[var(--btn-bg-hover)]
            text-[var(--btn-fg)] hover:text-[var(--btn-fg-hover)]
          "
          style={
            {
              ['--btn-bg' as any]: bg,
              ['--btn-bg-hover' as any]: hoverBg,
              ['--btn-fg' as any]: textColor,
              ['--btn-fg-hover' as any]: textColorHover,
            } as React.CSSProperties
          }
        >
          {t('viewPage')}
        </Link>
      </div>
    </div>
  );
}
