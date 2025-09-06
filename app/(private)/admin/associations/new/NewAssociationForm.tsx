"use client";

import * as React from "react";
import { useEffect, useTransition } from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui
import {
  Form,
  FormControl,
  FormDescription,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

import { useFieldArray, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

import { saveAssociation } from "./submitAssociation";
import type { ActionResponse } from "./types";
import { AssociationSchema } from "@/schemas/association";

type FormValues = z.infer<typeof AssociationSchema>;

const initialState: ActionResponse = { success: false, message: "" };

// keep values aligned with your enum names
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

function SocialLinksField({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  const { control, setValue, watch, formState } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socials",
  });

  // ensure at least one empty row
  React.useEffect(() => {
    if (fields.length === 0) append({ platform: "other", url: "" });
  }, []);

  const socialsErrors = formState.errors?.socials as
    | Array<{ platform?: { message?: string }; url?: { message?: string } }>
    | undefined;

  return (
    <FormField
      control={control}
      name="socials"
      render={() => (
        <FormItem>
          <FormLabel>Réseaux sociaux</FormLabel>
          <div className="space-y-3">
            {fields.map((field, idx) => {
              const platformName = `socials.${idx}.platform` as const;
              const urlName = `socials.${idx}.url` as const;
              const rowError = socialsErrors?.[idx];

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-[14rem_1fr_auto] items-start gap-2 rounded-xl border p-3"
                >
                  {/* Platform */}
                  <Controller
                    control={control}
                    name={platformName}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? "other"}
                        onValueChange={(val) => field.onChange(val)}
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
                    )}
                  />

                  {/* URL */}
                  <Controller
                    control={control}
                    name={urlName}
                    render={({ field }) => (
                      <Input
                        type="url"
                        inputMode="url"
                        placeholder="https://…"
                        className="h-10"
                        {...field}
                      />
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

                  {/* Row-level errors (optional) */}
                  {(rowError?.platform?.message || rowError?.url?.message) && (
                    <div className="col-span-full text-sm text-destructive">
                      {rowError?.platform?.message ?? rowError?.url?.message}
                    </div>
                  )}
                </div>
              );
            })}

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

export default function AssociationForm() {
  const [state, action, isPending] = useActionState(
    saveAssociation,
    initialState,
  );

  const [isTransPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(AssociationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      color: "#ffffff",
      summary: "",
      description: "",
      contactEmail: undefined,
      phone: undefined,
      website: undefined,
      socials: [{ platform: "other", url: "" }],
    },
  });

  // When server returns sanitized inputs, sync them into RHF
  useEffect(() => {
    if (state?.inputs) {
      form.reset({
        ...form.getValues(),
        ...(state.inputs as Partial<FormValues>),
      });
    }
  }, [state?.inputs]); // eslint-disable-line react-hooks/exhaustive-deps

  // Map server field errors (e.g., unique slug) into RHF messages
  useEffect(() => {
    if (state?.errors) {
      // Clear previous server errors first
      form.clearErrors();
      for (const [field, msgs] of Object.entries(state.errors)) {
        const message = Array.isArray(msgs) ? msgs[0] : String(msgs ?? "");
        form.setError(field as keyof FormValues, { type: "server", message });
      }
      // Optionally focus the first errored field
      const firstKey = Object.keys(state.errors)[0] as
        | keyof FormValues
        | undefined;
      if (firstKey) form.setFocus(firstKey);
    }
  }, [state?.errors, form]);

  // clear the form after a successful create
  useEffect(() => {
    if (state?.success) form.reset();
  }, [state?.success, form]);

  async function onSubmit(values: FormValues) {
    // Build FormData to send to your server action
    const fd = new FormData();
    (
      Object.entries(values) as [
        keyof FormValues,
        FormValues[keyof FormValues],
      ][]
    ).forEach(([k, v]) => fd.append(k, v == null ? "" : String(v)));
    startTransition(() => {
      action(fd);
    });
  }

  // ---------- Contrast helper (no deps) ----------
  const color = form.watch("color") ?? "#0ea5e9";
  function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    const num = parseInt(full, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  function srgbToLinear(c: number) {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  }
  function luminance({ r, g, b }: { r: number; g: number; b: number }) {
    const R = srgbToLinear(r);
    const G = srgbToLinear(g);
    const B = srgbToLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
  function contrastRatio(hexBg: string, hexFg: string) {
    const L1 = luminance(hexToRgb(hexBg));
    const L2 = luminance(hexToRgb(hexFg));
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  const ratioWhite = safeRatio(() => contrastRatio(color, "#ffffff"));
  const ratioBlack = safeRatio(() => contrastRatio(color, "#000000"));
  const recommendBlack = ratioBlack >= ratioWhite;
  const recommendedText = recommendBlack ? "#000000" : "#ffffff";
  const recommendedRatio = recommendBlack ? ratioBlack : ratioWhite;
  const aaPass =
    recommendedRatio >= 4.5
      ? "AA"
      : recommendedRatio >= 3
        ? "AA (large)"
        : "Fail";

  function safeRatio(fn: () => number) {
    try {
      const v = fn();
      return Number.isFinite(v) ? Number(v.toFixed(2)) : NaN;
    } catch {
      return NaN;
    }
  }
  // Message simple pour l'utilisateur selon le niveau de contraste

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Association · Informations</CardTitle>
        <CardDescription>
          Renseignez les détails de l’association.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            autoComplete="on"
          >
            {/* Name */}
            <FormField
              control={form.control}
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

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: open-knowledge-alliance"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minuscules, chiffres et tirets (unique).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur principale de l’association</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Sélecteur natif */}
                      <Input
                        type="color"
                        value={field.value}
                        onChange={(e) =>
                          form.setValue("color", e.target.value, {
                            shouldValidate: true,
                          })
                        }
                        className="h-10 w-14 p-1 cursor-pointer"
                        aria-label="Choisir la couleur"
                        title="Choisir la couleur"
                      />

                      {/* Saisie hexadécimale */}
                      <Input
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        placeholder="#0ea5e9"
                        pattern="#?[0-9a-fA-F]{3,6}"
                        inputMode="text"
                        className="max-w-[160px]"
                        aria-label="Code couleur hexadécimal"
                        title="Saisir un code couleur (ex. #0ea5e9)"
                      />

                      {/* Pastille d’aperçu avec texte conseillé */}
                      <div
                        className="h-10 px-3 rounded-md border flex items-center text-sm"
                        style={{
                          backgroundColor: color,
                          color: recommendedText,
                        }}
                        aria-label="Aperçu de contraste"
                        title={`Aperçu : ${color} avec texte ${recommendedText}`}
                      >
                        Aperçu
                      </div>

                      {/* Infos lisibles pour tout le monde */}
                      <div className="text-xs text-muted-foreground leading-5">
                        <div>
                          Contraste sur fond{" "}
                          <span className="font-mono">#fff</span> :{" "}
                          {isNaN(ratioWhite) ? "–" : `${ratioWhite}:1`}
                        </div>
                        <div>
                          Contraste sur fond{" "}
                          <span className="font-mono">#000</span> :{" "}
                          {isNaN(ratioBlack) ? "–" : `${ratioBlack}:1`}
                        </div>
                        <div className="mt-1">
                          <span className="font-medium">Texte conseillé :</span>{" "}
                          <span className="font-mono">
                            {recommendedText /* "#000000" ou "#ffffff" */}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="font-medium">Lisibilité :</span>{" "}
                          {recommendedRatio >= 4.5
                            ? "Bonne (AA)"
                            : recommendedRatio >= 3
                              ? "Acceptable pour grand texte (AA)"
                              : "Insuffisant"}
                        </div>
                      </div>
                    </div>
                  </FormControl>

                  <FormDescription>
                    Cette couleur sera utilisée pour les boutons, liens et
                    éléments d’accent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Résumé</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Courte description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Description détaillée"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contact</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@exemple.org"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+33 1 23 45 67 89"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://exemple.org"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SocialLinksField form={form} />

            {/* Global server action message */}
            {state?.message && (
              <Alert variant={state.success ? "default" : "destructive"}>
                {state.success && <CheckCircle2 className="h-4 w-4" />}
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isTransPending}
            >
              {isPending ? "Enregistrement..." : "Enregistrer l’association"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
