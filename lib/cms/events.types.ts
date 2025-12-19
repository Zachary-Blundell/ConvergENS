// lib/cms/events.types.ts

import { DirectusImage, Id } from "./types";


export type CollectiveRaw = {
  id: Id;
  name?: string | null;
  slug?: string | null;
  color?: string | null;
  logo?: DirectusImage | null;
};

export type EventTranslationRaw = {
  languages_code: string;
  title?: string | null;
  description?: string | null;
};

export type ArticleEventTranslationRaw = {
  languages_code: string;
  title?: string | null;
};

export type ArticleEventInfoRaw = {
  id: Id;
  translations?: ArticleEventTranslationRaw[];
};

// M2M: events ↔ collectives (organisers)
export type EventOrganiserRowRaw = {
  collectives_id: CollectiveRaw;
};

// M2M: events ↔ articles
export type EventArticleRowRaw = {
  articles_id: ArticleEventInfoRaw;
};

export type EventRaw = {
  id: Id;
  start_at?: string;
  end_at?: string;
  all_day?: boolean;

  location?: string | null;
  location_address?: string | null;

  organisers?: EventOrganiserRowRaw[];

  articles?: EventArticleRowRaw[];
  translations?: EventTranslationRaw[];
};

export type CalendarEventFlat = {
  id: string;
  title: string;
  description: string | null;

  start_at: Date;
  end_at: Date;
  all_day: boolean;

  location: string | null;
  location_address: string | null;

  organisers: Array<{
    id: string;
    name: string | null;
    slug: string | null;
    color: string | null;
    logoUrl: string | null;
    logoWidth: number | null;
    logoHeight: number | null;
  }>;

  // articles linked to the event (just what calendar UI typically needs)
  articles: Array<{
    id: string;
    title: string | null;
  }>;
};

