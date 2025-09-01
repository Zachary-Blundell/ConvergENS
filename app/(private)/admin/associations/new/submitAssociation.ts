"use server";

import z from "zod";
import { ActionResponse, AssociationFormData } from "./types";

// Helper: "" -> undefined (and trim non-empty values)
const EmptyToUndefined = z
  .string()
  .transform((v) => (v?.trim() === "" ? undefined : v.trim()));

const AssociationSchema = z.object({
  name: z.string().min(2).max(30),
  slug: z.string().min(2).max(30),
  summary: z.string(),
  description: z.string(),
  // logoUrl: EmptyToUndefined.pipe(z.string().url("URL invalide").optional()),
  contactEmail: EmptyToUndefined.pipe(z.email().optional()),
  phone: z.string().optional(),
  website: EmptyToUndefined.pipe(z.string().url("URL invalide").optional()),
  // socials: z.array(socialLinkSchema).optional(),
});

export async function saveAssociation(
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  // Simulate a delay for demonstration purposes
  await wait(1000);
  try {
    const rawData: AssociationFormData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      contactEmail: formData.get("contactEmail") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
    };
    const validatedData = AssociationSchema.safeParse(rawData);
    if (!validatedData.success) {
      const flattened = z.flattenError(validatedData.error);
      return {
        success: false,
        message: "Échec de la validation.",
        errors: flattened.fieldErrors,
      };
    }

    // Here you would typically save the address to your database
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
