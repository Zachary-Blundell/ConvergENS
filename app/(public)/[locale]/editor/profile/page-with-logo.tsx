// AssociationBasicsForm.tsx — Basics form extended with Logo uploader (preview + alt text)
// - Uses shadcn/ui + React Hook Form + Zod
// - No persistence; submit logs values (file name/size only)
// - Validates: name (required), blurb (required, ≤160), brandColor (hex),
//              logo optional BUT if provided → validate type/size and require alt

"use client";

import * as React from "react";
import { useMemo, useEffect } from "react";
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

// ---------------- Schema ----------------
const LogoSchema = z
  .object({
    file: z
      .any()
      .refine((f) => f == null || f instanceof File, "Invalid file")
      .refine((f) => f == null || f.size <= 2 * 1024 * 1024, "Max 2 MB")
      .refine(
        (f) =>
          f == null ||
          ["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(
            (f as File).type,
          ),
        "PNG, JPG, WEBP or SVG only",
      ),
    alt: z.string().trim().optional(),
  })
  .refine((v) => !v.file || !!(v.alt && v.alt.length > 0), {
    message: "Alt text is required when a logo is uploaded",
    path: ["alt"],
  });

const BasicsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Keep it under 100 characters"),
  blurb: z
    .string()
    .trim()
    .min(1, "Blurb is required")
    .max(160, "Blurb must be 160 characters or fewer"),
  brandColor: z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/i, "Use a hex color like #0ea5e9"),
  logo: LogoSchema.optional(), // optional overall; if present, file+alt validated
});

export type BasicsValues = z.infer<typeof BasicsSchema>;

export default function AssociationBasicsForm(
  props: {
    defaultValues?: Partial<BasicsValues>;
    onSubmit?: (values: BasicsValues) => void;
  } = {},
) {
  const form = useForm<BasicsValues>({
    resolver: zodResolver(BasicsSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      blurb: "",
      brandColor: "#0ea5e9",
      logo: { file: undefined, alt: "" },
      ...props.defaultValues,
    },
  });

  const blurb = form.watch("blurb") ?? "";
  const color = form.watch("brandColor") ?? "#0ea5e9";
  const logoFile = form.watch("logo.file") as File | undefined;

  // Create a blob URL preview for the selected logo file
  const previewUrl = useMemo(() => {
    if (!logoFile) return undefined;
    try {
      return URL.createObjectURL(logoFile);
    } catch {
      return undefined;
    }
  }, [logoFile]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = (values: BasicsValues) => {
    // Avoid logging huge file blobs — show basic info
    const safe = {
      ...values,
      logo: values.logo?.file
        ? {
            alt: values.logo?.alt ?? "",
            file: {
              name: values.logo.file.name,
              size: values.logo.file.size,
              type: values.logo.file.type,
            },
          }
        : undefined,
    };
    console.log("[Basics submitted]", safe);
    props.onSubmit?.(values);
  };

  // ---------- Contrast helper (no deps) ----------
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Association · Basics</h1>
        <p className="text-sm text-muted-foreground">
          Name, short blurb, brand color, and logo.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Cercle des Randonneurs de Paris"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Public display name of the association.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo uploader */}
          <FormField
            control={form.control}
            name="logo.file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo (optional)</FormLabel>
                <FormControl>
                  <div className="flex items-start gap-4 flex-wrap">
                    {/* Preview box */}
                    <div className="h-20 w-20 rounded-md border bg-background flex items-center justify-center overflow-hidden">
                      {previewUrl ? (
                        // Use <img> for blob URL preview; swap to next/image after upload
                        <img
                          src={previewUrl}
                          alt="Logo preview"
                          className="object-contain h-full w-full"
                        />
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          No logo
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          // Update form value + trigger validation
                          form.setValue("logo.file", f as any, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        aria-label="Upload logo image"
                      />
                      <div className="text-xs text-muted-foreground">
                        PNG/JPG/WEBP/SVG • Max 2 MB • Square logo recommended
                      </div>
                      {logoFile && (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              form.setValue("logo.file", undefined as any, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo alt text (shown only when a file is selected) */}
          {logoFile && (
            <FormField
              control={form.control}
              name="logo.alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo alt text</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Association logo" {...field} />
                  </FormControl>
                  <FormDescription>
                    Required when a logo is uploaded (for accessibility and
                    SEO).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Blurb */}
          <FormField
            control={form.control}
            name="blurb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blurb / Tagline</FormLabel>
                <FormControl>
                  <div>
                    <Textarea
                      rows={3}
                      placeholder="One‑line summary (≤ 160 characters)"
                      maxLength={160}
                      {...field}
                    />
                    <div className="mt-1 text-right text-xs text-muted-foreground">
                      {(form.watch("blurb") ?? "").length}/160
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Appears under the name and in SEO descriptions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand Color */}
          <FormField
            control={form.control}
            name="brandColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Brand Color</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Native color input */}
                    <Input
                      type="color"
                      value={field.value}
                      onChange={(e) =>
                        form.setValue("brandColor", e.target.value, {
                          shouldValidate: true,
                        })
                      }
                      className="h-10 w-14 p-1 cursor-pointer"
                      aria-label="Pick brand color"
                    />
                    {/* Hex text input */}
                    <Input
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      placeholder="#0ea5e9"
                      pattern="#?[0-9a-fA-F]{3,6}"
                      inputMode="text"
                      className="max-w-[160px]"
                      aria-label="Brand color hex"
                    />
                    {/* Preview chip with recommended text color */}
                    <div
                      className="h-10 px-3 rounded-md border flex items-center text-sm"
                      style={{ backgroundColor: color, color: recommendedText }}
                      aria-label="Contrast preview"
                      title={`Contrast preview (${color} on ${recommendedText})`}
                    >
                      Preview
                    </div>
                    {/* Contrast info */}
                    <div className="text-xs text-muted-foreground">
                      <div>
                        Contrast vs <span className="font-mono">#fff</span>:{" "}
                        {isNaN(ratioWhite) ? "–" : `${ratioWhite}:1`}
                      </div>
                      <div>
                        Contrast vs <span className="font-mono">#000</span>:{" "}
                        {isNaN(ratioBlack) ? "–" : `${ratioBlack}:1`}
                      </div>
                      <div>
                        Recommended text:{" "}
                        <span className="font-mono">
                          {recommendBlack ? "#000" : "#fff"}
                        </span>{" "}
                        · {aaPass}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Used for accents, buttons, and highlights.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit">Save (demo)</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
