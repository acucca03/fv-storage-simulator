export const businessContentCatalog = {
  serviceModules: [
    {
      id: "core-offer",
      title: "Offerta principale",
      description:
        "Presenta il servizio, prodotto, camera, menu o prestazione centrale del progetto.",
      usefulFor: ["hotel", "restaurant", "professional", "local-business"],
      outcome: "Far capire subito cosa offre l'attivita.",
    },
    {
      id: "trust",
      title: "Fiducia",
      description:
        "Mostra prove sociali, recensioni, esperienza, garanzie o elementi di autorevolezza.",
      usefulFor: ["hotel", "restaurant", "professional", "local-business"],
      outcome: "Ridurre dubbi prima della conversione.",
    },
    {
      id: "local-presence",
      title: "Presenza locale",
      description:
        "Evidenzia zona servita, posizione, territorio, contesto o vicinanza al cliente.",
      usefulFor: ["hotel", "restaurant", "local-business"],
      outcome: "Rendere il sito più rilevante per ricerche locali.",
    },
    {
      id: "process",
      title: "Metodo / processo",
      description:
        "Spiega come funziona il servizio, la prenotazione, la richiesta o il contatto.",
      usefulFor: ["professional", "local-business", "hotel"],
      outcome: "Rendere chiaro il percorso dell'utente.",
    },
  ],
  trustSignals: [
    "Recensioni reali",
    "Contatti visibili",
    "Informazioni locali coerenti",
    "FAQ chiare",
    "CTA non ambigue",
    "Dati strutturati coerenti con il contenuto",
  ],
  faqBlueprint: [
    {
      question: "Cosa deve chiarire questa sezione?",
      answer:
        "Deve eliminare i dubbi principali prima che l'utente arrivi alla CTA finale.",
    },
    {
      question: "Le FAQ sono uguali per tutti i settori?",
      answer:
        "No. La foundation fornisce la struttura, ma ogni progetto reale deve avere domande specifiche.",
    },
    {
      question: "Le FAQ aiutano anche la SEO?",
      answer:
        "Sì, se rispondono a domande reali e sono coerenti con i contenuti visibili della pagina.",
    },
  ],
  contactBlueprint: {
    title: "Contatto rapido",
    description:
      "Ogni progetto reale deve rendere semplice contattare, prenotare, richiedere disponibilita o chiedere un preventivo.",
    requiredChannels: ["email", "telefono", "form", "mappa o area servita"],
    rules: [
      "La CTA deve essere coerente con il verticale attivo.",
      "I contatti devono essere facili da trovare.",
      "Il form deve chiedere solo dati necessari.",
      "Le informazioni locali devono essere coerenti con SEO e dati strutturati.",
    ],
  },
} as const;
