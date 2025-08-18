//[local]/associations/[associationName]/articles/[articleSlug]
//Article-page

export default async function articlePage({
  params,
}: {
  params: Promise<{ associationName: string; articleSlug: string }>;
}) {
  const { associationName, articleSlug } = await params;

  return (
    <div>
      <h1>{articleSlug}</h1>
      <p>
        This is an example of the article page for the association{" "}
        {associationName}. Here you would see the rendered markdown
      </p>
    </div>
  );
}
