export const DEFAULT_LOCALE = "fr-FR";
export const PLACEHOLDER_LOGO = "/images/placeholder.png";

/* shared types */

export type ItemsQuery = {
  fields?: any[];
  sort?: string[] | string;
  filter?: Record<string, any>;
  search?: string;
  limit?: number;
  page?: number;
  deep?: Record<string, any>;
};

/* shared helpers */

export function pickTranslation<T extends { languages_code: string }>(
  tr: T[] | undefined,
  locale: string,
  fallback = DEFAULT_LOCALE,
) {
  if (!tr || tr.length === 0) return undefined;
  return (
    tr.find((x) => x.languages_code === locale) ||
    tr.find((x) => x.languages_code === fallback) ||
    tr[0]
  );
}

export function buildAssetUrl(
  fileId?: string | { id: string } | null,
): string | null {
  if (!fileId) return null;
  const base = process.env.DIRECTUS_API_ENDPOINT;
  const id = typeof fileId === "string" ? fileId : fileId.id;
  return `${base}/assets/${id}`;
}
