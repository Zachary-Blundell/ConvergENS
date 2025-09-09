// app/(private)/admin/associations/[slug]/edit/page.tsx
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditAssociationForm from "./EditAssociationForm";

type SlugParams = { slug: string };

export default async function Page({
  params,
}: {
  params: Promise<SlugParams>;
}) {
  const { slug } = await params;

  const assoc = await prisma.association.findUnique({
    where: { slug },
    include: { socials: true },
  });
  if (!assoc) notFound();

  const initial = {
    name: assoc.name,
    slug: assoc.slug,
    color: assoc.color ?? "#ffffff",
    summary: assoc.summary ?? "",
    description: assoc.description ?? "",
    contactEmail: assoc.contactEmail ?? undefined,
    phone: assoc.phone ?? undefined,
    website: assoc.website ?? undefined,
    socials: assoc.socials.map((s) => ({
      platform: s.platform, // string enum from Prisma
      url: s.url,
    })),
  };

  return <EditAssociationForm id={assoc.id} initial={initial} />;
}
