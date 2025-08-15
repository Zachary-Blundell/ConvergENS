export default async function associationPage({
  params,
}: {
  params: Promise<{ associationId: string }>;
}) {
  const { associationId } = await params;

  return <div>{associationId}</div>;
}
