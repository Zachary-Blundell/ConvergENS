// lib/cms/articles.types.ts

import { TagFlat, TagRaw } from "./tags";
import { OrganisationForUIRaw, DirectusImage, Id } from "./types";

export type ArticleTranslationRaw = {
  languages_code: string;
  title?: string | null;
  content?: string | null; // This will be html data
  description?: string | null;
};

export type EventTranslationForArticleRaw = {
  languages_code: string;
  title: string | null;
  description?: string | null;
};


export type EventArticleInfoRaw = {
  id: Id;
  start_at: string;
  end_at: string;
  all_day: boolean | null;
  location?: string | null;
  location_address?: string | null;
  translations?: EventTranslationForArticleRaw[] | null;
};

export type EventArticleInfoFlat = {
  id: Id;
  title: string;
  description?: string | null;
  start_at: Date;
  end_at: Date;
  all_day: boolean | null;
  location?: string | null;
  location_address?: string | null;
};

// M2M: articles ↔ organisations (editors)
// Editors junction: articles ↔ organisations (or users ↔ organisations depending on the schema)
export type ArticleEditorRowRaw = {
  organisation_id: OrganisationForUIRaw;
};

// M2M: events ↔ articles
export type ArticleEventRowRaw = {
  events_id: EventArticleInfoRaw;
};

// Main Article type
export type ArticleRaw = {
  id: Id;
  status?: string | null;

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
};

export type ArticleFlat = {
  id: Id;
  published_at: Date; // ISO datetime should never be null due to default value

  title: string;
  content: string; // This will be html data

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
    description?: string | null;
    start_at: Date;
    end_at: Date;
    all_day: boolean | null;
    location?: string | null;
    location_address?: string | null;
  }>;
};

