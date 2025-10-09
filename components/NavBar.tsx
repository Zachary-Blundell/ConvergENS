'use client';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import ThemeToggle from './ThemeToggle';
import LocaleSwitcher from './LocaleSwitcher';
import { usePathname } from 'next/navigation';
import { HiMenuAlt3 } from 'react-icons/hi';
import Logo from './logo';

/** i18n keys */
type LinkKey = 'organisations' | 'articles' | 'calendar' | 'newspaper';

export type LinkItem = {
  href: `/${string}`;
  labelKey: LinkKey;
};

export const DEFAULT_LINKS: readonly LinkItem[] = [
  { href: '/organisations', labelKey: 'organisations' },
  { href: '/articles', labelKey: 'articles' },
  { href: '/calendar', labelKey: 'calendar' },
  { href: '/newspaper', labelKey: 'newspaper' },
] as const;

export default function NavBar() {
  const [menuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const t = useTranslations('Nav');

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            'bg-surface-1/90 mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled &&
              'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5',
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              {/* Left logo */}
              <Logo alt={t('logoAlt')} title={t('siteTitle')} />

              {/* Mobile controls (show below 800px) */}
              <div className="flex items-center gap-3 min-[799px]:hidden">
                <MobileMenu />
              </div>
            </div>
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {DEFAULT_LINKS.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-fg-primary hover:text-fg-muted bg-surface-3 shadow-s rounded-lg p-2 block duration-150 border-0.5 border-outline"
                    >
                      <span>{t(link.labelKey)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right-side utilities on desktop */}
            <div className="max-[799px]:hidden space-x-4 flex items-center justify-center">
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </nav>
    </header>
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
