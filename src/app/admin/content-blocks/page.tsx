import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteContentBlockButton from "./delete-button";

export default async function ContentBlocksPage() {
  const blocks = await prisma.contentBlock.findMany({
    orderBy: [{ eraId: "asc" }, { order: "asc" }],
    include: { era: true },
  });

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl">Content Blocks</h1>
        <Link
          href="/admin/content-blocks/new"
          className="bg-accent text-white px-4 py-2 rounded font-heading hover:opacity-90"
        >
          + New Content Block
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border text-text-muted text-left text-sm">
            <th className="py-2">Era</th>
            <th className="py-2">Type</th>
            <th className="py-2">Title</th>
            <th className="py-2">Deadline</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block) => (
            <tr key={block.id} className="border-b border-border">
              <td className="py-3 text-text-muted">{block.era.title}</td>
              <td className="py-3">{block.type}</td>
              <td className="py-3">{block.title}</td>
              <td className="py-3 text-text-muted">
                {block.deadline
                  ? new Date(block.deadline).toLocaleDateString()
                  : "-"}
              </td>
              <td className="py-3">
                <span
                  className={
                    block.isPublished ? "text-green-400" : "text-text-muted"
                  }
                >
                  {block.isPublished ? "Published" : "Draft"}
                </span>
              </td>
              <td className="py-3 space-x-3">
                <Link
                  href={`/admin/content-blocks/${block.id}/edit`}
                  className="text-accent hover:underline"
                >
                  Edit
                </Link>
                <DeleteContentBlockButton id={block.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {blocks.length === 0 && (
        <p className="text-text-muted mt-8">
          No content blocks yet. Create your first one.
        </p>
      )}
    </main>
  );
}
