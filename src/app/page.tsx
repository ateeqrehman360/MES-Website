import { StaticHero } from "@/components/hero/static-hero";
import { FeaturedExperiencesSection } from "@/components/sections/featured-experiences-section";
import { HomeContent } from "@/components/sections/home-content";
import { ImpactSection } from "@/components/sections/impact-section";
import { OurNetworkSection } from "@/components/sections/our-network-section";
import { VisionSection } from "@/components/sections/vision-section";
import { createPageMetadata } from "@/lib/metadata";

import "@/styles/featured-experiences.css";
import "@/styles/home-content.css";
import "@/styles/our-network.css";

export const metadata = createPageMetadata(
  "Muslim Entrepreneurs Society at MMU",
  "MES is an independent student society at Manchester Metropolitan University, bringing Muslim students together to learn, connect and build through entrepreneurship.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        href="/models/MES_Laptop.glb"
        as="fetch"
        type="model/gltf-binary"
        crossOrigin="anonymous"
      />
      <StaticHero />
      <HomeContent>
        <VisionSection />
        <ImpactSection />
        <FeaturedExperiencesSection />
        <OurNetworkSection />
      </HomeContent>
    </>
  );
}
