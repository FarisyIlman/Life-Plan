import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import TrashList from "./trash-list";

export default async function TrashPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [deletedEras, deletedBlocks] = await Promise.all([
    prisma.era.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
    }),
    prisma.contentBlock.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
      include: { era: { select: { title: true } } },
    }),
  ]);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-2">Trash</h1>
      <p className="text-text-muted text-sm mb-8">
        Deleted items are kept here until permanently removed.
      </p>
      <TrashList eras={deletedEras} blocks={deletedBlocks} />
    </main>
  );
}
