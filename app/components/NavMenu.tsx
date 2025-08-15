"use client";

import Link from "next/link";

export type LinkItem = { href: string; label: string };

export default function NavMenu({
  links,
  onNavigateAction: onNavigate,
}: {
  links: LinkItem[];
  onNavigateAction?: () => void;
}) {
  return (
    <ul className="flex flex-wrap gap-4">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="hover:underline" onClick={onNavigate}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
