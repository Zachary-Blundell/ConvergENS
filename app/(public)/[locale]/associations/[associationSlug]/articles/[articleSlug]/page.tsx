//[local]/associations/[associationName]/articles/[articleSlug]
//Article-page

import Image from "next/image";

export default async function articlePage({
  params,
}: {
  params: Promise<{ associationName: string; articleSlug: string }>;
}) {
  const { associationName, articleSlug } = await params;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">{articleSlug}</h1>
      <Image
        alt="placeholder image"
        src="/placeholder.png"
        width={1200}
        height={800}
        className="w-400"
        style={{
          border: "1px solid #000",
          width: "500px",
          height: "auto",
        }}
      />
      <p>
        This is an example of the article page for the association{" "}
        {associationName}. Here you would see the rendered markdown
      </p>
    </section>
  );
}
