// components/Footer.tsx
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Logo from './logo';

export default function Footer() {
  const tNav = useTranslations('Nav');
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] text-[hsl(var(--fg-strong))]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3">
        {/* Brand */}
        <div className="space-y-4">
          <Logo alt={t('logoAlt')} title={t('siteTitle')} />

          <p className="text-sm text-fg-muted">{t('tagline')}</p>
        </div>

        {/* Sitemap */}
        <nav
          aria-label={t('sitemap.ariaLabel')}
          className="md:justify-self-center"
        >
          <h4 className="text-s font-medium uppercase tracking-wide text-fg-muted">
            {t('sitemap.title')}
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/sitemap"
                className="text-highlight-600 hover:text-highlight-700 hover:underline"
              >
                {t('sitemap.links.sitemap')}
              </Link>
            </li>
            <li>
              <Link href="/collectives" className="hover:underline">
                {t('sitemap.links.collectives')}
              </Link>
            </li>
            <li>
              <Link href="/evenements" className="hover:underline">
                {t('sitemap.links.events')}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                {t('sitemap.links.contact')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact */}
        <div className="md:justify-self-end">
          <h4 className="text-s font-medium uppercase tracking-wide text-fg-muted">
            {t('contact.title')}
          </h4>
          <address className="mt-4 not-italic">
            <a
              href={`mailto:${t('contact.email')}`}
              className="inline-flex items-center gap-2 hover:underline"
            >
              <span className="i-lucide-mail h-4 w-4" aria-hidden="true" />
              {t('contact.email')}
            </a>
          </address>
        </div>
      </div>

      {/* Disclaimer + small print */}
      <div className="border-t border-[hsl(var(--border))]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-xs leading-relaxed text-[hsl(var(--fg-muted))]">
            {t('disclaimer')}
          </p>
          <p className="mt-3 text-xs text-[hsl(var(--fg-muted))]">
            {t('copyright', {
              year: new Date().getFullYear(),
              site: tNav('siteTitle'),
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
