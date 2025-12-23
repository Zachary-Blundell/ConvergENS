// lib/cms/types.ts
export type Id = string | number;

export type MaybeExpanded<T> = Id | T;

export type DirectusImage = {
  id: string;
  description?: string | null;
  width?: number | null;
  height?: number | null;
};

export type CollectiveForUIRaw = {
  id: Id;
  name?: string | null;
  slug?: string | null;
  color?: string | null;
  logo?: DirectusImage | null;
};
