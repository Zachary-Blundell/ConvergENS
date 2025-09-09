// // app/associations/NewAssociationForm.tsx
// "use client";
//
// import * as React from "react";
// import { useEffect, useTransition } from "react";
// import { useActionState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
//
// import { Form } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { CheckCircle2 } from "lucide-react";
//
// import { saveAssociation } from "./submitAssociation";
// import type { ActionResponse } from "./types";
// import DescriptionField from "@/components/forms/Description";
// import SummaryField from "@/components/forms/Summary";
// import EmailField from "@/components/forms/Email";
// import PhoneField from "@/components/forms/Phone";
// import WebsiteField from "@/components/forms/Website";
// import ColorField from "@/components/forms/Color";
// import SlugField from "@/components/forms/Slug";
// import NameField from "@/components/forms/Name";
// import SocialLinksField from "@/components/forms/SocialLinksField";
// import LogoField from "@/components/forms/Logo";
// import {
//   AssociationCreateFormSchema,
//   AssociationCreateFormValues,
// } from "@/schemas/association-create-form";
//
// const initialState: ActionResponse = { success: false, message: "" };
//
// export default function AssociationForm() {
//   const [state, action, isPending] = useActionState(
//     saveAssociation,
//     initialState,
//   );
//
//   const [isTransPending, startTransition] = useTransition();
//
//   const form = useForm<AssociationCreateFormValues>({
//     resolver: zodResolver(AssociationCreateFormSchema),
//     // mode: "onChange",
//     shouldUnregister: true,
//     defaultValues: {
//       name: "",
//       slug: "",
//       color: "#ffffff",
//       summary: "",
//       description: "",
//       contactEmail: undefined,
//       phone: undefined,
//       website: undefined,
//       socials: [{ platform: "other", url: "" }],
//       logo: undefined,
//     },
//   });
//
//   // When server returns sanitized inputs, sync them into RHF
//   useEffect(() => {
//     if (state?.inputs) {
//       form.reset({
//         ...form.getValues(),
//         ...(state.inputs as Partial<AssociationCreateFormValues>),
//       });
//     }
//   }, [state?.inputs]);
//
//   // Map server field errors (e.g., unique slug) into RHF messages
//   useEffect(() => {
//     if (state?.errors) {
//       // Clear previous server errors first
//       form.clearErrors();
//       for (const [field, msgs] of Object.entries(state.errors)) {
//         const message = Array.isArray(msgs) ? msgs[0] : String(msgs ?? "");
//         form.setError(field as keyof AssociationCreateFormValues, {
//           type: "server",
//           message,
//         });
//       }
//       // Optionally focus the first errored field
//       const firstKey = Object.keys(state.errors)[0] as
//         | keyof AssociationCreateFormValues
//         | undefined;
//       if (firstKey) form.setFocus(firstKey);
//     }
//   }, [state?.errors, form]);
//
//   // clear the form after a successful create
//   useEffect(() => {
//     if (state?.success) form.reset();
//   }, [state?.success, form]);
//
//   async function onSubmit(values: AssociationCreateFormValues) {
//     const fd = new FormData();
//
//     const { socials, logo, ...rest } = values;
//
//     // primitives
//     (Object.entries(rest) as [keyof typeof rest, any][]).forEach(([k, v]) => {
//       fd.append(k, v == null ? "" : String(v));
//     });
//
//     // socials
//     (socials ?? []).forEach((s) => {
//       if (!s?.url) return;
//       fd.append("socialPlatform[]", String(s.platform ?? "other"));
//       fd.append("socialUrl[]", s.url);
//     });
//
//     // file
//     if (logo instanceof File) {
//       fd.append("logo", logo);
//     }
//
//     startTransition(() => action(fd));
//   }
//
//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>Association · Informations</CardTitle>
//         <CardDescription>
//           Renseignez les détails de l’association.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-6"
//             autoComplete="on"
//             encType="multipart/form-data"
//           >
//             <NameField />
//
//             <LogoField />
//
//             <SlugField form={form} />
//
//             <ColorField form={form} />
//
//             <SummaryField form={form} />
//
//             <DescriptionField form={form} />
//
//             <EmailField form={form} />
//
//             <PhoneField form={form} />
//
//             <WebsiteField form={form} />
//
//             <SocialLinksField />
//
//             {state?.message && (
//               <Alert variant={state.success ? "default" : "destructive"}>
//                 {state.success && <CheckCircle2 className="h-4 w-4" />}
//                 <AlertDescription>{state.message}</AlertDescription>
//               </Alert>
//             )}
//
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={isPending || isTransPending}
//             >
//               {isPending ? "Enregistrement..." : "Enregistrer l’association"}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }
//
// "use client";
//
// import * as React from "react";
// import { useTransition, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
//
// // shadcn/ui
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from "@/components/ui/alert";
// import {
//   RadioGroup,
//   RadioGroupItem,
// } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
//
// // Icons (optional)
// import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
//
// // Server action
// import { saveAssociation } from "./submitAssociation"; // adjust the path if needed
// import type { ActionResponse } from "./types";
//
// // ===== UI Schema =====
// const UrlOptional = z
//   .url("URL invalide")
//   .trim()
//   .optional()
//   .or(z.literal("").transform(() => undefined));
//
// const EmailOptional = z
//   .email("Email invalide")
//   .trim()
//   .optional()
//   .or(z.literal("").transform(() => undefined));
//
// const HexColor = z
//   .string()
//   .trim()
//   .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/i, "Utilisez une couleur hexadécimale (#0ea5e9)")
//   .default("#ffffff");
//
// const SocialLinkSchema = z.object({
//   platform: z.string(), // keep simple on UI; backend will validate enum
//   url: z.url("URL invalide").trim(),
// });
//
// const OrganizerModeEnum = z.enum(["existing", "new"], {
//   required_error: "Sélectionnez une option",
// });
//
// const OrganizerExistingSchema = z.object({
//   organizerLookup: z
//     .string()
//     .trim()
//     .min(2, "Saisissez l'ID ou l'email de l'organisateur·rice"),
// });
//
// const OrganizerNewSchema = z.object({
//   organizerName: z
//     .string()
//     .trim()
//     .min(2, "Nom trop court")
//     .max(80, "80 caractères maximum"),
//   organizerEmail: z
//     .email("Email invalide")
//     .trim(),
// });
//
// const AssociationBaseSchema = z.object({
//   name: z.string().trim().min(2, "Au moins 2 caractères").max(30, "30 max"),
//   slug: z.string().trim().min(2, "Au moins 2 caractères").max(30, "30 max"),
//   color: HexColor,
//   summary: z.string().trim().min(1, "Résumé requis"),
//   description: z.string().trim().min(1, "Description requise"),
//   contactEmail: EmailOptional,
//   phone: z.string().trim().max(30).optional().or(z.literal("").transform(() => undefined)),
//   website: UrlOptional,
//   // socials: z.array(SocialLinkSchema).optional(), // add back when UI is ready
//   logo: z
//     .any()
//     .refine(
//       (file) => !file || (typeof File !== "undefined" && file instanceof File),
//       "Fichier invalide",
//     )
//     .optional(),
// });
//
// const AssociationCreateWithOrganizerSchema = AssociationBaseSchema.extend({
//   organizerMode: OrganizerModeEnum,
// })
//   .and(
//     z.union([
//       OrganizerExistingSchema.extend({ organizerMode: z.literal("existing") }),
//       OrganizerNewSchema.extend({ organizerMode: z.literal("new") }),
//     ]),
//   );
//
// export type AssociationCreateWithOrganizerValues = z.infer<
//   typeof AssociationCreateWithOrganizerSchema
// >;
//
// function toFormData(values: AssociationCreateWithOrganizerValues) {
//   const fd = new FormData();
//   fd.set("name", values.name);
//   fd.set("slug", values.slug);
//   fd.set("color", values.color);
//   fd.set("summary", values.summary);
//   fd.set("description", values.description);
//   if (values.contactEmail) fd.set("contactEmail", values.contactEmail);
//   if (values.phone) fd.set("phone", values.phone);
//   if (values.website) fd.set("website", values.website);
//   if (values.logo) fd.set("logo", values.logo as unknown as File);
//
//   // Organizer payload
//   fd.set("organizerMode", values.organizerMode);
//   if (values.organizerMode === "existing") {
//     fd.set("organizerLookup", (values as any).organizerLookup);
//   } else {
//     fd.set("organizerName", (values as any).organizerName);
//     fd.set("organizerEmail", (values as any).organizerEmail);
//   }
//
//   return fd;
// }
//
// export default function NewAssociationFormWithOrganizer() {
//   const [isTransPending, startTransition] = useTransition();
//   const [serverState, setServerState] = React.useState<ActionResponse | null>(
//     null,
//   );
//
//   const form = useForm<AssociationCreateWithOrganizerValues>({
//     resolver: zodResolver(AssociationCreateWithOrganizerSchema),
//     shouldUnregister: true,
//     defaultValues: {
//       name: "",
//       slug: "",
//       color: "#ffffff",
//       summary: "",
//       description: "",
//       contactEmail: undefined,
//       phone: undefined,
//       website: undefined,
//       logo: undefined,
//       organizerMode: "existing",
//       organizerLookup: "",
//     } as any,
//   });
//
//   // Auto-generate slug from name (once empty or if user hasn't edited)
//   useEffect(() => {
//     const subscription = form.watch((all, { name }) => {
//       if (name === "name") {
//         const currentSlug = form.getValues("slug");
//         if (!currentSlug) {
//           const auto = all.name
//             ?.toString()
//             .trim()
//             .toLowerCase()
//             .replace(/[^a-z0-9\s-]/g, "")
//             .replace(/\s+/g, "-")
//             .slice(0, 30);
//           if (auto) form.setValue("slug", auto, { shouldValidate: true });
//         }
//       }
//     });
//     return () => subscription.unsubscribe();
//   }, [form]);
//
//   async function onSubmit(values: AssociationCreateWithOrganizerValues) {
//     startTransition(async () => {
//       const fd = toFormData(values);
//       const result = await saveAssociation(null, fd);
//       setServerState(result);
//
//       if (result?.errors) {
//         // Map backend field errors back into the form
//         for (const [key, msgs] of Object.entries(result.errors)) {
//           // Only map known fields from the association part
//           if (key in values) {
//             form.setError(key as any, {
//               type: "server",
//               message: msgs?.[0] ?? "Champ invalide",
//             });
//           }
//         }
//       }
//
//       if (result?.success) {
//         form.reset();
//       }
//     });
//   }
//
//   const organizerMode = form.watch("organizerMode");
//
//   return (
//     <Card className="max-w-2xl">
//       <CardHeader>
//         <CardTitle>Nouvelle association</CardTitle>
//         <CardDescription>
//           Créez une association et assignez un·e organisateur·rice pour la
//           gérer.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {serverState?.message && (
//           <Alert
//             variant={serverState.success ? "default" : "destructive"}
//             className="mb-6"
//           >
//             {serverState.success ? (
//               <>
//                 <CheckCircle2 className="h-4 w-4" />
//                 <AlertTitle>Succès</AlertTitle>
//               </>
//             ) : (
//               <>
//                 <TriangleAlert className="h-4 w-4" />
//                 <AlertTitle>Erreur</AlertTitle>
//               </>
//             )}
//             <AlertDescription>{serverState.message}</AlertDescription>
//           </Alert>
//         )}
//
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="grid gap-6"
//             noValidate
//           >
//             {/* Association basics */}
//             <div className="grid gap-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Nom</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Ex. Agora ENS" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="slug"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Slug</FormLabel>
//                       <FormControl>
//                         <Input placeholder="agora-ens" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="color"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Couleur</FormLabel>
//                       <FormControl>
//                         <Input type="color" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="logo"
//                   render={({ field: { onChange, value, ...rest } }) => (
//                     <FormItem>
//                       <FormLabel>Logo (PNG/JPG/SVG)</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => onChange(e.target.files?.[0])}
//                           {...rest}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//
//               <FormField
//                 control={form.control}
//                 name="summary"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Résumé</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Courte présentation" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <Textarea rows={6} placeholder="Texte de présentation" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="contactEmail"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email de contact</FormLabel>
//                       <FormControl>
//                         <Input type="email" placeholder="contact@exemple.fr" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="phone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Téléphone</FormLabel>
//                       <FormControl>
//                         <Input placeholder="06 12 34 56 78" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="website"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Site web</FormLabel>
//                       <FormControl>
//                         <Input placeholder="https://exemple.org" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//
//             {/* Organizer section */}
//             <div className="rounded-2xl border p-4 md:p-6 grid gap-4">
//               <div className="flex items-center gap-2">
//                 <Info className="h-4 w-4" />
//                 <p className="text-sm text-muted-foreground">
//                   Chaque association doit avoir un·e organisateur·rice assigné·e.
//                 </p>
//               </div>
//
//               <FormField
//                 control={form.control}
//                 name="organizerMode"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="mb-2 block">Organisateur·rice</FormLabel>
//                     <FormControl>
//                       <RadioGroup
//                         onValueChange={field.onChange}
//                         value={field.value}
//                         className="grid grid-cols-1 md:grid-cols-2 gap-3"
//                       >
//                         <div className="flex items-center space-x-2 rounded-lg border p-3">
//                           <RadioGroupItem value="existing" id="org-existing" />
//                           <Label htmlFor="org-existing">Lier un compte existant</Label>
//                         </div>
//                         <div className="flex items-center space-x-2 rounded-lg border p-3">
//                           <RadioGroupItem value="new" id="org-new" />
//                           <Label htmlFor="org-new">Créer un nouveau compte</Label>
//                         </div>
//                       </RadioGroup>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//
//               {organizerMode === "existing" ? (
//                 <FormField
//                   control={form.control}
//                   name="organizerLookup"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>ID ou email de l'organisateur·rice</FormLabel>
//                       <FormControl>
//                         <Input placeholder="uuid ou email@exemple.fr" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="organizerName"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Nom complet</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Prénom Nom" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="organizerEmail"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <Input type="email" placeholder="organisateur@exemple.fr" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               )}
//             </div>
//
//             <Button type="submit" className="w-full" disabled={isTransPending}>
//               {isTransPending ? "Enregistrement..." : "Enregistrer l’association"}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import * as React from "react";
import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Icons (optional)
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";

// Server action
import { saveAssociation } from "./submitAssociation"; // adjust the path if needed
import type { ActionResponse } from "./types";

// ===== UI Schema =====
const UrlOptional = z
  .url("URL invalide")
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

const EmailOptional = z
  .email("Email invalide")
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

const HexColor = z
  .string()
  .trim()
  .regex(
    /^#(?:[0-9a-fA-F]{3}){1,2}$/i,
    "Utilisez une couleur hexadécimale (#0ea5e9)",
  )
  .default("#ffffff");

const SocialLinkSchema = z.object({
  platform: z.string(), // keep simple on UI; backend will validate enum
  url: z.string().url("URL invalide").trim(),
});

const OrganizerModeEnum = z.enum(["existing", "new"], {
  error: "Sélectionnez une option",
});

const OrganizerExistingSchema = z.object({
  organizerLookup: z
    .string()
    .trim()
    .min(2, "Saisissez l'ID ou l'email de l'organisateur·rice"),
});

const OrganizerNewSchema = z.object({
  organizerName: z
    .string()
    .trim()
    .min(2, "Nom trop court")
    .max(80, "80 caractères maximum"),
  organizerEmail: z.string().trim().email("Email invalide"),
});

const AssociationBaseSchema = z.object({
  name: z.string().trim().min(2, "Au moins 2 caractères").max(30, "30 max"),
  slug: z.string().trim().min(2, "Au moins 2 caractères").max(30, "30 max"),
  color: HexColor,
  summary: z.string().trim().min(1, "Résumé requis"),
  description: z.string().trim().min(1, "Description requise"),
  contactEmail: EmailOptional,
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  website: UrlOptional,
  // socials: z.array(SocialLinkSchema).optional(), // add back when UI is ready
  logo: z
    .any()
    .refine(
      (file) => !file || (typeof File !== "undefined" && file instanceof File),
      "Fichier invalide",
    )
    .optional(),
});

const AssociationCreateWithOrganizerSchema = AssociationBaseSchema.extend({
  organizerMode: OrganizerModeEnum,
}).and(
  z.union([
    OrganizerExistingSchema.extend({ organizerMode: z.literal("existing") }),
    OrganizerNewSchema.extend({ organizerMode: z.literal("new") }),
  ]),
);

export type AssociationCreateWithOrganizerValues = z.infer<
  typeof AssociationCreateWithOrganizerSchema
>;
export type AssociationCreateWithOrganizerInput = z.input<
  typeof AssociationCreateWithOrganizerSchema
>;

function toFormData(values: AssociationCreateWithOrganizerInput) {
  const fd = new FormData();
  fd.set("name", values.name);
  fd.set("slug", values.slug);
  fd.set("color", values.color ?? "#ffffff");
  fd.set("summary", values.summary);
  fd.set("description", values.description);
  if (values.contactEmail) fd.set("contactEmail", values.contactEmail);
  if (values.phone) fd.set("phone", values.phone);
  if (values.website) fd.set("website", values.website);
  if (values.logo) fd.set("logo", values.logo as unknown as File);

  // Organizer payload
  fd.set("organizerMode", values.organizerMode);
  if (values.organizerMode === "existing") {
    fd.set("organizerLookup", (values as any).organizerLookup);
  } else {
    fd.set("organizerName", (values as any).organizerName);
    fd.set("organizerEmail", (values as any).organizerEmail);
  }

  return fd;
}

export default function NewAssociationFormWithOrganizer() {
  const [isTransPending, startTransition] = useTransition();
  const [serverState, setServerState] = React.useState<ActionResponse | null>(
    null,
  );

  const form = useForm<AssociationCreateWithOrganizerInput>({
    resolver: zodResolver(AssociationCreateWithOrganizerSchema),
    shouldUnregister: true,
    defaultValues: {
      name: "",
      slug: "",
      color: "#ffffff",
      summary: "",
      description: "",
      contactEmail: undefined,
      phone: undefined,
      website: undefined,
      logo: undefined,
      organizerMode: "existing",
      organizerLookup: "",
    } as any,
  });

  // Auto-generate slug from name (once empty or if user hasn't edited)
  useEffect(() => {
    const subscription = form.watch((all, { name }) => {
      if (name === "name") {
        const currentSlug = form.getValues("slug");
        if (!currentSlug) {
          const auto = all.name
            ?.toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 30);
          if (auto) form.setValue("slug", auto, { shouldValidate: true });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: AssociationCreateWithOrganizerInput) {
    startTransition(async () => {
      const fd = toFormData(values);
      const result = await saveAssociation(null, fd);
      setServerState(result);

      if (result?.errors) {
        // Map backend field errors back into the form
        for (const [key, msgs] of Object.entries(result.errors)) {
          // Only map known fields from the association part
          if (key in values) {
            form.setError(key as any, {
              type: "server",
              message: msgs?.[0] ?? "Champ invalide",
            });
          }
        }
      }

      if (result?.success) {
        form.reset();
      }
    });
  }

  const organizerMode = form.watch("organizerMode");

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Nouvelle association</CardTitle>
        <CardDescription>
          Créez une association et assignez un·e organisateur·rice pour la
          gérer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serverState?.message && (
          <Alert
            variant={serverState.success ? "default" : "destructive"}
            className="mb-6"
          >
            {serverState.success ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Succès</AlertTitle>
              </>
            ) : (
              <>
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
              </>
            )}
            <AlertDescription>{serverState.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6"
            noValidate
          >
            {/* Association basics */}
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex. Agora ENS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="agora-ens" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Logo (PNG/JPG/SVG)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Résumé</FormLabel>
                    <FormControl>
                      <Input placeholder="Courte présentation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Texte de présentation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contact</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@exemple.fr"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="06 12 34 56 78" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemple.org" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Organizer section */}
            <div className="rounded-2xl border p-4 md:p-6 grid gap-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <p className="text-sm text-muted-foreground">
                  Chaque association doit avoir un·e organisateur·rice
                  assigné·e.
                </p>
              </div>

              <FormField
                control={form.control}
                name="organizerMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 block">
                      Organisateur·rice
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                          <RadioGroupItem value="existing" id="org-existing" />
                          <Label htmlFor="org-existing">
                            Lier un compte existant
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                          <RadioGroupItem value="new" id="org-new" />
                          <Label htmlFor="org-new">
                            Créer un nouveau compte
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {organizerMode === "existing" ? (
                <FormField
                  control={form.control}
                  name="organizerLookup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID ou email de l'organisateur·rice</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="uuid ou email@exemple.fr"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="organizerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organizerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="organisateur@exemple.fr"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isTransPending}>
              {isTransPending
                ? "Enregistrement..."
                : "Enregistrer l’association"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
