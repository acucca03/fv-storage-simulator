import type { MetadataRoute } from "next";

import { seoProfile } from "@/config/seo-profile";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...seoProfile.robots.disallow],
    },
    sitemap: `${seoProfile.site.url}/sitemap.xml`,
    host: seoProfile.site.url,
  };
}
