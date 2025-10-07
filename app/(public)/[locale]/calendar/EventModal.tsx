'use client';

import React from 'react';
import type { CalEvent } from '@/lib/cms/events';
import Image from 'next/image';
import Link from 'next/link';

export type EventModalProps = {
  event: CalEvent;
  onCloseAction: () => void;
  locale?: string;
  zIndex?: number;
};

function fmtTime(locale: string, d: Date) {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
function fmtRange(locale: string, a: Date, b: Date) {
  try {
    // @ts-ignore
    if (Intl.DateTimeFormat.prototype.formatRange) {
      // @ts-ignore
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }).formatRange(a, b);
    }
  } catch {}
  return `${fmtTime(locale, a)} – ${fmtTime(locale, b)}`;
}
function fmtDayLong(locale: string, d: Date) {
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function EventModal({
  event,
  onCloseAction,
  locale,
  zIndex = 60,
}: EventModalProps) {
  const resolvedLocale =
    locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  const color = event.collective?.color || '#64748b';

  const hasLogo = Boolean(event.collective?.logoUrl);
  const nameOrSlug =
    event.collective?.name ?? event.collective?.slug ?? 'Collective';

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
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-3xl leading-tight">{event.title}</h3>
            <div className="mt-1 text-sm text-fg-primary dark:text-stone-300">
              {event.all_day ? (
                <span>All day</span>
              ) : (
                <span className="text-xl">
                  {fmtDayLong(resolvedLocale, event.start_at)} ·{' '}
                  {fmtRange(resolvedLocale, event.start_at, event.end_at)}
                </span>
              )}
            </div>

            {/* Collective chip (like article cards) */}
            {(event.collective?.name || event.collective?.slug) && (
              <div className="mt-2 inline-flex items-center gap-2 text-sm text-fg-primary dark:text-stone-300">
                {hasLogo ? (
                  // Avatar with colored ring + offset background
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                    <span
                      className="relative block h-7 w-7 overflow-hidden rounded-full"
                      style={{ boxShadow: `0 0 0 2px ${color}` }} // colored ring
                    >
                      <Image
                        src={event.collective!.logoUrl!}
                        alt={event.collective!.name ?? 'Collective logo'}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>
                  </span>
                ) : (
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                )}

                {event.collective?.slug ? (
                  <Link
                    href={`/collectives/${event.collective.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="hover:underline relative z-10"
                  >
                    {nameOrSlug}
                  </Link>
                ) : (
                  <span>{nameOrSlug}</span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onCloseAction}
            className="shrink-0 rounded-md px-2 py-1 text-sm text-fg-primary hover:bg-blue-500"
          >
            Close
          </button>
        </header>

        {event.location && (
          <div className="mt-3 text-sm text-fg-primary">
            <span className="font-medium">Location: </span>
            {event.location}
            {event.location_address ? (
              <span className="opacity-70"> — {event.location_address}</span>
            ) : null}
          </div>
        )}

        {event.description && (
          <div className="prose prose-sm mt-3 max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
