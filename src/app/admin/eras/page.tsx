import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import EraList from "./era-list";

export default async function ErasPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const eras = await prisma.era.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl">Era Management</h1>
        <Link
          href="/admin/eras/new"
          className="bg-accent text-white px-4 py-2 rounded font-heading hover:opacity-90"
        >
          + New Era
        </Link>
      </div>

      <p className="text-text-muted text-sm mb-4">
        Drag rows by the ⋮⋮ handle to reorder eras.
      </p>

      <EraList eras={eras} />

      {eras.length === 0 && (
        <p className="text-text-muted mt-8">
          No eras yet. Create your first one.
        </p>
      )}
    </main>
  );
}
