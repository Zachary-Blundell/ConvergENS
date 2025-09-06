/* Summary */

import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import z from "zod";
import { AssociationDBSchema } from "@/schemas/association";

type FormValues = z.infer<typeof AssociationDBSchema>;

export default function SummaryField({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  return (
    <FormField
      control={form.control}
      name="summary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Résumé*</FormLabel>
          <FormControl>
            <Textarea rows={3} placeholder="Courte description" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
