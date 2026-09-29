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
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Trash</h1>
          <p className="admin-page-description">
            Deleted items remain here until restored or permanently removed.
          </p>
        </div>
      </header>
      <TrashList eras={deletedEras} blocks={deletedBlocks} />
    </main>
  );
}
