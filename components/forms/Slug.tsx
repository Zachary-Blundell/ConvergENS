/* Slug */

import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { AssociationDBSchema } from "@/schemas/association";
import { Input } from "../ui/input";

type FormValues = z.infer<typeof AssociationDBSchema>;

export default function SlugField({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  return (
    <FormField
      control={form.control}
      name="slug"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Slug</FormLabel>
          <FormControl>
            <Input placeholder="ex: open-knowledge-alliance" {...field} />
          </FormControl>
          <FormDescription>
            Minuscules, chiffres et tirets (unique).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
