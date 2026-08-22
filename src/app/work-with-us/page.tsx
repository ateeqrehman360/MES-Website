import { FoundationPage } from "@/components/sections/foundation-page";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "This page will explain sponsorship and event partnership opportunities with the MES university society in a later implementation phase.";

export const metadata = createPageMetadata("Work With Us", description);

export default function WorkWithUsPage() {
  return <FoundationPage title="Work With Us" description={description} />;
}
