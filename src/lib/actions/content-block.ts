"use server";

import { prisma } from "@/lib/prisma";
import { contentBlockSchema } from "@/lib/validations/content-block";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";

function buildData(parsed: {
  description?: string;
  techStack?: string;
  responsibilities?: string;
  month?: number;
}) {
  return {
    description: parsed.description || "",
    techStack: parsed.techStack || "",
    responsibilities: parsed.responsibilities || "",
    month: parsed.month || null,
  };
}

export async function createContentBlock(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = contentBlockSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const {
    eraId,
    type,
    title,
    subtitle,
    deadline,
    order,
    isPublished,
    description,
    techStack,
    responsibilities,
    month,
  } = parsed.data;

  await prisma.contentBlock.create({
    data: {
      eraId,
      type,
      title,
      subtitle: subtitle || null,
      data: buildData({ description, techStack, responsibilities, month }),
      deadline: deadline ? new Date(deadline) : null,
      order,
      isPublished,
    },
  });

  revalidatePath("/admin/content-blocks");
  return { success: true };
}

export async function updateContentBlock(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = contentBlockSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const {
    eraId,
    type,
    title,
    subtitle,
    deadline,
    order,
    isPublished,
    description,
    techStack,
    responsibilities,
    month,
  } = parsed.data;

  await prisma.contentBlock.update({
    where: { id },
    data: {
      eraId,
      type,
      title,
      subtitle: subtitle || null,
      data: buildData({ description, techStack, responsibilities, month }),
      deadline: deadline ? new Date(deadline) : null,
      order,
      isPublished,
    },
  });

  revalidatePath("/admin/content-blocks");
  return { success: true };
}

export async function deleteContentBlock(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.contentBlock.delete({ where: { id } });

  revalidatePath("/admin/content-blocks");
  return { success: true };
}
