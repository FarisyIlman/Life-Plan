"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Era, ContentBlock } from "@prisma/client";
import CardGalaxyTheme from "@/components/CardGalaxyTheme";
import type { AchievementGoal } from "@prisma/client";
import AchievementTracker from "@/components/AchievementTracker";
import EraReflection from "@/components/EraReflection";
import {
  getContentProgress,
  getPublicContentBlocks,
} from "@/lib/content-progress";
import { formatTimelineDate, isUpcomingDeadline } from "@/lib/timeline-utils";

type EraWithBlocks = Era & {
  contentBlocks: ContentBlock[];
  achievementGoals: AchievementGoal[];
};
type EraNav = { slug: string; title: string } | null;
type SignalFilter = "ALL" | "ACTIVE" | "COMPLETED" | "DEADLINES";

export default function GalaxyEraView({
  era,
  prevEra,
  nextEra,
}: {
  era: EraWithBlocks;
  prevEra: EraNav;
  nextEra: EraNav;
}) {
  const publicBlocks = getPublicContentBlocks(era.contentBlocks);
  const {
    total,
    completed,
    percentage: progress,
  } = getContentProgress(era.contentBlocks);
  const now = new Date();
  const nextDeadline = publicBlocks
    .filter((block) =>
      isUpcomingDeadline(block.deadline, block.isCompleted, now),
    )
    .sort(
      (a, b) => (a.deadline?.getTime() ?? 0) - (b.deadline?.getTime() ?? 0),
    )[0]?.deadline;
  const [signalFilter, setSignalFilter] = useState<SignalFilter>("ALL");
  const prefersReducedMotion = useReducedMotion() ?? false;
  const visibleBlocks = publicBlocks.filter((block) => {
    if (signalFilter === "ACTIVE") return !block.isCompleted;
    if (signalFilter === "COMPLETED") return block.isCompleted;
    if (signalFilter === "DEADLINES")
      return isUpcomingDeadline(block.deadline, block.isCompleted, now);
    return true;
  });

  return (
    <div className="galaxy-page relative min-h-screen text-text-primary">
      <div className="mx-auto max-w-6xl px-6 pt-20">
        <Link
          href="/timeline"
          className="inline-flex min-h-10 items-center text-sm text-text-muted transition-colors hover:text-galaxy-cyan"
        >
          <span aria-hidden="true" className="mr-2">
            ←
          </span>
          Timeline
        </Link>
      </div>

      <section className="galaxy-hero">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-galaxy-purple/30 bg-galaxy-purple/8 px-3 py-1.5 text-xs font-medium uppercase text-galaxy-purple">
              <span className="h-1.5 w-1.5 rounded-full bg-galaxy-cyan" />
              Galaxy journey
              <span className="text-text-muted" aria-hidden="true">
                /
              </span>
              <span className="text-text-muted">
                {era.startYear === era.endYear
                  ? era.startYear
                  : `${era.startYear}–${era.endYear}`}
              </span>
            </p>
            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
              className="max-w-3xl wrap-break-word font-galaxy text-4xl leading-tight text-text-primary sm:text-5xl md:text-6xl"
            >
              {era.title}
            </motion.h1>
            {era.description && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-text-muted">
                {era.description}
              </p>
            )}
          </div>

          {total > 0 && (
            <div className="mt-9 max-w-2xl border-l-2 border-galaxy-cyan/55 pl-4 sm:pl-5">
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium text-text-primary">
                  Mission progress
                </span>
                <span className="font-galaxy text-lg text-galaxy-cyan">
                  {progress}%
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="Mission progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="h-full rounded-full bg-galaxy-cyan transition-[width] duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-text-muted">
                {completed} of {total} mission signals completed
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="galaxy-overview px-6" aria-label="Mission overview">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
            <p className="text-text-muted">
              <span className="font-medium text-text-primary">{total}</span>{" "}
              mission signals
            </p>
            <p className="text-text-muted">
              Next deadline{" "}
              <span className="font-medium text-galaxy-gold">
                {nextDeadline
                  ? formatTimelineDate(nextDeadline)
                  : "None scheduled"}
              </span>
            </p>
          </div>
          <p className="text-xs text-text-muted" aria-live="polite">
            Showing {visibleBlocks.length} of {publicBlocks.length} signals
          </p>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-2 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-text-muted">Filter missions</p>
          <div
            className="flex flex-wrap gap-2"
            aria-label="Mission signal filters"
          >
            {(
              [
                ["ALL", "All signals"],
                ["ACTIVE", "Active"],
                ["COMPLETED", "Completed"],
                ["DEADLINES", "Deadlines"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={signalFilter === value}
                onClick={() => setSignalFilter(value)}
                className={`min-h-10 rounded-md border px-3 text-xs font-medium transition-colors ${
                  signalFilter === value
                    ? "border-galaxy-cyan/50 bg-galaxy-cyan/10 text-galaxy-cyan"
                    : "border-white/10 bg-white/2 text-text-muted hover:border-galaxy-cyan/35 hover:text-text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <EraReflection
        thesis={era.thesis}
        tradeOff={era.tradeOff}
        successIndicators={era.successIndicators}
        retrospective={era.retrospective}
        accent="#FACC15"
        fontClassName="font-heading"
      />

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-galaxy-purple">
              Constellation map
            </p>
            <h2 className="mt-1 font-heading text-xl font-semibold text-text-primary">
              Mission signals
            </h2>
          </div>
        </div>
        {total === 0 ? (
          <p className="text-text-muted text-center">
            No content yet for this era.
          </p>
        ) : visibleBlocks.length === 0 ? (
          <p className="text-text-muted text-center border border-dashed border-border rounded-lg py-10">
            No signals match this filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {visibleBlocks.map((block, index) => (
              <CardGalaxyTheme
                key={block.id}
                block={block}
                sequence={index + 1}
                reduceMotion={prefersReducedMotion}
              />
            ))}
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
                theme="GALAXY"
              />
            ))}
        </section>
      )}

      {/* Prev/Next navigation */}
      <section className="border-t border-border px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center max-w-5xl mx-auto">
        {prevEra ? (
          <Link
            href={`/timeline/${prevEra.slug}`}
            className="min-h-11 flex items-center text-text-muted hover:text-accent transition wrap-break-word"
          >
            ← {prevEra.title}
          </Link>
        ) : (
          <span />
        )}
        {nextEra ? (
          <Link
            href={`/timeline/${nextEra.slug}`}
            className="min-h-11 flex items-center justify-end text-text-muted hover:text-accent transition wrap-break-word sm:text-right"
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
