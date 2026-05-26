import type {
  BusinessVertical,
  PerformanceTarget,
  QualityPillar,
  V2Milestone,
} from "@/types/foundation";

export const foundationV2 = {
  targetVersion: "2.0.0",
  currentProgress: 100,
  positioning:
    "Base madre modulare, sicura, accessibile, SEO-ready e ultra veloce per siti professionali.",
  principles: [
    "Static-first: tutto ciò che può essere statico resta statico.",
    "Mobile-first: ogni sezione nasce prima per smartphone.",
    "Zero dipendenze inutili: ogni libreria deve avere un motivo reale.",
    "Contenuto separato dal layout: il sito deve essere facile da duplicare e adattare.",
    "Componenti riutilizzabili: niente codice specifico se può diventare modulo.",
    "Performance come vincolo: bellezza e funzionalità non devono rallentare la base.",
  ],
} as const;

export const businessVerticals: BusinessVertical[] = [
  {
    id: "hotel",
    label: "Hotel / B&B",
    title: "Struttura pronta per ospitalità e turismo",
    description:
      "Pensata per camere, servizi, gallerie, posizione, recensioni e richieste di prenotazione.",
    modules: [
      "Camere e suite",
      "Servizi inclusi",
      "Gallery fotografica",
      "Mappa e punti di interesse",
      "FAQ ospiti",
      "Richiesta disponibilità",
    ],
  },
  {
    id: "restaurant",
    label: "Ristorante",
    title: "Base adatta a menu, tavoli e identità locale",
    description:
      "Pensata per presentare menu, cucina, ambiente, orari, contatti e prenotazioni.",
    modules: [
      "Menu digitale",
      "Piatti in evidenza",
      "Prenotazione tavolo",
      "Orari e chiusure",
      "Recensioni",
      "Eventi e serate",
    ],
  },
  {
    id: "professional",
    label: "Libero professionista",
    title: "Struttura chiara per servizi, fiducia e conversione",
    description:
      "Pensata per studi, consulenti, tecnici, professionisti sanitari non emergenziali e attività personali.",
    modules: [
      "Servizi",
      "Metodo di lavoro",
      "Profilo professionale",
      "Testimonianze",
      "FAQ",
      "Richiesta contatto",
    ],
  },
  {
    id: "local-business",
    label: "Attività locale",
    title: "Fondazione flessibile per aziende territoriali",
    description:
      "Pensata per piccole aziende, artigiani, brand locali, showroom e servizi su appuntamento.",
    modules: [
      "Valori aziendali",
      "Servizi principali",
      "Portfolio lavori",
      "Area coperta",
      "Contatti rapidi",
      "CTA personalizzate",
    ],
  },
];

export const qualityPillars: QualityPillar[] = [
  {
    title: "Architettura",
    description:
      "La base deve essere duplicabile senza diventare disordinata dopo pochi progetti.",
    checks: [
      "Cartelle separate per config, contenuti, componenti e sezioni",
      "Componenti server-first",
      "Naming leggibile",
      "Contenuti modificabili senza toccare la struttura",
    ],
  },
  {
    title: "Sicurezza",
    description:
      "La fondazione deve partire già con impostazioni difensive, anche nei siti semplici.",
    checks: [
      "Security headers in Next config",
      "Nessun segreto nel codice",
      "Validazione prevista per form e input",
      "Riduzione superficie d'attacco",
    ],
  },
  {
    title: "Accessibilità",
    description:
      "Il sito deve essere usabile anche da tastiera e tecnologie assistive.",
    checks: [
      "Struttura semantica",
      "Contrasto leggibile",
      "Focus visibile",
      "Navigazione chiara",
    ],
  },
  {
    title: "Scalabilità",
    description:
      "La base deve reggere l'aggiunta di moduli senza diventare un blocco unico ingestibile.",
    checks: [
      "Sezioni indipendenti",
      "Tipi TypeScript condivisi",
      "Configurazione centralizzata",
      "Documentazione di duplicazione",
    ],
  },
];

export const performanceTargets: PerformanceTarget[] = [
  {
    metric: "LCP",
    target: "≤ 2.5s",
    reason:
      "Il contenuto principale deve apparire rapidamente, soprattutto su mobile.",
  },
  {
    metric: "INP",
    target: "≤ 200ms",
    reason:
      "Le interazioni devono restare reattive anche quando il sito crescerà.",
  },
  {
    metric: "CLS",
    target: "≤ 0.1",
    reason:
      "La pagina non deve muoversi mentre carica immagini, font o sezioni.",
  },
  {
    metric: "JS iniziale",
    target: "Minimo indispensabile",
    reason:
      "Un sito vetrina premium non deve comportarsi come una web app pesante.",
  },
];

export const v2Milestones: V2Milestone[] = [
  {
    title: "Architettura base v2",
    description:
      "Separazione tra struttura, configurazione, contenuti e sezioni riutilizzabili.",
    status: "ready",
  },
  {
    title: "Design system leggero",
    description:
      "Componenti UI coerenti, riutilizzabili e privi di dipendenze inutili.",
    status: "ready",
  },
  {
    title: "Moduli business",
    description:
      "Blocchi pronti per hotel, ristoranti, professionisti e attività locali.",
    status: "ready",
  },
  {
    title: "SEO e dati strutturati",
    description:
      "Metadata, sitemap, robots e schema.org per siti locali professionali.",
    status: "ready",
  },
  {
    title: "Performance estrema",
    description:
      "Budget prestazionale, immagini ottimizzate, rendering statico e pochi script.",
    status: "ready",
  },
  {
    title: "Sicurezza e privacy",
    description:
      "Headers, gestione dati, checklist GDPR-oriented e protezioni per form.",
    status: "ready",
  },
  {
    title: "Accessibilità",
    description:
      "Semantica, tastiera, focus, contrasto e componenti più inclusivi.",
    status: "ready",
  },
  {
    title: "Documentazione finale",
    description:
      "Guide per duplicare, configurare, controllare e consegnare nuovi siti.",
    status: "ready",
  },
];
