// app/api/associations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SocialPlatform } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { errorToProblem } from "@/lib/http/errors";

export const dynamic = "force-dynamic";

// Schemas
const socialLinkSchema = z.object({
  platform: z.enum(SocialPlatform),
  url: z.url(),
  handle: z.string().optional(),
  label: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

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

  return NextResponse.json({ items: filtered, count: filtered.length });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    // Avoid throwing on invalid input
    const parsed = associationSchema.safeParse(json);
    if (!parsed.success) {
      // Consistent 422 with field errors
      throw parsed.error;
    }

    const data = parsed.data;
    const created = await prisma.association.create({
      data: {
        ...data,
        socials: data.socials ? { create: data.socials } : undefined,
      },
      include: { socials: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/associations error:", err);
    return errorToProblem(err);
  }
}
