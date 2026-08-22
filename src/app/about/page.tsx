import { FoundationPage } from "@/components/sections/foundation-page";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "This page will introduce the Muslim Entrepreneurs society at Manchester Metropolitan University in a later implementation phase.";

export const metadata = createPageMetadata("About", description);

export default function AboutPage() {
  return <FoundationPage title="About" description={description} />;
}
