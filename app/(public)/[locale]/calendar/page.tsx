// app/(public)/[locale]/calendar/page.tsx
// ConvergENS Calendar-page

import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  parseCursor,
  formatCursor,
  shiftMonth,
  firstOfMonth,
  startOfGrid,
  addDays,
} from '@/lib/date/cursor';
import CalendarMonth from './CalendarMonth';
import { getEventsForCalendar } from '@/lib/cms/events';

export default async function Page({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { locale } = params;

  // Parse with Paris defaulting
  const ym = parseCursor(searchParams?.cursor, 'Europe/Paris');
  const canonical = formatCursor(ym);

  const firstDay = firstOfMonth(ym);
  const startDate = startOfGrid(firstDay, true);
  const endDate = addDays(startDate, 42); // 6 weeks later

  const monthsEvents = await getEventsForCalendar(locale, {
    start: startDate,
    end: endDate,
  });

  if (searchParams?.cursor !== canonical) {
    redirect(`/${locale}/calendar?cursor=${canonical}`);
  }

  const prev = formatCursor(shiftMonth(ym, -1));
  const next = formatCursor(shiftMonth(ym, +1));
  const date = firstOfMonth(ym);

  return (
    <main className="space-y-4">
      <header className="m-4 flex items-center justify-between">
        <Link href={`/${locale}/calendar?cursor=${prev}`}>&larr; Prev</Link>
        <h1 className="text-2xl">
          {date.toLocaleString(locale, { month: 'long', year: 'numeric' })}
        </h1>
        <Link href={`/${locale}/calendar?cursor=${next}`}>Next &rarr;</Link>
      </header>

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
