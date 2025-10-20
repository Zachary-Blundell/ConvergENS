'use client';

import React, { useMemo, useState } from 'react';
import type { CalEvent } from '@/lib/cms/events';
import EventPill from './EventPill';
import EventModal from './EventModal';
import DayModal from './DayModal';
import { addDays, startOfGrid } from '@/lib/date/cursor';

export type CalendarMonthProps = {
  // Month cursor in "YYYY-MM" form (e.g., "2025-10").
  cursor: string;
  // BCP-47 locale (e.g., "en-US", "fr-FR"). Defaults to runtime/browser locale.
  locale?: string;
  // Start weeks on Monday (EU style). Default: true.
  startOnMonday?: boolean;
  // Events rendered as pills.
  events?: CalEvent[];
  // Max pills shown per day before "+N more". Default: 4.
  maxPills?: number;
  // Extra CSS classes for the root.
  className?: string;
};

// Parse "YYYY-MM" into { year, month } (month is 1-based).
function parseCursor(cursor: string): { year: number; month: number } {
  const m = cursor?.match(/^(\d{4})-(\d{2}|\d)$/);
  if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]);
    if (
      Number.isFinite(year) &&
      Number.isFinite(month) &&
      year >= 2000 &&
      year <= 3000 &&
      month >= 1 &&
      month <= 12
    )
      return { year, month };
  }
  // Fallback to current month if invalid.
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

const toDate = (y: number, m1: number, d: number) => new Date(y, m1, d);

// Compare only Y/M/D.
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Build localized weekday short labels, honoring Monday/Sunday week starts.
// Uses a fixed reference week where 2021-08-01 was a Sunday.
function weekdayLabels(locale: string, startOnMonday: boolean): string[] {
  const base = new Date(2021, 7, 1); // Aug 1, 2021 (Sunday)
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i + (startOnMonday ? 1 : 0));
    labels.push(fmt.format(d));
  }
  return labels;
}

// Normalize a Date to local start-of-day.
function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Format Date as "YYYY-MM-DD".
function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Group events by each day they cover (inclusive).
// Multi-day events appear on every covered day.
// A small guard avoids infinite loops on bad data.
function bucketEventsByDay(events: CalEvent[]): Map<string, CalEvent[]> {
  const map = new Map<string, CalEvent[]>();
  for (const ev of events || []) {
    const start = startOfDay(ev.start_at);
    const end = startOfDay(ev.end_at);
    let cur = new Date(start);
    let guard = 0;
    while (cur.getTime() <= end.getTime() && guard < 60) {
      const key = ymd(cur);
      const arr = map.get(key);
      if (arr) arr.push(ev);
      else map.set(key, [ev]);
      cur = addDays(cur, 1);
      guard++;
    }
  }
  return map;
}

// CalendarMonth: 6x7 month grid with event pills and modals.
export default function CalendarMonth({
  cursor,
  locale,
  startOnMonday = true,
  events = [],
  className,
  maxPills = 4,
}: CalendarMonthProps) {
  const { year, month } = parseCursor(cursor);
  const first = toDate(year, month - 1, 1);
  const gridStart = startOfGrid(first, startOnMonday);
  const today = new Date();

  const labels = weekdayLabels(
    locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US'),
    startOnMonday,
  );

  // Precompute per-day buckets so rendering stays cheap.
  const buckets = useMemo(() => bucketEventsByDay(events), [events]);

  const [openEvent, setOpenEvent] = useState<CalEvent | null>(null);
  const [openDay, setOpenDay] = useState<Date | null>(null);

  function handleDayClick(date: Date) {
    setOpenDay(date);
  }

  // Always render 42 cells (6 weeks) to cover any month layout.
  const cells: Date[] = Array.from({ length: 42 }, (_, i) =>
    addDays(gridStart, i),
  );

  const monthIndex = month - 1;

  return (
    <div className={`w-full select-none${className ? ` ${className}` : ''}`}>
      {/* Weekday header */}
      <div className="grid grid-cols-7 text-xs uppercase tracking-wide text-fg-muted">
        {labels.map((label) => (
          <div key={label} className="py-2 text-center font-medium">
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1 rounded-xl m-3 p-2 bg-surface-2 overflow-hidden ">
        {cells.map((date) => {
          const inMonth = date.getMonth() === monthIndex;
          const isToday = sameDay(date, today);

          const base = 'aspect-square bg-surface-3 p-2 text-sm ';
          const muted = inMonth
            ? 'text-fg-primary'
            : 'text-fg-muted opacity-60';
          const ring = isToday ? 'ring-1 ring-highlight/60' : '';

          const key = ymd(date);
          const dayEvents = buckets.get(key) || [];
          const visible = dayEvents.slice(0, Math.max(0, maxPills));
          const hiddenCount = Math.max(0, dayEvents.length - visible.length);

          return (
            <div
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              key={date.toISOString()}
              onClick={() => handleDayClick(date)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDayClick(date);
                }
              }}
              className={`${base} ${muted} ${ring} rounded-md hover:bg-surface-4 transition flex flex-col`}
              aria-label={date.toDateString()}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                    isToday ? 'bg-highlight text-white' : ''
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Event pills (up to maxPills) */}
              {dayEvents.length > 0 && (
                <div className="mt-1 flex-1 overflow-hidden">
                  <ul className="space-y-1">
                    {visible.map((ev) => (
                      <li key={String(ev.id)}>
                        <EventPill
                          event={ev}
                          locale={locale}
                          onClickAction={(e) => setOpenEvent(e)}
                        />
                      </li>
                    ))}
                    {hiddenCount > 0 && (
                      <li>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDay(date);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenDay(date);
                            }
                          }}
                          className="w-full truncate rounded-md bg-stone-50 px-2 py-1 text-left text-xs text-stone-600  cursor-pointer"
                        >
                          +{hiddenCount} more
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day and Event modals */}
      {openDay && (
        <DayModal
          date={openDay}
          events={buckets.get(ymd(openDay)) || []}
          locale={locale}
          onCloseAction={() => setOpenDay(null)}
          onEventClickAction={(ev) => setOpenEvent(ev)}
        />
      )}
      {openEvent && (
        <EventModal
          event={openEvent}
          locale={locale}
          onCloseAction={() => setOpenEvent(null)}
        />
      )}
    </div>
  );
}
