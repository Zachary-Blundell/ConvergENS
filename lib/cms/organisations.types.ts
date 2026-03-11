// lib/cms/organisations.types.ts
import { ArticleRaw, CardArticleFlat } from "./articles.types";
import { DirectusImage, Id } from "./types";

export type OrganisationTranslation = {
  languages_code: string;
  summary?: string | null;
  description?: string | null;
};

export type TypeTranslation = {
  languages_code: string;
  name?: string | null;
  plural?: string | null;
  adjective?: string | null;
};

export type SocialRaw = {
  id?: number | string;
  social_types?: string | null;
  URL?: string | null;
};

export type OrganisationEditorRaw = {
  id: number | string;
  organisations_id?: {
    id: number | string;
    name?: string | null;
    slug?: string | null;
    color?: string | null;
    logo?: DirectusImage | null;
  } | null;
};

export type ArticleTranslation = {
  languages_code: string;
  title?: string | null;
};

export type OrganisationArticleJunctionRaw = {
  id: number | string;
  articles_id?: ArticleRaw | null;
};

export type OrganisationRaw = {
  id: Id;
  name?: string | null;
  slug?: string | null;
  color?: string | null;
  type?: {
    id?: string | number | null;
    translations?: TypeTranslation[];
  } | null;
  logo?: DirectusImage | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  translations?: OrganisationTranslation[];
  socials?: SocialRaw[] | SocialRaw | null;
  articles?: OrganisationArticleJunctionRaw[] | null;
};

export type OrganisationFlat = {
  id: Id;
  name: string;
  slug: string;
  color: string | null;
  type: {
    id: Id | null;
    name: string | null;
    plural?: string | null;
    adjective?: string | null;
  };
  logoUrl: string; // placeholder fallback handled
  logoWidth: number | null;
  logoHeight: number | null;
  // Optional contact (only populated if requested in fields)
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  // Localized fields (flattened)
  summary?: string | null;
  description?: string | null;
  socials?: { type: string; url: string }[];
  articles: CardArticleFlat[];
};

export type OrganisationUI = {
  id: string | number;
  name: string;
  color: string;
};

export type OrganisationBadge = {
  id: string | number;
  slug: string;
  name: string;
  logoUrl: string; // placeholder fallback handled
  logoWidth: number | null;
  logoHeight: number | null;
  color: string;
};

/* Organisation cards */
export type OrganisationCard = {
  //flattened
  id: string;
  name: string;
  slug: string;
  color: string | null;
  type: {
    id: string | null;
    name: string | null;
    plural?: string | null;
    adjective?: string | null;
  };
  logoUrl: string; // placeholder fallback handled
  logoWidth: number | null;
  logoHeight: number | null;
  // Optional contact (only populated if requested in fields)
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  // Localized fields (flattened)
  summary?: string | null;
  description?: string | null;
  socials?: { type: string; url: string }[];
};


