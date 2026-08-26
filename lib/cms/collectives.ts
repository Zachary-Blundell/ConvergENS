// lib/cms/collectives.ts
import { readItem, readItems } from '@directus/sdk';
import { directus } from '../directus';
import {
  buildAssetUrl,
  DEFAULT_LOCALE,
  ItemsQuery,
  pickTranslation,
  PLACEHOLDER_LOGO,
} from './utils';
import { ArticleRaw, CardArticleFlat, EventArticleInfoRaw } from './articles.types';
import { flattenArticlesForCards } from './articles.utils';
import { Id } from './types';
import { ArticleEventInfoRaw, EventRaw } from './events.types';

export type OrganisationTranslation = {
  languages_code: string;
  summary?: string | null;
  description?: string | null;
};

export type TypeTranslation = {
  languages_code: string;
  name?: string | null;
  plural?: string | null;
  adjective?: string | null;
};

export type AssetRef = {
  id: string;
  width?: number | null;
  height?: number | null;
};

export type ArticleTranslation = {
  languages_code: string;
  title?: string | null;
};

export type OrganisationRaw = {
  id: number;
  name?: string | null;
  slug?: string | null;
  color?: string | null;
  type?: {
    id?: string;
    translations?: TypeTranslation[];
  } | null;
  logo?: { id: string; width?: number | null; height?: number | null } | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  translations?: OrganisationTranslation[];
  socials?: { platform: string; url: string }[];
  articles?: ArticleRaw[];
  events?: EventRaw[];
};

export type OrganisationFlat = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  type: {
    id: string | null;
    name: string | null;
    plural?: string | null;
    adjective?: string | null;
  };
  logoUrl: string; // placeholder fallback handled
  logoWidth: number | null;
  logoHeight: number | null;
  // Optional contact (only populated if requested in fields)
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  // Localized fields (flattened)
  summary?: string | null;
  description?: string | null;
  socials?: { platform: string; url: string }[];
  articles: Array<CardArticleFlat>;
  events: Array<ArticleEventInfoRaw>;
};

export type OrganisationUI = {
  id: string | number;
  name: string;
  color: string;
};

export type OrganisationBadge = {
  id: string | number;
  slug: string;
  name: string;
  logoUrl: string; // placeholder fallback handled
  logoWidth: number | null;
  logoHeight: number | null;
  color: string;
};

export async function getOrganisationsRaw(
  req?: ItemsQuery,
): Promise<OrganisationRaw[]> {
  if (!req) {
    // if req is not defined return everything
    req = {
      fields: ['*'],
    };
  }

  const rawOrganisations = await directus.request<any[]>(
    readItems('organisation', req),
  );
  return rawOrganisations as OrganisationRaw[];
}

/* Organisation cards */
export type OrganisationCard = {
  //flattened
  id: string;
  name: string;
  slug: string;
  color: string | null;
  type: {
    id: string | null;
    name: string | null;
    plural?: string | null;
    adjective?: string | null;
  };
  logoUrl: string; // placeholder fallback handled
  logoWidth: number | null;
  logoHeight: number | null;
  // Optional contact (only populated if requested in fields)
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  // Localized fields (flattened)
  summary?: string | null;
  description?: string | null;
  socials?: { platform: string; url: string }[];
};

export async function getOrganisationCards(
  locale: string,
): Promise<OrganisationCard[]> {
  // we get everything but the body text
  const req: ItemsQuery = {
    fields: [
      'id',
      'name',
      'slug',
      'color',
      'type',
      { logo: ['id', 'width', 'height'] },
      {
        type: [
          'id',
          { translations: ['languages_code', 'name', 'plural', 'adjective'] },
        ],
      },
      { translations: ['summary'] },
    ],
    sort: ['name'],
    filter: { status: { _eq: 'published' } },
    deep: {
      translations: {
        _filter: {
          languages_code: {
            _eq: locale,
          },
        },
      },
      types: {
        translations: {
          _filter: { languages_code: { _in: [locale] } },
        },
      },
    },
  };

  const rows = await getOrganisationsRaw(req);

  return rows.map((i: OrganisationRaw): OrganisationCard => {
    const organisationTr = pickTranslation(i.translations, locale);
    const typeTr = pickTranslation(i.type.translations, locale);
    const result: OrganisationCard = {
      id: String(i.id),
      name: String(i.name ?? null),
      slug: String(i.slug ?? null),
      color: i.color ?? null,
      type: {
        id: i.type?.id ?? null,
        name: typeTr?.name ?? null,
        plural: typeTr?.plural ?? null,
        adjective: typeTr?.adjective ?? null,
      },
      logoUrl: buildAssetUrl(i.logo) ?? PLACEHOLDER_LOGO,
      logoWidth: Number(i.logo.width),
      logoHeight: Number(i.logo.height),
      email: i.email ?? null,
      phone: i.phone ?? null,
      website: i.website ?? null,
      summary: organisationTr?.summary ?? null,
      description: organisationTr?.description ?? null,
      socials: i.socials ?? [],
    };
    return result;
  });
}

export async function getOrganisationBadges(): Promise<OrganisationBadge[]> {
  const req: ItemsQuery = {
    fields: [
      'id',
      'slug',
      { logo: ['id', 'width', 'height'] },
      'name',
      'color',
    ],
    filter: { status: { _eq: 'published' } },
  };
  try {
    const rows = await getOrganisationsRaw(req);
    return rows.map((i) => {
      const result = {
        id: String(i.id),
        name: String(i.name ?? ''),
        slug: String(i.slug ?? ''),
        color: i.color ?? null,
        logoUrl: buildAssetUrl(i.logo) ?? PLACEHOLDER_LOGO,
        logoWidth: i.logo?.width ?? null,
        logoHeight: i.logo?.height ?? null,
      };
      return result;
    });
  } catch (err: unknown) {
    const e = err as any;

    console.warn('Error fetching homepage:', err);
    const code =
      e?.errors?.[0]?.extensions?.code || e?.response?.status || e?.status;

    // Common patterns: 404, or Directus code like "RECORD_NOT_FOUND"
    const isNotFound =
      code === 404 ||
      code === 'RECORD_NOT_FOUND' ||
      e?.message?.toLowerCase?.().includes('not found');

    if (isNotFound) return null;

    return [];
  }
}

export async function getAllOrganisationsForUI(): Promise<OrganisationUI[]> {
  const req: ItemsQuery = {
    fields: ['id', 'name', 'color'],
  };

  const rawOrganisation = await directus.request<OrganisationRaw[]>(
    readItems('organisation', req),
  );

  return rawOrganisation.map((c) => {
    return {
      id: c.id,
      name: c.name,
      color: c.color,
    };
  });
}

export async function getOrganisationBySlug(
  slug: string,
  locale = DEFAULT_LOCALE,
): Promise<OrganisationFlat | null> {
  // 1) Find the primary key by slug (and published)
  const found = await directus.request<{ id: string }[]>(
    readItems('organisation', {
      fields: ['id'],
      filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
      limit: 1,
    }),
  );
  const id = found?.[0]?.id;
  if (!id) return null;

  // 2) Fetch the single item by primary key (+ related articles)
  const c = await directus.request<OrganisationRaw>(
    readItem('organisation', id, {
      fields: [
        'id',
        'name',
        'slug',
        'color',
        { logo: ['id', 'width', 'height'] },
        {
          type: [
            'id',
            { translations: ['languages_code', 'name', 'plural', 'adjective'] },
          ],
        },
        { translations: ['languages_code', 'summary', 'description'] },
        'email',
        'phone',
        'website',
        { socials: ['type', 'url'] },
        // O2M alias pulling articles tied to this organisation
        {
          articles: [
            'id',
            'status',
            'published_at',
            { cover: ['id', 'width', 'height'] },
            { translations: ['languages_code', 'title'] },
          ],
        },
      ],
      deep: {
        translations: { _filter: { languages_code: { _in: [locale] } } },

        // 🔧 was "types" before; should be "type"
        type: {
          translations: { _filter: { languages_code: { _in: [locale] } } },
        },

        // control the related articles you pull
        articles: {
          _filter: { status: { _eq: 'published' } },
          _sort: ['-published_at'],
          _limit: 12,
          translations: { _filter: { languages_code: { _in: [locale] } } },
          organisation: { fields: ['id', 'slug', 'name'] },
        },
      },
    }),
  );

  // Flatten
  const tr = pickTranslation(c.translations, locale);
  const typeTr = pickTranslation(c.type?.translations, locale);

  return {
    id: String(c.id),
    name: String(c.name ?? ''),
    slug: String(c.slug ?? ''),
    summary: tr?.summary ?? null,
    description: tr?.description ?? null,
    color: c.color ?? null,
    type: {
      id: c.type?.id ?? null,
      name: c.type ? typeTr?.name : null,
      plural: c.type ? typeTr?.plural : null,
      adjective: c.type ? typeTr?.adjective : null,
    },
    logoUrl: buildAssetUrl(c.logo) ?? PLACEHOLDER_LOGO,
    logoWidth: c.logo?.width ?? null,
    logoHeight: c.logo?.height ?? null,
    email: c.email ?? null,
    phone: c.phone ?? null,
    website: c.website ?? null,
    socials: c.socials ?? [],

    articles: flattenArticlesForCards(c.articles, locale),
    events: c.events ?? [],
  };
}
