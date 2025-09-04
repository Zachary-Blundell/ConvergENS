// app/api/associations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, SocialPlatform } from "@prisma/client";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

// Define the schema for a social link
const socialLinkSchema = z.object({
  platform: z.enum(SocialPlatform),
  url: z.url(),
  handle: z.string().optional(),
  label: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

// Define the schema for an association
const associationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.url().optional(),
  contactEmail: z.email().optional(),
  phone: z.string().optional(),
  website: z.url().optional(),
  socials: z.array(socialLinkSchema).optional(),
});

// GET /api/associations?q=term
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();

  const items = await prisma.association.findMany({
    orderBy: [{ name: "asc" }, { id: "asc" }],
    include: {
      socials: {
        select: {
          id: true,
          platform: true,
          url: true,
          handle: true,
          label: true,
          isPrimary: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [{ isPrimary: "desc" }, { platform: "asc" }],
      },
    },
  });

  const filtered = q
    ? items.filter((a) => {
        const haystack = [a.name, a.slug, a.summary ?? "", a.description ?? ""]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
    : items;

  return NextResponse.json({
    items: filtered,
    count: filtered.length,
  });
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = associationSchema.parse(json);

    const newAssociation = await prisma.association.create({
      data: {
        ...data,
        socials: data.socials ? { create: data.socials } : undefined,
      },
      include: { socials: true },
    });

    return NextResponse.json(newAssociation, { status: 201 });
  } catch (error: unknown) {
    // Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Prisma known errors (e.g., unique constraint)
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target;
        const constraint = Array.isArray(target)
          ? target.join(", ")
          : typeof target === "string"
            ? target
            : "constraint";
        return NextResponse.json(
          { error: `Unique constraint failed on the ${constraint}` },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Generic fallback
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
