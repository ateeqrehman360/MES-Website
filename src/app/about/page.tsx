import { AboutHero } from "@/components/sections/about-hero";
import { JourneySection } from "@/components/sections/journey-section";
import { WhatWeDoSection } from "@/components/sections/what-we-do-section";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "The Muslim Entrepreneurs Society at Manchester Metropolitan University, founded in 2024.";

export const metadata = createPageMetadata("About", description);

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <JourneySection />
      <WhatWeDoSection />
    </>
  );
}
