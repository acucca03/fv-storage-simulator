import { projectProfile } from "@/config/project";

export const privacyProfile = {
  activeVertical: projectProfile.business.activeVertical,
  dataMinimization: [
    "Raccogliere solo dati necessari alla richiesta.",
    "Evitare dati sensibili nella foundation.",
    "Delegare pagamenti e dati critici a provider specializzati.",
    "Non attivare analytics, pixel o tracking di default.",
  ],
  contactFormBaseline: {
    allowedFields: ["name", "email", "message"],
    optionalFields: ["phone", "service", "date"],
    forbiddenFields: [
      "documenti personali",
      "dati sanitari",
      "dati pagamento",
      "password",
      "codici fiscali non necessari",
    ],
  },
  publicationChecklist: [
    "Privacy policy reale collegata al progetto.",
    "Cookie policy se vengono aggiunti strumenti che usano cookie.",
    "Consenso marketing separato dal contatto base.",
    "Retention dati definita dal titolare.",
    "Responsabili esterni documentati se presenti.",
    "Form testati con validazione e messaggi chiari.",
  ],
  reliabilityRules: [
    "I form devono fallire in modo controllato.",
    "Gli errori non devono esporre dettagli tecnici all'utente.",
    "I dati inviati devono essere ridotti al minimo.",
    "Ogni integrazione esterna deve essere documentata.",
  ],
} as const;

export type PrivacyProfile = typeof privacyProfile;
