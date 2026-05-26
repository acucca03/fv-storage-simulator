import type { BusinessVerticalId, ProjectPreset } from "@/types/project";

export const activeProjectVertical = "local-business" satisfies BusinessVerticalId;

export const projectPresets = {
  hotel: {
    id: "hotel",
    label: "Hotel / B&B",
    businessType: "LodgingBusiness",
    headline: "Sito premium per strutture ricettive",
    description:
      "Preset pensato per camere, servizi, disponibilita, recensioni, posizione e richieste dirette.",
    primaryAction: {
      id: "availability",
      label: "Richiedi disponibilita",
      href: "#contact",
      intent: "Generare richieste di disponibilita dirette.",
    },
    secondaryAction: {
      id: "booking",
      label: "Scopri camere e servizi",
      href: "#services",
      intent: "Portare l'utente verso l'offerta ricettiva.",
    },
    sections: [
      "Hero con promessa chiara",
      "Camere o soluzioni disponibili",
      "Servizi principali",
      "Gallery",
      "Recensioni",
      "FAQ ospiti",
      "Richiesta disponibilita",
    ],
    seoFocus: [
      "hotel localita",
      "b&b localita",
      "camere localita",
      "dove dormire localita",
    ],
    conversionGoals: [
      "richiesta disponibilita",
      "prenotazione diretta",
      "contatto telefonico",
    ],
  },
  restaurant: {
    id: "restaurant",
    label: "Ristorante",
    businessType: "Restaurant",
    headline: "Sito premium per ristoranti e locali",
    description:
      "Preset pensato per menu, identita del locale, prenotazioni, orari, eventi e recensioni.",
    primaryAction: {
      id: "booking",
      label: "Prenota un tavolo",
      href: "#contact",
      intent: "Trasformare la visita in prenotazione.",
    },
    secondaryAction: {
      id: "menu",
      label: "Scopri il menu",
      href: "#menu",
      intent: "Mostrare rapidamente l'offerta gastronomica.",
    },
    sections: [
      "Hero con identita del locale",
      "Menu o piatti in evidenza",
      "Esperienza e ambiente",
      "Orari",
      "Eventi o serate",
      "Recensioni",
      "Prenotazione rapida",
    ],
    seoFocus: [
      "ristorante localita",
      "dove mangiare localita",
      "prenotazione ristorante localita",
      "menu ristorante localita",
    ],
    conversionGoals: [
      "prenotazione tavolo",
      "consultazione menu",
      "contatto rapido",
    ],
  },
  professional: {
    id: "professional",
    label: "Libero professionista",
    businessType: "ProfessionalService",
    headline: "Sito premium per professionisti",
    description:
      "Preset pensato per servizi, metodo, autorevolezza, testimonianze, FAQ e richieste di consulenza.",
    primaryAction: {
      id: "quote",
      label: "Richiedi una consulenza",
      href: "#contact",
      intent: "Generare richieste qualificate.",
    },
    secondaryAction: {
      id: "contact",
      label: "Scopri i servizi",
      href: "#services",
      intent: "Mostrare competenze e aree di intervento.",
    },
    sections: [
      "Hero con problema risolto",
      "Servizi principali",
      "Metodo di lavoro",
      "Profilo e competenze",
      "Testimonianze",
      "FAQ",
      "Modulo contatto",
    ],
    seoFocus: [
      "professionista localita",
      "consulenza localita",
      "servizi professionali localita",
      "studio professionale localita",
    ],
    conversionGoals: [
      "richiesta consulenza",
      "richiesta preventivo",
      "contatto qualificato",
    ],
  },
  "local-business": {
    id: "local-business",
    label: "Attivita locale",
    businessType: "LocalBusiness",
    headline: "Sito premium per attivita locali",
    description:
      "Preset flessibile per aziende territoriali, artigiani, showroom, servizi locali e brand indipendenti.",
    primaryAction: {
      id: "contact",
      label: "Contattaci",
      href: "#contact",
      intent: "Generare contatti diretti.",
    },
    secondaryAction: {
      id: "quote",
      label: "Scopri cosa facciamo",
      href: "#services",
      intent: "Presentare servizi, prodotti o valore aziendale.",
    },
    sections: [
      "Hero territoriale",
      "Servizi o prodotti",
      "Portfolio o esempi",
      "Area coperta",
      "Valori aziendali",
      "Recensioni",
      "Contatto rapido",
    ],
    seoFocus: [
      "attivita locale",
      "servizi localita",
      "azienda localita",
      "artigiano localita",
    ],
    conversionGoals: [
      "contatto diretto",
      "richiesta preventivo",
      "chiamata telefonica",
    ],
  },
} as const satisfies Record<BusinessVerticalId, ProjectPreset>;

export const activeProjectPreset = projectPresets[activeProjectVertical];
