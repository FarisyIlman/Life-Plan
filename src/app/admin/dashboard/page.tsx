import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

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
    prisma.era.count({ where: { deletedAt: null } }),
    prisma.contentBlock.count({
      where: { isPublished: true, deletedAt: null },
    }),
    prisma.contentBlock.count({
      where: { isPublished: false, deletedAt: null },
    }),
    prisma.contentBlock.findMany({
      where: {
        deadline: { gte: new Date() },
        isCompleted: false,
        deletedAt: null,
      },
      orderBy: { deadline: "asc" },
      take: 5,
      include: { era: { select: { title: true } } },
    }),
    prisma.contentBlock.findMany({
      where: { deletedAt: null },
      select: { isCompleted: true },
    }),
  ]);

  const totalBlocks = allBlocks.length;
  const completedBlocks = allBlocks.filter((b) => b.isCompleted).length;
  const overallProgress =
    totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-description">
            A clear view of published work, drafts, and what needs attention
            next.
          </p>
        </div>
        <Link
          href="/admin/content-blocks/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Plus size={16} aria-hidden="true" />
          New content block
        </Link>
      </header>

      <section
        aria-label="Content overview"
        className="admin-panel mb-8 grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0"
      >
        <div className="p-4 sm:p-5">
          <p className="text-xs font-medium text-text-muted">Total eras</p>
          <p className="mt-2 font-heading text-2xl font-semibold">
            {totalEras}
          </p>
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-xs font-medium text-text-muted">
            Published content
          </p>
          <p className="mt-2 font-heading text-2xl font-semibold text-status-success">
            {publishedBlocks}
          </p>
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-xs font-medium text-text-muted">Drafts</p>
          <p className="mt-2 font-heading text-2xl font-semibold">
            {draftBlocks}
          </p>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-medium text-text-muted">Completed</p>
            <p className="font-heading text-lg font-semibold text-accent">
              {overallProgress}%
            </p>
          </div>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-primary"
            role="progressbar"
            aria-label="Completed content blocks"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={overallProgress}
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-text-muted">
            {completedBlocks} of {totalBlocks} blocks
          </p>
        </div>
      </section>

      <section className="max-w-4xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-semibold">
              Upcoming deadlines
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              The next five incomplete content milestones.
            </p>
          </div>
          <Link
            href="/admin/calendar"
            className="inline-flex min-h-10 items-center gap-1 rounded-md px-3 text-sm text-text-muted transition hover:bg-bg-secondary hover:text-text-primary"
          >
            Calendar <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="admin-panel overflow-hidden">
          {upcomingDeadlines.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-text-muted">
              No upcoming deadlines. You&apos;re all caught up.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {upcomingDeadlines.map((block) => (
                <li key={block.id}>
                  <Link
                    href={`/admin/content-blocks/${block.id}/edit`}
                    className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 transition hover:bg-admin-raised sm:px-5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-text-primary">
                        {block.title}
                      </span>
                      <span className="mt-1 block text-xs text-text-muted">
                        {block.era.title}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-medium text-text-primary">
                        {block.deadline &&
                          new Date(block.deadline).toLocaleDateString("en-GB")}
                      </span>
                      <span className="mt-1 block text-[11px] text-text-muted">
                        Due date
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
