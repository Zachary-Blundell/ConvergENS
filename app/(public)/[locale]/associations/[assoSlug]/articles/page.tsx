//[local]/associations/[associationName]/articles
//Articles-page
// import type { Metadata } from "next";

// import { getGlobalMetadata, getItemById } from "@/lib/directus";
import { getArticleBySlug } from "@/lib/cms/articles";
import Container from "@/components/Container";

interface ArticleParams {
  params: {
    articleSlug: string;
  };
}

// export async function generateMetadata({ params }: ArticleParams): Promise<Metadata> {
//   const global = await getGlobalMetadata();
//   const article = await getArticleBySlug(params.articleSlug, {
//     fields: ["title"],
//   });
//   return {
//     title: `${article.title} - ${global.title}`,
//     // description: '' // Add new field for excerpt or SEO Metadata
//   }
// }

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ articleSlug: string }>;
}) {
  const slug = (await params).articleSlug;

  const data = await getArticleBySlug(slug, {
    fields: ["title", "body", "categories.article_categories_slug"],
  });

  const categorySlugs = data.categories
    ?.filter((category) => typeof category === "object")
    .map(({ article_categories_slug }) => article_categories_slug);

  const categories =
    categorySlugs &&
    (await Promise.all(
      categorySlugs.map(async (categorySlug) => {
        return getItemById("article_categories", categorySlug, {
          fields: ["title"],
        });
      }),
    ));

  return (
    <>
      <section className="bg-slate-50">
        <Container className="prose max-w-4xl -mt-8 py-28">
          <header className="text-center mx-auto mb-16">
            <h1 className="text-5xl leading-none mb-4">{data.title}</h1>
            <p className="text-lg text-slate-600">
              Published{" "}
              {data.date_created &&
                new Date(data.date_created).toLocaleDateString()}{" "}
              in {categories?.map(({ title }) => title).join(", ") || "None"}
            </p>
          </header>
          {Array.isArray(data.body?.blocks) && (
            <div>
              {data.body.blocks.map((block) => {
                if (block.type === "header") {
                  return (
                    <h2
                      key={block.id}
                      dangerouslySetInnerHTML={{
                        __html: block.data.text,
                      }}
                    />
                  );
                }
                if (block.type === "paragraph") {
                  return (
                    <p
                      key={block.id}
                      dangerouslySetInnerHTML={{
                        __html: block.data.text,
                      }}
                    />
                  );
                }
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

// EOF

//
// import Link from "next/link";
//
//
// export default async function AssociationArticlesPage({
//   params,
// }: {
//   params: Promise<{ associationName: string }>;
// }) {
//   const { associationName } = await params;
//
//   type articleLink = {
//     name: string;
//     slug: string;
//   };
//
//   let articles: articleLink[] = [];
//
//   switch (associationName) {
//     case "migrens":
//       articles = [
//         { name: "Article MigrENS 1", slug: "migrens-article-1" },
//         { name: "Article MigrENS 2", slug: "migrens-article-2" },
//         { name: "Article MigrENS 3", slug: "migrens-article-3" },
//         { name: "Article MigrENS 4", slug: "migrens-article-4" },
//       ];
//       break;
//     case "arabisens":
//       articles = [
//         { name: "Article Arabisens 1", slug: "arabisens-article-1" },
//         { name: "Article Arabisens 2", slug: "arabisens-article-2" },
//         { name: "Article Arabisens 3", slug: "arabisens-article-3" },
//         { name: "Article Arabisens 4", slug: "arabisens-article-4" },
//       ];
//       break;
//     case "ecocampus":
//       articles = [
//         { name: "Article Ecocampus 1", slug: "ecocampus-article-1" },
//         { name: "Article Ecocampus 2", slug: "ecocampus-article-2" },
//         { name: "Article Ecocampus 3", slug: "ecocampus-article-3" },
//         { name: "Article Ecocampus 4", slug: "ecocampus-article-4" },
//       ];
//       break;
//     case "eclore":
//       articles = [
//         { name: "Article ECLORE 1", slug: "eclore-article-1" },
//         { name: "Article ECLORE 2", slug: "eclore-article-2" },
//         { name: "Article ECLORE 3", slug: "eclore-article-3" },
//         { name: "Article ECLORE 4", slug: "eclore-article-4" },
//       ];
//
//       break;
//
//     default:
//       articles = [
//         { name: "Article generic 1", slug: "generic-article-1" },
//         { name: "Article generic 2", slug: "generic-article-2" },
//         { name: "Article generic 3", slug: "generic-article-3" },
//         { name: "Article generic 4", slug: "generic-article-4" },
//       ];
//       break;
//   }
//   return (
//     <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//       <h1 className="text-2xl font-semibold">
//         Articles for association {associationName}{" "}
//       </h1>
//       <p className="mt-2 text-gray-600">
//         Route to demonstrate the list of articles for a specific association
//         called: {associationName}
//       </p>
//       <ul>
//         {articles.map((article: articleLink, key: number) => (
//           <Link
//             key={key}
//             href={"/en/associations/associationName/articles/" + article.slug}
//             className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 mx-1 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none"
//           >
//             {article.name}
//           </Link>
//         ))}
//       </ul>
//     </section>
//   );
// }
