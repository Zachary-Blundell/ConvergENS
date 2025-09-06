/* Website */
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { AssociationDBSchema } from "@/schemas/association";
import { Input } from "../ui/input";

type FormValues = z.infer<typeof AssociationDBSchema>;

export default function WebsiteField({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  return (
    <FormField
      control={form.control}
      name="website"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Site web</FormLabel>
          <FormControl>
            <Input type="url" placeholder="https://exemple.org" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
