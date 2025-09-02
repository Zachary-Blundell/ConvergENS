"use server";
import { prisma } from "@/lib/db";
import { ActionResponse } from "./new/types";
import { revalidatePath } from "next/cache";

export async function deleteAssociation(id: string): Promise<ActionResponse> {
  try {
    await prisma.association.delete({ where: { id } });
    revalidatePath("/admin/associations");
    return { success: true, message: "Association deleted successfully." };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to delete association." };
  }
}
