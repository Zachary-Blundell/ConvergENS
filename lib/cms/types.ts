// lib/cms/types.ts
export type Id = string | number;

export type MaybeExpanded<T> = Id | T;

export type DirectusImage = {
  id: string;
  width?: number | null;
  height?: number | null;
  description?: string | null;
};

export type OrganisationForUIRaw = {
  id: Id;
  name?: string | null;
  slug?: string | null;
  color?: string | null;
  logo?: DirectusImage | null;
};
