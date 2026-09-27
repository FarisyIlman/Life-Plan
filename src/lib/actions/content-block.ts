"use server";

import { prisma } from "@/lib/prisma";
import { contentBlockSchema } from "@/lib/validations/content-block";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getPrismaErrorMessage } from "@/lib/prisma-error";
import {
  getContentBlockDataSchema,
  type ContentBlockType,
} from "@/lib/validations/content-block-data";
import { logActivity } from "@/lib/activity-log";
import {
  createCompletionNotification,
  createCompletionNotifications,
} from "@/lib/actions/notification";

function buildData(parsed: {
  description?: string;
  why?: string;
  nextAction?: string;
  evidenceUrl?: string;
  visibility?: "PUBLIC" | "SUMMARY" | "PRIVATE";
  techStack?: string;
  responsibilities?: string;
  month?: number;
  textColor?: string;
  imageUrl?: string;
  imageCaption?: string;
}): Record<string, unknown> {
  return {
    description: parsed.description || "",
    why: parsed.why || "",
    nextAction: parsed.nextAction || "",
    evidenceUrl: parsed.evidenceUrl || "",
    visibility: parsed.visibility || "PUBLIC",
    techStack: parsed.techStack || "",
    responsibilities: parsed.responsibilities || "",
    month: parsed.month || null,
    textColor: parsed.textColor || null,
    imageUrl: parsed.imageUrl || null,
    imageCaption: parsed.imageCaption || null,
  };
}

function parseContentBlockData(
  type: ContentBlockType,
  parsed: Parameters<typeof buildData>[0],
) {
  return getContentBlockDataSchema(type).safeParse(buildData(parsed));
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
    achievementGoalId,
    deadline,
    order,
    isPublished,
    isCompleted,
    description,
    why,
    nextAction,
    evidenceUrl,
    visibility,
    techStack,
    responsibilities,
    month,
    textColor,
    imageUrl,
    imageCaption,
  } = parsed.data;
  const dataResult = parseContentBlockData(type, {
    description,
    why,
    nextAction,
    evidenceUrl,
    visibility,
    techStack,
    responsibilities,
    month,
    textColor,
    imageUrl,
    imageCaption,
  });

  if (!dataResult.success) {
    return { error: dataResult.error.flatten().fieldErrors };
  }

  try {
    const block = await prisma.contentBlock.create({
      data: {
        eraId,
        type,
        title,
        subtitle: subtitle || null,
        achievementGoalId: achievementGoalId || null,
        data: dataResult.data,
        deadline: deadline ? new Date(deadline) : null,
        order,
        isPublished,
        isCompleted,
      },
    });

    await logActivity({
      adminId: session.user.id,
      action: "CREATE",
      entityType: "ContentBlock",
      entityId: block.id,
      detail: { title: block.title, type: block.type },
    });
    if (block.isCompleted) await createCompletionNotification(block.id);

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
    achievementGoalId,
    deadline,
    order,
    isPublished,
    isCompleted,
    description,
    why,
    nextAction,
    evidenceUrl,
    visibility,
    techStack,
    responsibilities,
    month,
    textColor,
    imageUrl,
    imageCaption,
  } = parsed.data;
  const dataResult = parseContentBlockData(type, {
    description,
    why,
    nextAction,
    evidenceUrl,
    visibility,
    techStack,
    responsibilities,
    month,
    textColor,
    imageUrl,
    imageCaption,
  });

  if (!dataResult.success) {
    return { error: dataResult.error.flatten().fieldErrors };
  }

  try {
    const block = await prisma.contentBlock.update({
      where: { id },
      data: {
        eraId,
        type,
        title,
        subtitle: subtitle || null,
        achievementGoalId: achievementGoalId || null,
        data: dataResult.data,
        deadline: deadline ? new Date(deadline) : null,
        order,
        isPublished,
        isCompleted,
      },
    });

    await logActivity({
      adminId: session.user.id,
      action: "UPDATE",
      entityType: "ContentBlock",
      entityId: id,
      detail: { title: block.title, type: block.type },
    });
    if (block.isCompleted) await createCompletionNotification(block.id);

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
    const block = await prisma.contentBlock.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await logActivity({
      adminId: session.user.id,
      action: "DELETE",
      entityType: "ContentBlock",
      entityId: id,
      detail: { title: block.title },
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
    const block = await prisma.contentBlock.update({
      where: { id },
      data: { deletedAt: null },
    });

    await logActivity({
      adminId: session.user.id,
      action: "RESTORE",
      entityType: "ContentBlock",
      entityId: id,
      detail: { title: block.title },
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
    const block = await prisma.contentBlock.findUnique({ where: { id } });
    await prisma.contentBlock.delete({ where: { id } });

    await logActivity({
      adminId: session.user.id,
      action: "PERMANENT_DELETE",
      entityType: "ContentBlock",
      entityId: id,
      detail: { title: block?.title },
    });
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

    if (updated.isCompleted) await createCompletionNotification(id);

    await logActivity({
      adminId: session.user.id,
      action: updated.isCompleted ? "MARK_COMPLETE" : "MARK_PENDING",
      entityType: "ContentBlock",
      entityId: id,
      detail: { title: block.title },
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

    await logActivity({
      adminId: session.user.id,
      action: "REORDER",
      entityType: "ContentBlock",
      entityId: "batch",
      detail: { count: orderedIds.length },
    });

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
    const result = await prisma.contentBlock.updateMany({
      where: { id: { in: ids } },
      data: { isPublished: publish },
    });
    await logActivity({
      adminId: session.user.id,
      action: publish ? "BULK_PUBLISH" : "BULK_UNPUBLISH",
      entityType: "ContentBlock",
      entityId: ids.join(","),
      detail: { count: result.count },
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

    if (completed) await createCompletionNotifications(ids);

    await logActivity({
      adminId: session.user.id,
      action: completed ? "BULK_MARK_COMPLETE" : "BULK_MARK_PENDING",
      entityType: "ContentBlock",
      entityId: ids.join(","),
      detail: { count: ids.length },
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
    const result = await prisma.contentBlock.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    await logActivity({
      adminId: session.user.id,
      action: "BULK_DELETE",
      entityType: "ContentBlock",
      entityId: ids.join(","),
      detail: { count: result.count },
    });
    revalidatePath("/admin/content-blocks");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}
