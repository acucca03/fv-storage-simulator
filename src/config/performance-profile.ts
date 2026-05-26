import { performanceConfig } from "@/config/performance";
import { projectProfile } from "@/config/project";

export const performanceProfile = {
  release: {
    targetVersion: projectProfile.release.targetVersion,
    progress: projectProfile.release.progress,
  },
  strategy: {
    rendering: "static-first",
    clientJavaScript: "minimal",
    dependencies: "essential-only",
    images: "optimized-by-default",
    stability: "layout-shift-aware",
  },
  budgets: {
    maxSourceSizeKb: 650,
    maxPublicSizeKb: 512,
    maxSourceFiles: 140,
    allowedClientFiles: ["src/app/error.tsx"],
    forbiddenDependencies: [
      "framer-motion",
      "gsap",
      "lodash",
      "moment",
      "swiper",
      "slick-carousel",
      "jquery",
      "bootstrap",
      "axios",
      "date-fns",
      "recharts",
      "lucide-react",
    ],
    forbiddenSourcePatterns: [
      "useEffect",
      "useState",
      "window.",
      "document.",
      "localStorage",
      "sessionStorage",
    ],
  },
  quality: {
    goal: performanceConfig.goal,
    principles: performanceConfig.principles,
    budgets: performanceConfig.budgets,
    forbiddenPatterns: performanceConfig.forbiddenPatterns,
  },
} as const;

export type PerformanceProfile = typeof performanceProfile;
