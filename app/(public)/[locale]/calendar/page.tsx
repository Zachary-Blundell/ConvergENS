// app/(public)/[locale]/calendar/page.tsx
// ConvergENS Calendar page (server component)

import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  parseCursor,
  formatCursor,
  shiftMonth,
  firstOfMonth,
  startOfGrid,
  addDays,
  clampYear,
  nowYearMonthTZ,
} from '@/lib/date/cursor';
import CalendarMonth from './CalendarMonth';
import { getEventsForCalendar } from '@/lib/cms/events';
import { getTranslations } from 'next-intl/server';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ cursor: string }>;
}) {
  const t = await getTranslations('CalendarPage');
  const { locale } = await params;

  // Pull the raw cursor from the querystring (may be missing/invalid).
  const { cursor } = await (searchParams || Promise.resolve({ cursor: '' }));

  // Normalize the cursor. If it's empty/invalid, default to the current month.
  // Use Europe/Paris as the reference timezone for month boundaries.
  let ym = parseCursor(cursor, 'Europe/Paris');

  // Extra safety: if someone crafts a year outside our supported range,
  // normalize to the current YearMonth before proceeding.
  if (!clampYear(ym.year)) {
    ym = nowYearMonthTZ('Europe/Paris');
  }

  // Canonical form of the month cursor (always "YYYY-MM", zero-padded).
  const canonical = formatCursor(ym);

  // If the incoming cursor isn't canonical, redirect to the canonical URL
  // (stabilizes URLs and prevents duplicate content).
  if (cursor !== canonical) {
    redirect(`/${locale}/calendar?cursor=${canonical}`);
  }

  // Compute the visible 6x7 grid window and load events for that range.
  const firstDay = firstOfMonth(ym);
  const startDate = startOfGrid(firstDay, true /* Monday start */);
  const endDate = addDays(startDate, 42); // exclusive upper bound

  const monthsEvents = await getEventsForCalendar(locale, {
    start: startDate,
    end: endDate,
  });

  // Build prev/next, but only if resulting years are within allowed range.
  const prevYM = shiftMonth(ym, -1);
  const nextYM = shiftMonth(ym, +1);
  const hasPrev = !!clampYear(prevYM.year);
  const hasNext = !!clampYear(nextYM.year);

  const prev = formatCursor(prevYM);
  const next = formatCursor(nextYM);

  // Date instance for the header label (localized month name)
  const headerDate = firstOfMonth(ym);

  return (
    <main className="space-y-4">
      <div className="py-9" />
      {/* Header with month label and guarded prev/next links */}
      <nav
        aria-label={t('nav.ariaLabel')}
        className="m-4 flex items-center justify-between"
      >
        {hasPrev ? (
          <Link href={`/${locale}/calendar?cursor=${prev}`}>
            {t('nav.prev')}
          </Link>
        ) : (
          <span className="text-fg-primary select-none">{t('nav.prev')}</span>
        )}

        <h1 className="text-2xl">
          {headerDate.toLocaleString(locale, {
            month: 'long',
            year: 'numeric',
          })}
        </h1>

        {hasNext ? (
          <Link href={`/${locale}/calendar?cursor=${next}`}>
            {t('nav.next')}
          </Link>
        ) : (
          <span className="text-fg-primary select-none">{t('nav.next')}</span>
        )}
      </nav>

      {/* Month grid */}
      <div className="flex items-center justify-center">
        <CalendarMonth
          locale={locale}
          cursor={canonical}
          events={monthsEvents}
          className="max-w-7xl"
        />
      </div>
    </main>
  );
}
