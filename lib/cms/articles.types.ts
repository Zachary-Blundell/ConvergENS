// lib/cms/articles.types.ts

import { TagFlat, TagRaw } from "./tags";
import { CollectiveForUIRaw, DirectusImage, Id } from "./types";

export type ArticleTranslationRaw = {
  languages_code: string;
  title?: string | null;
  body?: string | null; // This will be html data
  description?: string | null;
};

export type EventTranslationForArticleRaw = {
  languages_code: string;
  title: string | null;
};


export type EventArticleInfoRaw = {
  id: Id;
  start_at: string;
  end_at: string
  all_day: boolean;
  location_address?: string;
  location?: string;
  translations?: EventTranslationForArticleRaw[];
};

export type EventArticleInfoFlat = {
  id: Id;
  start_at: Date;
  end_at: Date
  all_day: boolean;
  location_address?: string;
  location?: string;
  translations?: EventTranslationForArticleRaw[];
};

// M2M: articles ↔ collectives (editors)
// Editors junction: articles ↔ collectives (or users ↔ collectives depending on the schema)
export type ArticleEditorRowRaw = {
  collectives_id: CollectiveForUIRaw;
};

// M2M: events ↔ articles
export type ArticleEventRowRaw = {
  events_id: EventArticleInfoRaw;
};

// Main Article type
export type ArticleRaw = {
  id: Id;

  published_at?: string | null; // ISO datetime should never be null due to default value
  cover?: DirectusImage;
  tag?: TagRaw | null;

  editors?: ArticleEditorRowRaw[];

  events?: ArticleEventRowRaw[] | null;
  translations?: ArticleTranslationRaw[];
}

// Flattened Article types
export type CardArticleFlat = {
  id: Id;

  title: string;
  published_at: Date; // ISO datetime should never be null due to default value
  coverUrl: string | null;
  coverDescription: string | null;
  coverWidth: number | null;
  coverHeight: number | null;
  tag: TagFlat | null;

  editors: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
    logoUrl: string;
    logoWidth: number | null;
    logoHeight: number | null;
  }>;

  events: Array<{
    id: Id;
    title: string;
    start_at: Date;
    end_at: Date;
    all_day: boolean | null;
  }>;
};

export type ArticleFlat = {
  id: Id;
  published_at: Date; // ISO datetime should never be null due to default value

  title: string;
  body: string; // This will be html data

  // Cover
  coverUrl: string | null;
  coverDescription: string | null;
  coverWidth: number | null;
  coverHeight: number | null;

  tag: TagFlat | null;

  editors: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
    logoUrl: string;
    logoWidth: number | null;
    logoHeight: number | null;
  }>;

  events: Array<{
    id: Id;
    title: string;
    start_at: Date;
    end_at: Date
    all_day: boolean;
  }>;
};
