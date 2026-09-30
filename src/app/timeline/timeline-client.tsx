"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  filterTimelineEras,
  type TimelineFilter,
  type TimelineSignals,
} from "@/lib/timeline-utils";

type TimelineEra = {
  id: string;
  slug: string;
  title: string;
  theme: string;
  startYear: number;
  endYear: number;
  description: string | null;
  signals: TimelineSignals;
};

const THEME_COLORS: Record<string, string> = {
  GALAXY: "#6D28D9",
  MONTHLY: "#3B82F6",
  RACING: "#DC2626",
  VOYAGE: "#1E3A8A",
  TREE: "#166534",
};
export default function TimelineClient({
  eras,
  summary,
}: {
  eras: TimelineEra[];
  summary: TimelineSignals;
}) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState<TimelineFilter>("ALL");
  const prefersReducedMotion = useReducedMotion() ?? false;

  const visibleEras = filterTimelineEras(eras, filter);
  const visibleEraSignature = visibleEras
    .map((era) => `${era.id}:${era.theme}`)
    .join("|");

  useEffect(() => {
    const moodLayer = bgRef.current;
    if (!moodLayer) return;

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section) => {
        if (!section) return;
        const color = THEME_COLORS[section.dataset.theme ?? ""] || "#7C6FEF";
        const updateMood = () => {
          if (prefersReducedMotion) {
            gsap.set(moodLayer, { backgroundColor: color, opacity: 0.15 });
            return;
          }
          gsap.to(moodLayer, {
            backgroundColor: color,
            opacity: 0.15,
            duration: 0.8,
          });
        };

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: updateMood,
          onEnterBack: updateMood,
        });
      });
    });

    return () => {
      ctx.revert();
      gsap.killTweensOf(moodLayer);
    };
  }, [prefersReducedMotion, visibleEraSignature]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visibleEntry) return;
        const index = sectionRefs.current.indexOf(
          visibleEntry.target as HTMLElement,
        );
        if (index >= 0) setActiveIndex(index);
      },
      { rootMargin: "-35% 0px -35%", threshold: [0.2, 0.5, 0.8] },
    );

    const sections = sectionRefs.current.filter(
      (section): section is HTMLElement => section !== null,
    );
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [visibleEraSignature]);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <SmoothScrollProvider>
      <main className="relative">
        <header className="mx-auto max-w-5xl px-6 pb-5 pt-24">
          <p className="mb-2 text-xs tracking-widest text-text-muted font-heading">
            ROADMAP SIGNALS
          </p>
          <h1 className="font-heading text-3xl text-text-primary sm:text-4xl">
            Life timeline
          </h1>
          <p className="mt-2 text-sm text-text-muted">From 2026 onward</p>
        </header>

        <div className="sticky top-14 z-30 border-b border-border bg-bg-primary/95 px-4 py-3 backdrop-blur sm:px-6">
          <div
            role="group"
            aria-label="Filter timeline eras"
            className="flex flex-wrap justify-center gap-2"
          >
            {(
              [
                ["ALL", "All"],
                ["GOALS", "Goals"],
                ["PROJECTS", "Projects"],
                ["EVIDENCE", "Evidence"],
                ["UPCOMING", "Upcoming"],
                ["COMPLETED", "Completed"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setFilter(value);
                  setActiveIndex(0);
                }}
                aria-pressed={filter === value}
                className={`min-h-11 rounded border px-3 text-xs font-heading transition ${
                  filter === value
                    ? "bg-accent text-white border-accent"
                    : "text-text-muted border-border hover:text-text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p
            className="mt-2 text-center text-xs text-text-muted"
            aria-live="polite"
          >
            Showing {visibleEras.length} of {eras.length} eras
          </p>
        </div>
        <section
          className="mx-auto max-w-5xl px-6 pb-4 pt-10"
          aria-label="Timeline overview"
        >
          <h2 className="mb-3 font-heading text-lg text-text-primary">
            At a glance
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              ["Goals", summary.goals],
              ["Projects", summary.projects],
              ["Completed", summary.completed],
              ["Evidence", summary.evidence],
              ["Upcoming", summary.upcoming],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border border-border bg-bg-secondary/60 rounded-lg p-3"
              >
                <p className="text-text-primary text-xl font-heading">
                  {value}
                </p>
                <p className="text-text-muted text-xs">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {visibleEras.length > 0 && (
          <nav
            aria-label="Jump to an era"
            className="flex gap-2 overflow-x-auto px-6 pb-3 sm:hidden"
          >
            {visibleEras.map((era, index) => (
              <button
                key={era.id}
                type="button"
                onClick={() => scrollToSection(index)}
                aria-current={activeIndex === index ? "location" : undefined}
                className={`min-h-11 shrink-0 rounded-full border px-4 text-xs font-medium transition-colors ${
                  activeIndex === index
                    ? "text-text-primary"
                    : "border-border text-text-muted"
                }`}
                style={{
                  borderColor: THEME_COLORS[era.theme] || "#7C6FEF",
                  backgroundColor:
                    activeIndex === index
                      ? `${THEME_COLORS[era.theme] || "#7C6FEF"}26`
                      : "transparent",
                }}
              >
                {era.title}
              </button>
            ))}
          </nav>
        )}

        {/* Background mood layer */}
        <div
          ref={bgRef}
          className="fixed inset-0 -z-10 pointer-events-none transition-colors"
          style={{ backgroundColor: "#12141C", opacity: 0 }}
        />

        {/* Dot navigation */}
        <nav
          aria-label="Jump to an era"
          className="fixed right-1 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 sm:right-6 sm:flex"
        >
          {visibleEras.map((era, i) => {
            const color = THEME_COLORS[era.theme] || "#7C6FEF";
            return (
              <button
                key={era.id}
                type="button"
                onClick={() => scrollToSection(i)}
                className="min-h-11 min-w-11 flex items-center justify-center rounded-full transition hover:scale-110"
                style={{ borderColor: color }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = color)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                aria-label={`Jump to ${era.title}`}
                aria-current={activeIndex === i ? "location" : undefined}
                title={era.title}
              >
                <span
                  className={`block h-3 w-3 rounded-full border transition ${
                    activeIndex === i ? "scale-125" : ""
                  }`}
                  style={{
                    borderColor: color,
                    backgroundColor: activeIndex === i ? color : "transparent",
                  }}
                />
              </button>
            );
          })}
        </nav>

        {visibleEras.length === 0 ? (
          <section
            className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
            aria-live="polite"
          >
            <p className="text-text-muted">No eras match this filter yet.</p>
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className="min-h-11 rounded border border-border px-4 text-sm text-text-primary transition hover:border-accent"
            >
              Show all eras
            </button>
          </section>
        ) : (
          visibleEras.map((era, i) => (
            <section
              key={era.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              data-theme={era.theme}
              className="min-h-screen flex flex-col items-center justify-center text-center px-6"
            >
              <p className="text-text-muted text-sm mb-2">
                {era.startYear === era.endYear
                  ? era.startYear
                  : `${era.startYear}–${era.endYear}`}
              </p>
              <h2 className="font-heading text-4xl md:text-6xl text-text-primary mb-4">
                {era.title}
              </h2>
              {era.description && (
                <p className="text-text-muted max-w-xl mb-8">
                  {era.description}
                </p>
              )}
              <Link
                href={`/timeline/${era.slug}`}
                aria-label={`View details for ${era.title}`}
                className="text-white px-6 py-3 rounded font-heading hover:opacity-90 transition"
                style={{
                  backgroundColor: THEME_COLORS[era.theme] || "#7C6FEF",
                }}
              >
                View Details →
              </Link>
            </section>
          ))
        )}
      </main>
    </SmoothScrollProvider>
  );
}
