import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import EditAchievementForm from "./edit-form";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const [goal, eras] = await Promise.all([
    prisma.achievementGoal.findUnique({ where: { id } }),
    prisma.era.findMany({
      where: { deletedAt: null },
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!goal) notFound();

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">Edit Achievement Goal</h1>
      <EditAchievementForm goal={goal} eras={eras} />
    </main>
  );
}
