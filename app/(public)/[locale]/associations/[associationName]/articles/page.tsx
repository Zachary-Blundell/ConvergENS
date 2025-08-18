//[local]/associations/[associationName]/articles
//Articles-page

export default async function AssociationArticlesPage({
  params,
}: {
  params: Promise<{ associationName: string }>;
}) {
  const { associationName } = await params;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">
        Articles for association {associationName}{" "}
      </h1>
      <p className="mt-2 text-gray-600">
        Route to demonstrate the list of articles for a specific association
        called: {associationName}
      </p>
    </section>
  );
}
