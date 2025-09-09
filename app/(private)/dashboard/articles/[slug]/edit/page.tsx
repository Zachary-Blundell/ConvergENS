// app/(private)/dashboard/articles/[slug]/edit/page.tsx

export default async function EditArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <div>Edit Article {slug} Page</div>;
}
