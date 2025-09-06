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
import { AssociationSchema } from "@/schemas/association";

type FormValues = z.infer<typeof AssociationSchema>;

export default function DescriptionField({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea rows={6} placeholder="Description détaillée" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
