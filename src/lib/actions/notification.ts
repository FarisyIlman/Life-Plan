"use server";

import { auth } from "@/../auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity-log";

export async function markNotificationRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  await logActivity({
    adminId: session.user.id,
    action: "MARK_READ",
    entityType: "Notification",
    entityId: id,
  });

  revalidatePath("/admin/notifications");
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const result = await prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });

  await logActivity({
    adminId: session.user.id,
    action: "MARK_ALL_READ",
    entityType: "Notification",
    entityId: "all",
    detail: { count: result.count },
  });

  revalidatePath("/admin/notifications");
}
