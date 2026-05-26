import { seoProfile } from "@/config/seo-profile";

const absoluteUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }

  return `${seoProfile.site.url}${path.startsWith("/") ? path : `/${path}`}`;
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: seoProfile.site.name,
  url: seoProfile.site.url,
  inLanguage: seoProfile.metadata.language,
  description: seoProfile.metadata.description,
};

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: seoProfile.site.legalName,
  url: seoProfile.site.url,
  logo: absoluteUrl("/favicon.ico"),
};

export const webApplicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: seoProfile.site.name,
  url: seoProfile.site.url,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: seoProfile.metadata.language,
  description: seoProfile.metadata.description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  potentialAction: {
    "@type": "UseAction",
    name: "Avvia simulazione",
    target: absoluteUrl("/simulatore"),
  },
};

export const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: seoProfile.site.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Simulatore",
      item: absoluteUrl("/simulatore"),
    },
  ],
};

export const siteStructuredData = [
  websiteStructuredData,
  organizationStructuredData,
  webApplicationStructuredData,
  breadcrumbStructuredData,
];
