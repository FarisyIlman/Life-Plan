import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import EditContentBlockForm from "./edit-form";

export default async function EditContentBlockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const [block, eras, goals] = await Promise.all([
    prisma.contentBlock.findUnique({ where: { id, deletedAt: null } }),
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

  if (!block) notFound();

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit content block</h1>
          <p className="admin-page-description">
            Update the milestone and check the theme preview before saving.
          </p>
        </div>
      </header>
      <EditContentBlockForm block={block} eras={eras} goals={goals} />
    </main>
  );
}
