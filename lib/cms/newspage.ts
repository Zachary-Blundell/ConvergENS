import { readSingleton } from '@directus/sdk';
import { directus } from '../directus';
import { buildAssetUrl, DEFAULT_LOCALE, PLACEHOLDER_LOGO } from './utils';

interface ImageT {
  id: string;
  height: number;
  width: number;
}
interface ImageProcessedT {
  url: string;
  height: number;
  width: number;
}

export interface NewspaperRaw {
  id: number;
  banner_img: ImageT | null; // Directus file attributes
  current_edition_img: ImageT | null; // Directus file attributes
  translations: NewspaperTranslation[];
}
export interface NewspaperFlat {
  id: number;
  banner_img: ImageProcessedT | null;
  current_edition_img: ImageProcessedT | null;
  translations: NewspaperTranslation; // flatenned
}

/** Language-specific fields for the newspaper */
export interface NewspaperTranslation {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  edition_title: string | null;
  quote_box: string | null;
  banner_img_description: string | null;
  edition_img_description: string | null;
}

interface NewspaperTranslationRaw {
  languages_code: string; // add this so we can pick the right one
  title: string | null;
  subtitle: string | null;
  description: string | null;
  edition_title: string | null;
  quote_box: string | null;
  banner_img_description: string | null;
  edition_img_description: string | null;
}

export interface NewspaperRaw {
  id: number;
  banner_img: ImageT | null;
  current_edition_img: ImageT | null;
  translations: NewspaperTranslationRaw[]; // note the Raw type here
}

export async function getNewspaperPage(
  locale: string,
): Promise<NewspaperFlat | null> {
  try {
    const raw = await directus.request<NewspaperRaw>(
      readSingleton('newspaper', {
        fields: [
          'id',
          'banner_img.id',
          'banner_img.height',
          'banner_img.width',
          'current_edition_img.id',
          'current_edition_img.height',
          'current_edition_img.width',
          {
            translations: [
              'languages_code', // <-- include this
              'title',
              'subtitle',
              'description',
              'edition_title',
              'quote_box',
              'banner_img_description',
              'edition_img_description',
            ],
          },
        ],
        deep: {
          translations: {
            _filter: { languages_code: { _in: [locale, DEFAULT_LOCALE] } },
            _limit: 2,
          },
        },
      }),
    );

    // Prefer requested locale, else default, else null
    const chosen =
      raw.translations?.find((t) => t.languages_code === locale) ??
      raw.translations?.find((t) => t.languages_code === DEFAULT_LOCALE) ??
      null;

    const translation = chosen
      ? {
          title: chosen.title,
          subtitle: chosen.subtitle,
          description: chosen.description,
          edition_title: chosen.edition_title,
          quote_box: chosen.quote_box,
          banner_img_description: chosen.banner_img_description,
          edition_img_description: chosen.edition_img_description,
        }
      : null;

    return {
      id: raw.id,
      banner_img: toProcessedImage(raw.banner_img, true),
      current_edition_img: toProcessedImage(raw.current_edition_img, true),
      translation,
    };
  } catch (e) {
    console.warn('Error fetching newspaper:', e);
    return null;
  }
}
