import { readSingleton } from '@directus/sdk';
import { directus } from '../directus';
import { buildAssetUrl, PLACEHOLDER_LOGO } from './utils';

type RawHomePage = {
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

  about_row1_img?: string | null;
  about_row2_img?: string | null;
  about_row3_img?: string | null;
};

export type FlatHomePage = {
  hero_bg: {
    url: string;
    height: number;
    width: number;
  };
  translations: {
    hero_title: string | null;
    hero_cta: string | null;

    section_1_title: string | null;
    section_1_body: string | null;

    section_2_title: string | null;
    section_2_body: string | null;

    section_3_title: string | null;
    section_3_body: string | null;

    about_row1_title: string | null;
    about_row1_body: string | null;

    about_row2_title: string | null;
    about_row2_body: string | null;

    about_row3_title: string | null;
    about_row3_body: string | null;
  };

  about_row1_img: string;
  about_row2_img: string;
  about_row3_img: string;
};

export async function getHome(locale: string): Promise<FlatHomePage> {
  try {
    const homePageRaw: RawHomePage = await directus.request<RawHomePage>(
      readSingleton('homepage', {
        fields: [
          'hero_bg.id',
          'hero_bg.height',
          'hero_bg.width',
          'hero_bg.modified_on',
          {
            translations: [
              'languages_code',
              'hero_title',
              'hero_cta',
              'section_1_title',
              'section_1_body',
              'section_2_title',
              'section_2_body',
              'section_3_title',
              'section_3_body',
              'about_row1_title',
              // "about_row1_img",
              'about_row1_body',

              'about_row2_title',
              // "about_row2_img",
              'about_row2_body',

              'about_row3_title',
              // "about_row3_img",
              'about_row3_body',
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

    const homePageFlat: FlatHomePage = {
      hero_bg: {
        url: buildAssetUrl(homePageRaw.hero_bg?.id) ?? PLACEHOLDER_LOGO,
        height: homePageRaw.hero_bg?.height,
        width: homePageRaw.hero_bg?.width,
      },
      translations: {
        hero_title: homePageRaw.translations?.[0]?.hero_title ?? null,
        hero_cta: homePageRaw.translations?.[0]?.hero_cta ?? null,

        section_1_title: homePageRaw.translations?.[0]?.section_1_title ?? null,
        section_1_body: homePageRaw.translations?.[0]?.section_1_body ?? null,

        section_2_title: homePageRaw.translations?.[0]?.section_2_title ?? null,
        section_2_body: homePageRaw.translations?.[0]?.section_2_body ?? null,

        section_3_title: homePageRaw.translations?.[0]?.section_3_title ?? null,
        section_3_body: homePageRaw.translations?.[0]?.section_3_body ?? null,

        about_row1_title:
          homePageRaw.translations?.[0]?.about_row1_title ?? null,
        about_row1_body: homePageRaw.translations?.[0]?.about_row1_body ?? null,

        about_row2_title:
          homePageRaw.translations?.[0]?.about_row2_title ?? null,
        about_row2_body: homePageRaw.translations?.[0]?.about_row2_body ?? null,

        about_row3_title:
          homePageRaw.translations?.[0]?.about_row3_title ?? null,
        about_row3_body: homePageRaw.translations?.[0]?.about_row3_body ?? null,
      },

      about_row1_img: homePageRaw.about_row1_img ?? PLACEHOLDER_LOGO,
      about_row2_img: homePageRaw.about_row2_img ?? PLACEHOLDER_LOGO,
      about_row3_img: homePageRaw.about_row3_img ?? PLACEHOLDER_LOGO,
    };

    return homePageFlat;
  } catch (err: unknown) {
    const e = err as any;

    console.warn('Error fetching homepage:', err);
    const code =
      e?.errors?.[0]?.extensions?.code || e?.response?.status || e?.status;

    // Common patterns: 404, or Directus code like "RECORD_NOT_FOUND"
    const isNotFound =
      code === 404 ||
      code === 'RECORD_NOT_FOUND' ||
      e?.message?.toLowerCase?.().includes('not found');

    if (isNotFound) return null;

    return {
      hero_bg: {
        url: PLACEHOLDER_LOGO,
        height: 100,
        width: 100,
      },
      translations: {
        hero_title: null,
        hero_cta: null,

        section_1_title: null,
        section_1_body: null,

        section_2_title: null,
        section_2_body: null,

        section_3_title: null,
        section_3_body: null,

        about_row1_title: null,
        about_row1_body: null,

        about_row2_title: null,
        about_row2_body: null,

        about_row3_title: null,
        about_row3_body: null,
      },

      about_row1_img: PLACEHOLDER_LOGO,
      about_row2_img: PLACEHOLDER_LOGO,
      about_row3_img: PLACEHOLDER_LOGO,
    };
  }
}
