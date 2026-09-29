import HomeClient from "./home-client";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import TimelinePreview from "@/components/TimelinePreview";
import Footer from "@/components/Footer";
import { getSiteUrl } from "@/lib/site-url";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Farisy Syarif",
    alternateName: ["xEmrys", "Edward", "mdtamla"],
    url: getSiteUrl().origin,
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
        <IntroSection />
        <TimelinePreview />
        <Footer />
      </HomeClient>
    </>
  );
}
