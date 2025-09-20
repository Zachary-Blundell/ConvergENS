import { readItems } from "@directus/sdk";
import { directus } from "../directus";
import {
  DEFAULT_LOCALE,
  ItemsQuery,
  pickTranslation,
  withRequiredFields,
} from "./utils";

export type ArticleTranslation = {
  languages_code: string;
  title?: string | null;
  slug?: string | null;
  body?: string | null;
};

export type ArticleRaw = {
  id: string | number;
  status?: string | null;
  association?: { id: string | number } | null;
  translations?: ArticleTranslation[];
};

export type ArticleFlat = {
  id: string;
  status: string | null;
  associationId: string | null;
  title: string;
  slug: string;
  body: string | null;
};

export async function getArticlesRaw(
  locale: string,
  options: ItemsQuery = {},
): Promise<ArticleRaw[]> {
  const deep = {
    translations: {
      _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
      _limit: 2, // still an array; we’ll pick best in code
    },
    ...(options.deep || {}),
  };

  const fields = withRequiredFields(options.fields as any[] | undefined);

  const rows = await directus.request<any[]>(
    readItems("articles", {
      ...options,
      fields,
      deep,
    }),
  );

  return rows as ArticleRaw[];
}

/**
 * Convenience: returns locale-flattened articles.
 * By default returns whatever `options` asks for; typical list views
 * might add `filter: { status: { _eq: "published" } }` in `options`.
 */
export async function getArticles(
  locale: string,
  options: ItemsQuery = {},
): Promise<ArticleFlat[]> {
  const rows = await getArticlesRaw(locale, options);
  return rows.map((i) => {
    const tr = pickTranslation(i.translations, locale);
    return {
      id: String(i.id),
      status: i.status ?? null,
      associationId: i.association ? String(i.association.id) : null,
      title: String(tr?.title ?? ""),
      slug: String(tr?.slug ?? ""),
      body: tr?.body ?? null,
    };
  });
}

/**
 * Fetch a single published article by its translated slug (locale-aware).
 * If the exact locale isn’t present, falls back to DEFAULT_LOCALE, then first.
 */
export async function getArticle(
  slug: string,
  locale = DEFAULT_LOCALE,
): Promise<ArticleFlat | null> {
  const rows = await directus.request<ArticleRaw[]>(
    readItems("articles", {
      fields: withRequiredFields(["id", "status", { association: ["id"] }]),
      // Match any translation with this slug; deep clause below narrows returned translations
      filter: {
        status: { _eq: "published" },
        translations: { slug: { _eq: slug } },
      },
      limit: 1,
      deep: {
        translations: {
          _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
          _limit: 2,
        },
      },
    }),
  );

  const i = rows[0];
  if (!i) return null;

  const tr = pickTranslation(i.translations, locale);

  return {
    id: String(i.id),
    status: i.status ?? null,
    associationId: i.association ? String(i.association.id) : null,
    title: String(tr?.title ?? ""),
    slug: String(tr?.slug ?? ""),
    body: tr?.body ?? null,
  };
}
