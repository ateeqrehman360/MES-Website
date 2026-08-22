import { FoundationPage } from "@/components/sections/foundation-page";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "The final privacy notice will describe only the data and services used by the completed MES website.";

export const metadata = createPageMetadata("Privacy", description);

export default function PrivacyPage() {
  return <FoundationPage title="Privacy" description={description} />;
}
