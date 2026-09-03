"use server";

import { prisma } from "@/lib/prisma";
import { contentBlockSchema } from "@/lib/validations/content-block";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getPrismaErrorMessage } from "@/lib/prisma-error";

function buildData(parsed: {
  description?: string;
  techStack?: string;
  responsibilities?: string;
  month?: number;
  textColor?: string;
}) {
  return {
    description: parsed.description || "",
    techStack: parsed.techStack || "",
    responsibilities: parsed.responsibilities || "",
    month: parsed.month || null,
    textColor: parsed.textColor || null,
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
    isCompleted,
    description,
    techStack,
    responsibilities,
    month,
    textColor,
  } = parsed.data;

  try {
    await prisma.contentBlock.create({
      data: {
        eraId,
        type,
        title,
        subtitle: subtitle || null,
        data: buildData({
          description,
          techStack,
          responsibilities,
          month,
          textColor,
        }),
        deadline: deadline ? new Date(deadline) : null,
        order,
        isPublished,
        isCompleted,
      },
    });

    revalidatePath("/admin/content-blocks");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
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
    isCompleted,
    description,
    techStack,
    responsibilities,
    month,
    textColor,
  } = parsed.data;

  try {
    await prisma.contentBlock.update({
      where: { id },
      data: {
        eraId,
        type,
        title,
        subtitle: subtitle || null,
        data: buildData({
          description,
          techStack,
          responsibilities,
          month,
          textColor,
        }),
        deadline: deadline ? new Date(deadline) : null,
        order,
        isPublished,
        isCompleted,
      },
    });

    revalidatePath("/admin/content-blocks");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function deleteContentBlock(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.contentBlock.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/admin/content-blocks");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function restoreContentBlock(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.contentBlock.update({
      where: { id },
      data: { deletedAt: null },
    });

    revalidatePath("/admin/content-blocks");
    revalidatePath("/admin/trash");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function permanentlyDeleteContentBlock(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.contentBlock.delete({ where: { id } });
    revalidatePath("/admin/trash");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function toggleContentBlockComplete(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const block = await prisma.contentBlock.findUnique({ where: { id } });
    if (!block) return { error: { _form: ["Content block not found."] } };

    const updated = await prisma.contentBlock.update({
      where: { id },
      data: { isCompleted: !block.isCompleted },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        action: updated.isCompleted ? "MARK_COMPLETE" : "MARK_PENDING",
        entityType: "ContentBlock",
        entityId: id,
        detail: { title: block.title },
      },
    });

    revalidatePath("/admin/content-blocks");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function reorderContentBlocks(orderedIds: string[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.contentBlock.update({ where: { id }, data: { order: index } }),
      ),
    );

    revalidatePath("/admin/content-blocks");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function bulkPublishContentBlocks(
  ids: string[],
  publish: boolean,
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.contentBlock.updateMany({
      where: { id: { in: ids } },
      data: { isPublished: publish },
    });
    revalidatePath("/admin/content-blocks");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function bulkMarkComplete(ids: string[], completed: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await prisma.contentBlock.updateMany({
      where: { id: { in: ids } },
      data: { isCompleted: completed },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        action: completed ? "BULK_MARK_COMPLETE" : "BULK_MARK_PENDING",
        entityType: "ContentBlock",
        entityId: ids.join(","),
        detail: { count: ids.length },
      },
    });

    revalidatePath("/admin/content-blocks");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function bulkDeleteContentBlocks(ids: string[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.contentBlock.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/admin/content-blocks");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}
