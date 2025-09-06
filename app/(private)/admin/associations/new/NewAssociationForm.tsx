"use client";

import * as React from "react";
import { useEffect, useTransition } from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
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
import DescriptionField from "@/components/forms/Description";
import SummaryField from "@/components/forms/Summary";
import EmailField from "@/components/forms/Email";
import PhoneField from "@/components/forms/Phone";
import WebsiteField from "@/components/forms/Website";
import ColorField from "@/components/forms/Color";
import SlugField from "@/components/forms/Slug";
import NameField from "@/components/forms/Name";
import SocialLinksField from "@/components/forms/SocialLinksField";

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
  }, [state?.inputs]);

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
    const fd = new FormData();

    const { socials, ...rest } = values;

    // primitives
    (Object.entries(rest) as [keyof typeof rest, any][]).forEach(([k, v]) => {
      fd.append(k, v == null ? "" : String(v));
    });

    // socials
    (socials ?? []).forEach((s) => {
      if (!s?.url) return; // skip blank rows
      fd.append("socialPlatform[]", String(s.platform ?? "other"));
      fd.append("socialUrl[]", s.url);
    });

    startTransition(() => action(fd));
  }

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
            <NameField />

            <SlugField form={form} />

            <ColorField form={form} />

            <SummaryField form={form} />

            <DescriptionField form={form} />

            <EmailField form={form} />

            <PhoneField form={form} />

            <WebsiteField form={form} />

            <SocialLinksField />

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
