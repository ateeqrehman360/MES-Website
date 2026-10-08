import type { Metadata } from "next";

import { siteConfig } from "@/data/site";

export const socialImage = {
  url: "/brand/mes-logo.png",
  width: 1254,
  height: 1254,
  alt: "Muslim Entrepreneurs Society (MES) logo",
};

export function createPageMetadata(
  title: string,
  description: string,
  pathname: "/" | "/about" | "/events" | "/work-with-us" | "/privacy",
): Metadata {
  const pageTitle = `${title} | ${siteConfig.shortName}`;

  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      title: pageTitle,
      description,
      url: pathname,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_GB",
      images: [socialImage],
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
      images: [{ url: socialImage.url, alt: socialImage.alt }],
    },
  };
}
