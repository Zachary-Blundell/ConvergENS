//[local]/associations/[associationName]/articles
//Articles-page

import Link from "next/link";

export default async function AssociationArticlesPage({
  params,
}: {
  params: Promise<{ associationName: string }>;
}) {
  const { associationName } = await params;

  type articleLink = {
    name: string;
    slug: string;
  };

  let articles: articleLink[] = [];

  switch (associationName) {
    case "migrens":
      articles = [
        { name: "Article MigrENS 1", slug: "migrens-article-1" },
        { name: "Article MigrENS 2", slug: "migrens-article-2" },
        { name: "Article MigrENS 3", slug: "migrens-article-3" },
        { name: "Article MigrENS 4", slug: "migrens-article-4" },
      ];
      break;
    case "arabisens":
      articles = [
        { name: "Article Arabisens 1", slug: "arabisens-article-1" },
        { name: "Article Arabisens 2", slug: "arabisens-article-2" },
        { name: "Article Arabisens 3", slug: "arabisens-article-3" },
        { name: "Article Arabisens 4", slug: "arabisens-article-4" },
      ];
      break;
    case "ecocampus":
      articles = [
        { name: "Article Ecocampus 1", slug: "ecocampus-article-1" },
        { name: "Article Ecocampus 2", slug: "ecocampus-article-2" },
        { name: "Article Ecocampus 3", slug: "ecocampus-article-3" },
        { name: "Article Ecocampus 4", slug: "ecocampus-article-4" },
      ];
      break;
    case "eclore":
      articles = [
        { name: "Article ECLORE 1", slug: "eclore-article-1" },
        { name: "Article ECLORE 2", slug: "eclore-article-2" },
        { name: "Article ECLORE 3", slug: "eclore-article-3" },
        { name: "Article ECLORE 4", slug: "eclore-article-4" },
      ];

      break;

    default:
      articles = [
        { name: "Article generic 1", slug: "generic-article-1" },
        { name: "Article generic 2", slug: "generic-article-2" },
        { name: "Article generic 3", slug: "generic-article-3" },
        { name: "Article generic 4", slug: "generic-article-4" },
      ];
      break;
  }
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">
        Articles for association {associationName}{" "}
      </h1>
      <p className="mt-2 text-gray-600">
        Route to demonstrate the list of articles for a specific association
        called: {associationName}
      </p>
      <ul>
        {articles.map((article: articleLink, key: number) => (
          <Link
            key={key}
            href={"/en/associations/associationName/articles/" + article.slug}
            className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 mx-1 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none"
          >
            {article.name}
          </Link>
        ))}
      </ul>
    </section>
  );
}
