import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PublicCalendarGrid from "./public-calendar-grid";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calendar — Farisy's Life Journey",
  description: "Upcoming milestones and deadlines across the timeline.",
};

export const dynamic = "force-dynamic";

export default async function PublicCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();

  const parsedYear = params.year ? parseInt(params.year, 10) : NaN;
  const year =
    !isNaN(parsedYear) && parsedYear >= 1970 && parsedYear <= 2200
      ? parsedYear
      : now.getFullYear();

  const parsedMonth = params.month ? parseInt(params.month, 10) : NaN;
  const month =
    !isNaN(parsedMonth) && parsedMonth >= 0 && parsedMonth <= 11
      ? parsedMonth
      : now.getMonth();

  const blocks = await prisma.contentBlock.findMany({
    where: {
      deadline: { not: null },
      isPublished: true,
      deletedAt: null,
      era: { isPublished: true, deletedAt: null },
    },
    include: { era: { select: { title: true, slug: true } } },
    orderBy: { deadline: "asc" },
  });

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const upcoming = blocks.filter(
    (b) => b.deadline && new Date(b.deadline).getTime() >= now.getTime(),
  );

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary px-6 pt-24 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-heading text-3xl mb-2">Journey Calendar</h1>
        <p className="text-text-muted text-sm mb-8">
          A look at upcoming milestones across the timeline.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar grid */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <Link
                href={`/calendar?month=${prevMonth}&year=${prevYear}`}
                className="text-text-muted hover:text-accent text-sm"
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
                href={`/calendar?month=${nextMonth}&year=${nextYear}`}
                className="text-text-muted hover:text-accent text-sm"
              >
                Next →
              </Link>
            </div>

            <PublicCalendarGrid
              year={year}
              month={month}
              blocks={blocks}
              now={now}
            />
          </div>

          {/* Upcoming list */}
          <div>
            <h2 className="font-heading text-xl mb-4">Upcoming</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {upcoming.length === 0 ? (
                <p className="text-text-muted text-sm">
                  No upcoming milestones right now.
                </p>
              ) : (
                upcoming.map((block) => (
                  <Link
                    key={block.id}
                    href={`/timeline/${block.era.slug}`}
                    className="block bg-bg-secondary border border-border rounded-lg p-3 hover:border-accent transition"
                  >
                    <p className="text-text-primary text-sm">{block.title}</p>
                    <p className="text-text-muted text-xs">{block.era.title}</p>
                    <p className="text-galaxy-gold text-xs font-heading mt-1">
                      {block.deadline &&
                        new Date(block.deadline).toLocaleDateString("en-GB")}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
