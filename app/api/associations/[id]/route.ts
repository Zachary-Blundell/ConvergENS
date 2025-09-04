import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, SocialPlatform } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
export const dynamic = "force-dynamic";

// Reuse your social link schema
const socialLinkSchema = z.object({
  platform: z.enum(SocialPlatform),
  url: z.url(),
  handle: z.string().optional(),
  label: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

// For updates: everything optional (PATCH semantics)
const associationUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.url().optional(),
  contactEmail: z.email().optional(),
  phone: z.string().optional(),
  website: z.url().optional(),
  // If provided, this will REPLACE all existing socials
  socials: z.array(socialLinkSchema).optional(),
});

/**
 * PATCH /api/associations/:id
 * - Partial update.
 * - If `socials` is present, we replace the entire socials list.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const data = associationUpdateSchema.parse(body);

    const updated = await prisma.association.update({
      where: { id: params.id },
      data: {
        // update only provided fields
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.contactEmail !== undefined && {
          contactEmail: data.contactEmail,
        }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.website !== undefined && { website: data.website }),

        // Replace socials if provided
        ...(data.socials
          ? {
              socials: {
                deleteMany: {}, // remove all existing
                create: data.socials, // add the new set
              },
            }
          : {}),
      },
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

    return NextResponse.json(updated, { status: 200 });
  } catch (error: unknown) {
    // Zod validation
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Association not found" },
          { status: 404 },
        );
      }
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
      // Other Prisma known errors
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Generic fallback
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

/**
 * DELETE /api/associations/:id
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.association.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Association not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
