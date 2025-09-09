// // app/[local]/associations/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, Phone, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";

export const revalidate = 60; // ISR: refresh every 60s

async function getAssociation(slug: string) {
  const assoc = await prisma.association.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      summary: true,
      color: true,
      description: true,
      logoUrl: true,
      contactEmail: true,
      phone: true,
      website: true,
      socials: {
        select: {
          platform: true,
          url: true,
        },
      },
    },
  });
  return assoc;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const assoc = await getAssociation(slug);
  if (!assoc) return { title: "Association not found" };

  const title = `${assoc.name} — ConvergENS`;
  const description = assoc.summary ?? "Association page";

  return {
    title,
    description,
    alternates: { canonical: `/associations/${assoc.slug}` },
    openGraph: {
      title,
      description,
      url: `/associations/${assoc.slug}`,
      images: assoc.logoUrl ? [{ url: assoc.logoUrl, alt: assoc.name }] : [],
      type: "website",
    },
  };
}

export default async function AssociationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const assoc = await getAssociation(slug);

  if (!assoc) notFound();

  return (
    // Main column
    <div className="container mx-auto max-w-5xl px-4 py-8 ">
      <div className="flex flex-row justify-between ">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Logo */}
          {assoc.logoUrl ? (
            <div className="shrink-0">
              <Image
                src={assoc.logoUrl}
                alt={`${assoc.name} logo`}
                width={96}
                height={96}
                className="rounded-lg border"
                priority
              />
            </div>
          ) : (
            <div
              className="flex h-24 w-24 items-center justify-center rounded-lg border text-xl font-semibold"
              aria-hidden
            >
              {assoc.name}
            </div>
          )}

          {/* Title + Summary + CTAs */}
          <div className="min-w-0 ">
            <h1 className="text-3xl tracking-tight">{assoc.name}</h1>
            {assoc.summary && (
              <p className="mt-1 text-muted-foreground">{assoc.summary}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {assoc.website && (
                <Button asChild>
                  <a
                    href={assoc.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Visit website
                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              {assoc.contactEmail && (
                <Button variant="outline" asChild>
                  <a href={`mailto:${assoc.contactEmail}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </a>
                </Button>
              )}
              {assoc.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${assoc.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border">
            <div className="p-4">
              <h2 className="text-fg-primary uppercase tracking-wide">
                Socials
              </h2>

              <ul className="mt-3 space-y-2">
                {assoc.socials.length > 0 ? (
                  assoc.socials.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex max-w-full items-center gap-2 truncate text-sm hover:underline"
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: "var(--brand)" }}
                        />
                        <span className="truncate">
                          {prettyPlatform(s.platform)}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">
                    No social links yet.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <Separator className="my-8" />

      {/* Main content */}
      <div className="grid gap-8">
        {/* Description */}
        <article className="text-fg-primary text-justify">
          {assoc.description ? (
            <p>{assoc.description}</p>
          ) : (
            <p className="text-muted-foreground">
              No description has been provided yet.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}

/* ---------- small helpers ---------- */

function prettyPlatform(p: string) {
  // e.g., "youtube" -> "YouTube"
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function cleanUrl(url: string) {
  try {
    const u = new URL(url);
    return u.host.replace(/^www\./, "") + u.pathname.replace(/\/$/, "");
  } catch {
    return url;
  }
}
// import { prisma } from "@/lib/db";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import SocialLinks from "@/components/SocialLinks";
//
// type PageProps = {
//   params: Promise<{ locale: string; associationSlug: string }>; // note: Promise here
// };
// const PLACEHOLDER_LOGO = "/images/placeholder.png";
//
// export async function generateMetadata({ params }: PageProps) {
//   const slug = (await params).associationSlug;
//   const assoc = await prisma.association.findUnique({
//     where: { slug },
//     select: { name: true, summary: true },
//   });
//
//   if (!assoc) return { title: "Association not found" };
//   return {
//     title: assoc.name,
//     description: assoc.summary ?? "Association details",
//   };
// }
//
// export default async function AssociationPage({ params }: PageProps) {
//   const { associationSlug: slug, locale } = await params;
//
//   const assoc = await prisma.association.findUnique({
//     where: { slug },
//     select: {
//       id: true,
//       name: true,
//       slug: true,
//       summary: true,
//       color: true,
//       description: true,
//       logoUrl: true,
//       contactEmail: true,
//       phone: true,
//       website: true,
//       socials: {
//         select: {
//           platform: true,
//           url: true,
//         },
//       },
//     },
//   });
//
//   if (!assoc) notFound();
//
//   const logo = assoc.logoUrl ?? PLACEHOLDER_LOGO;
//
//   return (
//     <main className="container px-4 py-12 mx-auto">
//       <Link
//         href={`/${locale}/associations`}
//         className="inline-block mb-6 text-sm underline underline-offset-4"
//       >
//         ← Back to associations
//       </Link>
//
//       <div className="flex flex-col gap-6 md:flex-row">
//         <div className="shrink-0 w-28 h-28 rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
//           <Image
//             src={logo}
//             alt={`${assoc.name} logo`}
//             width={112}
//             height={112}
//           />
//         </div>
//
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold" style={{ color: assoc.color }}>
//             {assoc.name}
//           </h1>
//           {assoc.summary && (
//             <p className="mt-2 text-slate-700 dark:text-slate-300">
//               {assoc.summary}
//             </p>
//           )}
//           {assoc.website && (
//             <p className="mt-4">
//               <a
//                 href={assoc.website}
//                 className="underline underline-offset-4"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Visit website
//               </a>
//             </p>
//           )}
//
//           {assoc.socials?.length ? (
//             <div className="mt-6">
//               <h2 className="mb-2 text-lg font-semibold">Socials</h2>
//               <SocialLinks socials={assoc.socials} showLabels size="md" />
//             </div>
//           ) : null}
//         </div>
//       </div>
//
//       {assoc.description && (
//         <article className="prose dark:prose-invert mt-8">
//           <p>{assoc.description}</p>
//         </article>
//       )}
//     </main>
//   );
// }
