"use server";

import { prisma } from "@/lib/prisma";
import { achievementGoalSchema } from "@/lib/validations/achievement-goal";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getPrismaErrorMessage } from "@/lib/prisma-error";

export async function createAchievementGoal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = achievementGoalSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.achievementGoal.create({
      data: {
        ...parsed.data,
        imageUrl: parsed.data.imageUrl || null,
        note: parsed.data.note || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        action: "CREATE",
        entityType: "AchievementGoal",
        entityId: "new",
        detail: { year: parsed.data.year, category: parsed.data.category },
      },
    });

    revalidatePath("/admin/achievements");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function updateAchievementGoal(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = achievementGoalSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.achievementGoal.update({
      where: { id },
      data: {
        ...parsed.data,
        imageUrl: parsed.data.imageUrl || null,
        note: parsed.data.note || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        action: "UPDATE",
        entityType: "AchievementGoal",
        entityId: id,
        detail: { year: parsed.data.year, category: parsed.data.category },
      },
    });

    revalidatePath("/admin/achievements");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function deleteAchievementGoal(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await prisma.achievementGoal.delete({ where: { id } });
    revalidatePath("/admin/achievements");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}
