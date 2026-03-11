import {
  getArticleCards,
  perPageConstant,
} from '@/lib/cms/articles';
import { getAllTagsForUI } from '@/lib/cms/tags';
import FiltersBar from './FiltersBar';
import Pagination from '@/components/Pagination';
import { getTranslations } from 'next-intl/server';
import { CardArticleFlat } from '@/lib/cms/articles.types';
import { ArticleCardGrid } from '@/components/ArticleCard';
import { getAllOrganisationsForUI } from '@/lib/cms/organisations';

async function ShowCards({
  t,
  articles,
  currentPage,
  articleCount,
}: {
  t: (key: string) => string;
  articles: Array<CardArticleFlat>;
  currentPage: number;
  articleCount: number;
}) {
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
        perPage={perPageConstant}
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
  searchParams: Promise<{ page?: string; tag?: string; organisation?: string }>;
}) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);


  const currentPage = sp.page ? Number(sp.page) : 1;
  const currentTag = sp.tag ? Number(sp.tag) : null;
  const currentOrganisation = sp.organisation ? Number(sp.organisation) : null;

  const [t, articlesData, tagOptions, organisationOptions] =
    await Promise.all([
      getTranslations('ArticlesPage'),
      getArticleCards({
        locale,
        page: currentPage,
        tagId: currentTag,
        collectiveId: currentOrganisation,
        numberOfArticles: perPageConstant,
      }),
      getAllTagsForUI(locale),
      getAllOrganisationsForUI(),
    ]);

  const articles = articlesData.data;
  const articleCount = articlesData.total;

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
        t={t}
        articles={articles}
        currentPage={currentPage}
        articleCount={articleCount}
      />
    </main>
  );
}
