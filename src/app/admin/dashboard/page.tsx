import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [
    totalEras,
    publishedBlocks,
    draftBlocks,
    upcomingDeadlines,
    allBlocks,
  ] = await Promise.all([
    prisma.era.count(),
    prisma.contentBlock.count({ where: { isPublished: true } }),
    prisma.contentBlock.count({ where: { isPublished: false } }),
    prisma.contentBlock.findMany({
      where: {
        deadline: { gte: new Date() },
        isCompleted: false,
      },
      orderBy: { deadline: "asc" },
      take: 5,
      include: { era: { select: { title: true } } },
    }),
    prisma.contentBlock.findMany({
      select: { isCompleted: true },
    }),
  ]);

  const totalBlocks = allBlocks.length;
  const completedBlocks = allBlocks.filter((b) => b.isCompleted).length;
  const overallProgress =
    totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-8">Admin Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-bg-secondary border border-border rounded-lg p-5">
          <p className="text-text-muted text-xs font-heading tracking-wide mb-1">
            TOTAL ERAS
          </p>
          <p className="text-3xl font-heading text-text-primary">{totalEras}</p>
        </div>

        <div className="bg-bg-secondary border border-border rounded-lg p-5">
          <p className="text-text-muted text-xs font-heading tracking-wide mb-1">
            PUBLISHED CONTENT
          </p>
          <p className="text-3xl font-heading text-green-400">
            {publishedBlocks}
          </p>
        </div>

        <div className="bg-bg-secondary border border-border rounded-lg p-5">
          <p className="text-text-muted text-xs font-heading tracking-wide mb-1">
            DRAFTS
          </p>
          <p className="text-3xl font-heading text-text-muted">{draftBlocks}</p>
        </div>

        <div className="bg-bg-secondary border border-border rounded-lg p-5">
          <p className="text-text-muted text-xs font-heading tracking-wide mb-1">
            OVERALL PROGRESS
          </p>
          <p className="text-3xl font-heading text-accent">
            {overallProgress}%
          </p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-10 max-w-2xl">
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>
            Completed {completedBlocks} of {totalBlocks} content blocks
          </span>
          <span>{overallProgress}%</span>
        </div>
        <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div className="max-w-2xl">
        <h2 className="font-heading text-xl mb-4">Upcoming Deadlines</h2>
        {upcomingDeadlines.length === 0 ? (
          <p className="text-text-muted text-sm">
            No upcoming deadlines. You&apos;re all caught up.
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingDeadlines.map((block) => (
              <Link
                key={block.id}
                href={`/admin/content-blocks/${block.id}/edit`}
                className="flex justify-between items-center bg-bg-secondary border border-border rounded-lg p-4 hover:border-accent transition"
              >
                <div>
                  <p className="text-text-primary text-sm">{block.title}</p>
                  <p className="text-text-muted text-xs">{block.era.title}</p>
                </div>
                <p className="text-galaxy-gold text-sm font-heading">
                  {block.deadline &&
                    new Date(block.deadline).toLocaleDateString("en-GB")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="flex gap-4 mt-10">
        <Link
          href="/admin/eras"
          className="text-accent hover:underline text-sm"
        >
          Manage Eras →
        </Link>
        <Link
          href="/admin/content-blocks"
          className="text-accent hover:underline text-sm"
        >
          Manage Content →
        </Link>
        <Link
          href="/admin/notifications"
          className="text-accent hover:underline text-sm"
        >
          View Notifications →
        </Link>
      </div>
    </main>
  );
}
