import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import CalendarGrid from "./calendar-grid";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; range?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) : now.getMonth(); // 0-indexed

  const blocks = await prisma.contentBlock.findMany({
    where: { deadline: { not: null } },
    include: { era: { select: { title: true } } },
    orderBy: { deadline: "asc" },
  });

  // Filtered list based on range
  const range = params.range;
  const nowTime = now.getTime();
  const day = 24 * 60 * 60 * 1000;

  let filteredBlocks = blocks;
  if (range === "overdue") {
    filteredBlocks = blocks.filter(
      (b) =>
        b.deadline &&
        new Date(b.deadline).getTime() < nowTime &&
        !b.isCompleted,
    );
  } else if (range === "1") {
    filteredBlocks = blocks.filter(
      (b) =>
        b.deadline &&
        new Date(b.deadline).getTime() >= nowTime &&
        new Date(b.deadline).getTime() <= nowTime + 1 * day,
    );
  } else if (range === "3") {
    filteredBlocks = blocks.filter(
      (b) =>
        b.deadline &&
        new Date(b.deadline).getTime() >= nowTime &&
        new Date(b.deadline).getTime() <= nowTime + 3 * day,
    );
  } else if (range === "7") {
    filteredBlocks = blocks.filter(
      (b) =>
        b.deadline &&
        new Date(b.deadline).getTime() >= nowTime &&
        new Date(b.deadline).getTime() <= nowTime + 7 * day,
    );
  }

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="font-heading text-3xl mb-6">Calendar & Deadlines</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/admin/calendar"
          className={`px-3 py-1.5 rounded text-sm ${
            !range
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-muted hover:text-text-primary"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/calendar?range=1"
          className={`px-3 py-1.5 rounded text-sm ${
            range === "1"
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-muted hover:text-text-primary"
          }`}
        >
          Next 1 day
        </Link>
        <Link
          href="/admin/calendar?range=3"
          className={`px-3 py-1.5 rounded text-sm ${
            range === "3"
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-muted hover:text-text-primary"
          }`}
        >
          Next 3 days
        </Link>
        <Link
          href="/admin/calendar?range=7"
          className={`px-3 py-1.5 rounded text-sm ${
            range === "7"
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-muted hover:text-text-primary"
          }`}
        >
          Next 7 days
        </Link>
        <Link
          href="/admin/calendar?range=overdue"
          className={`px-3 py-1.5 rounded text-sm ${
            range === "overdue"
              ? "bg-red-500 text-white"
              : "bg-bg-secondary text-red-400 hover:text-red-300"
          }`}
        >
          Overdue
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar grid */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <Link
              href={`/admin/calendar?month=${prevMonth}&year=${prevYear}`}
              className="text-text-muted hover:text-accent"
            >
              ← Prev
            </Link>
            <h2 className="font-heading text-xl">
              {new Date(year, month).toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <Link
              href={`/admin/calendar?month=${nextMonth}&year=${nextYear}`}
              className="text-text-muted hover:text-accent"
            >
              Next →
            </Link>
          </div>

          <CalendarGrid year={year} month={month} blocks={blocks} now={now} />
        </div>

        {/* Filtered list */}
        <div>
          <h2 className="font-heading text-xl mb-4">
            {range === "overdue"
              ? "Overdue"
              : range
                ? `Due in ${range} day${range === "1" ? "" : "s"}`
                : "All Deadlines"}
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredBlocks.length === 0 ? (
              <p className="text-text-muted text-sm">Nothing here.</p>
            ) : (
              filteredBlocks.map((block) => {
                const isOverdue =
                  block.deadline &&
                  new Date(block.deadline).getTime() < nowTime &&
                  !block.isCompleted;
                return (
                  <Link
                    key={block.id}
                    href={`/admin/content-blocks/${block.id}/edit`}
                    className={`block bg-bg-secondary border rounded-lg p-3 hover:border-accent transition ${
                      isOverdue ? "border-red-500/50" : "border-border"
                    }`}
                  >
                    <p className="text-text-primary text-sm">{block.title}</p>
                    <p className="text-text-muted text-xs">{block.era.title}</p>
                    <p
                      className={`text-xs font-heading mt-1 ${
                        isOverdue ? "text-red-400" : "text-galaxy-gold"
                      }`}
                    >
                      {block.deadline &&
                        new Date(block.deadline).toLocaleDateString("en-GB")}
                      {isOverdue && " — Overdue"}
                    </p>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
