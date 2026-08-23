import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import DeleteEraButton from "./delete-button";

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

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border text-text-muted text-left text-sm">
            <th className="py-2">Order</th>
            <th className="py-2">Title</th>
            <th className="py-2">Slug</th>
            <th className="py-2">Theme</th>
            <th className="py-2">Years</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {eras.map((era) => (
            <tr key={era.id} className="border-b border-border">
              <td className="py-3">{era.order}</td>
              <td className="py-3">{era.title}</td>
              <td className="py-3 text-text-muted">{era.slug}</td>
              <td className="py-3">{era.theme}</td>
              <td className="py-3">
                {era.startYear === era.endYear
                  ? era.startYear
                  : `${era.startYear}–${era.endYear}`}
              </td>
              <td className="py-3">
                <span
                  className={
                    era.isPublished ? "text-green-400" : "text-text-muted"
                  }
                >
                  {era.isPublished ? "Published" : "Draft"}
                </span>
              </td>
              <td className="py-3 space-x-3">
                <Link
                  href={`/admin/eras/${era.id}/edit`}
                  className="text-accent hover:underline"
                >
                  Edit
                </Link>
                <DeleteEraButton id={era.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {eras.length === 0 && (
        <p className="text-text-muted mt-8">
          No eras yet. Create your first one.
        </p>
      )}
    </main>
  );
}
