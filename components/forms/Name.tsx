/* Name */
import { useForm, useFormContext } from "react-hook-form";
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

export default function NameField() {
  const { control } = useFormContext<FormValues>();

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom de l’association</FormLabel>
          <FormControl>
            <Input
              placeholder="ex: Cercle des Randonneurs de Paris"
              {...field}
            />
          </FormControl>
          <FormDescription>Nom public affiché.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
