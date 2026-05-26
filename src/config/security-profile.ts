import { securityConfig } from "@/config/security";
import { projectProfile } from "@/config/project";

export const securityProfile = {
  release: {
    targetVersion: projectProfile.release.targetVersion,
    progress: projectProfile.release.progress,
  },
  headers: {
    required: [
      "X-DNS-Prefetch-Control",
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Content-Security-Policy",
      "Cross-Origin-Opener-Policy",
      "X-Permitted-Cross-Domain-Policies",
      "Origin-Agent-Cluster",
    ],
    cspDirectives: [
      "default-src",
      "script-src",
      "style-src",
      "img-src",
      "font-src",
      "connect-src",
      "frame-ancestors",
      "object-src",
      "base-uri",
      "form-action",
      "upgrade-insecure-requests",
    ],
    forbiddenCspPatterns: ["'unsafe-eval'"],
  },
  environment: {
    requiredExampleFile: ".env.example",
    forbiddenCommittedFiles: [".env", ".env.local", ".env.production"],
    publicPrefix: "NEXT_PUBLIC_",
    rules: [
      "Solo le variabili davvero pubbliche devono usare NEXT_PUBLIC_.",
      "Nessun segreto deve essere inserito in file config, componenti o repository.",
      "Ogni progetto reale deve configurare NEXT_PUBLIC_SITE_URL con il dominio definitivo.",
    ],
  },
  validation: {
    requiredUtilities: [
      "isValidEmail",
      "sanitizePlainText",
      "validateContactName",
      "validateContactEmail",
      "validateContactMessage",
    ],
    rules: [
      "Ogni form deve validare input e lunghezze.",
      "I messaggi testuali devono essere sanitizzati prima dell'uso.",
      "I dati sensibili non devono essere raccolti se non necessari.",
    ],
  },
  rules: securityConfig.principles,
  forbiddenDefaults: securityConfig.forbiddenDefaults,
} as const;

export type SecurityProfile = typeof securityProfile;
