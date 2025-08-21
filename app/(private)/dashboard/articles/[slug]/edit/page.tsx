export default function EditArticle({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  return <div>Edit Article {slug} Page</div>;
}
