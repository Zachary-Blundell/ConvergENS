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

export type CollectiveTranslation = {
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

export type CollectiveRaw = {
  id: string | number;
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
  translations?: CollectiveTranslation[];
  socials?: { platform: string; url: string }[];
};

export type CollectiveFlat = {
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

export type CollectiveUI = {
  id: string | number;
  name: string;
  color: string;
};

export type CollectiveBadge = {
  id: string | number;
  slug: string;
  name: string;
  logoUrl: string; // placeholder fallback handled
  logoWidth: number | null;
  logoHeight: number | null;
  color: string;
};

export async function getCollectivesRaw(
  req?: ItemsQuery,
): Promise<CollectiveRaw[]> {
  if (!req) {
    // if req is not defined return everything
    req = {
      fields: ['*'],
    };
  }

  const rawCollectives = await directus.request<any[]>(
    readItems('collectives', req),
  );
  return rawCollectives as CollectiveRaw[];
}

/* Collective cards */
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

  const rows = await getCollectivesRaw(req);

  return rows.map((i: CollectiveRaw): OrganisationCard => {
    const collectiveTr = pickTranslation(i.translations, locale);
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
      summary: collectiveTr?.summary ?? null,
      description: collectiveTr?.description ?? null,
      socials: i.socials ?? [],
    };
    console.log(result);
    return result;
  });
}

// export async function getCollectivesRaw(
//   options: ItemsQuery = {},
//   locale?: string | null,
// ): Promise<CollectiveRaw[]> {
//   const includeTranslations = Boolean(locale);
//
//
//   const req: any = {
//     ...options,
//     filter: {
//       status: { _eq: "published" },
//     },
//   };
//
//   if (includeTranslations) {
//     req.deep = {
//       translations: {
//         _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
//         _limit: 2,
//       },
//       ...(options.deep || {}),
//     };
//   } else if (options.deep) {
//     // If caller I call my own deep object, respect it.
//     req.deep = options.deep;
//   }
//
//   const rows = await directus.request<any[]>(readItems("collectives", req));
//   return rows as CollectiveRaw[];
// }

// export async function getCollectives(
//   options: ItemsQuery = {},
//   locale?: string,
// ): Promise<CollectiveFlat[]> {
//   const rows = await getCollectivesRaw(options, locale);
//   return rows.map((i) => {
//     const tr = pickTranslation(i.translations, locale);
//     const result = {
//       id: String(i.id),
//       name: String(i.name ?? ""),
//       slug: String(i.slug ?? ""),
//       color: i.color ?? null,
//       logoUrl: buildAssetUrl(i.logo) ?? PLACEHOLDER_LOGO,
//       logoWidth: i.logo?.width ?? null,
//       logoHeight: i.logo?.height ?? null,
//       email: (i as any).email ?? null,
//       phone: (i as any).phone ?? null,
//       website: (i as any).website ?? null,
//       summary: tr?.summary ?? null,
//       description: tr?.description ?? null,
//     };
//     return result;
//   });
// }
//
export async function getCollectiveBadges(): Promise<CollectiveBadge[]> {
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
    const rows = await getCollectivesRaw(req);
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
    //   return {
    //       id: null,
    //       name: null,
    //       slug: null,
    //       color:  null,
    //       logoUrl:  PLACEHOLDER_LOGO,
    //       logoWidth:  null,
    //       logoHeight: null,
    // }
  }
}

export async function getAllCollectivesForUI(): Promise<CollectiveUI[]> {
  const req: ItemsQuery = {
    fields: ['id', 'name', 'color'],
  };

  const rawCollective = await directus.request<CollectiveRaw[]>(
    readItems('collectives', req),
  );

  return rawCollective.map((c) => {
    return {
      id: c.id,
      name: c.name,
      color: c.color,
    };
  });
}

export async function getCollectiveBySlug(
  slug: string,
  locale = DEFAULT_LOCALE,
): Promise<CollectiveFlat | null> {
  // 1) Find the primary key by slug (and published)
  const found = await directus.request<{ id: string }[]>(
    readItems('collectives', {
      fields: ['id'],
      filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
      limit: 1,
    }),
  );
  const id = found?.[0]?.id;
  if (!id) return null;

  // 2) Fetch the single item by primary key
  const c = await directus.request<CollectiveRaw>(
    readItem('collectives', id, {
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
        // { socials: ['platform', 'url'] },
      ],
      deep: {
        translations: {
          _filter: { languages_code: { _in: [locale] } },
        },
        types: {
          translations: {
            _filter: { languages_code: { _in: [locale] } },
          },
        },
      },
    }),
  );

  // Flatten
  const tr = pickTranslation(c.translations, locale);
  const typeTr = pickTranslation(c.type.translations, locale);

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
  };
}
