"use server";

import { prisma } from "@/lib/prisma";
import { masterDegreeNodeSchema } from "@/lib/validations/master-degree-node";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getPrismaErrorMessage } from "@/lib/prisma-error";
import { logActivity } from "@/lib/activity-log";

function buildDetails(parsed: {
  cost?: string;
  requirements?: string;
  deadline?: string;
  pros?: string;
  cons?: string;
  rationale?: string;
  confidence?: number;
}) {
  return {
    cost: parsed.cost || "",
    requirements: parsed.requirements || "",
    deadline: parsed.deadline || "",
    pros: parsed.pros || "",
    cons: parsed.cons || "",
    rationale: parsed.rationale || "",
    confidence: parsed.confidence ?? null,
  };
}

export async function createMasterDegreeNode(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = masterDegreeNodeSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const node = await prisma.masterDegreeNode.create({
      data: {
        label: parsed.data.label,
        nodeType: parsed.data.nodeType,
        parentId: parsed.data.parentId,
        positionX: parsed.data.positionX,
        positionY: parsed.data.positionY,
        details: buildDetails(parsed.data),
      },
    });
    await logActivity({
      adminId: session.user.id,
      action: "CREATE",
      entityType: "MasterDegreeNode",
      entityId: node.id,
      detail: { label: node.label, nodeType: node.nodeType },
    });
    revalidatePath("/admin/master-degree");
    revalidatePath("/timeline/[slug]", "page");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function updateNodePosition(id: string, x: number, y: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const node = await prisma.masterDegreeNode.update({
      where: { id },
      data: { positionX: x, positionY: y },
    });
    await logActivity({
      adminId: session.user.id,
      action: "UPDATE_POSITION",
      entityType: "MasterDegreeNode",
      entityId: id,
      detail: { label: node.label, positionX: x, positionY: y },
    });
    revalidatePath("/admin/master-degree");
    revalidatePath("/timeline/[slug]", "page");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function updateMasterDegreeNode(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = masterDegreeNodeSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const node = await prisma.masterDegreeNode.update({
      where: { id },
      data: {
        label: parsed.data.label,
        nodeType: parsed.data.nodeType,
        parentId: parsed.data.parentId,
        positionX: parsed.data.positionX,
        positionY: parsed.data.positionY,
        details: buildDetails(parsed.data),
      },
    });
    await logActivity({
      adminId: session.user.id,
      action: "UPDATE",
      entityType: "MasterDegreeNode",
      entityId: id,
      detail: { label: node.label, nodeType: node.nodeType },
    });
    revalidatePath("/admin/master-degree");
    revalidatePath("/timeline/[slug]", "page");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}

export async function deleteMasterDegreeNode(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const node = await prisma.masterDegreeNode.findUnique({ where: { id } });
    await prisma.masterDegreeNode.delete({ where: { id } });
    await logActivity({
      adminId: session.user.id,
      action: "DELETE",
      entityType: "MasterDegreeNode",
      entityId: id,
      detail: { label: node?.label, nodeType: node?.nodeType },
    });
    revalidatePath("/admin/master-degree");
    revalidatePath("/timeline/[slug]", "page");
    return { success: true };
  } catch (error) {
    return { error: { _form: [getPrismaErrorMessage(error)] } };
  }
}
