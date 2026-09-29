import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDeadlineNotificationType } from "@/lib/notification-rules";

export async function createCompletionNotification(contentBlockId: string) {
  const block = await prisma.contentBlock.findUnique({
    where: { id: contentBlockId },
    select: { id: true, title: true, isCompleted: true },
  });

  if (!block?.isCompleted) return false;

  try {
    await prisma.notification.create({
      data: {
        contentBlockId: block.id,
        type: "COMPLETED",
        message: `"${block.title}" was marked complete.`,
      },
    });
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return false;
    }
    throw error;
  }
}

export async function createCompletionNotifications(contentBlockIds: string[]) {
  let created = 0;
  for (const contentBlockId of contentBlockIds) {
    if (await createCompletionNotification(contentBlockId)) created++;
  }
  return { created };
}

export async function generateDeadlineNotifications() {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const blocks = await prisma.contentBlock.findMany({
    where: {
      deadline: { not: null, gte: now, lte: in7Days },
      isCompleted: false,
      deletedAt: null,
    },
  });

  let created = 0;

  for (const block of blocks) {
    if (!block.deadline) continue;
    const deadline = new Date(block.deadline);

    const type = getDeadlineNotificationType(deadline, now);
    if (!type) continue;

    try {
      await prisma.notification.create({
        data: {
          contentBlockId: block.id,
          type,
          message: `"${block.title}" is due on ${deadline.toLocaleDateString("en-GB")}`,
        },
      });
      created++;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue;
      }
      throw error;
    }
  }

  return { created };
}
