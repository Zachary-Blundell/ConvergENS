// schemas/logo.ts (server-validated too, but we can reuse client-side)
import z from "zod";
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const LogoFileSchema = z
  .instanceof(File, { message: "Veuillez choisir une image." })
  .refine((f) => f.size <= MAX_FILE_SIZE, "Image trop lourde (max 5 Mo).")
  .refine(
    (f) => ACCEPTED_IMAGE_MIME_TYPES.includes(f.type as any),
    "Type d’image non supporté (jpg, jpeg, png, webp).",
  )
  .optional();
