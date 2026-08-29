"use server";

import { prisma } from "@/lib/prisma";
import { masterDegreeNodeSchema } from "@/lib/validations/master-degree-node";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getPrismaErrorMessage } from "@/lib/prisma-error";

export async function createMasterDegreeNode(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = masterDegreeNodeSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.masterDegreeNode.create({ data: parsed.data });
    revalidatePath("/admin/master-degree");
    revalidatePath("/timeline/[slug]", "page");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function updateNodePosition(id: string, x: number, y: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.masterDegreeNode.update({
      where: { id },
      data: { positionX: x, positionY: y },
    });
    revalidatePath("/admin/master-degree");
    revalidatePath("/timeline/[slug]", "page");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function updateMasterDegreeNode(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = masterDegreeNodeSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.masterDegreeNode.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/master-degree");
    revalidatePath("/timeline/[slug]", "page");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function deleteMasterDegreeNode(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.masterDegreeNode.delete({ where: { id } });
    revalidatePath("/admin/master-degree");
    revalidatePath("/timeline/[slug]", "page");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}
