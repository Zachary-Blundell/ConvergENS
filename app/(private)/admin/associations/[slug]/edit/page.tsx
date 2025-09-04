import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { requireAdmin } from "@/lib/auth";
// import { EditAssociationForm } from "./parts/EditAssociationForm"; // provided below

export default async function Page({ params }: { params: { slug: string } }) {
  // TODO: add auth
  // await requireAdmin();

  const row = await prisma.association.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      summary: true,
      description: true,
      contactEmail: true,
      phone: true,
      website: true,
    },
  });

  if (!row) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit association</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/associations">← Back to list</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{row.name}</CardTitle>
        </CardHeader>
        {/* <CardContent>{ */}
        {/*    <EditAssociationForm initial={row} /> */}
        {/* }</CardContent> */}
        <CardContent>EditAssociationForm</CardContent>
      </Card>
    </div>
  );
}
