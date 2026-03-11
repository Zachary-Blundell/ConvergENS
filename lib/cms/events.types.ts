// lib/cms/events.types.ts

import { OrganisationForUIRaw, Id } from "./types";

export type EventTranslationRaw = {
  languages_code: string;
  title?: string | null;
  description?: string | null;
};

export type ArticleTranslationForEventRaw = {
  languages_code: string;
  title?: string | null;
};

export type ArticleEventInfoRaw = {
  id: Id;
  translations?: ArticleTranslationForEventRaw[];
};

// M2M: events ↔ organisations (organisers)
export type EventOrganiserRowRaw = {
  organisation_id: OrganisationForUIRaw;
};

// M2M: events ↔ articles
export type EventArticleRowRaw = {
  articles_id: ArticleEventInfoRaw;
};

// Main Event type
export type EventRaw = {
  id: Id;

  start_at?: string;
  end_at?: string;
  all_day?: boolean | null;
  location?: string | null;
  location_address?: string | null;

  organisers?: EventOrganiserRowRaw[];

  articles?: EventArticleRowRaw[] | null;
  translations?: EventTranslationRaw[];
};

// Flattened Event types
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
    name: string;
    slug: string;
    color: string;
    logoUrl: string;
    logoWidth: number | null;
    logoHeight: number | null;
  }>;

  // articles linked to the event (just what calendar UI typically needs)
  articles: Array<{
    id: string;
    title: string;
  }>;
};
