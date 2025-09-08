// prisma/seed.ts
import { PrismaClient, SocialPlatform } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

console.log("Let's get seeding");

/** ==== Paste your RAW_DATA exactly as you have it ==== */
const RAW_DATA = [
  {
    name: "Africana-ENS",
    summary: "Dialogue interculturel : Afriques, Caraïbes et diasporas",
    bannerColor: "#286C47",
    logoUrl: "/images/placeholder.png",
    socials: {
      email: "club.africana.ens@ens.psl.eu",
      instagram: "@africanaens",
      linkedin: "Africana-ENS",
    },
  },
  {
    name: "ECLOR",
    summary: "Tutorat en collèges REP et activités culturelles",
    bannerColor: "#7883C2",
    logoUrl: "/images/associations/eclor.jpeg",
    socials: {
      email: "asso.eclor@gmail.com",
      facebook: "Association ECLOR",
    },
  },
  {
    name: "Ecocampus-ENS",
    summary: "Écologie conviviale et solidaire",
    bannerColor: "#53E48A",
    logoUrl: "/images/associations/eco-campus.png",
    socials: {
      email: "ecocampus@ens.fr",
      instagram: "@ecocampus.ens",
      facebook: "Écocampus ENS",
    },
  },
  {
    name: "MigrENS",
    summary: "Soutien aux étudiant·es exilé·es dans leur reprise d’études",
    bannerColor: "#819AB3",
    logoUrl: "/images/associations/migrens.png",
    socials: {
      email: "etudiantinviteens@gmail.com",
      instagram: "@association_migrens",
      facebook: "Migrens – Programme Étudiant Invité à l’ENS",
    },
  },
  {
    name: "Les Communistes de l’ENS",
    summary: "Collectif partisan communiste de l’ENS",
    bannerColor: "#BF3640",
    logoUrl: "/images/associations/communistes.jpeg",
    socials: {
      email: "communistes@lists.ens.psl.eu",
      facebook: "Les Communistes de l’ENS",
    },
  },
  {
    name: "Collectif Socialiste de Normale Sup’",
    summary: "Collectif socialiste étudiant de l’ENS",
    bannerColor: "#BF284A",
    logoUrl: "/images/placeholder.png",
    socials: {
      email: "csns@laposte.net",
      instagram: "@csns.ens",
    },
  },
  {
    name: "Solidaires étudiant-e-s ENS",
    summary: "Syndicat étudiant de l’ENS",
    bannerColor: "#C70809",
    logoUrl: "/images/associations/solidaires.png",
    socials: {
      email: "solidaires.etudiant.e.s.ens@gmail.com",
      twitter: "@solidairesetudiantsesens",
      facebook: "Solidaires étudiant-e-s ENS",
    },
  },
  {
    name: "L’Homônerie",
    summary: "Club LGBTQIA+ de l’ENS",
    bannerColor: "#EEEC77",
    logoUrl: "/images/associations/homonerie.jpeg",
    socials: {
      email: "homonerie@ens.fr",
      instagram: "@homonerie.ens",
      facebook: "Homônerie",
    },
  },
  {
    name: "La Pelleteuse",
    summary: "Collectif féministe de l’ENS",
    bannerColor: "#C167DC",
    logoUrl: "/images/associations/pelleteuse.png",
    socials: {
      email: "lapelleteuse@protonmail.com",
      instagram: "@la_pelleteuse_ens",
    },
  },
  {
    name: "Les Écologistes à Ulm",
    summary: "Collectif écologiste étudiant à Ulm",
    bannerColor: "#155A45",
    logoUrl: "/images/placeholder.png",
    socials: {
      email: "ecolosaulm@laposte.net",
    },
  },
  {
    name: "Comité NPA (Jeunes Révolutionnaires de l’ENS)",
    summary: "Comité des Jeunes Révolutionnaires de l’ENS affilié au NPA",
    bannerColor: "#E12638",
    logoUrl: "/images/placeholder.png",
    socials: {
      instagram: "@npajeunes.revo.jussieuens",
    },
  },
  {
    name: "Ulm Debout",
    summary: "Pour construire l’alternative à gauche avec François Ruffin",
    bannerColor: "#E93E47",
    logoUrl: "/images/placeholder.png",
    socials: {
      instagram: "@ulm_debout",
    },
  },
] as const;

/** ========== Helpers ========== */

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/’/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

// Ensure slug uniqueness within this seed run (satisfies unique slug constraint)
const slugCounts = new Map<string, number>();
function uniqueSlug(name: string): string {
  const base = slugify(name);
  const n = (slugCounts.get(base) ?? 0) + 1;
  slugCounts.set(base, n);
  return n === 1 ? base : `${base}-${n}`;
}

function isUrl(v: string): boolean {
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

function instagramUrl(v: string) {
  if (isUrl(v)) return v;
  const handle = v.startsWith("@") ? v.slice(1) : v;
  return `https://www.instagram.com/${handle}`;
}
function twitterUrl(v: string) {
  if (isUrl(v)) return v;
  const handle = v.startsWith("@") ? v.slice(1) : v;
  return `https://twitter.com/${handle}`;
}
function facebookUrl(v: string) {
  if (isUrl(v)) return v;
  return `https://www.facebook.com/${slugify(v)}`;
}
function linkedinUrl(v: string) {
  if (isUrl(v)) return v;
  return `https://www.linkedin.com/company/${slugify(v)}`;
}

type SeedRow = (typeof RAW_DATA)[number];

function buildSocials(
  a: SeedRow,
): Array<{ platform: SocialPlatform; url: string }> {
  const s = (a as any).socials || {};
  const out: Array<{ platform: SocialPlatform; url: string }> = [];

  if (s.instagram)
    out.push({ platform: "instagram", url: instagramUrl(String(s.instagram)) });
  if (s.twitter)
    out.push({ platform: "twitter", url: twitterUrl(String(s.twitter)) });
  if (s.facebook)
    out.push({ platform: "facebook", url: facebookUrl(String(s.facebook)) });
  if (s.linkedin)
    out.push({ platform: "linkedin", url: linkedinUrl(String(s.linkedin)) });

  // Hooks for future data keys you might add:
  // if (s.youtube) out.push({ platform: "youtube", url: String(s.youtube) });
  // if (s.threads) out.push({ platform: "threads", url: String(s.threads) });
  // if (s.bluesky) out.push({ platform: "bluesky", url: String(s.bluesky) });
  // if (s.mastodon) out.push({ platform: "mastodon", url: String(s.mastodon) });
  // if (s.tiktok) out.push({ platform: "tiktok", url: String(s.tiktok) });

  return out;
}

async function ensureOrganizer(slug: string, name: string) {
  const email = `${slug}@organizers.local`; // unique per association
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

  return prisma.organizer.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: "ORGANIZER",
    },
    select: { id: true },
  });
}

/** ========== Main ========== */
async function main() {
  for (const raw of RAW_DATA) {
    const slug = uniqueSlug(raw.name);
    const color = (raw as any).bannerColor ?? "#ffffff";
    const contactEmail = (raw as any).socials?.email ?? null;

    // 1) Organizer per association (1:1 enforced by organizerId @unique)
    const { id: organizerId } = await ensureOrganizer(slug, raw.name);

    // 2) Social links to create
    const socialLinks = buildSocials(raw);

    // 3) Upsert association by slug
    await prisma.association.upsert({
      where: { slug },
      update: {
        organizerId,
        name: raw.name,
        summary: raw.summary ?? "",
        color,
        description: "",
        logoUrl: (raw as any).logoUrl ?? null,
        contactEmail,
        phone: null,
        website: null,
        socials: {
          deleteMany: {}, // reset to match RAW_DATA
          create: socialLinks, // relies on @@unique([associationId, platform])
        },
      },
      create: {
        organizerId,
        name: raw.name,
        slug,
        summary: raw.summary ?? "",
        color,
        description: "",
        logoUrl: (raw as any).logoUrl ?? null,
        contactEmail,
        phone: null,
        website: null,
        socials: {
          create: socialLinks,
        },
      },
    });

    console.log(
      `✔ ${raw.name} (${slug}) seeded with organizer ${organizerId}`,
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Seeding finished");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
// // prisma/seed.ts
// import { PrismaClient } from "@prisma/client";
//
// const prisma = new PrismaClient();
//
// // === Your RAW_DATA goes here (exactly as you pasted) ===
// const RAW_DATA = [
//   {
//     name: "Africana-ENS",
//     summary: "Dialogue interculturel : Afriques, Caraïbes et diasporas",
//     bannerColor: "#286C47",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       email: "club.africana.ens@ens.psl.eu",
//       instagram: "@africanaens",
//       linkedin: "Africana-ENS",
//     },
//   },
//   {
//     name: "ECLOR",
//     summary: "Tutorat en collèges REP et activités culturelles",
//     bannerColor: "#7883C2",
//     logoUrl: "/images/associations/eclor.jpeg",
//     socials: {
//       email: "asso.eclor@gmail.com",
//       facebook: "Association ECLOR",
//     },
//   },
//   {
//     name: "Ecocampus-ENS",
//     summary: "Écologie conviviale et solidaire",
//     bannerColor: "#53E48A",
//     logoUrl: "/images/associations/eco-campus.png",
//     socials: {
//       email: "ecocampus@ens.fr",
//       instagram: "@ecocampus.ens",
//       facebook: "Écocampus ENS",
//     },
//   },
//   {
//     name: "MigrENS",
//     summary: "Soutien aux étudiant·es exilé·es dans leur reprise d’études",
//     bannerColor: "#819AB3",
//     logoUrl: "/images/associations/migrens.png",
//     socials: {
//       email: "etudiantinviteens@gmail.com",
//       instagram: "@association_migrens",
//       facebook: "Migrens – Programme Étudiant Invité à l’ENS",
//     },
//   },
//   {
//     name: "Les Communistes de l’ENS",
//     summary: "Collectif partisan communiste de l’ENS",
//     bannerColor: "#BF3640",
//     logoUrl: "/images/associations/communistes.jpeg",
//     socials: {
//       email: "communistes@lists.ens.psl.eu",
//       facebook: "Les Communistes de l’ENS",
//     },
//   },
//   {
//     name: "Collectif Socialiste de Normale Sup’",
//     summary: "Collectif socialiste étudiant de l’ENS",
//     bannerColor: "#BF284A",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       email: "csns@laposte.net",
//       instagram: "@csns.ens",
//     },
//   },
//   {
//     name: "Solidaires étudiant-e-s ENS",
//     summary: "Syndicat étudiant de l’ENS",
//     bannerColor: "#C70809",
//     logoUrl: "/images/associations/solidaires.png",
//     socials: {
//       email: "solidaires.etudiant.e.s.ens@gmail.com",
//       twitter: "@solidairesetudiantsesens",
//       facebook: "Solidaires étudiant-e-s ENS",
//     },
//   },
//   {
//     name: "L’Homônerie",
//     summary: "Club LGBTQIA+ de l’ENS",
//     bannerColor: "#EEEC77",
//     logoUrl: "/images/associations/homonerie.jpeg",
//     socials: {
//       email: "homonerie@ens.fr",
//       instagram: "@homonerie.ens",
//       facebook: "Homônerie",
//     },
//   },
//   {
//     name: "La Pelleteuse",
//     summary: "Collectif féministe de l’ENS",
//     bannerColor: "#C167DC",
//     logoUrl: "/images/associations/pelleteuse.png",
//     socials: {
//       email: "lapelleteuse@protonmail.com",
//       instagram: "@la_pelleteuse_ens",
//     },
//   },
//   {
//     name: "Les Écologistes à Ulm",
//     summary: "Collectif écologiste étudiant à Ulm",
//     bannerColor: "#155A45",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       email: "ecolosaulm@laposte.net",
//     },
//   },
//   {
//     name: "Comité NPA (Jeunes Révolutionnaires de l’ENS)",
//     summary: "Comité des Jeunes Révolutionnaires de l’ENS affilié au NPA",
//     bannerColor: "#E12638",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       instagram: "@npajeunes.revo.jussieuens",
//     },
//   },
//   {
//     name: "Ulm Debout",
//     summary: "Pour construire l’alternative à gauche avec François Ruffin",
//     bannerColor: "#E93E47",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       instagram: "@ulm_debout",
//     },
//   },
// ];
//
// // === Helpers ===
//
// console.log("seeding");
// // Basic slugifier with accent stripping & punctuation handling
// function slugify(input: string): string {
//   return input
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "") // remove diacritics
//     .replace(/’/g, "'")
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "")
//     .replace(/--+/g, "-");
// }
//
// // Map to unique slugs for this run (avoids unique violations if names collide)
// const slugCounts = new Map<string, number>();
// function uniqueSlug(name: string): string {
//   const base = slugify(name);
//   const n = (slugCounts.get(base) ?? 0) + 1;
//   slugCounts.set(base, n);
//   return n === 1 ? base : `${base}-${n}`;
// }
//
// function asUrl(s: string): string | null {
//   try {
//     const u = new URL(s);
//     return u.toString();
//   } catch {
//     return null;
//   }
// }
//
// // Social URL builders from handles/names (best-effort for seed data)
// function instagramUrl(v: string) {
//   const handle = v.startsWith("@")
//     ? v.slice(1)
//     : v.replace(/^https?:\/\/(www\.)?instagram\.com\//, "");
//   return `https://instagram.com/${handle}`;
// }
// function xUrl(v: string) {
//   const handle = v.startsWith("@")
//     ? v.slice(1)
//     : v.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, "");
//   return `https://x.com/${handle}`;
// }
// function facebookUrl(v: string) {
//   // If already a URL, keep it; else guess from a slugified title
//   const url = asUrl(v);
//   if (url) return url;
//   const slug = slugify(v);
//   return `https://www.facebook.com/${slug}`;
// }
// function linkedinUrl(v: string) {
//   const url = asUrl(v);
//   if (url) return url;
//   const slug = slugify(v);
//   // Guess company page path (works for most clubs/assos)
//   return `https://www.linkedin.com/company/${slug}`;
// }
//
// type SeedAssociation = (typeof RAW_DATA)[number];
//
// function toSocialLinks(a: SeedAssociation) {
//   const links: Array<{
//     platform: "instagram" | "facebook" | "x" | "linkedin";
//     url: string;
//   }> = [];
//
//   const s = a.socials || {};
//
//   if (s.instagram) {
//     const url = instagramUrl(s.instagram);
//     const handle = s.instagram.startsWith("@")
//       ? s.instagram.slice(1)
//       : s.instagram
//           .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
//           .replace(/\/$/, "");
//     links.push({ platform: "instagram", url });
//   }
//
//   if (s.twitter) {
//     // map twitter -> X
//     const url = xUrl(s.twitter);
//     const handle = s.twitter.startsWith("@")
//       ? s.twitter.slice(1)
//       : s.twitter
//           .replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, "")
//           .replace(/\/$/, "");
//     links.push({ platform: "x", url });
//   }
//
//   if (s.facebook) {
//     const url = facebookUrl(s.facebook);
//     links.push({
//       platform: "facebook",
//       url,
//     });
//   }
//
//   if (s.linkedin) {
//     const url = linkedinUrl(s.linkedin);
//     links.push({
//       platform: "linkedin",
//       url,
//     });
//   }
//
//   return links;
// }
//
// async function main() {
//   for (const raw of RAW_DATA) {
//     const slug = uniqueSlug(raw.name);
//     const color = raw.bannerColor || "#ffffff";
//     const contactEmail = raw.socials?.email || null;
//
//     // Upsert by slug so the seeder is re-runnable
//     await prisma.association.create({
//       where: { slug },
//       update: {
//         name: raw.name,
//         summary: raw.summary ?? "",
//         color,
//         description: "", // you can replace later if you add copy
//         logoUrl: raw.logoUrl ?? null,
//         contactEmail,
//         phone: null,
//         website: null,
//       },
//       create: {
//         name: raw.name,
//         slug,
//         summary: raw.summary ?? "",
//         color,
//         description: "",
//         logoUrl: raw.logoUrl ?? null,
//         contactEmail,
//         phone: null,
//         website: null,
//       },
//     });
//
//     console.log(`✔ Seeded association: ${raw.name} (${slug})`);
//   }
// }
//
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//     console.log("✅ Seeding finished");
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
//
// // prisma/seed.ts
// import { PrismaClient } from "@prisma/client";
//
// const prisma = new PrismaClient();
//
// const RAW_DATA = [
//   {
//     name: "Africana-ENS",
//     summary: "Dialogue interculturel : Afriques, Caraïbes et diasporas",
//     bannerColor: "#286C47",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       email: "club.africana.ens@ens.psl.eu",
//       instagram: "@africanaens",
//       linkedin: "Africana-ENS",
//     },
//   },
//   {
//     name: "ECLOR",
//     summary: "Tutorat en collèges REP et activités culturelles",
//     bannerColor: "#7883C2",
//     logoUrl: "/images/associations/eclor.jpeg",
//     socials: {
//       email: "asso.eclor@gmail.com",
//       facebook: "Association ECLOR",
//     },
//   },
//   {
//     name: "Ecocampus-ENS",
//     summary: "Écologie conviviale et solidaire",
//     bannerColor: "#53E48A",
//     logoUrl: "/images/associations/eco-campus.png",
//     socials: {
//       email: "ecocampus@ens.fr",
//       instagram: "@ecocampus.ens",
//       facebook: "Écocampus ENS",
//     },
//   },
//   {
//     name: "MigrENS",
//     summary: "Soutien aux étudiant·es exilé·es dans leur reprise d’études",
//     bannerColor: "#819AB3",
//     logoUrl: "/images/associations/migrens.png",
//     socials: {
//       email: "etudiantinviteens@gmail.com",
//       instagram: "@association_migrens",
//       facebook: "Migrens – Programme Étudiant Invité à l’ENS",
//     },
//   },
//   {
//     name: "Les Communistes de l’ENS",
//     summary: "Collectif partisan communiste de l’ENS",
//     bannerColor: "#BF3640",
//     logoUrl: "/images/associations/communistes.jpeg",
//     socials: {
//       email: "communistes@lists.ens.psl.eu",
//       facebook: "Les Communistes de l’ENS",
//     },
//   },
//   {
//     name: "Collectif Socialiste de Normale Sup’",
//     summary: "Collectif socialiste étudiant de l’ENS",
//     bannerColor: "#BF284A",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       email: "csns@laposte.net",
//       instagram: "@csns.ens",
//     },
//   },
//   {
//     name: "Solidaires étudiant-e-s ENS",
//     summary: "Syndicat étudiant de l’ENS",
//     bannerColor: "#C70809",
//     logoUrl: "/images/associations/solidaires.png",
//     socials: {
//       email: "solidaires.etudiant.e.s.ens@gmail.com",
//       twitter: "@solidairesetudiantsesens",
//       facebook: "Solidaires étudiant-e-s ENS",
//     },
//   },
//   {
//     name: "L’Homônerie",
//     summary: "Club LGBTQIA+ de l’ENS",
//     bannerColor: "#EEEC77",
//     logoUrl: "/images/associations/homonerie.jpeg",
//     socials: {
//       email: "homonerie@ens.fr",
//       instagram: "@homonerie.ens",
//       facebook: "Homônerie",
//     },
//   },
//   {
//     name: "La Pelleteuse",
//     summary: "Collectif féministe de l’ENS",
//     bannerColor: "#C167DC",
//     logoUrl: "/images/associations/pelleteuse.png",
//     socials: {
//       email: "lapelleteuse@protonmail.com",
//       instagram: "@la_pelleteuse_ens",
//     },
//   },
//   {
//     name: "Les Écologistes à Ulm",
//     summary: "Collectif écologiste étudiant à Ulm",
//     bannerColor: "#155A45",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       email: "ecolosaulm@laposte.net",
//     },
//   },
//   {
//     name: "Comité NPA (Jeunes Révolutionnaires de l’ENS)",
//     summary: "Comité des Jeunes Révolutionnaires de l’ENS affilié au NPA",
//     bannerColor: "#E12638",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       instagram: "@npajeunes.revo.jussieuens",
//     },
//   },
//   {
//     name: "Ulm Debout",
//     summary: "Pour construire l’alternative à gauche avec François Ruffin",
//     bannerColor: "#E93E47",
//     logoUrl: "/images/placeholder.png",
//     socials: {
//       instagram: "@ulm_debout",
//     },
//   },
// ];
//
// function slugify(name: string): string {
//   return name
//     .toLowerCase()
//     .normalize("NFKD") // split accents
//     .replace(/[\u0300-\u036f]/g, "") // drop diacritics
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)+/g, "");
// }
//
// async function main() {
//   for (const item of RAW_DATA) {
//     const slug = slugify(item.name);
//     try {
//       await prisma.association.upsert({
//         where: { slug },
//         create: {
//           name: item.name,
//           slug,
//           summary: item.summary,
//           color: item.bannerColor,
//           logoUrl: item.logoUrl,
//           socials: item.socials, // stored as JSON
//         },
//         update: {
//           name: item.name,
//           summary: item.summary,
//           color: item.bannerColor,
//           logoUrl: item.logoUrl,
//           socials: item.socials,
//         },
//       });
//     } catch (error) {
//       console.error(
//         `Error upserting association with slug "${item.name}":`,
//         error,
//       );
//     }
//   }
//   console.log("✅ Associations seeded/updated");
// }
//
// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
