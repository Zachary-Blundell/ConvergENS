'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import ThemeToggle from './ThemeToggle';
import LocaleSwitcher from './LocaleSwitcher';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { HiMenuAlt3 } from 'react-icons/hi';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';

/** i18n keys */
type LinkKey = 'collectives' | 'articles' | 'calendar' | 'newspaper';

export type LinkItem = {
  href: `/${string}`;
  labelKey: LinkKey;
};

export const DEFAULT_LINKS: readonly LinkItem[] = [
  { href: '/collectives', labelKey: 'collectives' },
  { href: '/articles', labelKey: 'articles' },
  { href: '/calendar', labelKey: 'calendar' },
  { href: '/newspaper', labelKey: 'newspaper' },
] as const;

export default function NavBar() {
  const t = useTranslations('Nav');
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 flex w-full items-center justify-between px-4 py-2 border-b-1 border-surface-3
             bg-surface-2/70 backdrop-blur-sm"
      aria-label={t('primaryNav', { default: 'Primary' })}
    >
      {/* Left logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/placeholder.png"
          alt={t('logoAlt')}
          width={40}
          height={40}
          className="rounded-md"
        />
        <span className="font-heading text-highlight text-lg">
          {t('siteTitle')}
        </span>
      </Link>

      {/* Desktop nav (hide below 800px) */}
      <div className="max-[799px]:hidden">
        <NavigationMenu className="flex gap-2">
          {DEFAULT_LINKS.map((link) => {
            return (
              <NavigationMenuLink asChild>
                <a href={link.href} className={navigationMenuTriggerStyle()}>
                  {t(link.labelKey)}
                </a>
              </NavigationMenuLink>
            );
          })}
        </NavigationMenu>
      </div>

      {/* Mobile controls (show below 800px) */}
      <div className="flex items-center gap-3 min-[799px]:hidden">
        <MobileMenu />
      </div>

      {/* Right-side utilities on desktop */}
      <div className="max-[799px]:hidden space-x-4 flex items-center justify-center">
        <ThemeToggle />
        <LocaleSwitcher />
      </div>
    </nav>
  );
}

function MobileMenu() {
  const t = useTranslations('Nav');
  const pathname = usePathname();

  return (
    <Sheet>
      {/* Explicit name on the trigger; SR text included */}
      <SheetTrigger
        aria-label={t('openMenu', { default: 'Open menu' })}
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        className="inline-flex items-center justify-center rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HiMenuAlt3 className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">
          {t('openMenu', { default: 'Open menu' })}
        </span>
      </SheetTrigger>

      {/* Sheet acts as a dialog; provide an accessible name via hidden title */}
      <SheetContent side="right" className="w-72 sm:w-80" id="mobile-menu">
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>{t('menuTitle', { default: 'Main menu' })}</SheetTitle>
            <SheetDescription>
              {t('menuDesc', { default: 'Primary navigation and settings' })}
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <nav
            className="flex flex-col gap-1"
            aria-label={t('primaryNav', { default: 'Primary' })}
          >
            {DEFAULT_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="rounded-md px-3 py-2 text-fg-primary hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="mx-5 pt-3 border-t mt-4 flex items-center gap-3">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
