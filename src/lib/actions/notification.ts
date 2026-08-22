"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { revalidatePath } from "next/cache";

export async function generateDeadlineNotifications() {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

  const blocks = await prisma.contentBlock.findMany({
    where: {
      deadline: { not: null, gte: now, lte: in7Days },
      isCompleted: false,
    },
  });

  let created = 0;

  for (const block of blocks) {
    if (!block.deadline) continue;
    const deadline = new Date(block.deadline);

    let type: "DEADLINE_7D" | "DEADLINE_3D" | "DEADLINE_1D" | null = null;

    if (deadline <= in1Day) {
      type = "DEADLINE_1D";
    } else if (deadline <= in3Days) {
      type = "DEADLINE_3D";
    } else if (deadline <= in7Days) {
      type = "DEADLINE_7D";
    }

    if (!type) continue;

    const existing = await prisma.notification.findFirst({
      where: { contentBlockId: block.id, type },
    });

    if (existing) continue;

    await prisma.notification.create({
      data: {
        contentBlockId: block.id,
        type,
        message: `"${block.title}" is due on ${deadline.toLocaleDateString()}`,
      },
    });

    created++;
  }

  return { created };
}

export async function markNotificationRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  revalidatePath("/admin/notifications");
}
