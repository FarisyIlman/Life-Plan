import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Me Farisy",
  description: "Hobbies, favorites, and fun facts about Farisy Syarif.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Me Farisy",
    description: "Hobbies, favorites, and fun facts about Farisy Syarif.",
    url: "/about",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me Farisy",
    description: "Hobbies, favorites, and fun facts about Farisy Syarif.",
    images: ["/opengraph-image"],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Farisy Syarif",
    alternateName: ["xEmrys", "Edward", "mdtamla"],
    url: getSiteUrl().origin,
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
