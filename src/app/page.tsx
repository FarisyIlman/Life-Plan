import HomeClient from "./home-client";
import HeroSection from "@/components/HeroSection";
import TimelinePreview from "@/components/TimelinePreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <HomeClient>
      <HeroSection />
      <TimelinePreview />
      <Footer />
    </HomeClient>
  );
}
