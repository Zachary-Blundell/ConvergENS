// lib/cms/types.ts
export type Id = string | number;

export type MaybeExpanded<T> = Id | T;

export type DirectusImage = {
  id: string;
  width?: number | null;
  height?: number | null;
};
