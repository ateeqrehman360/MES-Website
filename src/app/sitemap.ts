import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about", "/events", "/work-with-us", "/privacy"].map(
    (pathname) => ({ url: new URL(pathname, siteConfig.url).href }),
  );
}
