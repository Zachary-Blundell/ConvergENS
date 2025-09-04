// components/SocialLinks.tsx
import * as React from "react";
import type { IconType } from "react-icons";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaBluesky,
  FaMastodon,
  FaThreads,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa6";

const iconMap: Record<string, IconType> = {
  twitter: FaTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  bluesky: FaBluesky,
  mastodon: FaMastodon,
  threads: FaThreads,
  linkedin: FaLinkedin,
  other: FaGlobe,
};

export type Platform =
  | "twitter"
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "bluesky"
  | "mastodon"
  | "threads"
  | "linkedin"
  | "other"
  | (string & {});

export type SocialLinkItem = {
  platform: Platform;
  url: string;
  handle?: string | null;
  label?: string | null;
  isPrimary?: boolean | null;
};

export type SocialLinksProps = {
  socials?: SocialLinkItem[] | null;
  className?: string;
  showLabels?: boolean; // show "handle/label" next to icon
  size?: "sm" | "md" | "lg"; // icon & padding size
};

const ICON_SIZES: Record<NonNullable<SocialLinksProps["size"]>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

function normalizePlatform(p?: string | null): string {
  return (p ?? "other").toLowerCase();
}

function hostnameFrom(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function labelFor(item: SocialLinkItem): string {
  return item.label ?? item.handle ?? hostnameFrom(item.url);
}

export default function SocialLinks({
  socials,
  className,
  showLabels = false,
  size = "md",
}: SocialLinksProps) {
  const items = (socials ?? [])
    .filter(
      (s): s is SocialLinkItem =>
        !!s && typeof s.url === "string" && s.url.length > 0,
    )
    .sort((a, b) => Number(!!b.isPrimary) - Number(!!a.isPrimary)); // primary first

  if (items.length === 0) return null; // nothing to show

  const iconSize = ICON_SIZES[size];

  const pad =
    size === "sm" ? "px-2 py-1" : size === "lg" ? "px-3 py-2" : "px-2.5 py-1.5";
  const text =
    size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-sm";

  return (
    <ul role="list" className={"flex flex-wrap gap-2 " + (className ?? "")}>
      {items.map((item, idx) => {
        const key = `${normalizePlatform(item.platform)}-${idx}`;
        const P = iconMap[normalizePlatform(item.platform)] ?? iconMap["other"];
        const isPrimary = !!item.isPrimary;
        const rel =
          normalizePlatform(item.platform) === "mastodon"
            ? "me noopener noreferrer"
            : "noopener noreferrer";

        return (
          <li key={key}>
            <a
              href={item.url}
              target="_blank"
              rel={rel}
              title={labelFor(item)}
              className={`inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800/80 ${pad} ${
                isPrimary
                  ? "ring-2 ring-offset-1 ring-slate-400/60 dark:ring-slate-500/60"
                  : ""
              } hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors`}
            >
              <P size={iconSize} className="shrink-0" />
              {showLabels && (
                <span className={`${text} text-slate-700 dark:text-slate-300`}>
                  {labelFor(item)}
                </span>
              )}
              <span className="sr-only">
                {normalizePlatform(item.platform)}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
