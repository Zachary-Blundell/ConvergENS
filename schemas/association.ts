import z from "zod";
import { SocialPlatform } from "@prisma/client";

export const SocialLinkSchema = z.object({
  platform: z.enum(SocialPlatform),
  url: z.url().trim(),
});

export const AssociationSchema = z.object({
  name: z.string().trim().min(2, "Au moins 2 caractères").max(30),
  slug: z
    .string()
    .trim()
    .min(2, "Au moins 2 caractères")
    .max(30, "30 maximum")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Minuscules, chiffres et tirets"),
  color: z
    .string()
    .trim()
    .regex(
      /^#(?:[0-9a-fA-F]{3}){1,2}$/i,
      "Utilisez une couleur hexadécimale comme #0ea5e9",
    ),
  summary: z.string().trim(),
  description: z.string().trim(),
  // logoUrl: z.url("URL invalide").optional(),
  contactEmail: z.email("Email invalide").optional(),
  phone: z.string().optional(),
  website: z.url("URL invalide").optional(),
  socials: z.array(SocialLinkSchema).optional(),
});
