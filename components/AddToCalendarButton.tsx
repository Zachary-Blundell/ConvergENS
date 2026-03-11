'use client';

import React from 'react';
import { google, outlook, office365, yahoo, ics } from 'calendar-link';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';

export type AddToCalendarEvent = {
  uid?: string;
  title: string;
  description?: string | null;
  start: Date;
  end: Date;
  allDay?: boolean | null;
  location?: string | null;
  url?: string | null;
};

type CalendarTarget = 'google' | 'outlook' | 'office365' | 'yahoo' | 'ics';

function safeFilename(input: string) {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'event'
  );
}

function buildCalendarLinkEvent(e: AddToCalendarEvent) {
  const startIso = e.start.toISOString();
  const endIso = e.end.toISOString();

  const location = e.location?.trim() || undefined;

  const url =
    e.url?.trim() ||
    (typeof window !== 'undefined' ? window.location.href : undefined);

  return {
    uid: e.uid,
    title: e.title,
    description: e.description ?? undefined,
    start: startIso,
    end: endIso,
    allDay: Boolean(e.allDay),
    location,
    url,
  };
}

function makeHref(
  target: CalendarTarget,
  eventObj: ReturnType<typeof buildCalendarLinkEvent>,
) {
  switch (target) {
    case 'google':
      return google(eventObj);
    case 'outlook':
      return outlook(eventObj);
    case 'office365':
      return office365(eventObj);
    case 'yahoo':
      return yahoo(eventObj);
    case 'ics':
      return ics(eventObj);
    default:
      return '#';
  }
}

export type AddToCalendarButtonProps = {
  event: AddToCalendarEvent;

  label?: string;
  items?: Array<{ key: CalendarTarget; label: string }>;

  className?: string;
  menuClassName?: string;

  align?: 'left' | 'right';
};

export function AddToCalendarButton({
  event,
  label,
  items,
  className = '',
  menuClassName = '',
  align = 'left',
}: AddToCalendarButtonProps) {
  const t = useTranslations('Components.AddToCalendar');

  const defaultItems = React.useMemo<Array<{ key: CalendarTarget; label: string }>>(
    () => [
      { key: 'google', label: t('google') },
      { key: 'outlook', label: t('outlook') },
      { key: 'office365', label: t('office365') },
      { key: 'yahoo', label: t('yahoo') },
      { key: 'ics', label: t('ics') },
    ],
    [t],
  );

  const resolvedItems = items ?? defaultItems;

  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const eventObj = React.useMemo(() => buildCalendarLinkEvent(event), [event]);
  const filename = React.useMemo(
    () => `${safeFilename(event.title)}.ics`,
    [event.title],
  );

  React.useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!open) return;
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`}>
      <Button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-md px-3 py-2 text-sm border border-outline text-fg-primary bg-highlight hover:bg-highlight-400 hover:shadow-l hover:scale-110 md:text-md "
      >
        <div>
          {label ?? t('button')}
        </div>
      </Button>

      {open ? (
        <div
          role="menu"
          className={[
            'absolute z-50 mt-2 min-w-[220px] rounded-xl border border-outline bg-surface-2 shadow-xl p-1',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName,
          ].join(' ')}
        >
          {resolvedItems.map((item) => {
            const href = makeHref(item.key, eventObj);
            const isIcs = item.key === 'ics';

            return (
              <a
                key={item.key}
                role="menuitem"
                href={href}
                target={isIcs ? undefined : '_blank'}
                rel={isIcs ? undefined : 'noreferrer'}
                download={isIcs ? filename : undefined}
                className="block rounded-lg px-3 py-2 text-sm text-fg-primary hover:bg-highlight"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
