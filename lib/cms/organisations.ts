// lib/cms/organisations.ts
import { readItem, readItems } from '@directus/sdk';
import { directus } from '../directus';
import {
  buildAssetUrl,
  DEFAULT_LOCALE,
  ItemsQuery,
  pickTranslation,
  PLACEHOLDER_LOGO,
} from './utils';
import { ArticleRaw, CardArticleFlat } from './articles.types';
import { OrganisationBadge, OrganisationFlat, OrganisationRaw, OrganisationUI } from './organisations.types';
import { Id } from './types';

export async function getOrganisationsRaw(
  req?: ItemsQuery,
): Promise<OrganisationRaw[]> {
  if (!req) {
    // if req is not defined return everything
    req = {
      fields: [
        { socials: ['*'], }],
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
  id: Id;
  name: string;
  slug: string;
  color: string | null;
  type: {
    id: Id | null;
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
  socials?: { type: string; url: string }[];
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
      summary: organisationTr?.summary ?? null,
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
    sort: ['type.translations.name', 'name'],
    filter: { status: { _eq: 'published' } },

    deep: {
      type: {
        translations: {
          _filter: { languages_code: { _in: ['fr-FR'] } },
        },
      },
    },
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

        {
          socials: [
            'id', // junction id (optional)
            'social_types',
            'URL',
          ],
        },

        {
          articles: [
            'id', // junction id
            {
              articles_id: [
                'id',
                'status',
                'published_at',
                { cover: ['id', 'width', 'height', 'description'] },
                {
                  tag: [
                    'id',
                    'color',
                    { translations: ['languages_code', 'name'] },
                  ],
                },
                {
                  editors: [
                    'id',
                    {
                      organisations_id: [
                        'id',
                        'name',
                        'slug',
                        'color',
                        { logo: ['id', 'width', 'height'] },
                      ],
                    },
                  ],
                },
                { translations: ['languages_code', 'title'] },
              ],
            },
          ],
        },
      ],
      deep: {
        translations: {
          _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
          _limit: 2,
        },

        type: {
          translations: {
            _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
            _limit: 2,
          },
        },

        articles: {
          _sort: ['-articles_id.published_at'],
          _limit: 12,
          articles_id: {
            _filter: { status: { _eq: 'published' } },
            translations: {
              _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
              _limit: 2,
            },
            tag: {
              translations: {
                _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
                _limit: 2,
              },
            },
          },
        },
      },
    }),
  );

  // Flatten
  const tr = pickTranslation(c.translations, locale);
  const typeTr = pickTranslation(c.type?.translations, locale);

  const socialsRaw = c.socials
    ? Array.isArray(c.socials)
      ? c.socials
      : [c.socials]
    : [];


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

    socials: socialsRaw
      .map((s: any) => {
        const type = s?.social_types ?? null;
        const url = s?.URL ?? null;
        if (!type || !url) return null;
        return { type: String(type), url: String(url) };
      })
      .filter(Boolean) as { type: string; url: string }[],

    articles: (c.articles ?? []).flatMap(
      (row: { id: number | string; articles_id?: ArticleRaw | null }) => {
        const a = row.articles_id;
        if (!a) return [];

        return [
          {
            id: String(a.id),
            title: pickTranslation(a.translations, locale)?.title ?? '',
            coverUrl: a.cover?.id ? buildAssetUrl(a.cover.id) : PLACEHOLDER_LOGO,
            coverWidth: a.cover?.width ?? null,
            coverHeight: a.cover?.height ?? null,
            coverDescription: a.cover?.description ?? null,
            tag: a.tag
              ? {
                id: a.tag.id,
                name: pickTranslation(a.tag.translations, locale)?.name ?? '',
                color: a.tag.color ?? null,
              }
              : null,
            editors: [],
            published_at: new Date(a.published_at as string),
          },
        ];
      },
    ),
  };
}
