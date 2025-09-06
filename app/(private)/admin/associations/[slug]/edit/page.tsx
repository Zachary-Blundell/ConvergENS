// app/associations/[slug]/edit/page.tsx
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditAssociationForm from "./EditAssociationForm";

export default async function Page({ params }: { params: { slug: string } }) {
  // TODO: add auth
  // await requireAdmin();
  const assoc = await prisma.association.findFirst({
    where: { slug: params.slug },
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
  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <div className="mb-6 flex items-center justify-between">
  //       <h1 className="text-2xl font-bold">Edit association</h1>
  //       <Button variant="outline" asChild>
  //         <Link href="/admin/associations">← Back to list</Link>
  //       </Button>
  //     </div>
  //
  //     <Card>
  //       <CardHeader>
  //         <CardTitle>{assoc.name}</CardTitle>
  //       </CardHeader>
  //       {/* <CardContent>{ */}
  //       {/*    <EditAssociationForm initial={row} /> */}
  //       {/* }</CardContent> */}
  //       <CardContent>{initial.slug}</CardContent>
  //       <CardContent>{initial.description}</CardContent>
  //       <CardContent>{initial.summary}</CardContent>
  //     </Card>
  //   </div>
  // );
}
