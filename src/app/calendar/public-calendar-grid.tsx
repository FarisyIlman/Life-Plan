"use client";

import Link from "next/link";
import type { ContentBlock } from "@prisma/client";

type BlockWithEra = ContentBlock & { era: { title: string; slug: string } };

export default function PublicCalendarGrid({
  year,
  month,
  blocks,
  now,
}: {
  year: number;
  month: number;
  blocks: BlockWithEra[];
  now: Date;
}) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blocksByDay = new Map<number, BlockWithEra[]>();
  for (const block of blocks) {
    if (!block.deadline) continue;
    const d = new Date(block.deadline);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!blocksByDay.has(day)) blocksByDay.set(day, []);
      blocksByDay.get(day)!.push(block);
    }
  }

  const todayIsThisMonth =
    now.getFullYear() === year && now.getMonth() === month;
  const todayDate = now.getDate();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="sm:hidden space-y-2">
        {Array.from(blocksByDay.entries()).length === 0 ? (
          <p className="text-text-muted text-sm py-6 text-center">
            No milestones this month.
          </p>
        ) : (
          Array.from(blocksByDay.entries())
            .sort(([a], [b]) => a - b)
            .map(([day, dayBlocks]) => (
              <div
                key={day}
                className="bg-bg-secondary border border-border rounded-lg p-3"
              >
                <p className="text-text-muted text-xs font-heading mb-2">
                  {new Date(year, month, day).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <div className="space-y-2">
                  {dayBlocks.map((block) => (
                    <Link
                      key={block.id}
                      href={`/timeline/${block.era.slug}`}
                      className="min-h-11 flex items-center rounded border border-border px-3 text-sm text-accent hover:border-accent"
                    >
                      <span className="break-words">{block.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

      <div className="hidden sm:block">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-xs text-text-muted font-heading py-2"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }

            const dayBlocks = blocksByDay.get(day) || [];
            const isToday = todayIsThisMonth && day === todayDate;

            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-1.5 flex flex-col ${
                  isToday
                    ? "border-accent bg-accent/10"
                    : "border-border bg-bg-secondary"
                }`}
              >
                <span
                  className={`text-xs font-heading ${
                    isToday ? "text-accent" : "text-text-muted"
                  }`}
                >
                  {day}
                </span>
                <div className="flex-1 flex flex-col gap-0.5 mt-1 overflow-hidden">
                  {dayBlocks.slice(0, 2).map((block) => (
                    <Link
                      key={block.id}
                      href={`/timeline/${block.era.slug}`}
                      className="text-[10px] leading-tight px-1 py-0.5 rounded truncate bg-accent/20 text-accent"
                      title={block.title}
                    >
                      {block.title}
                    </Link>
                  ))}
                  {dayBlocks.length > 2 && (
                    <span className="text-[10px] text-text-muted">
                      +{dayBlocks.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
