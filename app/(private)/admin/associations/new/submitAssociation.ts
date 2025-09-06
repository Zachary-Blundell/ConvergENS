"use server";

import z from "zod";
import { ActionResponse, AssociationFormData, SocialLinkForm } from "./types";
import { prisma } from "@/lib/db";
import { Prisma, SocialPlatform } from "@prisma/client";
import { AssociationSchema } from "@/schemas/association";

export async function saveAssociation(
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  // Simulate a delay for demonstration purposes
  //TODO: remove this
  await wait(1000);

  try {
    const platforms = formData.getAll("socialPlatform[]") as string[]; // ["twitter", ...]
    const urls = formData.getAll("socialUrl[]") as string[];
    const theSocials: SocialLinkForm[] = platforms
      .map((p, i) => ({
        platform: p as SocialPlatform,
        url: String(urls[i] ?? "").trim(),
      }))
      // keep pairs that have a URL (and optionally platform)
      .filter((s) => s.url.length > 0);
    const rawData: AssociationFormData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      color: formData.get("color") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      contactEmail: (formData.get("contactEmail") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
      socials: theSocials.length ? theSocials : undefined,
    };

    // Server side validation
    const validatedData = AssociationSchema.safeParse(rawData);

    if (!validatedData.success) {
      const flattened = z.flattenError(validatedData.error);
      return {
        success: false,
        message: "Échec de la validation.",
        errors: flattened.fieldErrors,
        inputs: rawData,
      };
    }

    // Data is valid, proceed to save to the database
    const { socials, ...rest } = validatedData.data;
    try {
      await prisma.association.create({
        data: {
          ...rest,
          ...(socials?.length ? { socials: { create: socials } } : {}),
        },
      });

      return {
        success: true,
        message: "Association enregistrée avec succès.",
      };
    } catch (e: unknown) {
      // Prisma unique constraint
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const target = (e.meta?.target ?? []) as string[]; // e.g. ["slug"] or ["name"]
        const errors: NonNullable<ActionResponse["errors"]> = {};
        if (target.includes("slug")) errors.slug = ["Ce slug est déjà utilisé"];
        if (target.includes("name")) errors.name = ["Ce nom est déjà utilisé"];

        return {
          success: false,
          message: "Conflit de contrainte d’unicité.",
          errors,
          inputs: rawData,
        };
      }
    }

    console.log("Association soumise !", validatedData.data);
    return {
      success: true,
      message: "Association enregistrée avec succès.",
    };
  } catch (error) {
    return {
      success: false,
      message: `Une erreur inattendue s'est produite : ${error}`,
    };
  }
}

function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
