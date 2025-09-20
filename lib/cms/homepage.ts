import { readSingleton } from "@directus/sdk";
import { directus } from "../directus";

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "fr-FR";

type HomeT = {
  hero_bg?: {
    id: string;
    height: number;
    width: number;
  } | null;
  translations: Array<{
    languages_code: string;

    hero_title?: string | null;
    hero_cta?: string | null;

    section_1_title?: string | null;
    section_1_body?: string | null;
    section_2_title?: string | null;
    section_2_body?: string | null;
    section_3_title?: string | null;
    section_3_body?: string | null;

    about_row1_title?: string | null;
    about_row1_body?: string | null;
    about_row2_title?: string | null;
    about_row2_body?: string | null;
    about_row3_title?: string | null;
    about_row3_body?: string | null;
  }>;
};

export async function getHome(locale: string): Promise<HomeT> {
  return directus.request<HomeT>(
    readSingleton("homepage", {
      fields: [
        "hero_bg.id",
        "hero_bg.height",
        "hero_bg.width",
        "hero_bg.modified_on",
        {
          translations: [
            "languages_code",
            "hero_title",
            "hero_cta",
            "section_1_title",
            "section_1_body",
            "section_2_title",
            "section_2_body",
            "section_3_title",
            "section_3_body",
            "about_row1_title",
            "about_row1_body",
            "about_row2_title",
            "about_row2_body",
            "about_row3_title",
            "about_row3_body",
          ],
        },
      ],
      deep: {
        translations: {
          _filter: { languages_code: { _in: [locale] } },
        },
      },
    }),
  );
}

export function pickHomeT(home: HomeT, locale: string) {
  return (
    home.translations.find((t) => t.languages_code === locale) ??
    home.translations.find((t) => t.languages_code === DEFAULT_LOCALE) ??
    home.translations[0] ??
    null
  );
}
