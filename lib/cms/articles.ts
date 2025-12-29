// lib/cms/articles.ts
import { readItems, aggregate } from '@directus/sdk';
import { directus } from '../directus';
import { buildAssetUrl, DEFAULT_LOCALE, pickTranslation, PLACEHOLDER_LOGO, type ItemsQuery } from './utils';
import type { ArticleEventRowRaw, ArticleRaw, CardArticleFlat } from './articles.types';
import { isObject, objectLogger } from '../utils';

export const perPageConstant = 12;

// Package data with some extra info for ui
type Paged<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

interface ArticleCardsParameters {
  locale: string;
  page: number;
  tagId?: number;
  collectiveId?: number;
  numberOfArticles?: number;
}


export async function getArticlesRaw(req?: ItemsQuery): Promise<ArticleRaw[]> {
  if (!req) {
    // if req is not defined return everything helpful for testing
    req = {
      fields: ['*'],
    };
  }

  const rawArticles = await directus.request<any[]>(readItems('articles', req));
  objectLogger(rawArticles, "rawArticles from getArticlesRaw: ")
  return rawArticles as ArticleRaw[];
}

export async function getArticleCards(
  {
    locale,
    page,
    tagId,
    collectiveId,
    numberOfArticles = perPageConstant,
  }: ArticleCardsParameters
): Promise<Paged<CardArticleFlat>> {
  const limit = numberOfArticles;

  // Build filter safely
  const filter: any = { status: { _eq: 'published' } };
  if (tagId != null) filter.tag = { id: { _eq: tagId } };
  if (collectiveId != null) {
    filter.editors = {
      _some: {
        collectives_id: { id: { _eq: collectiveId } },
      },
    };
  }

  const fields = [
    'id',
    'published_at',
    { cover: ['id', 'width', 'height'] },

    // M2M: articles ↔ collectives via editors
    {
      editors: [
        { collectives_id: ['id', 'name', 'slug', 'color', { logo: ['id', 'width', 'height'] }] },
      ],
    },
    { tag: ['id', 'color', { translations: ['languages_code', 'name'] }] },
    { translations: ['languages_code', 'title'] },
  ];

  const deep = {
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
  };

  // Stable sort helps avoid duplicates when multiple items share the same published_at
  const sort = ['-published_at', '-id'];

  // Combine both calls for the articles and the total number of articles
  const [rawArticles, countRows] = await Promise.all([
    directus.request<ArticleRaw[]>(
      readItems('articles', { fields, deep, filter, sort, page, limit } as ItemsQuery)
    ),
    directus.request<any[]>(
      aggregate('articles', {
        aggregate: { count: '*' },
        query: { filter },
      })
    ),
  ]);

  const total = Number(countRows?.[0]?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data: flattenArticlesForCards(rawArticles, locale),
    page,
    limit,
    total,
    totalPages,
  };
}


function flattenArticleForCards(
  rawArticle: ArticleRaw, locale: string,
): CardArticleFlat {

  // editors: junction rows -> collectives
  const editors =
    rawArticle.editors?.flatMap((row) => {
      const c = row.collectives_id;
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

  const events =
    rawArticle.events?.flatMap((row: ArticleEventRowRaw) => {
      const event = row.event_id;
      if (!isObject(event)) return [];

      const eventTr = pickTranslation(event.translations, locale);

      return [
        {
          id: event.id,
          title: eventTr?.title ?? '',
          start_at: new Date(event.start_at),
          end_at: new Date(event.end_at),
          all_day: event.all_day ?? null,
          location_address: event.location_address ?? null,
          location: event.location ?? null,
        },
      ];
    }) ?? [];
  const articleTr = pickTranslation(rawArticle.translations, locale);
  const tagTr = pickTranslation(rawArticle.tag.translations, locale);

  return {
    id: String(rawArticle.id),
    title: String(articleTr?.title ?? null),

    coverUrl: buildAssetUrl(rawArticle.cover.id) ?? PLACEHOLDER_LOGO,
    coverDescription: rawArticle.cover.description,
    coverWidth: Number(rawArticle.cover.width),
    coverHeight: Number(rawArticle.cover.height),
    tag: {
      id: rawArticle.tag.id,
      color: rawArticle.tag.color,
      name: tagTr.name,
    },
    published_at: new Date(rawArticle.published_at),
    events,
    editors
  }
}

// Flatten a list ArticleRaw[] -> CalendarEventFlat[]
export function flattenArticlesForCards(
  rows: ArticleRaw[],
  locale: string,
): CardArticleFlat[] {
  return rows.map((r) => flattenArticleForCards(r, locale));
}
