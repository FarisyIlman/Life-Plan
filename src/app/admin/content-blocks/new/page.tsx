import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import NewContentBlockForm from "./new-form";

export default async function NewContentBlockPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [eras, goals] = await Promise.all([
    prisma.era.findMany({
      where: { deletedAt: null },
      orderBy: { order: "asc" },
      select: { id: true, title: true, theme: true },
    }),
    prisma.achievementGoal.findMany({
      orderBy: [{ year: "asc" }, { category: "asc" }],
      select: { id: true, eraId: true, year: true, category: true },
    }),
  ]);

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Create content block</h1>
          <p className="admin-page-description">
            Add a milestone and preview how it will appear in its era.
          </p>
        </div>
      </header>
      <NewContentBlockForm eras={eras} goals={goals} />
    </main>
  );
}
