'use client';

import React from 'react';
import type { CalEvent } from '@/lib/cms/events';
import EventPill from './EventPill';

export type DayModalProps = {
  date: Date;
  events: CalEvent[];
  onCloseAction: () => void;
  onEventClickAction?: (ev: CalEvent) => void;
  locale?: string;
  zIndex?: number;
};

function fmtDayLong(locale: string, d: Date) {
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function compareEvents(a: CalEvent, b: CalEvent) {
  if (a.all_day !== b.all_day) return a.all_day ? -1 : 1; // all-day first
  return a.start_at.getTime() - b.start_at.getTime();
}

export default function DayModal({
  date,
  events,
  onCloseAction,
  onEventClickAction: onEventClick,
  locale,
  zIndex = 60,
}: DayModalProps) {
  const resolvedLocale =
    locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  const sorted = [...(events || [])].sort(compareEvents);

  return (
    <div
      className="fixed inset-0 grid place-items-center p-4"
      style={{ zIndex }}
      onClick={onCloseAction}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4">
          <h2 className="text-lg ">{fmtDayLong(resolvedLocale, date)}</h2>
          <button
            onClick={onCloseAction}
            className="rounded-md px-2 py-1 text-sm text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            Close
          </button>
        </header>

        {sorted.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">No events.</p>
        ) : (
          <ul className="mt-3 space-y-2 max-h-[60vh] overflow-auto pr-1">
            {sorted.map((ev) => (
              <li key={String(ev.id)}>
                <EventPill
                  event={ev}
                  locale={resolvedLocale}
                  onClickAction={onEventClick}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
