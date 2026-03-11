import { isObject, objectLogger } from "../utils";
import { ArticleEditorRowRaw, ArticleEventRowRaw, ArticleFlat, ArticleRaw, CardArticleFlat, EventArticleInfoFlat } from "./articles.types";
import { buildAssetUrl, pickTranslation, PLACEHOLDER_LOGO } from "./utils";

function flattenEditors(rawArticle: ArticleRaw) {

  objectLogger(rawArticle.editors, "here rawArticle.editors coming in to flattenEditors: ")
  // {
  //    "organisation_id": {
  //      "id": 7,
  //      "name": "ConvergENS",
  //      "slug": "converg-ens",
  //      "color": "#FF621F",
  //      "logo": {
  //        "id": "f51b5ce6-4572-41f5-89ea-58a8356fcef9",
  //        "width": 500,
  //        "height": 500
  //      }
  //    }
  return (
    rawArticle.editors?.flatMap((row: ArticleEditorRowRaw) => {
      const c = row.organisation_id;
      if (!isObject(c)) return [];

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
    }) ?? []
  );
}

function flattenEvents(rawArticle: ArticleRaw, locale: string): EventArticleInfoFlat[] {
  return (
    rawArticle.events?.flatMap((row: ArticleEventRowRaw) => {
      const event = row.events_id;
      if (!isObject(event)) return [];

      const eventTr = pickTranslation(event.translations, locale);

      return [
        {
          id: event.id,
          title: eventTr?.title ?? '',
          description: eventTr?.description ?? null,
          start_at: new Date(event.start_at),
          end_at: new Date(event.end_at),
          all_day: event.all_day ?? null,
          location: event.location ?? null,
          location_address: event.location_address ?? null,
        },
      ];
    }) ?? []
  );
}

function flattenCover(cover: ArticleRaw['cover']) {
  return {
    coverUrl: (cover?.id ? buildAssetUrl(cover.id) : null) ?? PLACEHOLDER_LOGO,
    coverDescription: cover?.description ?? null,
    coverWidth: cover?.width != null ? Number(cover.width) : null,
    coverHeight: cover?.height != null ? Number(cover.height) : null,
  };
}

function flattenTag(tag: ArticleRaw['tag'], locale: string) {
  const tagTr = pickTranslation(tag?.translations, locale);
  return {
    id: tag?.id,
    color: tag?.color,
    name: tagTr?.name ?? '',
  };
}

function flattenArticleBase(rawArticle: ArticleRaw, locale: string) {
  const articleTr = pickTranslation(rawArticle.translations, locale);

  return {
    id: String(rawArticle.id),
    title: articleTr?.title ?? '',
    ...flattenCover(rawArticle.cover),
    tag: flattenTag(rawArticle.tag, locale),
    published_at: new Date(rawArticle.published_at),
    events: flattenEvents(rawArticle, locale),
    editors: flattenEditors(rawArticle),
  };
}

function flattenArticleForCards(rawArticle: ArticleRaw, locale: string): CardArticleFlat {
  return flattenArticleBase(rawArticle, locale);
}

// Flatten a list ArticleRaw[] -> CardArticleFlat[]
export function flattenArticlesForCards(rows: ArticleRaw[], locale: string): CardArticleFlat[] {
  return rows.map((r) => flattenArticleForCards(r, locale));
}

export function flattenArticle(rawArticle: ArticleRaw, locale: string): ArticleFlat {

  objectLogger(rawArticle.editors, "here rawArticle.editors coming in to flattenEvents: ")
  const base = flattenArticleBase(rawArticle, locale);
  const articleTr = pickTranslation(rawArticle.translations, locale);

  // objectLogger(articleTr, "here is the picked translations: ")
  objectLogger(base, "here is the picked base: ")

  return {
    ...base,
    content: articleTr?.content ?? '',
  };
}
