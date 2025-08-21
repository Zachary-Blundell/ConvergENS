export default function EditAssociation({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  return <div>Edit Association {slug} Page</div>;
}
