"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Era, ContentBlock } from "@prisma/client";

type EraWithBlocks = Era & { contentBlocks: ContentBlock[] };
type EraNav = { slug: string; title: string } | null;

const THEME_STYLES: Record<
  string,
  { accent: string; font: string; label: string }
> = {
  RACING: {
    accent: "#DC2626",
    font: "font-racing",
    label: "Racing / Grand Prix",
  },
  VOYAGE: {
    accent: "#0D9488",
    font: "font-voyage",
    label: "Ship / Sea Voyage",
  },
  TREE: {
    accent: "#166534",
    font: "font-heading",
    label: "Tree / Rooting & Growing",
  },
};

export default function GenericThemeView({
  era,
  prevEra,
  nextEra,
}: {
  era: EraWithBlocks;
  prevEra: EraNav;
  nextEra: EraNav;
}) {
  const style = THEME_STYLES[era.theme] || {
    accent: "#7C6FEF",
    font: "font-heading",
    label: era.theme,
  };

  const total = era.contentBlocks.length;
  const completed = era.contentBlocks.filter((b) => b.isCompleted).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Breadcrumb */}
      <div className="px-6 pt-6">
        <Link
          href="/timeline"
          className="text-text-muted text-sm hover:text-accent"
        >
          ← Back to Timeline
        </Link>
      </div>

      {/* Notice banner — this theme's dedicated visual is still in development */}
      <div className="mx-6 mt-6 max-w-2xl md:mx-auto px-4 py-3 rounded-lg border border-border bg-bg-secondary text-text-muted text-sm">
        This era uses the{" "}
        <strong style={{ color: style.accent }}>{style.label}</strong> theme.
        Its dedicated visual experience is planned for a future phase — showing
        a simplified layout for now.
      </div>

      {/* Hero */}
      <section className="text-center px-6 py-16">
        <p
          className={`${style.font} tracking-widest text-sm mb-2`}
          style={{ color: style.accent }}
        >
          {era.startYear === era.endYear
            ? era.startYear
            : `${era.startYear}–${era.endYear}`}
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`${style.font} text-5xl md:text-6xl text-text-primary mb-4`}
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
            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-700"
                style={{ width: `${progress}%`, backgroundColor: style.accent }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Content blocks — simple list, generic across themes */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        {total === 0 ? (
          <p className="text-text-muted text-center">
            No content yet for this era.
          </p>
        ) : (
          <div className="space-y-4">
            {era.contentBlocks.map((block) => {
              const data = block.data as {
                description?: string;
                techStack?: string;
                responsibilities?: string;
              };
              return (
                <div
                  key={block.id}
                  className="bg-bg-secondary border border-border rounded-lg p-5 border-l-4"
                  style={{ borderLeftColor: style.accent }}
                >
                  {block.deadline && (
                    <p
                      className="text-xs mb-1 font-heading"
                      style={{ color: style.accent }}
                    >
                      {new Date(block.deadline).toLocaleDateString("en-GB")}
                    </p>
                  )}
                  <h3 className="font-heading text-lg text-text-primary mb-1">
                    {block.title}
                  </h3>
                  {block.subtitle && (
                    <p className="text-text-muted text-sm mb-2">
                      {block.subtitle}
                    </p>
                  )}
                  {data.description && (
                    <p className="text-text-primary text-sm">
                      {data.description}
                    </p>
                  )}
                  {block.isCompleted && (
                    <span className="inline-block mt-3 text-green-400 text-xs font-heading">
                      ✓ Completed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Prev/Next navigation */}
      <section className="border-t border-border px-6 py-8 flex justify-between items-center max-w-5xl mx-auto">
        {prevEra ? (
          <Link
            href={`/timeline/${prevEra.slug}`}
            className="text-text-muted hover:text-accent transition"
          >
            ← {prevEra.title}
          </Link>
        ) : (
          <span />
        )}
        {nextEra ? (
          <Link
            href={`/timeline/${nextEra.slug}`}
            className="text-text-muted hover:text-accent transition"
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
