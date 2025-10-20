'use client';

import React from 'react';
import type { CalEvent } from '@/lib/cms/events';

export type EventPillProps = {
  // Source event to render.
  event: CalEvent;
  // Optional locale for time formatting (falls back to browser).
  locale?: string;
  // Required click handler (e.g., to open an event modal).
  onClickAction: (ev: CalEvent) => void;
  // Extra classes for spacing when embedding.
  className?: string;
};

export default function EventPill({
  event,
  locale,
  onClickAction,
}: EventPillProps) {
  // Resolve display locale (SSR-safe fallback).
  const resolvedLocale =
    locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');

  // Left color strip uses the collective color; fallback is Tailwind slate-500 hex.
  const color = event.collective?.color || '#64748b';

  return (
    <button
      type="button"
      onClick={(e) => {
        // Prevent day-cell click from firing when the pill is clicked.
        e.stopPropagation();
        onClickAction(event);
      }}
      className="w-full truncate rounded-md px-2 py-1 pl-3 text-left text-xs bg-surface-4 border-1 dark:border-0 cursor-pointer"
      // 4px inset strip inside the left edge; respects border radius.
      style={{ boxShadow: `inset 4px 0 0 0 ${color}` }}
      // Native tooltip on hover.
      title={event.title}
      // Screen-reader label: includes time when not all-day.
      aria-label={
        event.all_day
          ? `${event.title} (All day)`
          : `${new Intl.DateTimeFormat(resolvedLocale, {
              hour: '2-digit',
              minute: '2-digit',
            }).format(event.start_at)} · ${event.title}`
      }
    >
      {event.all_day ? (
        // All-day: prefix with label, then title.
        <>
          <span className="">All day · </span>
          {event.title}
        </>
      ) : (
        // Timed: show start time, then title.
        <>
          <span className="opacity-70">
            {new Intl.DateTimeFormat(resolvedLocale, {
              hour: '2-digit',
              minute: '2-digit',
            }).format(event.start_at)}{' '}
            ·{' '}
          </span>
          {event.title}
        </>
      )}
    </button>
  );
}
