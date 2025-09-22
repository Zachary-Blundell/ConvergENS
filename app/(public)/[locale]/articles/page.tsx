// [local]/articles
// ConvergENS Articles-page

import {
  getArticleCards,
  getArticleCount,
  perPage as perPage,
} from "@/lib/cms/articles";
import { ArticleCardGrid } from "@/components/ArticleCard";
import { getAllTagsForUI } from "@/lib/cms/tags";
import FiltersBar from "./FiltersBar";
import Pagination from "@/components/Pagination";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page: string; tag: string }>;
}) {
  const { locale } = await params;
  const { page, tag } = await searchParams;

  const currentPage = page ? parseInt(page) : 1;

  const articles = await getArticleCards(locale, currentPage, tag);
  const articleCount = await getArticleCount();
  const tagOptions = await getAllTagsForUI(locale);

  return (
    <main className="flex flex-col gap-6 p-6">
      <FiltersBar tags={tagOptions} selectedTag={tag} />
      <ArticleCardGrid items={articles} />
      <Pagination
        perPage={perPage}
        currentPage={currentPage}
        count={articleCount}
      />
    </main>
  );
}
