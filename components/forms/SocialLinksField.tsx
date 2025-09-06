"use client";
import * as React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import z from "zod";
import { AssociationDBSchema } from "@/schemas/association";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

type FormValues = z.infer<typeof AssociationDBSchema>;

const SOCIAL_OPTIONS = [
  { value: "twitter", label: "Twitter / X" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "bluesky", label: "Bluesky" },
  { value: "mastodon", label: "Mastodon" },
  { value: "threads", label: "Threads" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Autre" },
] as const;

export default function SocialLinksField() {
  const { control } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  return (
    <FormField
      control={control}
      name="socials"
      render={() => (
        <FormItem>
          <FormLabel>Réseaux sociaux</FormLabel>

          <div className="space-y-3">
            {fields.length === 0 && (
              <div className="rounded-xl border p-3 text-sm text-muted-foreground">
                Aucun lien social pour l’instant.
              </div>
            )}

            {fields.map((f, idx) => (
              <div
                key={f.id}
                className="grid grid-cols-1 md:grid-cols-[14rem_1fr_auto] items-start gap-2 rounded-xl border p-3"
              >
                {/* Platform */}
                <FormField
                  control={control}
                  name={`socials.${idx}.platform`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={(field.value as string) ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Plateforme" />
                          </SelectTrigger>
                          <SelectContent>
                            {SOCIAL_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* URL */}
                <FormField
                  control={control}
                  name={`socials.${idx}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="url"
                          inputMode="url"
                          placeholder="https://…"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => remove(idx)}
                    aria-label="Supprimer ce lien"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ platform: "other", url: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un lien
            </Button>
          </div>

          <FormDescription className="mt-1">
            Ajoutez un ou plusieurs profils (URL du profil public).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// "use client";
//
// import * as React from "react";
// import { useEffect } from "react";
// import { useFieldArray, useFormContext } from "react-hook-form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Plus, Trash2 } from "lucide-react";
// import z from "zod";
// import { AssociationSchema } from "@/schemas/association";
// import {
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
//
// type FormValues = z.infer<typeof AssociationSchema>;
//
// const SOCIAL_OPTIONS = [
//   { value: "twitter", label: "Twitter / X" },
//   { value: "facebook", label: "Facebook" },
//   { value: "instagram", label: "Instagram" },
//   { value: "youtube", label: "YouTube" },
//   { value: "tiktok", label: "TikTok" },
//   { value: "bluesky", label: "Bluesky" },
//   { value: "mastodon", label: "Mastodon" },
//   { value: "threads", label: "Threads" },
//   { value: "linkedin", label: "LinkedIn" },
//   { value: "other", label: "Autre" },
// ] as const;
//
// export default function SocialLinksField({
//   seedIfEmpty = false,
// }: {
//   seedIfEmpty?: boolean;
// }) {
//   const form = useFormContext<FormValues>();
//   const { control } = form;
//
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "socials",
//   });
//
//   // Optionally ensure at least one empty row for on create new page
//   useEffect(() => {
//     if (seedIfEmpty && fields.length === 0) {
//       append({ platform: "other", url: "" });
//     }
//   }, [seedIfEmpty, fields.length, append]);
//
//   return (
//     <FormField
//       control={control}
//       name="socials"
//       render={() => (
//         <FormItem>
//           <FormLabel>Réseaux sociaux</FormLabel>
//
//           <div className="space-y-3">
//             {fields.length === 0 && (
//               <div className="rounded-xl border p-3 text-sm text-muted-foreground">
//                 Aucun lien social pour l’instant.
//               </div>
//             )}
//
//             {fields.map((field, idx) => (
//               <div
//                 key={field.id}
//                 className="grid grid-cols-1 md:grid-cols-[14rem_1fr_auto] items-start gap-2 rounded-xl border p-3"
//               >
//                 {/* Platform */}
//                 <FormField
//                   control={control}
//                   name={`socials.${idx}.platform`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Select
//                           value={(field.value as string) ?? undefined}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="h-10">
//                             <SelectValue placeholder="Plateforme" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {SOCIAL_OPTIONS.map((opt) => (
//                               <SelectItem key={opt.value} value={opt.value}>
//                                 {opt.label}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//
//                 {/* URL */}
//                 <FormField
//                   control={control}
//                   name={`socials.${idx}.url`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Input
//                           type="url"
//                           inputMode="url"
//                           placeholder="https://…"
//                           className="h-10"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//
//                 {/* Remove */}
//                 <div className="flex justify-end">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="icon"
//                     className="h-10 w-10"
//                     onClick={() => remove(idx)}
//                     aria-label="Supprimer ce lien"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => append({ platform: "other", url: "" })}
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Ajouter un lien
//             </Button>
//           </div>
//
//           <FormDescription className="mt-1">
//             Ajoutez un ou plusieurs profils (URL du profil public).
//           </FormDescription>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
// // import { useFieldArray, useForm } from "react-hook-form";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Plus, Trash2 } from "lucide-react";
// // import z from "zod";
// // import { AssociationSchema } from "@/schemas/association";
// // import {
// //   FormControl,
// //   FormDescription,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// //
// // type FormValues = z.infer<typeof AssociationSchema>;
// //
// // const SOCIAL_OPTIONS = [
// //   { value: "twitter", label: "Twitter / X" },
// //   { value: "facebook", label: "Facebook" },
// //   { value: "instagram", label: "Instagram" },
// //   { value: "youtube", label: "YouTube" },
// //   { value: "tiktok", label: "TikTok" },
// //   { value: "bluesky", label: "Bluesky" },
// //   { value: "mastodon", label: "Mastodon" },
// //   { value: "threads", label: "Threads" },
// //   { value: "linkedin", label: "LinkedIn" },
// //   { value: "other", label: "Autre" },
// // ] as const;
// //
// // export default function SocialLinksField({
// //   form,
// // }: {
// //   form: ReturnType<typeof useForm<FormValues>>;
// // }) {
// //   const { control } = form;
// //   const { fields, append, remove } = useFieldArray({
// //     control,
// //     name: "socials",
// //   });
// //
// //   return (
// //     <FormField
// //       control={control}
// //       name="socials"
// //       render={() => (
// //         <FormItem>
// //           <FormLabel>Réseaux sociaux</FormLabel>
// //           <div className="space-y-3">
// //             {fields.map((field, idx) => (
// //               <div
// //                 key={field.id}
// //                 className="grid grid-cols-1 md:grid-cols-[14rem_1fr_auto] items-start gap-2 rounded-xl border p-3"
// //               >
// //                 {/* Platform */}
// //                 <FormField
// //                   control={control}
// //                   name={`socials.${idx}.platform`}
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormControl>
// //                         <Select
// //                           onValueChange={field.onChange}
// //                           defaultValue={field.value as string}
// //                         >
// //                           <SelectTrigger className="h-10">
// //                             <SelectValue placeholder="Plateforme" />
// //                           </SelectTrigger>
// //                           <SelectContent>
// //                             {SOCIAL_OPTIONS.map((opt) => (
// //                               <SelectItem key={opt.value} value={opt.value}>
// //                                 {opt.label}
// //                               </SelectItem>
// //                             ))}
// //                           </SelectContent>
// //                         </Select>
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //
// //                 {/* URL */}
// //                 <FormField
// //                   control={control}
// //                   name={`socials.${idx}.url`}
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormControl>
// //                         <Input
// //                           type="url"
// //                           inputMode="url"
// //                           placeholder="https://…"
// //                           className="h-10"
// //                           {...field}
// //                         />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //
// //                 {/* Remove */}
// //                 <div className="flex justify-end">
// //                   <Button
// //                     type="button"
// //                     variant="outline"
// //                     size="icon"
// //                     className="h-10 w-10"
// //                     onClick={() => remove(idx)}
// //                     aria-label="Supprimer ce lien"
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                   </Button>
// //                 </div>
// //               </div>
// //             ))}
// //
// //             <Button
// //               type="button"
// //               variant="secondary"
// //               onClick={() => append({ platform: "other", url: "" })}
// //             >
// //               <Plus className="mr-2 h-4 w-4" />
// //               Ajouter un lien
// //             </Button>
// //           </div>
// //           <FormDescription className="mt-1">
// //             Ajoutez un ou plusieurs profils (URL du profil public).
// //           </FormDescription>
// //           <FormMessage />
// //         </FormItem>
// //       )}
// //     />
// //   );
// // }
