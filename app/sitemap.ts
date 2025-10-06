// app/sitemap.ts
import type { MetadataRoute } from "next";

const LOCALES = ["en", "fr"]; // <- change to your locales

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

// TODO: wire up CMS
async function getArticleIds(): Promise<string[]> {
  return [];
}
async function getCollectiveSlugs(): Promise<string[]> {
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articleIds, collectiveSlugs] = await Promise.all([
    getArticleIds(),
    getCollectiveSlugs(),
  ]);

  const staticPerLocale = (locale: string) => [
    `/${locale}`,
    `/${locale}/articles`,
    `/${locale}/calendar`,
    `/${locale}/collectives`,
    `/${locale}/newspaper`,
    `/${locale}/sitemap`,
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    // Static pages
    for (const path of staticPerLocale(locale)) {
      entries.push({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    // Dynamic: articles
    for (const id of articleIds) {
      entries.push({
        url: `${SITE_URL}/${locale}/articles/${id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    // Dynamic: collectives
    for (const slug of collectiveSlugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/collectives/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
