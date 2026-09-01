"use server";

import { prisma } from "@/lib/prisma";
import { adminUserSchema } from "@/lib/validations/admin-user";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getPrismaErrorMessage } from "@/lib/prisma-error";
import bcrypt from "bcryptjs";

export async function createAdminUser(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = adminUserSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    const newAdmin = await prisma.admin.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        username: parsed.data.username,
        passwordHash,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        action: "CREATE",
        entityType: "Admin",
        entityId: newAdmin.id,
        detail: { name: newAdmin.name, email: newAdmin.email },
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function deleteAdminUser(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Prevent self-deletion — avoid locking yourself out
  if (session.user.id === id) {
    return { error: { _form: ["You cannot delete your own account."] } };
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { id } });
    await prisma.admin.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        action: "DELETE",
        entityType: "Admin",
        entityId: id,
        detail: { name: admin?.name },
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}
