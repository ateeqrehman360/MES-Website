import { AboutHero } from "@/components/sections/about-hero";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "The Muslim Entrepreneurs Society at Manchester Metropolitan University, founded in 2024.";

export const metadata = createPageMetadata("About", description);

export default function AboutPage() {
  return <AboutHero />;
}
