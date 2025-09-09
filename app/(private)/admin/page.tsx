// app/(private)/admin/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Database,
  Plus,
  ArrowRight,
  ChevronRight,
  Settings,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Administration — Tableau de bord",
  description: "Vue d'ensemble du contenu du site et actions rapides.",
};

function fmt(dt: Date | string | null | undefined) {
  if (!dt) return "—";
  const d = typeof dt === "string" ? new Date(dt) : dt;
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toLocaleString("fr-FR");
  }
}

async function getData() {
  const [assocCount] = await Promise.all([prisma.association.count()]);

  const recentAssociations = await prisma.association.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return { assocCount, recentAssociations };
}

export default async function AdminDashboardPage() {
  const { assocCount, recentAssociations } = await getData();

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">
            Tableau de bord — Administration
          </h1>
          <p className="text-sm text-muted-foreground">
            Bon retour&nbsp;! Voici un aperçu rapide.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/associations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle association
            </Button>
          </Link>
          <Link href="/admin/associations">
            <Button variant="outline">
              Gérer les associations <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Associations</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assocCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Associations au total
            </p>
          </CardContent>
          <CardFooter className="justify-end">
            <Link
              href="/admin/associations"
              className="text-sm inline-flex items-center"
            >
              Voir tout <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Système</CardTitle>
            <Database className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">OK</div>
            <p className="text-xs text-muted-foreground mt-1">
              Prisma et base de données accessibles
            </p>
          </CardContent>
          <CardFooter className="justify-end">
            <Link href="/admin" className="text-sm inline-flex items-center">
              Paramètres <Settings className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* Listes récentes */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Associations récentes</CardTitle>
            <CardDescription>Vos dernières modifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden sm:table-cell">Slug</TableHead>
                  <TableHead className="text-right">Mis à jour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAssociations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground py-8"
                    >
                      Aucune association pour l’instant.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentAssociations.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          /{a.slug}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        /{a.slug}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {fmt(a.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-end">
            <Link
              href="/admin/associations"
              className="text-sm inline-flex items-center"
            >
              Gérer les associations <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
//
// // app/(private)/admin/page.tsx
// import type { Metadata } from "next";
// import Link from "next/link";
// import { prisma } from "@/lib/db";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Separator } from "@/components/ui/separator";
// import {
//   Users,
//   Database,
//   Plus,
//   ArrowRight,
//   ChevronRight,
//   Settings,
// } from "lucide-react";
//
// export const metadata: Metadata = {
//   title: "Admin — Dashboard",
//   description: "Overview of site content and quick actions.",
// };
//
// function fmt(dt: Date | string | null | undefined) {
//   if (!dt) return "—";
//   const d = typeof dt === "string" ? new Date(dt) : dt;
//   try {
//     return new Intl.DateTimeFormat("en-GB", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }).format(d);
//   } catch {
//     return d.toLocaleString();
//   }
// }
//
// async function getData() {
//   const [assocCount] = await Promise.all([prisma.association.count()]);
//
//   const recentAssociations = await prisma.association.findMany({
//     select: {
//       id: true,
//       name: true,
//       slug: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//     orderBy: { updatedAt: "desc" },
//     take: 5,
//   });
//
//   return { assocCount, recentAssociations };
// }
//
// export default async function AdminDashboardPage() {
//   const { assocCount, recentAssociations } = await getData();
//
//   return (
//     <main className="container mx-auto px-4 py-10">
//       <div className="mb-8 flex items-start justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
//           <p className="text-sm text-muted-foreground">
//             Welcome back. Here's a quick overview.
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Link href="/admin/associations/new">
//             <Button>
//               <Plus className="mr-2 h-4 w-4" /> New Association
//             </Button>
//           </Link>
//           <Link href="/admin/associations">
//             <Button variant="outline">
//               Manage Associations <ArrowRight className="ml-2 h-4 w-4" />
//             </Button>
//           </Link>
//         </div>
//       </div>
//
//       {/* Stats */}
//       <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <Card className="shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Associations</CardTitle>
//             <Users className="h-5 w-5 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">{assocCount}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Total associations
//             </p>
//           </CardContent>
//           <CardFooter className="justify-end">
//             <Link
//               href="/admin/associations"
//               className="text-sm inline-flex items-center"
//             >
//               View all <ChevronRight className="ml-1 h-4 w-4" />
//             </Link>
//           </CardFooter>
//         </Card>
//
//         <Card className="shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">System</CardTitle>
//             <Database className="h-5 w-5 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-lg font-semibold">OK</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Prisma & DB reachable
//             </p>
//           </CardContent>
//           <CardFooter className="justify-end">
//             <Link href="/admin" className="text-sm inline-flex items-center">
//               Settings <Settings className="ml-1 h-4 w-4" />
//             </Link>
//           </CardFooter>
//         </Card>
//       </section>
//
//       <Separator className="my-8" />
//
//       {/* Recent lists */}
//       <section className="grid gap-6 lg:grid-cols-2">
//         <Card className="shadow-sm">
//           <CardHeader>
//             <CardTitle className="text-base">Recent Associations</CardTitle>
//             <CardDescription>Your latest changes</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead className="hidden sm:table-cell">Slug</TableHead>
//                   <TableHead className="text-right">Updated</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {recentAssociations.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={3}
//                       className="text-center text-muted-foreground py-8"
//                     >
//                       No associations yet.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   recentAssociations.map((a) => (
//                     <TableRow key={a.id}>
//                       <TableCell>
//                         <div className="font-medium">{a.name}</div>
//                         <div className="text-xs text-muted-foreground sm:hidden">
//                           /{a.slug}
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell text-muted-foreground">
//                         /{a.slug}
//                       </TableCell>
//                       <TableCell className="text-right text-muted-foreground">
//                         {fmt(a.updatedAt)}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//           <CardFooter className="justify-end">
//             <Link
//               href="/admin/associations"
//               className="text-sm inline-flex items-center"
//             >
//               Manage associations <ChevronRight className="ml-1 h-4 w-4" />
//             </Link>
//           </CardFooter>
//         </Card>
//       </section>
//     </main>
//   );
// }
