"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => {
        const seed = index * 13.37;

        return {
          width: ((seed % 3) + 1) * 0.8,
          height: ((seed % 5) + 1) * 0.8,
          top: `${(seed * 7.3) % 100}%`,
          left: `${(seed * 11.7) % 100}%`,
          opacity: 0.2 + (index % 7) / 10,
        };
      }),
    [],
  );

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* subtle starfield teaser bg */}
      <div className="absolute inset-0 -z-10 opacity-40">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-heading text-5xl md:text-7xl text-text-primary mb-4"
      >
        Farisy — <span className="text-accent">Through The Time</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-body text-text-muted text-lg max-w-xl mb-10"
      >
        An immersive, story-driven journey through my life from 2026 into the
        future.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex gap-4"
      >
        <Link
          href="/timeline"
          className="bg-accent text-white px-6 py-3 rounded font-heading hover:opacity-90 transition"
        >
          Start the Journey
        </Link>
        <Link
          href="/about"
          className="border border-border text-text-primary px-6 py-3 rounded font-heading hover:bg-bg-secondary transition"
        >
          About Me
        </Link>
      </motion.div>
    </section>
  );
}
