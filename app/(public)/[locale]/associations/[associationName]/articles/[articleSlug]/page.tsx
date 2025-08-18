//[local]/associations/[associationName]/articles/[articleSlug]
//Article-page

export default async function articlePage({
  params,
}: {
  params: Promise<{ articleSlug: string }>;
}) {
  const { articleSlug } = await params;

  return <div>{articleSlug}</div>;
}
