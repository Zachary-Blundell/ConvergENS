// app/(private)/admin/associations/new/page.tsx (server component)
import type { Metadata } from "next";
import NewAssociationForm from "./NewAssociationForm";

export const metadata: Metadata = {
  title: "Administration — Nouvelle association",
  description: "Créer une nouvelle association",
};

export default function NewAssociationPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nouvelle association</h1>
        <p className="text-sm text-muted-foreground">
          Renseignez les informations de base puis enregistrez.
        </p>
      </div>
      <NewAssociationForm />
    </main>
  );
}
