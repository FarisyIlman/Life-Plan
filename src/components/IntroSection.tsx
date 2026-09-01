"use client";

import { motion } from "framer-motion";

export default function IntroSection() {
  return (
    <section className="py-20 px-6 max-w-3xl mx-auto text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-text-muted text-xs font-heading tracking-widest mb-4"
      >
        WHO&apos;S BEHIND THIS
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-heading text-3xl md:text-4xl text-text-primary mb-6"
      >
        A life, planned out loud.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-text-muted leading-relaxed"
      >
        I am Farisy — a student, developer, and someone who likes turning vague
        life goals into something you can actually track. This site is both a
        personal roadmap and a technical playground: every year from 2026 onward
        gets its own visual identity, its own theme, its own way of telling the
        story. Some parts are already lived. Most are still ahead. Scroll down
        and see where the timeline goes.
      </motion.p>
    </section>
  );
}
