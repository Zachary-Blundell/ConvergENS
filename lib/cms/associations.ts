// lib/cms/associations.ts
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
    { association: ["id"] },
  ];
  return [...base];
}

export type AssociationTranslation = {
  languages_code: string;
  summary?: string | null;
  description?: string | null;
};

export type AssociationRaw = {
  id: string;
  status?: string | null;
  name?: string | null;
  slug?: string | null;
  color?: string | null;
  logo?: { id: string; width?: number | null; height?: number | null } | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  translations?: AssociationTranslation[];
  socials?: { platform: string; url: string }[];
};

export type AssociationFlat = {
  id: string;
  status?: string | null;
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

export async function getAssociationsRaw(
  options: ItemsQuery = {},
  locale?: string | null,
): Promise<AssociationRaw[]> {
  const includeTranslations = Boolean(locale);

  const fields = withRequiredMinFields(options.fields as any[] | undefined);

  const req: any = {
    ...options,
    fields,
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

  const rows = await directus.request<any[]>(readItems("associations", req));
  return rows as AssociationRaw[];
}

export async function getAssociations(
  options: ItemsQuery = {},
  locale?: string,
): Promise<AssociationFlat[]> {
  const rows = await getAssociationsRaw(options, locale);
  return rows.map((i) => {
    const tr = pickTranslation(i.translations, locale);
    const result = {
      id: String(i.id),
      status: String(i.status),
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

export async function getAssociationBadges(): Promise<AssociationFlat[]> {
  const rows = await getAssociationsRaw({
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

// export async function getAssociationBySlug(
//   slug: string,
//   locale = DEFAULT_LOCALE,
// ) {
//   // Just get everything
//   const rows = await directus.request<AssociationRaw[]>(
//     readItem("associations", {
//       fields: [
//         "id",
//         "status",
//         "name",
//         "slug",
//         "color",
//         "email",
//         "phone",
//         "website",
//         { logo: ["id", "width", "height"] },
//         { translations: ["languages_code", "summary", "description"] },
//         { socials: ["platform", "url"] },
//       ],
//       filter: { slug: { _eq: slug }, status: { _eq: "published" } },
//       limit: 1,
//       deep: {
//         translations: {
//           _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
//           _limit: 2,
//         },
//       },
//     }),
//   );
//
//   const i = rows[0];
//   if (!i) return null;
//
//   // Flatten
//   const tr = pickTranslation(i.translations, locale);
//
//   const assoc: AssociationFlat = {
//     id: i.id,
//     status: i.status,
//     name: i.name,
//     slug: i.slug,
//     summary: tr?.summary ?? null,
//     description: tr?.description ?? null,
//     color: i.color ?? null,
//     logoUrl: buildAssetUrl(i.logo) ?? PLACEHOLDER_LOGO,
//     logoWidth: i.logo?.width ?? null,
//     logoHeight: i.logo?.height ?? null,
//     email: i.email ?? null,
//     phone: i.phone ?? null,
//     website: i.website ?? null,
//     socials: i.socials ?? [],
//   };
//
//   return assoc;
// }

export async function getAssociationBySlug(
  slug: string,
  locale = DEFAULT_LOCALE,
): Promise<AssociationFlat | null> {
  // 1) Find the primary key by slug (and published)
  log("here is the slug searched", slug);
  const found = await directus.request<{ id: string }[]>(
    readItems("associations", {
      fields: ["id"],
      filter: { slug: { _eq: slug }, status: { _eq: "published" } },
      limit: 1,
    }),
  );
  log("here is what was found: ", found);
  const id = found?.[0]?.id;
  if (!id) return null;

  // 2) Fetch the single item by primary key
  const i = await directus.request<AssociationRaw>(
    readItem("associations", id, {
      fields: [
        "id",
        "status",
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

  // (optional safety) if status changed between calls, you can bail out:
  if (i?.status !== "published") return null;

  // Flatten
  const tr = pickTranslation(i.translations, locale);

  return {
    id: String(i.id),
    status: i.status ?? null,
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
