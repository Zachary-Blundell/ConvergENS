export default async function articlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;

  return <div>{articleId}</div>;
}
