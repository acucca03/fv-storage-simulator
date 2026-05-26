import { projectProfile } from "@/config/project";

const seoConfig = projectProfile.configuration.seo;

const unique = <T>(items: readonly T[]) => [...new Set(items)];

export const seoProfile = {
  site: seoConfig.site,
  openGraph: seoConfig.openGraph,
  contact: seoConfig.contact,
  socials: seoConfig.socials,
  address: seoConfig.address,
  robots: seoConfig.robots,
  pages: seoConfig.pages,
  business: {
    activeVertical: projectProfile.business.activeVertical,
    label: projectProfile.business.preset.label,
    schemaType: projectProfile.business.preset.businessType,
    primaryAction: projectProfile.business.primaryAction,
    secondaryAction: projectProfile.business.secondaryAction,
    seoFocus: projectProfile.business.seoFocus,
    conversionGoals: projectProfile.business.conversionGoals,
  },
  metadata: {
    title: seoConfig.site.title,
    titleTemplate: seoConfig.site.titleTemplate,
    description: seoConfig.site.description,
    shortDescription: seoConfig.site.shortDescription,
    keywords: unique([
      ...seoConfig.site.keywords,
      ...projectProfile.business.seoFocus,
    ]),
    canonical: "/",
    locale: seoConfig.site.locale,
    language: seoConfig.site.language,
  },
  rules: [
    ...seoConfig.rules,
    "Il tipo schema.org deve seguire il preset business attivo.",
    "Le keyword devono includere anche il focus SEO del verticale attivo.",
    "Le CTA usate nei dati strutturati devono essere coerenti con il project profile.",
  ],
} as const;

export type SeoProfile = typeof seoProfile;
