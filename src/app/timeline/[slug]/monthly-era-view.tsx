"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Era, ContentBlock, AchievementGoal } from "@prisma/client";
import CardMonthlyTheme from "@/components/CardMonthlyTheme";
import AchievementTracker from "@/components/AchievementTracker";
import EraReflection from "@/components/EraReflection";
import {
  getContentProgress,
  getPublicContentBlocks,
} from "@/lib/content-progress";

type EraWithBlocks = Era & {
  contentBlocks: ContentBlock[];
  achievementGoals: AchievementGoal[];
};
type EraNav = { slug: string; title: string } | null;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthlyEraView({
  era,
  prevEra,
  nextEra,
}: {
  era: EraWithBlocks;
  prevEra: EraNav;
  nextEra: EraNav;
}) {
  const publicBlocks = getPublicContentBlocks(era.contentBlocks);
  const { total, percentage: progress } = getContentProgress(era.contentBlocks);

  // Group content blocks by month
  const blocksByMonth: Record<number, ContentBlock[]> = {};
  for (const block of publicBlocks) {
    const data = block.data as { month?: number };
    const month = data.month ?? 0;
    const bucket = month >= 1 && month <= 12 ? month : 0;
    if (!blocksByMonth[bucket]) blocksByMonth[bucket] = [];
    blocksByMonth[bucket].push(block);
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const isEraPast = era.endYear < currentYear;
  const isEraFuture = era.startYear > currentYear;
  const isCurrentEra = !isEraPast && !isEraFuture;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Breadcrumb */}
      <div className="px-6 pt-20">
        <Link
          href="/timeline"
          className="text-text-muted text-sm hover:text-accent"
        >
          ← Back to Timeline
        </Link>
      </div>

      {/* Hero */}
      <section className="text-center px-6 py-16">
        <p className="text-monthly-blue font-heading tracking-widest text-sm mb-2">
          {era.startYear === era.endYear
            ? era.startYear
            : `${era.startYear}–${era.endYear}`}
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl text-text-primary mb-4 break-words"
        >
          {era.title}
        </motion.h1>
        {era.description && (
          <p className="text-text-muted max-w-xl mx-auto">{era.description}</p>
        )}

        {total > 0 && (
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div
              className="h-2 bg-bg-secondary rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Year progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full bg-monthly-blue transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <EraReflection
        thesis={era.thesis}
        tradeOff={era.tradeOff}
        successIndicators={era.successIndicators}
        retrospective={era.retrospective}
        accent="#3B82F6"
      />

      {/* Monthly grid */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        {total === 0 ? (
          <p className="text-text-muted text-center">
            No content yet for this era.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MONTH_NAMES.map((monthName, i) => {
              const monthNum = i + 1;
              const blocks = blocksByMonth[monthNum];
              if (!blocks || blocks.length === 0) return null;
              const completed = blocks.filter(
                (block) => block.isCompleted,
              ).length;
              const isCurrent = isCurrentEra && monthNum === currentMonth;
              const isPast =
                isEraPast || (isCurrentEra && monthNum < currentMonth);

              return (
                <div
                  key={monthNum}
                  className={`relative ${isCurrent ? "md:-translate-y-2" : ""}`}
                >
                  <div
                    className={`mb-3 border-b pb-2 ${isCurrent ? "border-monthly-blue" : "border-border"}`}
                  >
                    <div className="flex items-end justify-between gap-3">
                      <h3 className="font-heading text-xl text-text-primary">
                        {monthName}
                      </h3>
                      <span className="text-xs text-text-muted">
                        {completed}/{blocks.length} done
                      </span>
                    </div>
                    <p
                      className={`text-[11px] uppercase tracking-wider mt-1 ${isCurrent ? "text-monthly-blue" : isPast ? "text-text-muted" : "text-text-muted"}`}
                    >
                      {isCurrent
                        ? "Current month"
                        : isPast
                          ? "Past cadence"
                          : "Upcoming"}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {blocks.map((block) => (
                      <CardMonthlyTheme key={block.id} block={block} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Unscheduled blocks — no month assigned */}
            {blocksByMonth[0] && blocksByMonth[0].length > 0 && (
              <div>
                <h3 className="font-heading text-xl text-text-muted mb-3 border-b border-border pb-2">
                  Unscheduled / needs a date
                </h3>
                <div className="space-y-3">
                  {blocksByMonth[0].map((block) => (
                    <CardMonthlyTheme key={block.id} block={block} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Achievement goals, if any */}
      {era.achievementGoals.length > 0 && (
        <section className="px-6 pb-12 max-w-4xl mx-auto">
          {Array.from(new Set(era.achievementGoals.map((g) => g.year)))
            .sort((a, b) => a - b)
            .map((year) => (
              <AchievementTracker
                key={year}
                year={year}
                goals={era.achievementGoals.filter((g) => g.year === year)}
                theme="MONTHLY"
              />
            ))}
        </section>
      )}

      {/* Prev/Next navigation */}
      <section className="border-t border-border px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center max-w-5xl mx-auto">
        {prevEra ? (
          <Link
            href={`/timeline/${prevEra.slug}`}
            className="min-h-11 flex items-center text-text-muted hover:text-accent transition break-words"
          >
            ← {prevEra.title}
          </Link>
        ) : (
          <span />
        )}
        {nextEra ? (
          <Link
            href={`/timeline/${nextEra.slug}`}
            className="min-h-11 flex items-center justify-end text-text-muted hover:text-accent transition break-words sm:text-right"
          >
            {nextEra.title} →
          </Link>
        ) : (
          <span />
        )}
      </section>
    </div>
  );
}
