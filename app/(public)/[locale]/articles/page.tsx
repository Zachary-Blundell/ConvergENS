// [local]/articles
// ConvergENS Articles-page

import {
  getArticleCards,
  getArticleCount,
  perPage as perPage,
} from '@/lib/cms/articles';
import { ArticleCardGrid } from '@/components/ArticleCard';
import { getAllTagsForUI } from '@/lib/cms/tags';
import FiltersBar from './FiltersBar';
import Pagination from '@/components/Pagination';
import { getAllCollectivesForUI } from '@/lib/cms/collectives';
import { getTranslations } from 'next-intl/server';

async function ShowCards({ articles, currentPage, articleCount }) {
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
  searchParams: Promise<{ page: string; tag: string; collective: string }>;
}) {
  const { locale } = await params;
  const { page, tag, collective } = await searchParams;

  const currentPage = page ? parseInt(page) : 1;
  const currentTag = tag ? parseInt(tag) : null;
  const currentCollective = collective ? parseInt(collective) : null;

  const articles = await getArticleCards(locale, currentPage, tag, collective);
  const articleCount = await getArticleCount();

  const tagOptions = await getAllTagsForUI(locale);
  const collectiveOptions = await getAllCollectivesForUI();

  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="py-5" />
      <FiltersBar
        collectives={collectiveOptions}
        tags={tagOptions}
        selectedTag={currentTag}
        selectedCollective={currentCollective}
      />
      <ShowCards
        articles={articles}
        currentPage={currentPage}
        articleCount={articleCount}
      />
    </main>
  );
}
