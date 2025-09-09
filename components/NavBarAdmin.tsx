"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ThemeToggle from "./ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { HiMenuAlt3 } from "react-icons/hi";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { usePathname } from "next/navigation";
import Link from "next/link";

export type LinkItem = {
  href: `/${string}`;
  labelKey: string;
};

export const ADMIN_LINKS: readonly LinkItem[] = [
  { href: "/admin", labelKey: "Tableau de board" },
  { href: "/admin/associations", labelKey: "Associations" },
  { href: "/admin/articles", labelKey: "Articles" },
  // { href: "/admin/calendar", labelKey: "calendar" },
  // { href: "/admin/newspaper", labelKey: "Journal" },
  { href: "/", labelKey: "Accueil public" },
] as const;

export default function NavBarAdmin() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className="sticky top-0 z-50 flex w-full items-center justify-between px-4 py-2 border-b border-surface-3 bg-surface-2/70 backdrop-blur-sm"
      aria-label="Primary navigation"
    >
      {/* Left: logo (desktop) + mobile menu (mobile) */}
      <div className="flex items-center">
        {/* Logo & title on desktop */}
        <Link
          href="/admin"
          className="hidden min-[800px]:flex items-center gap-2"
        >
          <img
            src="/images/placeholder.png"
            alt="ConvergENS logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="font-heading text-highlight text-lg">
            ConvergENS Admin
          </span>
        </Link>

        {/* Mobile menu trigger */}
        <div className="min-[800px]:hidden">
          <MobileMenu links={ADMIN_LINKS} />
        </div>
      </div>

      {/* Center: desktop nav */}
      <div className="hidden min-[800px]:block col-start-2 min-w-0 justify-self-center">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-2 max-w-full overflow-x-auto">
            {ADMIN_LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  <Link href={link.href}>{link.labelKey}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right: utilities */}
      <div className="hidden min-[800px]:flex col-start-3 justify-self-end items-center gap-3 shrink-0">
        <ThemeToggle />
        {/* <LocaleSwitcher /> */}
      </div>
    </nav>
  );
}

function MobileMenu({ links }: { links: readonly LinkItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Ouvrir le menu"
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        className="inline-flex items-center justify-center rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HiMenuAlt3 className="h-6 w-6" aria-hidden />
        <span className="sr-only">Ouvrir le menu</span>
      </SheetTrigger>

      <SheetContent side="right" className="w-72 sm:w-80" id="mobile-menu">
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Menu principal</SheetTitle>
            <SheetDescription>
              Navigation principale et paramètres
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <nav
            className="flex flex-col gap-1"
            aria-label="Navigation principale"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="rounded-md px-3 py-2 text-fg-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.labelKey}
              </Link>
            ))}
          </nav>

          <div className="mx-5 pt-3 border-t mt-4 flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
