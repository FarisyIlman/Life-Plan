"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const stars = useMemo(
    () =>
      Array.from({ length: 120 }, (_, index) => {
        const seed = index * 13.37;
        return {
          width: ((seed % 3) + 0.5) * 1.2,
          height: ((seed % 5) + 0.5) * 1.2,
          top: `${(seed * 7.3) % 100}%`,
          left: `${(seed * 11.7) % 100}%`,
          opacity: 0.15 + (index % 7) / 10,
          delay: (index % 10) * 0.15,
        };
      }),
    [],
  );

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 -z-10">
        {stars.map((star, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: star.opacity }}
            transition={{ duration: 1.5, delay: star.delay }}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
            }}
          />
        ))}
        {/* Subtle radial glow behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-galaxy-purple/10 rounded-full blur-3xl" />
      </div>

      {/* Badge pills row */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        <span className="flex items-center gap-1.5 text-xs font-heading border border-border rounded-full px-3 py-1.5 text-text-muted bg-bg-secondary/60 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          2026 — Present
        </span>
        <span className="text-xs font-heading border border-border rounded-full px-3 py-1.5 text-text-muted bg-bg-secondary/60 backdrop-blur-sm">
          xEmrys
        </span>
        <span className="text-xs font-heading border border-border rounded-full px-3 py-1.5 text-text-muted bg-bg-secondary/60 backdrop-blur-sm">
          Frsy.com
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-text-primary mb-6 leading-[1.05] max-w-4xl"
      >
        Imagine a life <span className="text-accent">planned out loud</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-body text-text-muted text-lg max-w-xl mb-10"
      >
        From 2026 into the future — every year gets its own theme, its own
        story, its own way of showing progress. This is{" "}
        <span className="text-text-primary font-medium">Through The Time</span>.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4"
      >
        <Link
          href="/timeline"
          className="min-h-11 flex items-center justify-center bg-accent text-white px-6 py-3 rounded font-heading hover:opacity-90 transition"
        >
          Start the Journey
        </Link>
        <Link
          href="/about"
          className="min-h-11 flex items-center justify-center border border-border text-text-primary px-6 py-3 rounded font-heading hover:bg-bg-secondary transition"
        >
          About Me
        </Link>
      </motion.div>
    </section>
  );
}
