export default async function articlePage({
  params,
}: {
  params: Promise<{ articleSlug: string }>;
}) {
  const { articleSlug } = await params;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">
        Article articleSlug: {articleSlug} for ConvergENS
      </h1>
      <p className="mt-2 text-gray-600">
        Route to demonstrate an article page for ConvergENS. This page is used
        to show an article.
      </p>
    </section>
  );
}
