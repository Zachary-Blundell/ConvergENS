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

// helper functions
function pickTranslation(
  translations: NewspaperTranslationRaw[],
  preferred: string,
  fallback: string,
): NewspaperTranslation {
  const t =
    translations.find((x) => x.languages_code === preferred) ??
    translations.find((x) => x.languages_code === fallback);

  // If still nothing, return explicit nulls for all keys so the UI can decide
  return (
    t ?? {
      title: null,
      subtitle: null,
      description: null,
      edition_title: null,
      quote_box: null,
      banner_img_description: null,
      edition_img_description: null,
    }
  );
}

export interface NewspaperRaw {
  id: number;
  banner_img: ImageT | null; // Directus file attributes
  current_edition_img: ImageT | null; // Directus file attributes
  translations: NewspaperTranslationRaw[];
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

type NewspaperTranslationRaw = NewspaperTranslation & {
  languages_code: string;
};

export async function getNewspaperPage(
  locale: string,
): Promise<NewspaperFlat | null> {
  try {
    const newspaperPageRaw = await directus.request<NewspaperRaw>(
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
              'languages_code',
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
          },
        },
      }),
    );

    // If record truly doesn't exist
    if (!newspaperPageRaw?.id) return null;

    const resolvedT = pickTranslation(
      newspaperPageRaw.translations ?? [],
      locale,
      DEFAULT_LOCALE,
    );

    const newspaperPageFlat: NewspaperFlat = {
      id: newspaperPageRaw.id,
      banner_img: {
        url: buildAssetUrl(newspaperPageRaw.banner_img.id) ?? PLACEHOLDER_LOGO,
        height: newspaperPageRaw.banner_img.height,
        width: newspaperPageRaw.banner_img.width,
      },
      current_edition_img: {
        url:
          buildAssetUrl(newspaperPageRaw.current_edition_img.id) ??
          PLACEHOLDER_LOGO,
        height: newspaperPageRaw.current_edition_img.height,
        width: newspaperPageRaw.current_edition_img.width,
      },
      translations: resolvedT,
    };

    return newspaperPageFlat;
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

    return null;
  }
}

// export async function getTestPage() {
//   // ): Promise<newspaperPageFlat | null> {
//   const pageName = 'newspaper';
//
//   const newspaperPageRaw = await directus.request(
//     readSingleton(pageName, {
//       fields: ['*', { translations: ['*'] }],
//     }),
//   );
//
//   console.log(pageName, newspaperPageRaw);
//
//   return null;
// }
//
