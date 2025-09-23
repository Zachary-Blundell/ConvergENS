// lib/cms/articles.ts
import { readItem, readItems } from "@directus/sdk";
import { directus } from "../directus";
import {
  buildAssetUrl,
  DEFAULT_LOCALE,
  ItemsQuery,
  pickTranslation,
  PLACEHOLDER_LOGO,
} from "./utils";
import { log } from "console";
import { TagTranslation } from "./tags";

export const perPage: number = 12;

export type ArticleTranslation = {
  languages_code: string;
  title?: string | null;
  body?: string | null; // body in schema but not needed for the card grid
};

export type ArticleRaw = {
  id?: string;
  published_at?: string | null;
  cover?: { id: string; width?: number | null; height?: number | null } | null;
  collective?: {
    id?: string;
    name?: string | null;
    slug?: string | null;
    color?: string | null;
    logo?: { id: string; width?: number | null; height?: number | null } | null;
  } | null;
  tag?: {
    id?: string;
    color?: string | null;
    translations?: TagTranslation[];
  } | null;
  translations?: ArticleTranslation[];
};

export type ArticleFlat = {
  //flattened
  id: string;
  title: string;
  body: string;
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
  // collective
  collective: {
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

export async function getArticlesRaw(req?: ItemsQuery): Promise<ArticleRaw[]> {
  if (!req) {
    // if req is not defined return everything
    req = {
      fields: ["*"],
    };
  }

  log("here is the req from getArticlesRaw: ", req);
  const rawArticles = await directus.request<any[]>(readItems("articles", req));
  log("here are the raw Articles form getArticlesRaw: ", rawArticles);
  return rawArticles as ArticleRaw[];
}

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
  // collective
  collective: {
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

export async function getArticleCount(): Promise<number> {
  const req: ItemsQuery = {
    aggregate: { count: "*" },
  };
  const count: Array<{ count: string }> = await directus.request<any[]>(
    readItems("articles", req),
  );

  return parseInt(count[0].count);
}

export async function getArticleCards(
  locale: string,
  page: number,
  tagId?: string,
): Promise<ArticleCard[]> {
  // we get everything but the body text
  const req: ItemsQuery = {
    fields: [
      "id",
      "published_at",
      { cover: ["id", "width", "height"] },
      {
        collective: [
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
    filter: {
      tag: { id: { _eq: tagId } },
    },
    deep: {
      translations: {
        _filter: {
          languages_code: {
            _eq: locale,
          },
        },
      },
      tags: {
        translations: {
          _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
          _limit: 2,
        },
      },
    },
    sort: ["-date_created"],
    page,
    limit: perPage,
  };

  const rows = await getArticlesRaw(req);

  return rows.map((i: ArticleRaw): ArticleCard => {
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
      collective: {
        id: i.collective.id,
        name: i.collective.name,
        slug: i.collective.slug,
        color: i.collective.color,
        logoUrl: buildAssetUrl(i.collective.logo.id) ?? PLACEHOLDER_LOGO,
        logoWidth: i.collective.logo.width,
        logoHeight: i.collective.logo.height,
      },
      published_at: String(i.published_at),
    };
    log(result);
    return result;
  });
}

export async function getArticle(
  articleId: string,
  locale: string,
): Promise<ArticleFlat> {
  // we get everything but the body text
  const req: ItemsQuery = {
    fields: [
      "id",
      "published_at",
      { cover: ["id", "width", "height"] },
      {
        collective: [
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
    deep: {
      translations: {
        _filter: {
          languages_code: {
            _eq: locale,
          },
        },
      },
      tags: {
        translations: {
          _filter: { languages_code: { _in: [locale] } },
        },
      },
    },
  };
  try {
    const articleRaw: ArticleRaw = await directus.request<ArticleRaw>(
      readItem("articles", articleId, req),
    );

    if (!articleRaw) return null;

    const articleTr = pickTranslation(articleRaw.translations, locale);
    const tagTr = articleRaw.tag
      ? pickTranslation(articleRaw.tag.translations, locale)
      : null;

    const coverId = articleRaw.cover?.id ?? null;
    const coverUrl = coverId ? buildAssetUrl(coverId) : PLACEHOLDER_LOGO;

    const logoId = articleRaw.collective?.logo?.id ?? null;
    const logoUrl = logoId ? buildAssetUrl(logoId) : PLACEHOLDER_LOGO;

    const article: ArticleFlat = {
      id: String(articleRaw.id),
      title: String(articleTr?.title ?? ""),
      body: String(articleTr?.body ?? ""),

      coverUrl,
      coverWidth: Number(articleRaw.cover?.width ?? 0),
      coverHeight: Number(articleRaw.cover?.height ?? 0),

      tag: {
        id: articleRaw.tag?.id ?? null,
        name: tagTr?.name ?? null,
        color: articleRaw.tag?.color ?? null,
      },

      collective: {
        id: articleRaw.collective?.id ?? null,
        name: articleRaw.collective?.name ?? "",
        slug: articleRaw.collective?.slug ?? "",
        color: articleRaw.collective?.color ?? null,
        logoUrl,
        logoWidth: Number(articleRaw.collective?.logo?.width ?? 0),
        logoHeight: Number(articleRaw.collective?.logo?.height ?? 0),
      },

      published_at: String(articleRaw.published_at ?? ""),
    };

    return article;
  } catch (err: any) {
    // Detect Directus "record not found" (SDK/REST variants)
    const code =
      err?.errors?.[0]?.extensions?.code ||
      err?.response?.status ||
      err?.status;

    // Common patterns: 404, or Directus code like "RECORD_NOT_FOUND"
    const isNotFound =
      code === 404 ||
      code === "RECORD_NOT_FOUND" ||
      err?.message?.toLowerCase?.().includes("not found");

    if (isNotFound) return null;

    return null;
  }
}
