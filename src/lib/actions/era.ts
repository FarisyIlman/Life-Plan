"use server";

import { prisma } from "@/lib/prisma";
import { eraSchema } from "@/lib/validations/era";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";

export async function createEra(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = eraSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.era.create({ data: parsed.data });

  revalidatePath("/admin/eras");
  return { success: true };
}

export async function updateEra(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = eraSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.era.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/eras");
  return { success: true };
}

export async function deleteEra(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.era.delete({ where: { id } });

  revalidatePath("/admin/eras");
  return { success: true };
}
