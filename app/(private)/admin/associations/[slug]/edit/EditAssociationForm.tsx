// app/associations/[slug]/edit/EditAssociationForm.tsx
"use client";

import * as React from "react";
import { useEffect, useTransition } from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
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
import { ActionResponse } from "../../new/types";
import DescriptionField from "@/components/forms/Description";
import PhoneField from "@/components/forms/Phone";
import EmailField from "@/components/forms/Email";
import SummaryField from "@/components/forms/Summary";
import ColorField from "@/components/forms/Color";
import SlugField from "@/components/forms/Slug";
import NameField from "@/components/forms/Name";
import WebsiteField from "@/components/forms/Website";
import SocialLinksField from "@/components/forms/SocialLinksField";
import { updateAssociation } from "./editAssociation";
import {
  AssociationCreateFormSchema,
  AssociationCreateFormValues,
} from "@/schemas/association-create-form";
import LogoField from "@/components/forms/Logo";

const initialState: ActionResponse = { success: false, message: "" };

export default function EditAssociationForm({
  id,
  initial,
}: {
  id: string;
  initial: AssociationCreateFormValues;
}) {
  const [state, action, isPending] = useActionState(
    updateAssociation.bind(null, id),
    initialState,
  );

  const [isTransPending, startTransition] = useTransition();

  const form = useForm<AssociationCreateFormValues>({
    resolver: zodResolver(AssociationCreateFormSchema),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: initial,
  });

  // dynamic list helper
  const { reset, setError, clearErrors, setFocus, watch } = form;

  // When server returns sanitized inputs, sync them into RHF
  useEffect(() => {
    if (state?.inputs) {
      reset({
        ...watch(),
        ...(state.inputs as Partial<AssociationCreateFormValues>),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.inputs]);

  // Map server field errors (e.g., unique slug) into RHF messages
  useEffect(() => {
    if (state?.errors) {
      clearErrors();
      for (const [field, msgs] of Object.entries(state.errors)) {
        const message = Array.isArray(msgs) ? msgs[0] : String(msgs ?? "");
        setError(field as keyof AssociationCreateFormValues, {
          type: "server",
          message,
        });
      }
      const firstKey = Object.keys(state.errors)[0] as
        | keyof AssociationCreateFormValues
        | undefined;
      if (firstKey) setFocus(firstKey);
    }
  }, [state?.errors, clearErrors, setError, setFocus]);

  async function onSubmit(values: AssociationCreateFormValues) {
    const fd = new FormData();
    const { socials, logo, ...rest } = values;

    // primitives
    (Object.entries(rest) as [keyof typeof rest, any][]).forEach(([k, v]) =>
      fd.append(k, v == null ? "" : String(v)),
    );

    // socials
    (socials ?? []).forEach((s) => {
      if (!s?.url) return;
      fd.append("socialPlatform[]", String(s.platform ?? "other"));
      fd.append("socialUrl[]", s.url);
    });

    if (logo instanceof File) {
      fd.append("logo", logo);
    }

    startTransition(() => action());
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Association · Modifier</CardTitle>
        <CardDescription>
          Modifiez les informations de l’association.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            autoComplete="on"
            encType="multipart/form-data"
          >
            <NameField />

            <LogoField />

            <SlugField form={form} />

            <ColorField form={form} />

            <SummaryField form={form} />

            <DescriptionField form={form} />

            <EmailField form={form} />

            <PhoneField form={form} />

            <WebsiteField form={form} />

            <SocialLinksField />

            {/* Server message */}
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
              {isPending ? "Enregistrement..." : "Mettre à jour l’association"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
