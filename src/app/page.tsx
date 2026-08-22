import { StaticHero } from "@/components/hero/static-hero";

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
    </>
  );
}
