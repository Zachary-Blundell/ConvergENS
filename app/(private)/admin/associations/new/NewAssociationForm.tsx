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

import { saveAssociation } from "./submitAssociation";
import type { ActionResponse } from "./types";
import { AssociationSchema } from "@/schemas/association";

type FormValues = z.infer<typeof AssociationSchema>;

const initialState: ActionResponse = { success: false, message: "" };

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
