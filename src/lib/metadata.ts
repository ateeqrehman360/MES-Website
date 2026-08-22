import type { Metadata } from "next";

import { siteConfig } from "@/data/site";

export function createPageMetadata(
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.shortName}`,
      description,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}
