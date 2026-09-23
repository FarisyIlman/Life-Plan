"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Era } from "@prisma/client";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const THEME_COLORS: Record<string, string> = {
  GALAXY: "#6D28D9",
  MONTHLY: "#3B82F6",
  RACING: "#DC2626",
  VOYAGE: "#1E3A8A",
  TREE: "#166534",
};

export default function TimelineClient({ eras }: { eras: Era[] }) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section, i) => {
        if (!section) return;
        const era = eras[i];
        const color = THEME_COLORS[era.theme] || "#7C6FEF";

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () =>
            gsap.to(bgRef.current, {
              backgroundColor: color,
              opacity: 0.15,
              duration: 0.8,
            }),
          onEnterBack: () =>
            gsap.to(bgRef.current, {
              backgroundColor: color,
              opacity: 0.15,
              duration: 0.8,
            }),
        });
      });
    });

    return () => ctx.revert();
  }, [eras]);

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

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [eras.length]);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SmoothScrollProvider>
      <div className="relative">
        {/* Background mood layer */}
        <div
          ref={bgRef}
          className="fixed inset-0 -z-10 pointer-events-none transition-colors"
          style={{ backgroundColor: "#12141C", opacity: 0 }}
        />

        {/* Dot navigation */}
        <div className="fixed right-1 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1">
          {eras.map((era, i) => {
            const color = THEME_COLORS[era.theme] || "#7C6FEF";
            return (
              <button
                key={era.id}
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
                aria-current={activeIndex === i ? "true" : undefined}
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
        </div>

        {eras.map((era, i) => (
          <section
            key={era.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
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
              <p className="text-text-muted max-w-xl mb-8">{era.description}</p>
            )}
            <Link
              href={`/timeline/${era.slug}`}
              className="text-white px-6 py-3 rounded font-heading hover:opacity-90 transition"
              style={{ backgroundColor: THEME_COLORS[era.theme] || "#7C6FEF" }}
            >
              View Details →
            </Link>
          </section>
        ))}
      </div>
    </SmoothScrollProvider>
  );
}
