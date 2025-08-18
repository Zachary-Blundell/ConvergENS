//[local]/associations/[associationName]
//association-page

import Link from "next/link";

export default async function associationPage({
  params,
}: {
  params: Promise<{ associationName: string }>;
}) {
  const { associationName } = await params;

  if (associationName)
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">
          Association {associationName} page
        </h1>
        <p className="mt-2 text-gray-600">
          Demonstration of navigation and active link styling for association{" "}
          {associationName}.
        </p>
        <Link
          href={"/en/associations/" + associationName + "/articles/"}
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 mx-1 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none"
        >
          Articles
        </Link>
      </section>
    );
}
