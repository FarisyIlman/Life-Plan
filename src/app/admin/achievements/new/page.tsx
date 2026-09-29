import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import NewAchievementForm from "./new-form";

export default async function NewAchievementPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const eras = await prisma.era.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
    select: { id: true, title: true },
  });

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Create achievement goal</h1>
          <p className="admin-page-description">
            Set a target and choose exactly what can appear publicly.
          </p>
        </div>
      </header>
      <NewAchievementForm eras={eras} />
    </main>
  );
}
