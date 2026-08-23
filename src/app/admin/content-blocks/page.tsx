import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import DeleteContentBlockButton from "./delete-button";
import ToggleCompleteButton from "./toggle-complete-button";

export default async function ContentBlocksPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { filter } = await searchParams;

  const where =
    filter === "completed"
      ? { isCompleted: true }
      : filter === "pending"
        ? { isCompleted: false }
        : {};

  const blocks = await prisma.contentBlock.findMany({
    where,
    orderBy: [{ eraId: "asc" }, { order: "asc" }],
    include: { era: true },
  });

  // Progress per era (based on ALL blocks, not filtered)
  const allBlocks = await prisma.contentBlock.findMany({
    include: { era: { select: { title: true, id: true } } },
  });

  const progressByEra = new Map<
    string,
    { title: string; total: number; completed: number }
  >();

  for (const block of allBlocks) {
    const key = block.era.id;
    if (!progressByEra.has(key)) {
      progressByEra.set(key, {
        title: block.era.title,
        total: 0,
        completed: 0,
      });
    }
    const entry = progressByEra.get(key)!;
    entry.total++;
    if (block.isCompleted) entry.completed++;
  }

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

      {/* Progress per era */}
      {progressByEra.size > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array.from(progressByEra.values()).map((entry) => {
            const pct =
              entry.total > 0
                ? Math.round((entry.completed / entry.total) * 100)
                : 0;
            return (
              <div
                key={entry.title}
                className="bg-bg-secondary border border-border rounded-lg p-4"
              >
                <p className="text-text-primary text-sm mb-2">{entry.title}</p>
                <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-text-muted text-xs">
                  {entry.completed}/{entry.total} completed ({pct}%)
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <Link
          href="/admin/content-blocks"
          className={`px-3 py-1.5 rounded text-sm ${
            !filter
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-muted hover:text-text-primary"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/content-blocks?filter=pending"
          className={`px-3 py-1.5 rounded text-sm ${
            filter === "pending"
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-muted hover:text-text-primary"
          }`}
        >
          Pending
        </Link>
        <Link
          href="/admin/content-blocks?filter=completed"
          className={`px-3 py-1.5 rounded text-sm ${
            filter === "completed"
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-muted hover:text-text-primary"
          }`}
        >
          Completed
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
            <th className="py-2">Completed</th>
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
                  ? new Date(block.deadline).toLocaleDateString("en-GB")
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
              <td className="py-3">
                <ToggleCompleteButton
                  id={block.id}
                  isCompleted={block.isCompleted}
                />
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
          {filter
            ? `No ${filter} content blocks found.`
            : "No content blocks yet. Create your first one."}
        </p>
      )}
    </main>
  );
}
