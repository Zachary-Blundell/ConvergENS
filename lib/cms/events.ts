import { readItems } from '@directus/sdk';
import { directus } from '../directus';
import {
  buildAssetUrl,
  ItemsQuery,
  pickTranslation,
  PLACEHOLDER_LOGO,
} from './utils';

export type EventTranslation = {
  languages_code: string;
  title?: string | null;
  description?: string | null;
};

export type EventRaw = {
  id: string | number;
  translations?: EventTranslation[];
  start_at?: string; //iso string
  end_at?: string; //iso string
  all_day?: boolean;
  location?: string | null;
  location_address?: string | null;
  collective?: {
    id: string | number | null;
    name?: string | null;
    slug?: string | null;
    color?: string | null;
    logo?: { id: string; width?: number | null; height?: number | null } | null;
  } | null;
};

export async function getEventsRaw(req?: ItemsQuery): Promise<EventRaw[]> {
  if (!req) {
    // if req is not defined return everything helpfull for testing
    req = {
      fields: ['*'],
    };
  }

  const rawEvents = await directus.request<any[]>(readItems('events', req));
  return rawEvents as EventRaw[];
}

/* Events */
export type CalEvent = {
  //flattened
  id: string | number;
  title: string;
  description: string | null;
  start_at: Date;
  end_at: Date;
  all_day: boolean;
  location: string | null;
  location_address: string | null;
  // collective
  collective: {
    id: string | number | null;
    name: string | null;
    slug: string | null;
    color: string | null;
    logoUrl: string | null;
    logoWidth: number | null;
    logoHeight: number | null;
  };
};

export async function getEventsForCalendar(
  locale: string,
  opts: { start: Date; end: Date },
): Promise<CalEvent[]> {
  const startISO = opts.start.toISOString();
  const endISO = opts.end.toISOString();

  const req: ItemsQuery = {
    fields: [
      'id',
      'start_at',
      'end_at',
      'all_day',
      'location',
      'location_address',
      {
        collective: [
          'id',
          'name',
          'slug',
          'color',
          { logo: ['id', 'width', 'height'] },
        ],
      },
      { translations: ['languages_code', 'title', 'description'] },
    ],
    filter: {
      _and: [
        { start_at: { _lt: endISO } }, // starts before window ends
        { end_at: { _gt: startISO } }, // ends after window starts
      ],
    },
    deep: {
      translations: {
        _filter: {
          languages_code: {
            _eq: locale,
          },
        },
      },
    },
    // sort: ['all_day', 'start_at', 'end_at'], // all_day first (false<true), then by time
  };

  const rawEvents = await getEventsRaw(req);

  return rawEvents.map((i: EventRaw): CalEvent => {
    const tr = pickTranslation(i.translations, locale);
    const result: CalEvent = {
      id: String(i.id),
      title: String(tr?.title ?? null),
      description: tr?.description ?? null,
      start_at: new Date(i.start_at),
      end_at: new Date(i.end_at),
      all_day: i.all_day,
      location: i.location,
      location_address: i.location_address,
      collective: {
        id: i.collective.id,
        name: i.collective.name,
        slug: i.collective.slug,
        color: i.collective.color,
        logoUrl: buildAssetUrl(i.collective.logo.id) ?? PLACEHOLDER_LOGO,
        logoWidth: i.collective.logo.width,
        logoHeight: i.collective.logo.height,
      },
    };
    return result;
  });
}
