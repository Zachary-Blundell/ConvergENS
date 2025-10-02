// app/[locale]/calendar/page.tsx
import Link from 'next/link';
import { monthBoundsParis } from '@/lib/cms/dates'; // your zone-safe bounds
import { notFound } from 'next/navigation';
import { getEventsForCalendar } from '@/lib/cms/events';
import CalendarGrid from './CalendarGrid';
import CalendarGridClient from './CalendarGridClient';

type Search = { y?: string; m?: string; collective?: string };

export default async function Page({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: Search;
}) {
  const { locale } = params;

  // Resolve year/month from searchParams (defaults to "today" in Europe/Paris)
  const now = new Date();
  const y = clampInt(searchParams.y, getUTCYearParis(now), 1970, 9999);
  const m = clampInt(searchParams.m, getUTCMonthParis(now), 1, 12);

  const baseUTCFirst = new Date(Date.UTC(y, m - 1, 1));
  const { start, end } = monthBoundsParis(baseUTCFirst);

  const collectiveId = searchParams.collective
    ? Number(searchParams.collective)
    : undefined;

  const events = await getEventsForCalendar(locale, {
    start,
    end,
  });

  if (!events) notFound();

  const { prev, next, label } = monthNav(y, m, locale);

  const days = buildGridDays(baseUTCFirst); // 6x7 grid

  return (
    <main className="flex flex-col gap-6 p-6">
      <header className="flex items-center justify-center">
        <div className="w-full flex items-center justify-between gap-4">
          <Link
            href={`/${locale}/calendar?y=${prev.y}&m=${prev.m}${collectiveId ? `&collective=${collectiveId}` : ''}`}
            className="rounded-xl px-3 py-2 ring-1 ring-gray-300 hover:bg-gray-50"
          >
            ← Prev
          </Link>
          <h1 className="text-xl">{label}</h1>
          <Link
            href={`/${locale}/calendar?y=${next.y}&m=${next.m}${collectiveId ? `&collective=${collectiveId}` : ''}`}
            className="rounded-xl px-3 py-2 ring-1 ring-gray-300 hover:bg-gray-50"
          >
            Next →
          </Link>
        </div>

        {/* <FiltersBar ... /> */}
      </header>

      {/* <CalendarGrid */}
      {/*   days={days} */}
      {/*   events={events} */}
      {/*   visibleMonthUTCFirst={baseUTCFirst} */}
      {/* /> */}
      <CalendarGridClient
        daysISO={daysISO}
        events={eventsWire}
        visibleMonthUTCFirstISO={monthUTCFirst.toISOString()}
        locale={locale}
        timeZone="Europe/Paris"
        maxPerDay={4} // show first 4; "+N more" if over
      />
    </main>
  );
}

/* ---------- helpers (server-safe) ---------- */

// Show a 6x7 grid starting Monday. All calculations in UTC.
function buildGridDays(monthUTCFirst: Date) {
  const firstDow = (monthUTCFirst.getUTCDay() + 6) % 7; // 0=Mon ... 6=Sun
  const gridStart = addDaysUTC(monthUTCFirst, -firstDow);
  return Array.from({ length: 42 }, (_, i) => addDaysUTC(gridStart, i));
}

function addDaysUTC(d: Date, n: number) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n),
  );
}

function sameUTCDate(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function overlapsDayUTC(event: { start_at: Date; end_at: Date }, day: Date) {
  const dayStart = day;
  const dayEnd = addDaysUTC(day, 1);
  return event.start_at < dayEnd && event.end_at > dayStart;
}

function isSameMonthUTC(d: Date, monthUTCFirst: Date) {
  return (
    d.getUTCFullYear() === monthUTCFirst.getUTCFullYear() &&
    d.getUTCMonth() === monthUTCFirst.getUTCMonth()
  );
}

function clampInt(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  const n = Number(raw);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

// For defaulting y/m using Paris month while keeping UTC-safe math
function getUTCYearParis(now: Date) {
  // Using now's UTC year is fine because we only need a default; exact Paris year edge at NYE is rare.
  return now.getUTCFullYear();
}
function getUTCMonthParis(now: Date) {
  return now.getUTCMonth() + 1; // 1..12
}

function monthNav(y: number, m: number, locale: string) {
  const date = new Date(Date.UTC(y, m - 1, 1));
  //capitalize month in locale-aware way
  const label = date
    .toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    })
    .replace(/^\p{Lower}/u, (c) => c.toUpperCase());
  const prevDate = new Date(Date.UTC(y, m - 2, 1));
  const nextDate = new Date(Date.UTC(y, m, 1));
  return {
    label,
    prev: { y: prevDate.getUTCFullYear(), m: prevDate.getUTCMonth() + 1 },
    next: { y: nextDate.getUTCFullYear(), m: nextDate.getUTCMonth() + 1 },
  };
}
//eof
// 'use client';
//
// import { useMemo, useState } from 'react';
// import useSWR from 'swr';
// import { useParams } from 'next/navigation';
// import { monthBoundsParis } from '@/lib/cms/dates';
//
// const fetcher = async (url: string) => {
//   const res = await fetch(url, { cache: 'no-store' });
//   if (!res.ok) {
//     const text = await res.text().catch(() => '');
//     throw new Error(`Fetch ${res.status} ${res.statusText}: ${text}`);
//   }
//   return res.json();
// };
//
// function makeMonthKey(d: Date) {
//   return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
// }
//
// export default function CalendarMonth() {
//   const params = useParams<{ locale?: string }>();
//   const locale = params?.locale ?? 'fr-FR'; // guard just in case
//
//   // Keep cursor in UTC to be consistent with bounds conversions
//   const [cursor, setCursor] = useState(() => {
//     const now = new Date();
//     return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
//   });
//
//   const nextMonth = () =>
//     setCursor(
//       (prev) =>
//         new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)),
//     );
//
//   const prevMonth = () =>
//     setCursor(
//       (prev) =>
//         new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)),
//     );
//
//   const { start, end } = useMemo(() => monthBoundsParis(cursor), [cursor]);
//
//   const url = useMemo(() => {
//     const qs = new URLSearchParams({
//       locale,
//       start: start.toISOString(),
//       end: end.toISOString(),
//     });
//     return `/api/events?${qs.toString()}`;
//   }, [locale, start, end]);
//
//   const {
//     data: events,
//     isLoading,
//     error,
//   } = useSWR(url, fetcher, {
//     // Avoid undefined on first render so your map()s don't crash
//     fallbackData: [],
//     revalidateOnFocus: true,
//     dedupingInterval: 1000,
//   });
//
//   console.log('fetch URL', url);
//   console.log('events for', makeMonthKey(cursor), events);
//   if (error) console.error('events error', error);
//
//   // render your calendar using `events` (an array, never undefined)
//   return null;
// }
// // 'use client';
// //
// // import { useMemo, useState } from 'react';
// // import useSWR from 'swr';
// // import { useParams } from 'next/navigation';
// // import { monthBoundsParis } from '@/lib/cms/dates';
// //
// // const fetcher = (url: string) => fetch(url).then((r) => r.json());
// //
// // function monthKey(d: Date) {
// //   return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
// // }
// //
// // export default function CalendarMonth() {
// //   const { locale } = useParams<{ locale: string }>();
// //
// //   // init cursor at 00:00 UTC on the first of the *UTC* month
// //   const [cursor, setCursor] = useState(() => {
// //     const now = new Date();
// //     return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
// //     // when moving months, stay in UTC
// //     const nextMonth = () =>
// //       setCursor(
// //         (prev) =>
// //           new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)),
// //       );
// //
// //     const prevMonth = () =>
// //       setCursor(
// //         (prev) =>
// //           new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)),
// //       );
// //   });
// //
// //   const { start, end } = useMemo(() => monthBoundsParis(cursor), [cursor]);
// //
// //   const url = `/api/events?locale=${locale}&start=${start.toISOString()}&end=${end.toISOString()}`;
// //
// //   // String key is simplest. (Array key would be useSWR([url, monthKey(cursor)], (url) => fetcher(url)))
// //   const {
// //     data: events,
// //     isLoading,
// //     error,
// //   } = useSWR(url, fetcher, {
// //     // Optional SWR tuning:
// //     revalidateOnFocus: true,
// //     dedupingInterval: 1000,
// //   });
// //
// //   console.log('events for month', monthKey(cursor), events);
// //
// //   // ...render your calendar here (prev/next month buttons update `cursor`)
// //   return null;
// // }
// //eof
// // import { getEventsForCalendar } from '@/lib/cms/events-back';
// //
// // export default async function CalendarPage() {
// //   const events = await getEventsForCalendar('fr-FR');
// //   console.log('here are the events from getEventsForCalendar', events);
// //
// //   return <div>Calendar Page</div>;
// // }
//
// // 'use client';
// // import { monthBoundsParis } from '@/lib/cms/events';
// // import { useState } from 'react';
// // import useSWR from 'swr';
// //
// // function monthKey(d: Date) {
// //   return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
// // }
// //
// // async function fetcher(url: string) {
// //   return fetch(url).then((r) => r.json());
// // }
// //
// // export default async function CalendarMonth({
// //   params,
// // }: {
// //   params: Promise<{ locale: string }>;
// // }) {
// //   const { locale } = await params;
// //
// //   const [cursor, setCursor] = useState(() => {
// //     const d = new Date();
// //     d.setDate(1);
// //     d.setHours(0, 0, 0, 0);
// //     return d;
// //   });
// //
// //   const { start, end } = monthBoundsParis(cursor); // or monthBoundsParis(cursor)
// //
// //   const { data: events, isLoading } = useSWR(
// //     [
// //       `/api/events?locale=${locale}&start=${start.toISOString()}&end=${end.toISOString()}`,
// //       monthKey(cursor),
// //     ],
// //     ([url]) => fetcher(url),
// //     { keepPreviousData: true },
// //   );
// //
// //   console.log('events for month', monthKey(cursor), events);
// // }
