import { accessibilityConfig } from "@/config/accessibility";
import { businessModulesConfig } from "@/config/business-modules";
import { designSystemConfig } from "@/config/design-system";
import { foundationConfig } from "@/config/foundation";
import { performanceConfig } from "@/config/performance";
import {
  activeProjectPreset,
  activeProjectVertical,
  projectPresets,
} from "@/config/project-presets";
import { securityConfig } from "@/config/security";
import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { themeConfig } from "@/config/theme";
import type { BusinessVerticalId } from "@/types/project";

export const projectProfile = {
  identity: {
    name: siteConfig.name,
    shortName: siteConfig.shortName,
    owner: siteConfig.owner,
    description: siteConfig.description,
    repository: siteConfig.repository,
  },
  release: {
    targetVersion: "3.0.0",
    label: "Base Madre Ultimate",
    status: "foundation-release",
    progress: 100,
  },
  positioning: {
    headline: activeProjectPreset.headline,
    description: foundationConfig.positioning,
    promise:
      "Una foundation stabile, configurabile e riutilizzabile per creare siti premium senza ripartire da zero.",
  },
  business: {
    activeVertical: activeProjectVertical,
    supportedVerticals: Object.keys(projectPresets) as BusinessVerticalId[],
    preset: activeProjectPreset,
    presets: projectPresets,
    primaryGoal: "conversion",
    primaryAction: activeProjectPreset.primaryAction,
    secondaryAction: activeProjectPreset.secondaryAction,
    conversionGoals: activeProjectPreset.conversionGoals,
    seoFocus: activeProjectPreset.seoFocus,
    recommendedSections: activeProjectPreset.sections,
  },
  configuration: {
    site: siteConfig,
    theme: themeConfig,
    seo: seoConfig,
    foundation: foundationConfig,
    businessModules: businessModulesConfig,
    designSystem: designSystemConfig,
    performance: performanceConfig,
    security: securityConfig,
    accessibility: accessibilityConfig,
  },
} as const;

export type ProjectProfile = typeof projectProfile;
