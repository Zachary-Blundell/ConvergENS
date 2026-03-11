import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const HOVER_BG = '#FF621F';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const full =
    h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
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
function pickText(hexBg: string) {
  const rw = contrastRatio(hexBg, '#ffffff');
  const rb = contrastRatio(hexBg, '#000000');
  return rb >= rw ? '#000000' : '#ffffff';
}

const HOVER_FG = pickText(HOVER_BG);

export function OrganisationCard({
  name,
  summary,
  logoUrl,
  logoW,
  logoH,
  slug,
  color,
  altLogo,
  viewPageLabel,
  viewPageTitle,
  viewPageAria,
}: {
  name: string;
  summary: string;
  logoUrl: string;
  logoW: number;
  logoH: number;
  slug: string;
  color: string | null;
  altLogo: string;
  viewPageLabel: string;
  viewPageTitle: string;
  viewPageAria: string;
}) {
  const bg = color || '#ffffff';
  const textColor = pickText(bg);

  return (
    <div className="group relative flex h-full flex-col rounded-lg bg-surface-2 shadow-m transition delay-150 duration-300 ease-in-out md:hover:-translate-y-1 md:hover:scale-110">
      <div className="-mt-10 mb-2 flex justify-center sm:block sm:absolute sm:-top-2 sm:-left-6 sm:z-10">
        <Image
          height={logoH}
          width={logoW}
          src={logoUrl}
          alt={altLogo}
          sizes="96px"
          loading="lazy"
          className="h-24 w-24 rounded-full bg-surface-2 ring-2 ring-outline shadow-lg transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-center items-center w-full">
          <h3 className="text-center text-lg sm:text-xl text-fg-primary px-15">
            {name}
          </h3>
        </div>

        <p className="my-5 text-sm text-fg-muted">{summary}</p>

        <Link
          href={`/organisations/${slug}`}
          title={viewPageTitle}
          aria-label={viewPageAria}
          className="mt-auto inline-flex gap-2 rounded-md px-6 py-3 text-sm text-center font-medium uppercase focus:outline-none transition-colors duration-200 bg-[var(--btn-bg)] hover:bg-[var(--btn-bg-hover)] text-[var(--btn-fg)] hover:text-[var(--btn-fg-hover)]"
          style={
            {
              ['--btn-bg' as any]: bg,
              ['--btn-bg-hover' as any]: HOVER_BG,
              ['--btn-fg' as any]: textColor,
              ['--btn-fg-hover' as any]: HOVER_FG,
            } as React.CSSProperties
          }
        >
          {viewPageLabel}
        </Link>
      </div>
    </div>
  );
}
