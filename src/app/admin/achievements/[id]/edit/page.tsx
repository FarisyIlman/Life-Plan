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
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit achievement goal</h1>
          <p className="admin-page-description">
            Update the target, status, and public visibility settings.
          </p>
        </div>
      </header>
      <EditAchievementForm goal={goal} eras={eras} />
    </main>
  );
}
