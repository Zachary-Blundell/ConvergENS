export type Group = {
  id: string;
  name: string;
  blurb?: string;
  image?: string;
};

/* ---------------- Demo data ---------------- */
export const GROUPS: Group[] = [
  {
    id: "1",
    name: "Syndicat Étudiant ENS",
    blurb:
      "Mobilisations étudiantes, entraide et défense des droits sur le campus.",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "2",
    name: "Club Climat ENS",
    blurb:
      "Ateliers, conférences et actions concrètes pour la transition écologique.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "3",
    name: "Collectif Accessibilité",
    blurb:
      "Rendre l’ENS plus inclusive : accessibilité numérique et des lieux.",
    image:
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "4",
    name: "Club Presse & Journal",
    blurb:
      "Rédaction du journal étudiant, enquêtes et couverture des événements.",
    image:
      "https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "5",
    name: "Atelier Informatique Libre",
    blurb: "Install parties, sensibilisation aux logiciels libres et sécurité.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "6",
    name: "Groupe Culture & Arts",
    blurb: "Expos, concerts et ateliers ouverts à toutes et tous.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=60",
  },
];
