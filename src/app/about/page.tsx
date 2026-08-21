import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Me — Farisy",
  description: "Hobbies, favorites, and fun facts about Farisy Syarif.",
};

export default function AboutPage() {
  return <AboutClient />;
}
