/* Phone */
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

export default function PhoneField({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Téléphone</FormLabel>
          <FormControl>
            <Input type="tel" placeholder="+33 1 23 45 67 89" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
