import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import NewAchievementForm from "./new-form";

export default async function NewAchievementPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const eras = await prisma.era.findMany({
    where: { deletedAt: null, theme: "RACING" },
    orderBy: { order: "asc" },
    select: { id: true, title: true },
  });

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">New Achievement Goal</h1>
      <NewAchievementForm eras={eras} />
    </main>
  );
}
