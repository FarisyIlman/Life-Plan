import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function logActivity(input: {
  adminId: string;
  action: string;
  entityType: string;
  entityId: string;
  detail?: Prisma.InputJsonValue;
}) {
  await prisma.activityLog.create({
    data: {
      adminId: input.adminId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      detail: input.detail,
    },
  });
}
