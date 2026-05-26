export const foundationContent = {
  hero: {
    badge: "Base madre privata",
    note:
      "Questo progetto non e un sito finale: e la fondazione tecnica privata da cui nasceranno futuri siti professionali.",
  },
  principles: {
    eyebrow: "Principi",
    title: "Poche fondamenta, ma costruite nel modo giusto.",
    items: [
      "Generica: non legata a un settore specifico.",
      "Solida: ogni modifica deve passare controlli tecnici.",
      "Elastica: deve adattarsi a hotel, ristoranti, professionisti e aziende.",
      "Privata: non deve essere pubblicata come sito pubblico.",
    ],
  },
  quality: {
    eyebrow: "Qualita",
    title: "Ogni modifica deve essere controllata.",
    checks: [
      "pnpm lint",
      "pnpm build",
      "git status",
      "commit piccoli e chiari",
    ],
  },
} as const;
