// components/forms/Logo.tsx
"use client";
import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AssociationCreateFormValues } from "@/schemas/association-create-form";
import { useFormContext } from "react-hook-form";

export default function LogoField({
  name = "logo",
  label = "Logo (image)",
  description = "PNG, JPG, WebP (max 5 Mo).",
  accept = "image/*",
}: {
  name?: "logo";
  label?: string;
  description?: string;
  accept?: string;
}) {
  const { control } = useFormContext<AssociationCreateFormValues>();
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-3">
              {preview && (
                <img
                  src={preview}
                  alt="Aperçu du logo"
                  className="h-45 w-45 m-3 rounded-full border object-cover"
                />
              )}
              <Input
                type="file"
                name={name}
                accept={accept}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  field.onChange(f); // ← store a single File (or null)
                  setPreview((old) => {
                    if (old) URL.revokeObjectURL(old);
                    return f ? URL.createObjectURL(f) : null;
                  });
                }}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
