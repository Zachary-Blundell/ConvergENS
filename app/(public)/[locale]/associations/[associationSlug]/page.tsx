// app/[local]/associations/[slug]/page.tsx
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";

type PageProps = {
  params: Promise<{ locale: string; associationSlug: string }>; // note: Promise here
};
const PLACEHOLDER_LOGO = "/images/placeholder.png";

export async function generateMetadata({ params }: PageProps) {
  const slug = (await params).associationSlug;
  const assoc = await prisma.association.findUnique({
    where: { slug },
    select: { name: true, summary: true },
  });

  if (!assoc) return { title: "Association not found" };
  return {
    title: assoc.name,
    description: assoc.summary ?? "Association details",
  };
}

export default async function AssociationPage({ params }: PageProps) {
  const { associationSlug: slug, locale } = await params;

  const assoc = await prisma.association.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      summary: true,
      description: true,
      logoUrl: true,
      website: true,
      color: true,
      slug: true,
      socials: {
        select: {
          platform: true,
          url: true,
          handle: true,
          label: true,
          isPrimary: true,
        },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!assoc) notFound();

  const logo = assoc.logoUrl ?? PLACEHOLDER_LOGO;

  return (
    <main className="container px-4 py-12 mx-auto">
      <Link
        href={`/${locale}/associations`}
        className="inline-block mb-6 text-sm underline underline-offset-4"
      >
        ← Back to associations
      </Link>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="shrink-0 w-28 h-28 rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
          <Image
            src={logo}
            alt={`${assoc.name} logo`}
            width={112}
            height={112}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold" style={{ color: assoc.color }}>
            {assoc.name}
          </h1>
          {assoc.summary && (
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              {assoc.summary}
            </p>
          )}
          {assoc.website && (
            <p className="mt-4">
              <a
                href={assoc.website}
                className="underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit website
              </a>
            </p>
          )}

          {assoc.socials?.length ? (
            <div className="mt-6">
              <h2 className="mb-2 text-lg font-semibold">Socials</h2>
              <SocialLinks socials={assoc.socials} showLabels size="md" />
            </div>
          ) : null}
        </div>
      </div>

      {assoc.description && (
        <article className="prose dark:prose-invert mt-8">
          <p>{assoc.description}</p>
        </article>
      )}
    </main>
  );
}
