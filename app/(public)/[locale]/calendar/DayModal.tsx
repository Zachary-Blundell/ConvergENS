'use client';

import React from 'react';
import type { CalEvent } from '@/lib/cms/events';
import EventPill from './EventPill';
import { useTranslations } from 'next-intl';

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
  onEventClickAction,
  locale,
  zIndex = 60,
}: DayModalProps) {
  const t = useTranslations('CalendarPage');

  const resolvedLocale =
    locale || (typeof navigator !== 'undefined' ? navigator.language : 'fr-FR');
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
          <h2 className="text-lg ">
            {t('labels.eventsOn', { date: fmtDayLong(resolvedLocale, date) })}
          </h2>
          <button
            onClick={onCloseAction}
            className="rounded-md px-2 py-1 text-sm text-fg-primary hover:bg-highlight"
            aria-label={t('nav.close')}
          >
            {t('nav.close')}
          </button>
        </header>

        {sorted.length === 0 ? (
          <p className="mt-3 text-sm text-fg-primary">{t('labels.noEvents')}</p>
        ) : (
          <ul className="mt-3 space-y-2 max-h-[60vh] overflow-auto pr-1">
            {sorted.map((ev) => (
              <li key={String(ev.id)}>
                <EventPill
                  event={ev}
                  locale={resolvedLocale}
                  onClickAction={onEventClickAction}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
