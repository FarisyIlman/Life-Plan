import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import EraList from "./era-list";
import { Plus } from "lucide-react";

export default async function ErasPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const eras = await prisma.era.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Era management</h1>
          <p className="admin-page-description">
            Organize published chapters, themes, and their timeline order.
          </p>
        </div>
        <Link
          href="/admin/eras/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Plus size={16} aria-hidden="true" />
          New era
        </Link>
      </header>

      <p className="mb-4 text-xs text-text-muted">
        Drag a row to change its position in the public timeline.
      </p>

      <div className="admin-panel overflow-hidden">
        <EraList eras={eras} />
      </div>

      {eras.length === 0 && (
        <p className="mt-6 text-center text-sm text-text-muted">
          No eras yet. Create your first one.
        </p>
      )}
    </main>
  );
}
