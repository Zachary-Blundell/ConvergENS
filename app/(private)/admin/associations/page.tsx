import Link from "next/link";
// import { Suspense } from "react";
// import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
// import { requireAdmin } from "@/lib/auth"; // replace with your guard
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

async function getData(q: string) {
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const rows = await prisma.association.findMany({
    where,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      summary: true,
      contactEmail: true,
      website: true,
    },
  });
  return rows;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  // await requireAdmin();
  const q = searchParams?.q?.toString() ?? "";
  const rows = await getData(q);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Associations</h1>
        <div className="flex items-center gap-2">
          <form action="/admin/associations" className="flex gap-2">
            <Input
              name="q"
              defaultValue={q}
              placeholder="Search name, slug, summary"
            />
            <Button type="submit" variant="secondary">
              Rechercher
            </Button>
          </form>
          <Button asChild>
            <Link href="/admin/associations/new">Nouvelle association</Link>
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">
          Aucune association trouvée{q ? ` for “${q}”` : ""}.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1 py-0.5 text-sm">
                      {r.slug}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-[36ch] truncate">
                    {r.summary}
                  </TableCell>
                  <TableCell className="space-x-2">
                    {r.contactEmail && (
                      <Badge variant="outline">{r.contactEmail}</Badge>
                    )}
                    {r.website && (
                      <a
                        href={r.website}
                        target="_blank"
                        className="underline underline-offset-2"
                      >
                        Website
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/associations/${r.slug}/edit`}>
                        Modifier
                      </Link>
                    </Button>
                    <DeleteButton id={r.id} name={r.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
