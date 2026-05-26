import { privacyProfile } from "@/config/privacy-profile";
import { projectProfile } from "@/config/project";
import { securityProfile } from "@/config/security-profile";
import { stabilityProfile } from "@/config/stability-profile";

export const reliabilityProfile = {
  release: {
    targetVersion: projectProfile.release.targetVersion,
    progress: projectProfile.release.progress,
  },
  baseline: {
    security: "security-by-default",
    privacy: "privacy-by-design",
    stability: "static-first-runtime",
    recovery: "controlled-errors",
  },
  requiredChecks: [
    "verify:security",
    "verify:stability",
    "verify:performance",
    "verify:accessibility",
    "verify:release",
  ],
  failureHandling: [
    "Error boundary presente per errori runtime.",
    "Pagina not-found presente per percorsi non validi.",
    "I messaggi errore non devono esporre dettagli tecnici.",
    "Le sezioni devono poter fallire o essere rimosse senza rompere l'intera pagina.",
    "Le integrazioni esterne devono essere isolate e documentate.",
  ],
  formReliability: [
    "Validazione lato codice prima dell'invio.",
    "Campi minimi e coerenti con la finalità.",
    "Messaggi chiari per input non validi.",
    "Nessun dato sensibile richiesto dalla foundation.",
    "Provider dedicati per pagamenti, prenotazioni avanzate o dati critici.",
  ],
  operationalReadiness: [
    "Dominio reale configurato prima della pubblicazione.",
    "Contatti reali verificati.",
    "Policy privacy e cookie completate sul progetto reale.",
    "Analytics o pixel assenti di default.",
    "Header e CSP verificati automaticamente.",
    "Build e check completi superati prima del rilascio.",
  ],
  linkedProfiles: {
    securityRules: securityProfile.rules,
    privacyChecklist: privacyProfile.publicationChecklist,
    stabilityRules: stabilityProfile.stabilityRules,
  },
} as const;

export type ReliabilityProfile = typeof reliabilityProfile;
