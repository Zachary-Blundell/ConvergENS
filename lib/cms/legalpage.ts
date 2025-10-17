import { readSingleton } from '@directus/sdk';
import { directus } from '../directus';

type LegalPageRaw = {
  translations: Array<{
    languages_code: string;
    page_body?: string | null;
  }>;
};

export type LegalPageFlat = {
  body?: string | null;
};

export async function getLegalPage(
  locale: string,
): Promise<LegalPageFlat | null> {
  try {
    const legalPageRaw = await directus.request<LegalPageRaw>(
      readSingleton('legalpage', {
        fields: [
          {
            translations: ['languages_code', 'page_body'],
          },
        ],
        deep: {
          translations: {
            _filter: { languages_code: { _in: [locale] } },
          },
        },
      }),
    );
    console.log('legalPageRaw', legalPageRaw);

    const legalPageFlat: LegalPageFlat = {
      body: legalPageRaw.translations?.[0]?.page_body ?? null,
    };

    return legalPageFlat;
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
