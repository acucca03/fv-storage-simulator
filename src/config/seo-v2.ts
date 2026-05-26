const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fv-storage-simulator.vercel.app";
const siteUrl = rawSiteUrl.replace(/\/$/, "");

export const seoV2 = {
  site: {
    name: "SolarScope",
    legalName: "SolarScope",
    url: siteUrl,
    locale: "it_IT",
    language: "it",
    title: "SolarScope - Simulatore fotovoltaico con accumulo",
    titleTemplate: "%s | SolarScope",
    description:
      "Simulatore professionale per stimare il dimensionamento di impianti fotovoltaici domestici con accumulo, consumi reali, autoconsumo, batteria e report PDF.",
    shortDescription:
      "Simulatore fotovoltaico domestico con accumulo, consumi reali e report PDF.",
    keywords: [
      "simulatore fotovoltaico",
      "dimensionamento fotovoltaico",
      "fotovoltaico con accumulo",
      "batteria fotovoltaico",
      "accumulo domestico",
      "autoconsumo fotovoltaico",
      "impianto fotovoltaico casa",
      "report fotovoltaico",
      "PVGIS",
      "consumi ARERA",
    ],
  },
  openGraph: {
    image: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "SolarScope - Simulatore fotovoltaico domestico con accumulo",
  },
  contact: {
    email: "",
    telephone: "",
    areaServed: "Italia",
  },
  address: {
    streetAddress: "",
    addressLocality: "",
    addressRegion: "",
    postalCode: "",
    addressCountry: "IT",
  },
  socials: [] as string[],
  pages: [
    {
      path: "/",
      priority: 1,
      changeFrequency: "weekly",
      label: "Homepage",
      description:
        "Homepage del simulatore fotovoltaico domestico con accumulo SolarScope.",
    },
    {
      path: "/simulatore",
      priority: 0.9,
      changeFrequency: "weekly",
      label: "Simulatore",
      description:
        "Simulatore interattivo per impianti fotovoltaici domestici con accumulo.",
    },
    {
      path: "/privacy",
      priority: 0.4,
      changeFrequency: "yearly",
      label: "Privacy",
      description: "Informativa privacy essenziale.",
    },
    {
      path: "/cookie",
      priority: 0.4,
      changeFrequency: "yearly",
      label: "Cookie",
      description: "Informativa cookie essenziale.",
    },
    {
      path: "/termini",
      priority: 0.4,
      changeFrequency: "yearly",
      label: "Termini",
      description: "Termini di utilizzo essenziali.",
    },
    {
      path: "/disclaimer",
      priority: 0.4,
      changeFrequency: "yearly",
      label: "Disclaimer",
      description: "Disclaimer tecnico sulla natura preliminare delle stime.",
    },
  ],
  robots: {
    index: true,
    follow: true,
    disallow: ["/api/"],
  },
  localBusinessTypes: ["LocalBusiness"],
  rules: [
    "Titolo e descrizione devono rappresentare il simulatore fotovoltaico reale.",
    "Le pagine legal devono essere raggiungibili dal footer.",
    "Le simulazioni devono essere presentate come preliminari e non sostitutive del progetto tecnico.",
    "Sitemap e robots devono usare l'URL pubblico corretto.",
    "Open Graph e metadata devono essere coerenti con il progetto pubblicato.",
  ],
} as const;
