/* Email */

import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { AssociationSchema } from "@/schemas/association";
import { Input } from "../ui/input";

type FormValues = z.infer<typeof AssociationSchema>;

export default function EmailField({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  return (
    <FormField
      control={form.control}
      name="contactEmail"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email de contact</FormLabel>
          <FormControl>
            <Input type="email" placeholder="contact@exemple.org" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
