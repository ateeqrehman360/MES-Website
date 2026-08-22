import { FoundationPage } from "@/components/sections/foundation-page";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "Upcoming event information and the MES event archive will be added from verified society content in a later implementation phase.";

export const metadata = createPageMetadata("Events", description);

export default function EventsPage() {
  return <FoundationPage title="Events" description={description} />;
}
