import { isObject } from "../utils";
import { ArticleEditorRowRaw, ArticleEventRowRaw, ArticleFlat, ArticleRaw, CardArticleFlat, EventArticleInfoFlat } from "./articles.types";
import { buildAssetUrl, pickTranslation, PLACEHOLDER_LOGO } from "./utils";

function flattenEditors(rawArticle: ArticleRaw) {

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

  const base = flattenArticleBase(rawArticle, locale);
  const articleTr = pickTranslation(rawArticle.translations, locale);

  return {
    ...base,
    content: articleTr?.content ?? '',
  };
}
