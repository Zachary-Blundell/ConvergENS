import { readItems } from "@directus/sdk";
import { directus } from "../directus";
import { ItemsQuery, pickTranslation } from "./utils";
import { log } from "console";

/* Types */

export type TagTranslation = {
  languages_code: string;
  name?: string | null;
};
export type TagRaw = {
  id: string | number;
  color: string;
  translations: TagTranslation[];
};
export type TagUI = { id: string | number; label: string; color: string };

export async function getAllTags(locale: string): Promise<TagRaw[]> {
  const req: ItemsQuery = {
    // Return id + translations (language + name)
    fields: ["id", { translations: ["languages_code", "name"] }],
    filter: { translations: { languages_code: { _in: locale } } },
    deep: {
      translations: {
        _filter: { languages_code: { _in: locale } },
      },
    },
  };

  const rows = await directus.request<TagRaw[]>(readItems("tags", req));
  log("here are rows:", rows);
  return rows;
}

export async function getAllTagsForUI(locale: string): Promise<TagUI[]> {
  const req: ItemsQuery = {
    fields: ["id", "color", { translations: ["languages_code", "name"] }],
    deep: {
      translations: {
        _filter: { languages_code: { _in: locale } },
      },
    },
  };

  const rows = await directus.request<TagRaw[]>(readItems("tags", req));

  return rows.map((t) => {
    const label = pickTranslation(t.translations, locale)?.name || `#${t.id}`;
    return { id: t.id, label, color: t.color ?? undefined };
  });
}
