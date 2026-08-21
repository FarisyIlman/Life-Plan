import HomeClient from "./home-client";
import HeroSection from "@/components/HeroSection";
import TimelinePreview from "@/components/TimelinePreview";
import Footer from "@/components/Footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Farisy Syarif",
    alternateName: ["xEmrys", "Edward", "mdtamla"],
    url: process.env.AUTH_URL || "http://localhost:3000",
    sameAs: ["https://github.com/FarisyIlman"],
    jobTitle: "Student & Software Developer",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient>
        <HeroSection />
        <TimelinePreview />
        <Footer />
      </HomeClient>
    </>
  );
}
