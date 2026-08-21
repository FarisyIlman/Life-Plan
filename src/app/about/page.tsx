import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Me — Farisy",
  description: "Hobbies, favorites, and fun facts about Farisy Syarif.",
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Farisy Syarif",
    alternateName: ["xEmrys", "Edward", "mdtamla"],
    url: process.env.AUTH_URL || "http://localhost:3000",
    sameAs: ["https://github.com/FarisyIlman"],
    jobTitle: "Student & Software Developer",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Itenas",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}
