// lib/cms/collectives.ts
import { readItem, readItems } from "@directus/sdk";
import { directus } from "../directus";
import {
  buildAssetUrl,
  DEFAULT_LOCALE,
  ItemsQuery,
  pickTranslation,
  PLACEHOLDER_LOGO,
} from "./utils";
import { log } from "console";

/* Ensure required minium fields are always requested if nothing is provided*/
function withRequiredMinFields(fields: any[] | undefined): any[] {
  const base = fields ?? [
    "id",
    "status",
    "name",
    "slug",
    "color",
    { logo: ["id", "height", "width"] },
    { collective: ["id"] },
  ];
  return [...base];
}

export type CollectiveTranslation = {
  languages_code: string;
  summary?: string | null;
  description?: string | null;
};

export type CollectiveRaw = {
  id: string | number;
  name?: string | null;
  slug?: string | null;
  color?: string | null;
  logo?: { id: string; width?: number | null; height?: number | null } | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  translations?: CollectiveTranslation[];
  socials?: { platform: string; url: string }[];
};

export type CollectiveFlat = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
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
  socials?: { platform: string; url: string }[];
};

export type CollectiveUI = {
  id: string | number;
  name: string;
  color: string;
};

export async function getCollectivesRaw(
  options: ItemsQuery = {},
  locale?: string | null,
): Promise<CollectiveRaw[]> {
  const includeTranslations = Boolean(locale);

  const fields = withRequiredMinFields(options.fields as any[] | undefined);

  const req: any = {
    ...options,
    fields,
    filter: {
      status: { _eq: "published" },
    },
  };

  if (includeTranslations) {
    req.deep = {
      translations: {
        _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
        _limit: 2,
      },
      ...(options.deep || {}),
    };
  } else if (options.deep) {
    // If caller I call my own deep object, respect it.
    req.deep = options.deep;
  }

  const rows = await directus.request<any[]>(readItems("collectives", req));
  return rows as CollectiveRaw[];
}

export async function getCollectives(
  options: ItemsQuery = {},
  locale?: string,
): Promise<CollectiveFlat[]> {
  const rows = await getCollectivesRaw(options, locale);
  return rows.map((i) => {
    const tr = pickTranslation(i.translations, locale);
    const result = {
      id: String(i.id),
      name: String(i.name ?? ""),
      slug: String(i.slug ?? ""),
      color: i.color ?? null,
      logoUrl: buildAssetUrl(i.logo) ?? PLACEHOLDER_LOGO,
      logoWidth: i.logo?.width ?? null,
      logoHeight: i.logo?.height ?? null,
      email: (i as any).email ?? null,
      phone: (i as any).phone ?? null,
      website: (i as any).website ?? null,
      summary: tr?.summary ?? null,
      description: tr?.description ?? null,
    };
    return result;
  });
}

export async function getCollectiveBadges(): Promise<CollectiveFlat[]> {
  const rows = await getCollectivesRaw({
    /* id, name, slug, color, and logo should be included by default see utils.ts*/
  });
  return rows.map((i) => {
    const result = {
      id: String(i.id),
      name: String(i.name ?? ""),
      slug: String(i.slug ?? ""),
      color: i.color ?? null,
      logoUrl: buildAssetUrl(i.logo) ?? PLACEHOLDER_LOGO,
      logoWidth: i.logo?.width ?? null,
      logoHeight: i.logo?.height ?? null,
    };
    return result;
  });
}

export async function getAllCollectivesForUI(
  locale: string,
): Promise<CollectiveUI[]> {
  const req: ItemsQuery = {
    fields: ["id", "name", "color"],
  };

  const rawCollective = await directus.request<CollectiveRaw[]>(
    readItems("collectives", req),
  );

  return rawCollective.map((c) => {
    return {
      id: c.id,
      name: c.name,
      color: c.color,
    };
  });
}
export async function getCollectiveBySlug(
  slug: string,
  locale = DEFAULT_LOCALE,
): Promise<CollectiveFlat | null> {
  // 1) Find the primary key by slug (and published)
  log("here is the slug searched", slug);
  const found = await directus.request<{ id: string }[]>(
    readItems("collectives", {
      fields: ["id"],
      filter: { slug: { _eq: slug }, status: { _eq: "published" } },
      limit: 1,
    }),
  );
  log("here is what was found: ", found);
  const id = found?.[0]?.id;
  if (!id) return null;

  // 2) Fetch the single item by primary key
  const i = await directus.request<CollectiveRaw>(
    readItem("collectives", id, {
      fields: [
        "id",
        "name",
        "slug",
        "color",
        "email",
        "phone",
        "website",
        { logo: ["id", "width", "height"] },
        { translations: ["languages_code", "summary", "description"] },
        { socials: ["platform", "url"] },
      ],
      deep: {
        translations: {
          _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
          _limit: 2,
        },
      },
    }),
  );
  log("here is i: ", i);

  // Flatten
  const tr = pickTranslation(i.translations, locale);

  return {
    id: String(i.id),
    name: String(i.name ?? ""),
    slug: String(i.slug ?? ""),
    summary: tr?.summary ?? null,
    description: tr?.description ?? null,
    color: i.color ?? null,
    logoUrl: buildAssetUrl(i.logo) ?? PLACEHOLDER_LOGO,
    logoWidth: i.logo?.width ?? null,
    logoHeight: i.logo?.height ?? null,
    email: i.email ?? null,
    phone: i.phone ?? null,
    website: i.website ?? null,
    socials: i.socials ?? [],
  };
}
