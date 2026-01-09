// lib/cms/articles.ts
import { readItems, aggregate, readItem } from '@directus/sdk';
import { directus } from '../directus';
import { buildAssetUrl, DEFAULT_LOCALE, pickTranslation, PLACEHOLDER_LOGO, type ItemsQuery } from './utils';
import type { ArticleEventRowRaw, ArticleFlat, ArticleRaw, CardArticleFlat } from './articles.types';
import { isObject, objectLogger } from '../utils';
import { flattenArticle, flattenArticlesForCards } from './articles.utils';

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

interface articleByIdParameters {
  locale: string;
  articleId: number;
}

export async function getArticleById(
  {
    articleId,
    locale,
  }: articleByIdParameters
): Promise<ArticleFlat> {

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
    { translations: ['languages_code', 'title', 'body'] },
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

  const filter = { id: { _eq: articleId }, status: { _eq: 'published' } };

  const req: ItemsQuery = { fields, deep, filter, };

  const rawArticle = await directus.request<ArticleRaw>(readItem('articles', articleId, req));

  return flattenArticle(rawArticle, locale);
}
