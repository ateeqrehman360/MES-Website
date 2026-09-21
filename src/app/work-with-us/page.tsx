import { WorkWithUsHero } from "@/components/sections/work-with-us-hero";
import { WaysToWorkWithUs } from "@/components/sections/ways-to-work-with-us";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "MES works with businesses, founders, speakers and organisations to create meaningful events, conversations and opportunities for Muslim students.";

export const metadata = createPageMetadata("Work With Us", description);

export default function WorkWithUsPage() {
  return (
    <>
      <WorkWithUsHero />
      <WaysToWorkWithUs />
    </>
  );
}
