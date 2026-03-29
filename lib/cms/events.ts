import { readItems } from '@directus/sdk';
import { directus } from '../directus';
import {
  buildAssetUrl,
  DEFAULT_LOCALE,
  ItemsQuery,
  pickTranslation,
  PLACEHOLDER_LOGO,
} from './utils';
import { CalendarEventFlat, EventRaw } from './events.types';
import { isObject } from '../utils';

export async function getEventsRaw(req?: ItemsQuery): Promise<EventRaw[]> {
  if (!req) {
    // if req is not defined return everything helpful for testing
    req = {
      fields: ['*'],
    };
  }

  const rawEvents = await directus.request<any[]>(readItems('events', req));
  return rawEvents as EventRaw[];
}

// events for a month on the calendar (minimal fields)
export async function getEventsForCalendar(
  locale: string,
  opts: { start: Date; end: Date },
): Promise<any[]> {
  const startISO = opts.start.toISOString();
  const endISO = opts.end.toISOString();
  const fields = [
    "id",
    "start_at",
    "end_at",
    "all_day",
    "location",
    "location_address",

    // M2M: organisers (junction row id + expanded organisation)
    {
      organisers: [
        "id",
        {
          organisation_id: [
            "id",
            "status",
            "name",
            "color",
            "slug",
            { logo: ["id", "width", "height"] },
          ],
        },
      ],
    },

    // O2M: event translations (only what UI needs)
    { translations: ["id", "languages_code", "title", "description"] },

    // M2M: articles linked to event (junction ids + expanded article translations)
    {
      articles: [
        "id",
        "events_id",
        {
          articles_id: [
            "id",
            "status",
            { translations: ["id", "languages_code", "title"] },
          ],
        },
      ],
    },
  ];

  const deep = {
    translations: {
      _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
      _limit: 2,
    },

    articles: {
      articles_id: {
        translations: {
          _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
          _limit: 2,
        },
      },
    },
  };

  const filter = {
    _and: [
      { status: { _eq: "published" } },
      { start_at: { _gte: startISO } }, // starts on/after window start
      { end_at: { _lte: endISO } },     // ends on/before window end
    ],
  };

  const sort = ["all_day", "start_at", "end_at"];

  const req: ItemsQuery = {
    fields,
    deep,
    filter,
    sort,
  };

  const rawEvents = await getEventsRaw(req);
  return flattenEventsForCalendar(rawEvents, locale);
}

// Flatten one EventRaw -> CalendarEventFlat
export function flattenEventForCalendar(
  raw: EventRaw,
  locale: string,
): CalendarEventFlat {
  const tr = pickTranslation(raw.translations, locale);

  // organisers: junction rows -> organisations
  const organisers =
    raw.organisers?.flatMap((row) => {
      const c = row.organisation_id;

      if (!isObject(c)) return []; // should not happen but just incase

      const logoId = c.logo?.id ?? null;
      return [
        {
          id: String(c.id),
          name: c.name ?? null,
          slug: c.slug ?? null,
          color: c.color ?? null,
          logoUrl: logoId ? buildAssetUrl(logoId) : PLACEHOLDER_LOGO,
          logoWidth: c.logo?.width ?? null,
          logoHeight: c.logo?.height ?? null,
        },
      ];
    }) ?? [];

  // articles: junction rows -> {id,title}
  const articles =
    raw.articles?.flatMap((row) => {
      const a = row.articles_id;
      if (!isObject(a)) return [];

      const atr = pickTranslation(a.translations, locale);
      return [
        {
          id: String(a.id),
          title: atr?.title ?? null,
        },
      ];
    }) ?? [];

  return {
    id: String(raw.id),
    title: String(tr?.title ?? ""),
    description: tr?.description ?? null,

    start_at: new Date(raw.start_at ?? ""),
    end_at: new Date(raw.end_at ?? ""),
    all_day: Boolean(raw.all_day),

    location: raw.location ?? null,
    location_address: raw.location_address ?? null,

    organisers: organisers,
    articles: articles,
  };
}

// Flatten a list EventRaw[] -> CalendarEventFlat[]
export function flattenEventsForCalendar(
  rows: EventRaw[],
  locale: string,
): CalendarEventFlat[] {
  return rows.map((r) => flattenEventForCalendar(r, locale));
}
