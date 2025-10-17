import { readSingleton } from '@directus/sdk';
import { directus } from '../directus';

type ContactPageRaw = {
  translations: Array<{
    languages_code: string;
    page_body?: string | null;
  }>;
};

export type ContactPageFlat = {
  body?: string | null;
};

export async function getContactPage(
  locale: string,
): Promise<ContactPageFlat | null> {
  try {
    const contactPageRaw = await directus.request<ContactPageRaw>(
      readSingleton('contactpage', {
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

    const contactPageFlat: ContactPageFlat = {
      body: contactPageRaw.translations?.[0]?.page_body ?? null,
    };

    return contactPageFlat;
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
