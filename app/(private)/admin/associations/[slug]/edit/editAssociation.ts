// app/associations/[slug]/edit/updateAssociation.ts
"use server";

import { prisma } from "@/lib/db";
import { Prisma, SocialPlatform } from "@prisma/client";
import { AssociationDBSchema } from "@/schemas/association"; // DB-shaped (no logo)
import path from "node:path";
import crypto from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import type { ActionResponse } from "../../new/types";
import z from "zod";
import { LogoFileSchema } from "@/schemas/logo";

function urlToFsPath(publicUrl: string) {
  // only allow files under /public/uploads
  const rel = publicUrl.replace(/^\//, ""); // strip leading slash
  return path.join(process.cwd(), "public", rel);
}

async function safeUnlink(p?: string) {
  if (!p) return;
  try {
    await unlink(p);
  } catch (err: any) {
    // ignore file-not-found or similar
    if (err?.code !== "ENOENT") {
      console.warn("unlink failed:", p, err);
    }
  }
}

export async function updateAssociation(
  id: string,
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    // Socials
    const platforms = formData.getAll("socialPlatform[]") as string[];
    const urls = formData.getAll("socialUrl[]") as string[];
    const theSocials = platforms
      .map((p, i) => ({
        platform: p as SocialPlatform,
        url: String(urls[i] ?? "").trim(),
      }))
      .filter((s) => s.url.length > 0);

    // Build rawData (same shape as create)
    const rawData = {
      name: String((formData.get("name") as string) ?? ""),
      slug: String((formData.get("slug") as string) ?? ""),
      color: String((formData.get("color") as string) ?? "#ffffff"),
      summary: String((formData.get("summary") as string) ?? ""),
      description: String((formData.get("description") as string) ?? ""),
      contactEmail: (formData.get("contactEmail") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
      socials: theSocials.length ? theSocials : undefined,
    };

    // Server side validation
    const validatedData = AssociationDBSchema.safeParse(rawData);
    if (!validatedData.success) {
      const flattened = z.flattenError(validatedData.error);
      return {
        success: false,
        message: "Échec de la validation.",
        errors: flattened.fieldErrors,
        inputs: rawData,
      };
    }

    // Logo
    const existingLogo = await prisma.association.findUnique({
      where: { id },
      select: { logoUrl: true },
    });

    let newLogoUrl: string | undefined;
    let newLogoFsPath: string | undefined; // just incase we need to delete it later
    const file = formData.get("logo") as File | null;

    if (file && file.size > 0) {
      const validatedLogo = LogoFileSchema.safeParse(file);

      if (!validatedLogo.success) {
        const first =
          validatedLogo.error.issues[0]?.message ?? "Logo invalide.";
        return { success: false, message: first, inputs: rawData };
      }

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const extFromMime: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      };
      const ext =
        extFromMime[file.type] ||
        (path.extname((file as any).name ?? "") || ".bin").slice(1);

      const filename = `${crypto.randomUUID()}.${ext}`;
      const filepath = path.join(uploadsDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filepath, buffer);

      newLogoUrl = `/uploads/${filename}`;
      //TODO: delete old file after update
    }

    // Update: simplest path = replace socials
    const { socials: s, ...rest } = validatedData.data;

    try {
      await prisma.association.update({
        where: { id },
        data: {
          ...rest,
          ...(newLogoUrl ? { logoUrl: newLogoUrl } : {}),
          socials: { deleteMany: {}, ...(s?.length ? { create: s } : {}) },
        },
      });
    } catch (e) {
      // DB failed → remove the new file we just wrote
      await safeUnlink(newLogoFsPath);
      throw e; // rethrow to fall into outer catch
    }

    // DB succeeded → if we uploaded a new logo, delete the old one (best-effort)
    if (
      newLogoUrl &&
      existingLogo?.logoUrl &&
      existingLogo.logoUrl !== newLogoUrl
    ) {
      // only delete files under /uploads
      if (existingLogo.logoUrl.startsWith("/uploads/")) {
        const oldFsPath = urlToFsPath(existingLogo.logoUrl);
        await safeUnlink(oldFsPath);
      }
    }
    return { success: true, message: "Association mise à jour." };
  } catch (e: unknown) {
    // Handle unique constraint collisions (e.g., slug or name)
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const target = (e.meta?.target ?? []) as string[];
      const errors: NonNullable<ActionResponse["errors"]> = {};
      if (target.includes("slug")) errors.slug = ["Ce slug est déjà utilisé"];
      if (target.includes("name")) errors.name = ["Ce nom est déjà utilisé"];
      return {
        success: false,
        message: "Conflit de contrainte d’unicité.",
        errors,
      };
    }
    return { success: false, message: "Erreur lors de la mise à jour." };
  }
}
