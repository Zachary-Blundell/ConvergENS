// schemas/association-create-form.ts (UI-shaped)
import z from "zod";
import { AssociationDBSchema } from "./association";
import { LogoFileSchema } from "./logo";

export const AssociationCreateFormSchema = AssociationDBSchema.extend({
  logo: LogoFileSchema,
});
export type AssociationCreateFormValues = z.infer<
  typeof AssociationCreateFormSchema
>;
