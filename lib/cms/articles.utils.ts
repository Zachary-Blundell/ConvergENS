import { isObject } from "../utils";
import { ArticleEventRowRaw, ArticleFlat, ArticleRaw, CardArticleFlat } from "./articles.types";
import { buildAssetUrl, pickTranslation, PLACEHOLDER_LOGO } from "./utils";

// Helpers (pull these above your flatteners)

function flattenEditors(rawArticle: ArticleRaw) {
  return (
    rawArticle.editors?.flatMap((row) => {
      const c = row.collectives_id;
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

function flattenEvents(rawArticle: ArticleRaw, locale: string) {
  return (
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
    id: tag.id,
    color: tag.color,
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

// --- Your flatteners (now very small)

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
    body: articleTr?.body ?? '',
  };
}

// function flattenArticleForCards(
//   rawArticle: ArticleRaw, locale: string,
// ): CardArticleFlat {
//
//   // editors: junction rows -> collectives
//   const editors =
//     rawArticle.editors?.flatMap((row) => {
//       const c = row.collectives_id;
//       if (!isObject(c)) return []; // should not happen but just incase
//
//       const logoId = c.logo?.id ?? null;
//       return [
//         {
//           id: String(c.id),
//           name: c.name ?? null,
//           slug: c.slug ?? null,
//           color: c.color ?? null,
//           logoUrl: logoId ? buildAssetUrl(logoId) : PLACEHOLDER_LOGO,
//           logoWidth: c.logo?.width ?? null,
//           logoHeight: c.logo?.height ?? null,
//         },
//       ];
//     }) ?? [];
//
//   const events =
//     rawArticle.events?.flatMap((row: ArticleEventRowRaw) => {
//       const event = row.event_id;
//       if (!isObject(event)) return [];
//
//       const eventTr = pickTranslation(event.translations, locale);
//
//       return [
//         {
//           id: event.id,
//           title: eventTr?.title ?? '',
//           start_at: new Date(event.start_at),
//           end_at: new Date(event.end_at),
//           all_day: event.all_day ?? null,
//           location_address: event.location_address ?? null,
//           location: event.location ?? null,
//         },
//       ];
//     }) ?? [];
//   const articleTr = pickTranslation(rawArticle.translations, locale);
//   const tagTr = pickTranslation(rawArticle.tag.translations, locale);
//
//   return {
//     id: String(rawArticle.id),
//     title: String(articleTr?.title ?? null),
//
//     coverUrl: buildAssetUrl(rawArticle.cover.id) ?? PLACEHOLDER_LOGO,
//     coverDescription: rawArticle.cover.description,
//     coverWidth: Number(rawArticle.cover.width),
//     coverHeight: Number(rawArticle.cover.height),
//     tag: {
//       id: rawArticle.tag.id,
//       color: rawArticle.tag.color,
//       name: tagTr.name,
//     },
//     published_at: new Date(rawArticle.published_at),
//     events,
//     editors
//   }
// }
//
// // Flatten a list ArticleRaw[] -> CalendarEventFlat[]
// export function flattenArticlesForCards(
//   rows: ArticleRaw[],
//   locale: string,
// ): CardArticleFlat[] {
//   return rows.map((r) => flattenArticleForCards(r, locale));
// }
//
// export function flattenArticle(
//   rawArticle: ArticleRaw, locale: string,
// ): ArticleFlat {
//
//   // editors: junction rows -> collectives
//   const editors =
//     rawArticle.editors?.flatMap((row) => {
//       const c = row.collectives_id;
//       if (!isObject(c)) return []; // should not happen but just incase
//
//       const logoId = c.logo?.id ?? null;
//       return [
//         {
//           id: String(c.id),
//           name: c.name ?? null,
//           slug: c.slug ?? null,
//           color: c.color ?? null,
//           logoUrl: logoId ? buildAssetUrl(logoId) : PLACEHOLDER_LOGO,
//           logoWidth: c.logo?.width ?? null,
//           logoHeight: c.logo?.height ?? null,
//         },
//       ];
//     }) ?? [];
//
//   const events =
//     rawArticle.events?.flatMap((row: ArticleEventRowRaw) => {
//       const event = row.event_id;
//       if (!isObject(event)) return [];
//
//       const eventTr = pickTranslation(event.translations, locale);
//
//       return [
//         {
//           id: event.id,
//           title: eventTr?.title ?? '',
//           start_at: new Date(event.start_at),
//           end_at: new Date(event.end_at),
//           all_day: event.all_day ?? null,
//           location_address: event.location_address ?? null,
//           location: event.location ?? null,
//         },
//       ];
//     }) ?? [];
//   const articleTr = pickTranslation(rawArticle.translations, locale);
//   const tagTr = pickTranslation(rawArticle.tag.translations, locale);
//
//   return {
//     id: String(rawArticle.id),
//     title: String(articleTr?.title ?? null),
//     body: String(articleTr?.body ?? null),
//
//     coverUrl: buildAssetUrl(rawArticle.cover.id) ?? PLACEHOLDER_LOGO,
//     coverDescription: rawArticle.cover.description,
//     coverWidth: Number(rawArticle.cover.width),
//     coverHeight: Number(rawArticle.cover.height),
//     tag: {
//       id: rawArticle.tag.id,
//       color: rawArticle.tag.color,
//       name: tagTr.name,
//     },
//     published_at: new Date(rawArticle.published_at),
//     events,
//     editors
//   }
// }
