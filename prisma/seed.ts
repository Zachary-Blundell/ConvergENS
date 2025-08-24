// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RAW_DATA = [
  {
    name: "Africana-ENS",
    blurb: "Dialogue interculturel : Afriques, Caraïbes et diasporas",
    bannerColor: "#286C47",
    imagePath: "/images/placeholder.png",
    socials: {
      email: "club.africana.ens@ens.psl.eu",
      instagram: "@africanaens",
      linkedin: "Africana-ENS",
    },
  },
  {
    name: "ECLOR",
    blurb: "Tutorat en collèges REP et activités culturelles",
    bannerColor: "#7883C2",
    imagePath: "/images/associations/eclor.jpeg",
    socials: {
      email: "asso.eclor@gmail.com",
      facebook: "Association ECLOR",
    },
  },
  {
    name: "Ecocampus-ENS",
    blurb: "Écologie conviviale et solidaire",
    bannerColor: "#53E48A",
    imagePath: "/images/associations/eco-campus.png",
    socials: {
      email: "ecocampus@ens.fr",
      instagram: "@ecocampus.ens",
      facebook: "Écocampus ENS",
    },
  },
  {
    name: "MigrENS",
    blurb: "Soutien aux étudiant·es exilé·es dans leur reprise d’études",
    bannerColor: "#819AB3",
    imagePath: "/images/associations/migrens.png",
    socials: {
      email: "etudiantinviteens@gmail.com",
      instagram: "@association_migrens",
      facebook: "Migrens – Programme Étudiant Invité à l’ENS",
    },
  },
  {
    name: "Les Communistes de l’ENS",
    blurb: "Collectif partisan communiste de l’ENS",
    bannerColor: "#BF3640",
    imagePath: "/images/associations/communistes.jpeg",
    socials: {
      email: "communistes@lists.ens.psl.eu",
      facebook: "Les Communistes de l’ENS",
    },
  },
  {
    name: "Collectif Socialiste de Normale Sup’",
    blurb: "Collectif socialiste étudiant de l’ENS",
    bannerColor: "#BF284A",
    imagePath: "/images/placeholder.png",
    socials: {
      email: "csns@laposte.net",
      instagram: "@csns.ens",
    },
  },
  {
    name: "Solidaires étudiant-e-s ENS",
    blurb: "Syndicat étudiant de l’ENS",
    bannerColor: "#C70809",
    imagePath: "/images/associations/solidaires.png",
    socials: {
      email: "solidaires.etudiant.e.s.ens@gmail.com",
      twitter: "@solidairesetudiantsesens",
      facebook: "Solidaires étudiant-e-s ENS",
    },
  },
  {
    name: "L’Homônerie",
    blurb: "Club LGBTQIA+ de l’ENS",
    bannerColor: "#EEEC77",
    imagePath: "/images/associations/homonerie.jpeg",
    socials: {
      email: "homonerie@ens.fr",
      instagram: "@homonerie.ens",
      facebook: "Homônerie",
    },
  },
  {
    name: "La Pelleteuse",
    blurb: "Collectif féministe de l’ENS",
    bannerColor: "#C167DC",
    imagePath: "/images/associations/pelleteuse.png",
    socials: {
      email: "lapelleteuse@protonmail.com",
      instagram: "@la_pelleteuse_ens",
    },
  },
  {
    name: "Les Écologistes à Ulm",
    blurb: "Collectif écologiste étudiant à Ulm",
    bannerColor: "#155A45",
    imagePath: "/images/placeholder.png",
    socials: {
      email: "ecolosaulm@laposte.net",
    },
  },
  {
    name: "Comité NPA (Jeunes Révolutionnaires de l’ENS)",
    blurb: "Comité des Jeunes Révolutionnaires de l’ENS affilié au NPA",
    bannerColor: "#E12638",
    imagePath: "/images/placeholder.png",
    socials: {
      instagram: "@npajeunes.revo.jussieuens",
    },
  },
  {
    name: "Ulm Debout",
    blurb: "Pour construire l’alternative à gauche avec François Ruffin",
    bannerColor: "#E93E47",
    imagePath: "/images/placeholder.png",
    socials: {
      instagram: "@ulm_debout",
    },
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD") // split accents
    .replace(/[\u0300-\u036f]/g, "") // drop diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  for (const item of RAW_DATA) {
    const slug = slugify(item.name);
    try {
      await prisma.association.upsert({
        where: { slug },
        create: {
          name: item.name,
          slug,
          blurb: item.blurb,
          color: item.bannerColor,
          imagePath: item.imagePath,
          socials: item.socials, // stored as JSON
        },
        update: {
          name: item.name,
          blurb: item.blurb,
          color: item.bannerColor,
          imagePath: item.imagePath,
          socials: item.socials,
        },
      });
    } catch (error) {
      console.error(
        `Error upserting association with slug "${item.name}":`,
        error,
      );
    }
  }
  console.log("✅ Associations seeded/updated");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
