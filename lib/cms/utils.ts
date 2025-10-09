//lib/cms/utils.ts
export const DEFAULT_LOCALE = 'fr-FR';
export const PLACEHOLDER_LOGO = '/images/placeholder.png';

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
  if (fileId === undefined) return null;

  const base = process.env.DIRECTUS_API_ENDPOINT;

  const id = typeof fileId === 'string' ? fileId : fileId.id;
  return `${base}/assets/${id}`;
}

// Minimal but accurate shapes per Directus docs
type SortParam = string | string[];
type GroupByParam = string | string[];
type ExportType = 'csv' | 'json' | 'xml' | 'yaml';

// Recursive "fields" tree (string or nested object)
type FieldsParam = Array<string | { [key: string]: FieldsParam }>;

type FilterParam = Record<string, any>; // or import the SDK’s Filter type

type AggregateParam = Partial<
  Record<
    | 'count'
    | 'countDistinct'
    | 'sum'
    | 'sumDistinct'
    | 'avg'
    | 'avgDistinct'
    | 'min'
    | 'max',
    '*' | string | string[]
  >
>;

type DeepParams = Record<string, any>;

/* shared types */

export type ItemsQuery = {
  fields?: FieldsParam;
  filter?: FilterParam;
  search?: string;
  sort?: SortParam;
  limit?: number;
  offset?: number; // you were missing this
  page?: number;

  // For aggregate() API (not readItems)
  aggregate?: AggregateParam;
  groupBy?: GroupByParam;

  // Extras the API supports
  deep?: DeepParams;
  alias?: Record<string, string>;
  export?: ExportType;
  backlink?: boolean;

  // Only used on single-item reads
  version?: string;
  versionRaw?: boolean;
};
