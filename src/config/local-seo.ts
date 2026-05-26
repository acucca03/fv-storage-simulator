import { projectProfile } from "@/config/project";
import { seoProfile } from "@/config/seo-profile";

export const localSeoProfile = {
  activeVertical: projectProfile.business.activeVertical,
  schemaType: seoProfile.business.schemaType,
  primaryAction: seoProfile.business.primaryAction,
  requiredProjectData: [
    {
      key: "site-url",
      label: "URL reale del sito",
      reason:
        "Metadata, canonical, sitemap, robots e dati strutturati devono puntare al dominio definitivo.",
    },
    {
      key: "business-name",
      label: "Nome reale dell'attivita",
      reason:
        "Nome visibile, metadata e dati strutturati devono essere coerenti.",
    },
    {
      key: "local-contact",
      label: "Contatti reali",
      reason:
        "Telefono, email e canali di contatto devono essere verificati prima della pubblicazione.",
    },
    {
      key: "local-address",
      label: "Indirizzo o area servita",
      reason:
        "La local SEO richiede riferimenti territoriali coerenti e non contraddittori.",
    },
    {
      key: "vertical-keywords",
      label: "Keyword locali del settore",
      reason:
        "Le keyword devono essere adattate al verticale attivo e alla localita reale.",
    },
  ],
  consistencyChecks: [
    "Il tipo schema.org deve seguire il preset business attivo.",
    "La CTA primaria deve essere visibile anche nella pagina.",
    "Le keyword devono essere coerenti con il contenuto realmente mostrato.",
    "Sitemap e canonical devono usare lo stesso dominio.",
    "Telefono, email e indirizzo devono coincidere tra pagina e JSON-LD.",
    "Open Graph deve descrivere il progetto reale, non la foundation generica.",
  ],
  forbiddenSeoPatterns: [
    "Keyword stuffing",
    "Dati strutturati non visibili nella pagina",
    "Indirizzi placeholder in produzione",
    "URL example.com in produzione",
    "Titoli duplicati tra pagine diverse",
    "CTA non coerenti con il settore",
  ],
} as const;

export type LocalSeoProfile = typeof localSeoProfile;
