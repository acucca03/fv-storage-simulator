import type { MetadataRoute } from "next";

import { seoProfile } from "@/config/seo-profile";
import { projectProfile } from "@/config/project";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoProfile.site.name,
    short_name: projectProfile.identity.shortName,
    description: seoProfile.metadata.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: seoProfile.metadata.language,
    icons: [
      {
        src: "/icon.svg",
        sizes: "64x64",
        type: "image/svg+xml",
      },
    ],
  };
}
