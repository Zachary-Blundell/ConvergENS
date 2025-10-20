// [local]/articles
// ConvergENS Articles-page

import {
  ArticleCard,
  getArticleCards,
  getArticleCount,
  perPage as perPage,
} from '@/lib/cms/articles';
import { ArticleCardGrid } from '@/components/ArticleCard';
import { getAllTagsForUI } from '@/lib/cms/tags';
import FiltersBar from './FiltersBar';
import Pagination from '@/components/Pagination';
import { getTranslations } from 'next-intl/server';
import { getAllCollectivesForUI } from '@/lib/cms/collectives';

async function ShowCards({
  articles,
  currentPage,
  articleCount,
}: {
  articles: Array<ArticleCard>;
  currentPage: number;
  articleCount: number;
}) {
  const t = await getTranslations('ArticlesPage');

  if (articles.length === 0) {
    return (
      <div className="p-10 flex justify-center align-middle h-[50vh]">
        <div className="bg-gradient-to-t from-surface-2 to-surface-3 flex flex-col p-10 my-auto rounded-lg shadow-l">
          <h2>{t('noArticles')}</h2>
          <p className="mt-2 text-fg-muted">{t('tryDifferentFilters')}</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <ArticleCardGrid items={articles} />
      <Pagination
        perPage={perPage}
        currentPage={currentPage}
        count={articleCount}
      />
    </>
  );
}

export default async function ArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page: string; tag: string; organisation: string }>;
}) {
  const { locale } = await params;
  const { page, tag, organisation } = await searchParams;

  const currentPage = page ? parseInt(page) : 1;
  const currentTag = tag ? parseInt(tag) : null;
  const currentOrganisation = organisation ? parseInt(organisation) : null;

  const articles = await getArticleCards(
    locale,
    currentPage,
    tag,
    organisation,
  );
  const articleCount = await getArticleCount();

  const tagOptions = await getAllTagsForUI(locale);
  const organisationOptions = await getAllCollectivesForUI();

  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="py-5" />
      <FiltersBar
        organisations={organisationOptions}
        tags={tagOptions}
        selectedTag={currentTag}
        selectedOrganisation={currentOrganisation}
      />
      <ShowCards
        articles={articles}
        currentPage={currentPage}
        articleCount={articleCount}
      />
    </main>
  );
}
