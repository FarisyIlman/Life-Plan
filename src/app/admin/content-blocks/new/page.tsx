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
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">New Content Block</h1>
      <NewContentBlockForm eras={eras} goals={goals} />
    </main>
  );
}
