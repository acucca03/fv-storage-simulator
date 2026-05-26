import type { Metadata } from "next";

import { seoProfile } from "@/config/seo-profile";

export const metadataConfig: Metadata = {
  metadataBase: new URL(seoProfile.site.url),
  applicationName: seoProfile.site.name,
  title: {
    default: seoProfile.metadata.title,
    template: seoProfile.metadata.titleTemplate,
  },
  description: seoProfile.metadata.description,
  keywords: [...seoProfile.metadata.keywords],
  authors: [{ name: seoProfile.site.name }],
  creator: seoProfile.site.name,
  publisher: seoProfile.site.name,
  alternates: {
    canonical: seoProfile.metadata.canonical,
    languages: {
      it: seoProfile.metadata.canonical,
    },
  },
  openGraph: {
    type: "website",
    locale: seoProfile.metadata.locale,
    url: seoProfile.metadata.canonical,
    siteName: seoProfile.site.name,
    title: seoProfile.metadata.title,
    description: seoProfile.metadata.description,
    images: [
      {
        url: seoProfile.openGraph.image,
        width: seoProfile.openGraph.width,
        height: seoProfile.openGraph.height,
        alt: seoProfile.openGraph.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoProfile.metadata.title,
    description: seoProfile.metadata.description,
    images: [seoProfile.openGraph.image],
  },
  robots: {
    index: seoProfile.robots.index,
    follow: seoProfile.robots.follow,
    googleBot: {
      index: seoProfile.robots.index,
      follow: seoProfile.robots.follow,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};
