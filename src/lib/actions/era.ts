"use server";

import { prisma } from "@/lib/prisma";
import { eraSchema } from "@/lib/validations/era";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getPrismaErrorMessage } from "@/lib/prisma-error";

export async function createEra(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = eraSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const era = await prisma.era.create({ data: parsed.data });

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        action: "CREATE",
        entityType: "Era",
        entityId: era.id,
        detail: { title: era.title },
      },
    });

    revalidatePath("/admin/eras");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function updateEra(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = eraSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.era.update({ where: { id }, data: parsed.data });

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        action: "UPDATE",
        entityType: "Era",
        entityId: id,
        detail: { title: parsed.data.title },
      },
    });

    revalidatePath("/admin/eras");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function deleteEra(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const era = await prisma.era.findUnique({ where: { id } });
    await prisma.era.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        action: "DELETE",
        entityType: "Era",
        entityId: id,
        detail: { title: era?.title },
      },
    });

    revalidatePath("/admin/eras");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}
