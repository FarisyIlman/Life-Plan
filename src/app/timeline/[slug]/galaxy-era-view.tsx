"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Era, ContentBlock } from "@prisma/client";
import CardGalaxyTheme from "@/components/CardGalaxyTheme";
import type { AchievementGoal } from "@prisma/client";
import AchievementTracker from "@/components/AchievementTracker";
import EraReflection from "@/components/EraReflection";
import { getContentProgress } from "@/lib/content-progress";
import { getPublicContentBlocks } from "@/lib/content-progress";

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
  const nextDeadline = publicBlocks
    .filter((block) => block.deadline && !block.isCompleted)
    .sort(
      (a, b) => (a.deadline?.getTime() ?? 0) - (b.deadline?.getTime() ?? 0),
    )[0]?.deadline;
  const [signalFilter, setSignalFilter] = useState<SignalFilter>("ALL");
  const visibleBlocks = publicBlocks.filter((block) => {
    if (signalFilter === "ACTIVE") return !block.isCompleted;
    if (signalFilter === "COMPLETED") return block.isCompleted;
    if (signalFilter === "DEADLINES")
      return Boolean(block.deadline && !block.isCompleted);
    return true;
  });

  return (
    <div className="min-h-screen bg-bg-primary relative">
      {/* Galaxy background glow */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-galaxy-purple/10 via-transparent to-transparent" />

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
        <p className="text-galaxy-gold font-heading tracking-widest text-sm mb-2">
          {era.startYear === era.endYear
            ? era.startYear
            : `${era.startYear}–${era.endYear}`}
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-galaxy text-4xl sm:text-5xl md:text-6xl text-text-primary mb-4 break-words"
        >
          {era.title}
        </motion.h1>
        {era.description && (
          <p className="text-text-muted max-w-xl mx-auto">{era.description}</p>
        )}

        {/* Progress indicator */}
        {total > 0 && (
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div
              className="h-2 bg-bg-secondary rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Mission progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full bg-galaxy-cyan transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <section
        className="px-6 pb-12 max-w-5xl mx-auto"
        aria-label="Mission overview"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-galaxy-purple/40 bg-bg-secondary/60 p-4 rounded-lg">
            <p className="text-galaxy-purple text-xs font-heading tracking-wider uppercase">
              Signals
            </p>
            <p className="font-galaxy text-2xl text-text-primary mt-1">
              {total}
            </p>
          </div>
          <div className="border border-galaxy-cyan/40 bg-bg-secondary/60 p-4 rounded-lg">
            <p className="text-galaxy-cyan text-xs font-heading tracking-wider uppercase">
              Completed
            </p>
            <p className="font-galaxy text-2xl text-text-primary mt-1">
              {completed}
            </p>
          </div>
          <div className="border border-galaxy-gold/40 bg-bg-secondary/60 p-4 rounded-lg">
            <p className="text-galaxy-gold text-xs font-heading tracking-wider uppercase">
              Next deadline
            </p>
            <p className="font-heading text-sm text-text-primary mt-2">
              {nextDeadline
                ? nextDeadline.toLocaleDateString("en-GB")
                : "No active deadline"}
            </p>
          </div>
        </div>
        <div
          className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-xs text-text-muted font-heading"
          aria-label="Constellation legend"
        >
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-galaxy-purple mr-2" />
            Mission signal
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-galaxy-cyan mr-2" />
            Active work
          </span>
          <span>
            <span className="inline-block h-2 w-2 rounded-full bg-galaxy-gold mr-2" />
            Deadline
          </span>
        </div>
        <div
          className="flex flex-wrap gap-2 mt-5"
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
              className={`rounded border px-3 py-2 text-xs transition-colors ${
                signalFilter === value
                  ? "border-galaxy-cyan bg-galaxy-cyan/10 text-galaxy-cyan"
                  : "border-border text-text-muted hover:border-galaxy-cyan/60 hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          ))}
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

      {/* Content blocks grid */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        {total === 0 ? (
          <p className="text-text-muted text-center">
            No content yet for this era.
          </p>
        ) : visibleBlocks.length === 0 ? (
          <p className="text-text-muted text-center border border-dashed border-border rounded-lg py-10">
            No signals match this filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleBlocks.map((block, index) => (
              <div key={block.id} className="relative">
                <span className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-galaxy-cyan/60 bg-bg-primary text-[10px] text-galaxy-cyan font-galaxy">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <CardGalaxyTheme block={block} />
              </div>
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
