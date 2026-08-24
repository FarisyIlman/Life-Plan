"use client";

import Link from "next/link";
import type { ContentBlock } from "@prisma/client";

type BlockWithEra = ContentBlock & { era: { title: string } };

export default function CalendarGrid({
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
  const startWeekday = firstDay.getDay(); // 0 = Sunday
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
          const hasOverdue = dayBlocks.some(
            (b) =>
              new Date(b.deadline!).getTime() < now.getTime() && !b.isCompleted,
          );
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
                    href={`/admin/content-blocks/${block.id}/edit`}
                    className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${
                      hasOverdue
                        ? "bg-red-500/20 text-red-300"
                        : "bg-accent/20 text-accent"
                    }`}
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
  );
}
