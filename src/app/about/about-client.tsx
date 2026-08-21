"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const FUN_FACTS = [
  {
    label: "Hobbies",
    value: "Listening to music, playing games, learning something new",
  },
  { label: "Favorite Movie", value: "Interstellar" },
  {
    label: "Favorite Anime",
    value: "Naruto (for the normies) & Fullmetal Alchemist: Brotherhood",
  },
  { label: "Favorite Animation", value: "Gravity Falls" },
  { label: "Favorite Food", value: "Indomie / Instant Noodle" },
  { label: "Favorite Drink", value: "Water & Coffee" },
  { label: "MBTI", value: "INTP — The Logician" },
  { label: "Also Known As", value: "xEmrys · Edward · mdtamla" },
];

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-28 h-28 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-6"
        >
          <span className="font-heading text-4xl text-accent">F</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl md:text-5xl mb-2"
        >
          Farisy Syarif
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted max-w-lg"
        >
          The Logician behind the code — an INTP who&apos;d rather build
          something than talk about building it. Welcome to the part of the site
          that isn&apos;t a CV.
        </motion.p>
      </section>

      {/* Fun facts grid */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FUN_FACTS.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-bg-secondary border border-border rounded-lg p-5 hover:border-accent transition"
            >
              <p className="text-accent text-xs font-heading tracking-wide mb-1">
                {fact.label.toUpperCase()}
              </p>
              <p className="text-text-primary">{fact.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border px-6 py-16 text-center">
        <h2 className="font-heading text-2xl md:text-3xl mb-4">
          That&apos;s the person behind the timeline.
        </h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          Curious where the story actually goes? Head back and pick up where you
          left off.
        </p>
        <Link
          href="/timeline"
          className="bg-accent text-white px-6 py-3 rounded font-heading hover:opacity-90 transition inline-block"
        >
          Back to the Journey →
        </Link>
      </section>
    </main>
  );
}
