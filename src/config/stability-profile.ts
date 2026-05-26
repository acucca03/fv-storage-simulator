import { projectProfile } from "@/config/project";

export const stabilityProfile = {
  release: {
    targetVersion: projectProfile.release.targetVersion,
    progress: projectProfile.release.progress,
  },
  requiredRuntimeFiles: [
    "src/app/error.tsx",
    "src/app/not-found.tsx",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/robots.ts",
    "src/app/sitemap.ts",
    "src/app/manifest.ts",
  ],
  requiredFoundationFeatures: [
    "MainLayout",
    "StructuredData",
    "SkipLink",
    "metadataConfig",
    "siteStructuredData",
  ],
  forbiddenRuntimePatterns: [
    "dynamic = \"force-dynamic\"",
    "revalidate = 0",
    "cache: \"no-store\"",
    "unstable_noStore",
    "force-cache disabled without reason",
  ],
  stabilityRules: [
    "La homepage deve restare prerenderizzata staticamente.",
    "La base deve avere pagine di errore e not-found controllate.",
    "I dati strutturati devono essere collegati al layout principale.",
    "La configurazione Next deve mantenere compressione e header difensivi.",
    "Non si devono introdurre pattern dinamici senza motivo reale.",
    "Ogni nuovo modulo deve poter essere rimosso senza rompere la pagina.",
  ],
} as const;

export type StabilityProfile = typeof stabilityProfile;
