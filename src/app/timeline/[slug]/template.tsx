"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 0, scaleY: 0 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-accent origin-top pointer-events-none"
      />
      <motion.div
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
