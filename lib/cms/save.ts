// lib/cms/articles.ts
import { readItems } from "@directus/sdk";
import { directus } from "../directus";
import {
  buildAssetUrl,
  DEFAULT_LOCALE,
  ItemsQuery,
  pickTranslation,
  PLACEHOLDER_LOGO,
} from "./utils";
import { log } from "console";

/**
 * Ensure minimal fields are always requested if nothing is provided.
 * Card needs: cover, title (localized), tag (localized), association (basic)
 */

function withRequiredMinFields(fields: any[] | undefined): any[] {
  const base = fields ?? [
    "id",
    "published_at",
    { cover: ["id", "width", "height"] },
    {
      association: [
        "id",
        "name",
        "slug",
        "color",
        { logo: ["id", "width", "height"] },
      ],
    },
    { tag: ["id", "color", { translations: ["languages_code", "name"] }] },
    { translations: ["languages_code", "title", "body"] },
  ];
  return [...base];
}

export type ArticleTranslation = {
  languages_code: string;
  title?: string | null;
  body?: string | null; // body in schema but not needed for the card grid
};

export type TagTranslation = {
  languages_code: string;
  name?: string | null;
};

export type ArticleRaw = {
  id: string;
  published_at?: string | null;
  cover?: { id: string; width?: number | null; height?: number | null } | null;
  association?: {
    id: string;
    name?: string | null;
    slug?: string | null;
    color?: string | null;
    logo?: { id: string; width?: number | null; height?: number | null } | null;
  } | null;
  tag?: {
    id: string;
    color?: string | null;
    translations?: TagTranslation[];
  } | null;
  translations?: ArticleTranslation[];
};

export type ArticleFlat = {
  //flattened
  id: string;
  title: string;
  body?: string;
  // cover
  coverUrl: string | null;
  coverWidth: number | null;
  coverHeight: number | null;
  // tag
  tag: {
    id: string | null;
    name: string | null; // localized
    color: string | null;
  };
  // association
  association: {
    id: string | null;
    name: string | null;
    slug: string | null;
    color: string | null;
    logoUrl: string | null;
    logoWidth: number | null;
    logoHeight: number | null;
  };
  published_at?: string | null;
};

export type ArticleCard = {
  //flattened
  id: string;
  title: string;
  // cover
  coverUrl: string | null;
  coverWidth: number | null;
  coverHeight: number | null;
  // tag
  tag: {
    id: string | null;
    name: string | null; // localized
    color: string | null;
  };
  // association
  association: {
    id: string | null;
    name: string | null;
    slug: string | null;
    color: string | null;
    logoUrl: string | null;
    logoWidth: number | null;
    logoHeight: number | null;
  };
  published_at?: string | null;
};

export async function getArticlesRaw(
  options: ItemsQuery = {},
  locale: string | null,
): Promise<ArticleRaw[]> {
  const fields = withRequiredMinFields(options.fields as any[] | undefined);

  // base: only published
  const base = { status: { _eq: "published" } } as NonNullable<
    ItemsQuery["filter"]
  >;

  // if caller passed a filter, AND it with base; else just base
  const filter: ItemsQuery["filter"] = options.filter
    ? { _and: [base, options.filter] }
    : base;

  const req: any = {
    ...options,
    fields,
    filter,
  };

  req.deep = {
    translations: {
      _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
      _limit: 2,
    },
    tags: {
      translations: {
        _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
        _limit: 2,
      },
    },
  };

  req.aggregate = { count: "*" };
  log("here is the req: ", req);
  const rows = await directus.request<any[]>(readItems("articles", req));
  log("here are the new rows: ", rows);
  return rows as ArticleRaw[];
}

export async function getAllArticles(locale?: string): Promise<ArticleFlat[]> {
  const rows = await getArticlesRaw(
    {
      fields: [
        "id",
        "published_at",
        { cover: ["id", "width", "height"] },
        {
          association: [
            "id",
            "name",
            "slug",
            "color",
            { logo: ["id", "width", "height"] },
          ],
        },
        { tag: ["id", "color", { translations: ["languages_code", "name"] }] },
        { translations: ["languages_code", "title", "body"] },
      ],
    },
    locale,
  );

  return rows.map((i) => {
    const articleTr = pickTranslation(i.translations, locale);
    const tagTr = pickTranslation(i.tag.translations, locale);
    const result = {
      id: String(i.id),
      title: String(articleTr?.title ?? null),
      body: String(articleTr?.body ?? null),

      coverUrl: buildAssetUrl(i.cover.id) ?? PLACEHOLDER_LOGO,
      coverWidth: Number(i.cover.width),
      coverHeight: Number(i.cover.height),
      tag: {
        id: i.tag.id,
        color: i.tag.color,
        name: tagTr.name,
      },
      association: {
        id: i.association.id,
        name: i.association.name,
        slug: i.association.slug,
        color: i.association.color,
        logoUrl: buildAssetUrl(i.association.logo.id) ?? PLACEHOLDER_LOGO,
        logoWidth: i.association.logo.width,
        logoHeight: i.association.logo.height,
      },
      published_at: String(i.published_at),
    };
    return result;
  });
}

export async function getArticleCards(
  page: number,
  locale: string,
): Promise<ArticleFlat[]> {
  // we get everything but the body text
  const rows = await getArticlesRaw(
    {
      fields: [
        "id",
        "published_at",
        { cover: ["id", "width", "height"] },
        {
          association: [
            "id",
            "name",
            "slug",
            "color",
            { logo: ["id", "width", "height"] },
          ],
        },
        { tag: ["id", "color", { translations: ["languages_code", "name"] }] },
        { translations: ["languages_code", "title"] },
      ],
      page: page,
      limit: 3,
      // filter:{
      //   "tag ": { _in: tags }
      // }
    },
    locale,
  );

  return rows.map((i) => {
    const articleTr = pickTranslation(i.translations, locale);
    const tagTr = pickTranslation(i.tag.translations, locale);
    const result = {
      id: String(i.id),
      title: String(articleTr?.title ?? null),

      coverUrl: buildAssetUrl(i.cover.id) ?? PLACEHOLDER_LOGO,
      coverWidth: Number(i.cover.width),
      coverHeight: Number(i.cover.height),
      tag: {
        id: i.tag.id,
        color: i.tag.color,
        name: tagTr.name,
      },
      association: {
        id: i.association.id,
        name: i.association.name,
        slug: i.association.slug,
        color: i.association.color,
        logoUrl: buildAssetUrl(i.association.logo.id) ?? PLACEHOLDER_LOGO,
        logoWidth: i.association.logo.width,
        logoHeight: i.association.logo.height,
      },
      published_at: String(i.published_at),
    };
    return result;
  });
}

// export type GetArticlesParams = {
//   page?: number; // 1-based
//   limit?: number; // default 24
//   search?: string | null;
//   associationId?: string | number | null;
//   tagIds?: (string | number)[] | string | number | null; // supports single or array
//   sort?: string | string[]; // default: "-published_at"
//   options?: ItemsQuery;
// };

// export type PaginatedArticles = {
//   items: ArticleCard[];
//   page: number;
//   limit: number;
//   total: number | null; // null if not requested
//   hasMore: boolean | null; // derived if total available
// };

// function normalizeToArray<T>(value: T | T[] | null | undefined): T[] | null {
//   if (value == null) return null;
//   return Array.isArray(value) ? value : [value];
// }

/**
 * Build Directus filter for All Articles page.
 * - Only published by default
 * - Search in localized title (O2M translations)
 * - Filter by association (M2O id)
 * - Filter by tag(s) (M2O id)
 */
// function buildArticlesFilter(
//   {
//     search,
//     associationId,
//     tagIds,
//   }: Pick<GetArticlesParams, "search" | "associationId" | "tagIds">,
//   locale?: string | null,
// ) {
//   const tags = normalizeToArray(tagIds);
//
//   const filter: any = {
//     status: { _eq: "published" },
//   };
//
//   if (associationId) {
//     filter.association = { _eq: associationId };
//   }
//
//   if (tags && tags.length > 0) {
//     filter.tag = { _in: tags };
//   }
//
//   // Search by (localized) title using translations O2M
//   if (search && search.trim().length > 0) {
//     // We restrict the search to the desired locale (and fallback)
//     // via deep filter, but for correctness on filtering we also use _some
//     filter.translations = {
//       _some: {
//         title: { _icontains: search.trim() },
//         ...(locale
//           ? { languages_code: { _in: [locale, DEFAULT_LOCALE] } }
//           : {}),
//       },
//     };
//   }
//
//   return filter;
// }

// export async function getArticlesRaw(
//   params: GetArticlesParams = {},
//   locale?: string | null,
// ): Promise<{
//   rows: ArticleRaw[];
//   total: number | null;
//   page: number;
//   limit: number;
// }> {
//   const {
//     page = 1,
//     limit = 24,
//     search = null,
//     associationId = null,
//     tagIds = null,
//     sort = "-published_at",
//     options = {},
//   } = params;
//
//   const includeTranslations = Boolean(locale);
//   const fields = withRequiredMinFields(options.fields as any[] | undefined);
//
//   const req: any = {
//     ...options,
//     fields,
//     sort,
//     limit,
//     offset: (Math.max(1, page) - 1) * limit,
//     filter: buildArticlesFilter({ search, associationId, tagIds }, locale),
//     meta: ["filter_count"], // to compute pagination
//   };
//
//   // Deep localization for article & tag translations
//   if (includeTranslations) {
//     req.deep = {
//       ...(options.deep || {}),
//       translations: {
//         _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
//         _limit: 2,
//       },
// tag: {
//   translations: {
//     _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
//     _limit: 2,
//   },
// },
//     };
//   } else if (options.deep) {
//     req.deep = options.deep;
//   }
//
//   const resp = await directus.request<any>(readItems("articles", req));
//   const rows: ArticleRaw[] = (Array.isArray(resp) ? resp : resp?.data) || [];
//   // When meta is requested, SDK returns { data, meta }
//   const total: number | null = resp?.meta?.filter_count ?? null;
//
//   return { rows, total, page, limit };
// }
//
// export async function getArticlesForIndex(
//   params: GetArticlesParams = {},
//   locale?: string | null,
// ): Promise<PaginatedArticles> {
//   const { rows, total, page, limit } = await getArticlesRaw(params, locale);
//
//   const items: ArticleCard[] = rows.map((i) => {
//     const tr = pickTranslation(i.translations, locale);
//     const tagTr = pickTranslation(i.tag?.translations, locale);
//
//     return {
//       id: String(i.id),
//       title: String(tr?.title ?? ""),
//       // cover
//       coverUrl: buildAssetUrl(i.cover) ?? null,
//       coverWidth: i.cover?.width ?? null,
//       coverHeight: i.cover?.height ?? null,
//       // tag (single)
//       tag: {
//         id: i.tag ? String(i.tag.id) : null,
//         name: tagTr?.name ?? null,
//         color: i.tag?.color ?? null,
//       },
//       // association (basic badge/link info)
//       association: {
//         id: i.association ? String(i.association.id) : null,
//         name: i.association?.name ?? null,
//         slug: i.association?.slug ?? null,
//         color: i.association?.color ?? null,
//         logoUrl: buildAssetUrl(i.association?.logo) ?? null,
//         logoWidth: i.association?.logo?.width ?? null,
//         logoHeight: i.association?.logo?.height ?? null,
//       },
//       published_at: i.published_at ?? null,
//     };
//   });
//
//   const hasMore = total == null ? null : page * limit < total;
//
//   return { items, page, limit, total, hasMore };
// }
//
// // import { readItem, readItems } from "@directus/sdk";
// // import { directus } from "../directus";
// // import {
// //   buildAssetUrl,
// //   DEFAULT_LOCALE,
// //   ItemsQuery,
// //   pickTranslation,
// //   PLACEHOLDER_LOGO,
// // } from "./utils";
// // import { log } from "console";
// //
// // /* Ensure required minium fields are always requested if nothing is provided*/
// // function withRequiredMinFields(fields: any[] | undefined): any[] {
// //   const base = fields ?? [
// //     "id",
// //     "status",
// //     { translations: ["languages_code", "title", "slug"] },
// //   ];
// //   return [...base];
// // }
// //
// // // function withRequiredMinFields(fields: any[] | undefined): any[] {
// // //   const base = fields ?? [
// // //     "id",
// // //     "status",
// // //     { translations: [ "languages_code", "title", "slug", "body"] },
// // //   ];
// // //   return [...base];
// // // }
// //
// // export type ArticleTranslation = {
// //   languages_code: string;
// //   title?: string | null;
// //   slug?: string | null;
// //   body?: string | null;
// // };
// //
// // export type ArticleRaw = {
// //   id: string;
// //   status?: string | null;
// //   translations?: ArticleTranslation[];
// // };
// //
// // export type ArticleFlat = {
// //   id: string;
// //   status?: string | null;
// //
// //   title: string;
// //   slug: string;
// //   body: string | null;
// // };
// //
// // export async function getArticlesRaw(
// //   options: ItemsQuery = {},
// //   locale?: string | null,
// // ): Promise<ArticleRaw[]> {
// //   const fields = withRequiredMinFields(options.fields as any[] | undefined);
// //
// //   const req: any = {
// //     ...options,
// //     fields,
// //   };
// //
// //   req.deep = {
// //     translations: {
// //       _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
// //       _limit: 2,
// //     },
// //     ...(options.deep || {}),
// //   };
// //
// //   const rows = await directus.request<any[]>(readItems("articles", req));
// //   return rows as ArticleRaw[];
// // }
// //
// // export async function getArticles(
// //   options: ItemsQuery = {},
// //   locale?: string,
// // ): Promise<ArticleFlat[]> {
// //   const rows = await getArticlesRaw(options, locale);
// //   return rows.map((i) => {
// //     const tr = pickTranslation(i.translations, locale);
// //     const result = {
// //       id: String(i.id),
// //       status: String(i.status),
// //       title: tr?.title ?? null,
// //       slug: tr?.slug ?? null,
// //       body: tr?.body ?? null,
// //     };
// //     return result;
// //   });
// // }
// //
// // export async function getArticleCard(locale: string): Promise<ArticleFlat[]> {
// //   const rows = await getArticlesRaw({
// //     //eof
// //   });
// //   return rows.map((i) => {
// //     const tr = pickTranslation(i.translations, locale);
// //     const result = {
// //       id: String(i.id),
// //       status: String(i.status),
// //       title: tr?.title ?? null,
// //       slug: tr?.slug ?? null,
// //     };
// //     return result;
// //   });
// // }
// //
// // export async function getArticleBySlug(
// //   slug: string,
// //   locale = DEFAULT_LOCALE,
// // ): Promise<ArticleFlat | null> {
// //   // 1) Find the primary key by slug (and published)
// //   const found = await directus.request<{ id: string }[]>(
// //     readItems("articles", {
// //       fields: ["id"],
// //       filter: { slug: { _eq: slug }, status: { _eq: "published" } },
// //       limit: 1,
// //     }),
// //   );
// //   const id = found?.[0]?.id;
// //   if (!id) return null;
// //
// //   // 2) Fetch the single item by primary key
// //   const i = await directus.request<ArticleRaw>(
// //     readItem("articles", id, {
// //       fields: [
// //         "id",
// //         "status",
// //         "name",
// //         "slug",
// //         "color",
// //         "email",
// //         "phone",
// //         "website",
// //         { logo: ["id", "width", "height"] },
// //         { translations: ["languages_code", "summary", "description"] },
// //         { socials: ["platform", "url"] },
// //       ],
// //       deep: {
// //         translations: {
// //           _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
// //           _limit: 2,
// //         },
// //       },
// //     }),
// //   );
// //
// //   // (optional safety) if status changed between calls, you can bail out:
// //   if (i?.status !== "published") return null;
// //
// //   // Flatten
// //   const tr = pickTranslation(i.translations, locale);
// //
// //   return {
// //     id: String(i.id),
// //     status: i.status ?? null,
// //     name: String(i.name ?? ""),
// //     slug: String(i.slug ?? ""),
// //     summary: tr?.summary ?? null,
// //     description: tr?.description ?? null,
// //     color: i.color ?? null,
// //     logoUrl: buildAssetUrl(i.logo) ?? PLACEHOLDER_LOGO,
// //     logoWidth: i.logo?.width ?? null,
// //     logoHeight: i.logo?.height ?? null,
// //     email: i.email ?? null,
// //     phone: i.phone ?? null,
// //     website: i.website ?? null,
// //     socials: i.socials ?? [],
// //   };
// // }
