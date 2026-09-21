import { AboutHero } from "@/components/sections/about-hero";
import { AboutWorkWithUsCta } from "@/components/sections/about-work-with-us-cta";
import { BuiltAtMmuSection } from "@/components/sections/built-at-mmu-section";
import { JourneySection } from "@/components/sections/journey-section";
import { TeamSection } from "@/components/sections/team-section";
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
      <TeamSection />
      <BuiltAtMmuSection />
      <AboutWorkWithUsCta />
    </>
  );
}
