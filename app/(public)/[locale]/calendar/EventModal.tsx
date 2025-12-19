'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { CalendarEventFlat } from '@/lib/cms/events.types';

export type EventModalProps = {
  event: CalendarEventFlat;
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
    if (Intl.DateTimeFormat.prototype.formatRange) {
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }).formatRange(a, b);
    }
  } catch { }
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
  const t = useTranslations('CalendarPage');

  const resolvedLocale =
    locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');

  const organisers = event.organisers ?? [];
  const fallbackName = t('collective.fallbackName');

  return (
    <div
      className="fixed inset-0 grid place-items-center p-4"
      style={{ zIndex }}
      onClick={onCloseAction}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl p-4 shadow-xl bg-surface-2 border-1 border-outline"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-3xl bg-surface-3 shadow-s p-1 px-2 rounded-lg">
              {event.title}
            </h3>

            <div className="mt-1 text-sm text-fg-primary">
              {event.all_day ? (
                <span>{t('event.allDay')}</span>
              ) : (
                <span className="text-xl">
                  {fmtDayLong(resolvedLocale, event.start_at)} ·{' '}
                  {fmtRange(resolvedLocale, event.start_at, event.end_at)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onCloseAction}
            className="shrink-0 rounded-md px-2 py-1 text-sm text-fg-primary hover:bg-highlight"
            aria-label={t('nav.close')}
          >
            {t('nav.close')}
          </button>
        </header>

        {event.location && (
          <div className="mt-3 text-sm text-fg-primary">
            <span className="font-medium">{t('event.locationLabel')}</span>
            {event.location}
            {event.location_address ? (
              <span className="opacity-70"> — {event.location_address}</span>
            ) : null}
          </div>
        )}

        {event.description && (
          <div className="prose prose-sm mt-3 max-w-none dark:prose-invert bg-surface-4 rounded-lg p-2 shadow-m">
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* Organisers */}
        {organisers.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-fg-muted mb-2">
              {t('event.organisersLabel', { defaultMessage: 'Organisers' })}
            </p>

            <div className="flex flex-wrap gap-2">
              {organisers.map((org) => {
                const color = org.color ?? '#64748b';
                const hasLogo = Boolean(org.logoUrl);
                const nameOrSlug = org.name ?? org.slug ?? fallbackName;

                return (
                  <div
                    key={org.id}
                    className="inline-flex items-center gap-2 rounded-full border border-outline bg-surface-3 px-2 py-1 text-sm text-fg-muted"
                  >
                    {hasLogo ? (
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-3">
                        <span
                          className="relative block h-6 w-6 overflow-hidden rounded-full"
                          style={{ boxShadow: `0 0 0 2px ${color}` }}
                        >
                          <Image
                            src={org.logoUrl!}
                            alt={t('collective.logoAlt', { name: nameOrSlug })}
                            fill
                            sizes="24px"
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

                    {org.slug ? (
                      <Link
                        href={`/organisations/${org.slug}`}
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
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
