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

  const articles = await getArticleCards(locale, currentPage, tag);
  const articleCount = await getArticleCount();

  const tagOptions = await getAllTagsForUI(locale);
  const collectiveOptions = await getAllCollectivesForUI(locale);

  return (
    <main className="flex flex-col gap-6 p-6">
      <FiltersBar
        collectives={collectiveOptions}
        tags={tagOptions}
        selectedTag={currentTag}
        selectedCollective={currentCollective}
      />
      <ArticleCardGrid items={articles} />
      <Pagination
        perPage={perPage}
        currentPage={currentPage}
        count={articleCount}
      />
    </main>
  );
}
