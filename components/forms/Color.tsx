/* Color */
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { AssociationSchema } from "@/schemas/association";
import { Input } from "../ui/input";

type FormValues = z.infer<typeof AssociationSchema>;

export default function ColorField({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  // ---------- Contrast helper (optional; same as your create form) ----------
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
  function safeRatio(fn: () => number) {
    try {
      const v = fn();
      return Number.isFinite(v) ? Number(v.toFixed(2)) : NaN;
    } catch {
      return NaN;
    }
  }
  const ratioWhite = safeRatio(() => contrastRatio(color, "#ffffff"));
  const ratioBlack = safeRatio(() => contrastRatio(color, "#000000"));
  const recommendBlack = ratioBlack >= ratioWhite;
  const recommendedText = recommendBlack ? "#000000" : "#ffffff";
  const recommendedRatio = recommendBlack ? ratioBlack : ratioWhite;
  return (
    <FormField
      control={form.control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Couleur principale de l’association</FormLabel>
          <FormControl>
            <div className="flex flex-wrap items-center gap-3">
              <Input
                type="color"
                value={field.value}
                onChange={(e) =>
                  form.setValue("color", e.target.value, {
                    shouldValidate: true,
                  })
                }
                className="h-10 w-14 p-1 cursor-pointer"
              />
              <Input
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                placeholder="#0ea5e9"
                pattern="#?[0-9a-fA-F]{3,6}"
                inputMode="text"
                className="max-w-[160px]"
              />
              <div
                className="h-10 px-3 rounded-md border flex items-center text-sm"
                style={{
                  backgroundColor: color,
                  color: recommendedText,
                }}
              >
                Aperçu
              </div>
              <div className="text-xs text-muted-foreground leading-5">
                <div>
                  Contraste #fff : {isNaN(ratioWhite) ? "–" : `${ratioWhite}:1`}
                </div>
                <div>
                  Contraste #000 : {isNaN(ratioBlack) ? "–" : `${ratioBlack}:1`}
                </div>
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Utilisée pour les éléments d’accent.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
