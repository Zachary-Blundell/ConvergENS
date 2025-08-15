export default async function associationPage({
  params,
}: {
  params: Promise<{ associationName: string }>;
}) {
  const { associationName } = await params;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">
        Association {associationName} page
      </h1>
      <p className="mt-2 text-gray-600">
        demonstration of navigation and active link styling for association{" "}
        {associationName}.
      </p>
    </section>
  );
}
