"use server";

import { prisma } from "@/lib/prisma";
import { eraSchema } from "@/lib/validations/era";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";

async function logActivity(
  adminId: string,
  action: string,
  entityId: string,
  detail?: object,
) {
  await prisma.activityLog.create({
    data: {
      adminId,
      action,
      entityType: "Era",
      entityId,
      detail: detail || undefined,
    },
  });
}

export async function createEra(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = eraSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const era = await prisma.era.create({ data: parsed.data });
  await logActivity(session.user.id, "CREATE", era.id, { title: era.title });

  revalidatePath("/admin/eras");
  return { success: true };
}

export async function updateEra(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = eraSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.era.update({ where: { id }, data: parsed.data });
  await logActivity(session.user.id, "UPDATE", id, {
    title: parsed.data.title,
  });

  revalidatePath("/admin/eras");
  return { success: true };
}

export async function deleteEra(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const era = await prisma.era.findUnique({ where: { id } });
  await prisma.era.delete({ where: { id } });
  await logActivity(session.user.id, "DELETE", id, { title: era?.title });

  revalidatePath("/admin/eras");
  return { success: true };
}
