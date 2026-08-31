import { StaticHero } from "@/components/hero/static-hero";
import { HomeContent } from "@/components/sections/home-content";
import { ImpactSection } from "@/components/sections/impact-section";
import { VisionSection } from "@/components/sections/vision-section";

import "@/styles/home-content.css";

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
      </HomeContent>
    </>
  );
}
