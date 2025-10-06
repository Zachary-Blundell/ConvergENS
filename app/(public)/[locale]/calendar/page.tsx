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
  nowYearMonthTZ,
  clampYear,
} from '@/lib/date/cursor';
import CalendarMonth from './CalendarMonth';
import { getEventsForCalendar } from '@/lib/cms/events';

type Params = Promise<{ locale: string }>;
type Search = Promise<{ cursor?: string }>;

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: Search;
}) {
  const { locale } = await params;
  const { cursor = '' } = await (searchParams ||
    Promise.resolve({ cursor: '' }));

  // Parse the cursor using Paris TZ defaults; fall back to "now" if invalid
  let ym = parseCursor(cursor, 'Europe/Paris');

  // Extra safety: if someone crafts a year outside our supported range,
  // normalize to the current YearMonth before proceeding.
  if (!clampYear(ym.year)) {
    ym = nowYearMonthTZ('Europe/Paris');
  }

  // Canonical, zero-padded "YYYY-MM"
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
      {/* Header with month label and guarded prev/next links */}
      <header className="m-4 flex items-center justify-between">
        {hasPrev ? (
          <Link href={`/${locale}/calendar?cursor=${prev}`}>&larr; Prev</Link>
        ) : (
          <span className="text-stone-400 select-none">&larr; Prev</span>
        )}

        <h1 className="text-2xl">
          {headerDate.toLocaleString(locale, {
            month: 'long',
            year: 'numeric',
          })}
        </h1>

        {hasNext ? (
          <Link href={`/${locale}/calendar?cursor=${next}`}>Next &rarr;</Link>
        ) : (
          <span className="text-stone-400 select-none">Next &rarr;</span>
        )}
      </header>

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
