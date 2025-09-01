"use client";

import { ActionResponse } from "./types";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { saveAssociation } from "./submitAssociation";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function AddressForm() {
  const [state, action, isPending] = useActionState(
    saveAssociation,
    initialState,
  );

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Association Information</CardTitle>
        <CardDescription>
          Please enter the association details below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6" autoComplete="on">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="associationName">Nom de l’association</Label>
              <Input
                id="associationName"
                name="name"
                placeholder="Nom de l’association"
                required
                minLength={2}
                maxLength={30}
                aria-describedby="associationName-error"
                className={state?.errors?.name ? "border-red-500" : ""}
              />
              {state?.errors?.name && (
                <p id="streetAddress-error" className="text-sm text-red-500">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="associationSlug">Slug</Label>
              <Input
                id="associationSlug"
                name="slug"
                placeholder="ex: open-knowledge-alliance"
                required
                minLength={2}
                maxLength={30}
                aria-describedby="associationSlug-error"
                // optional hard constraint if you want: pattern & title
                // pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                // title="Minuscules, chiffres et tirets uniquement"
                className={state?.errors?.slug ? "border-red-500" : ""}
              />
              {state?.errors?.slug && (
                <p id="associationSlug-error" className="text-sm text-red-500">
                  {state.errors.slug[0]}
                </p>
              )}
            </div>

            {/* Résumé */}
            <div className="space-y-2">
              <Label htmlFor="associationSummary">Résumé</Label>
              <Textarea
                id="associationSummary"
                name="summary"
                placeholder="Courte description"
                rows={3}
                aria-describedby="associationSummary-error"
                className={state?.errors?.summary ? "border-red-500" : ""}
              />
              {state?.errors?.summary && (
                <p
                  id="associationSummary-error"
                  className="text-sm text-red-500"
                >
                  {state.errors.summary[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="associationDescription">Description</Label>
              <Textarea
                id="associationDescription"
                name="description"
                placeholder="Description détaillée"
                required
                rows={6}
                aria-describedby="associationDescription-error"
                className={state?.errors?.description ? "border-red-500" : ""}
              />
              {state?.errors?.description && (
                <p
                  id="associationDescription-error"
                  className="text-sm text-red-500"
                >
                  {state.errors.description[0]}
                </p>
              )}
            </div>

            {/* Email de contact */}
            <div className="space-y-2">
              <Label htmlFor="associationEmail">Email de contact</Label>
              <Input
                id="associationEmail"
                name="contactEmail"
                type="email"
                placeholder="contact@exemple.org"
                aria-describedby="associationEmail-error"
                className={state?.errors?.contactEmail ? "border-red-500" : ""}
              />
              {state?.errors?.contactEmail && (
                <p id="associationEmail-error" className="text-sm text-red-500">
                  {state.errors.contactEmail[0]}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="associationPhone">Téléphone</Label>
              <Input
                id="associationPhone"
                name="phone"
                type="tel"
                placeholder="+33 1 23 45 67 89"
                aria-describedby="associationPhone-error"
                className={state?.errors?.phone ? "border-red-500" : ""}
              />
              {state?.errors?.phone && (
                <p id="associationPhone-error" className="text-sm text-red-500">
                  {state.errors.phone[0]}
                </p>
              )}
            </div>

            {/* Site web */}
            <div className="space-y-2">
              <Label htmlFor="associationWebsite">Site web</Label>
              <Input
                id="associationWebsite"
                name="website"
                type="url"
                placeholder="https://exemple.org"
                aria-describedby="associationWebsite-error"
                className={state?.errors?.website ? "border-red-500" : ""}
              />
              {state?.errors?.website && (
                <p
                  id="associationWebsite-error"
                  className="text-sm text-red-500"
                >
                  {state.errors.website[0]}
                </p>
              )}
            </div>
          </div>

          {state?.message && (
            <Alert variant={state.success ? "default" : "destructive"}>
              {state.success && <CheckCircle2 className="h-4 w-4" />}
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Enregistrement..." : "Enregistrer l'association"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
