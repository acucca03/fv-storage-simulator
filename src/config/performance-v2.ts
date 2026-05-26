export const performanceV2 = {
  goal:
    "La base madre 2.0.0 deve restare ultra veloce, statica dove possibile e leggera soprattutto da mobile.",
  principles: [
    "Static-first: preferire generazione statica e contenuti renderizzati lato server.",
    "No client JavaScript inutile: evitare use client salvo necessità reale.",
    "Zero dipendenze pesanti non motivate.",
    "Immagini sempre ottimizzate e dimensionate.",
    "Font limitati e caricati in modo controllato.",
    "Layout stabile: evitare spostamenti visivi durante il caricamento.",
    "Se una funzionalità rallenta la base senza valore chiaro, non entra.",
  ],
  budgets: [
    {
      metric: "LCP",
      target: "≤ 2.5s",
      strictTarget: "≤ 1.8s",
      meaning: "Il contenuto principale deve apparire rapidamente.",
    },
    {
      metric: "INP",
      target: "≤ 200ms",
      strictTarget: "≤ 100ms",
      meaning: "Le interazioni devono restare immediate.",
    },
    {
      metric: "CLS",
      target: "≤ 0.1",
      strictTarget: "≤ 0.05",
      meaning: "La pagina deve rimanere stabile mentre carica.",
    },
    {
      metric: "Initial JS",
      target: "Minimo indispensabile",
      strictTarget: "Nessun client JS non necessario",
      meaning: "Un sito vetrina non deve comportarsi come una web app pesante.",
    },
    {
      metric: "Rendering",
      target: "Statico dove possibile",
      strictTarget: "Homepage prerenderizzata",
      meaning: "Le pagine principali devono essere servite velocemente.",
    },
    {
      metric: "Dipendenze",
      target: "Solo essenziali",
      strictTarget: "Nessuna libreria UI pesante",
      meaning: "Meno codice esterno significa meno rischio e più velocità.",
    },
  ],
  checks: [
    {
      name: "Homepage statica",
      command: "pnpm build",
      expected: "La route / deve risultare prerenderizzata come contenuto statico.",
    },
    {
      name: "Lint e TypeScript",
      command: "pnpm check",
      expected: "Nessun errore ESLint o TypeScript.",
    },
    {
      name: "Verifica performance foundation",
      command: "pnpm verify:performance",
      expected: "Nessun uso improprio di client component o dipendenze vietate.",
    },
    {
      name: "Verifica completa",
      command: "pnpm check:full",
      expected: "Build, struttura e performance devono passare insieme.",
    },
  ],
  forbiddenPatterns: [
    "use client non motivato",
    "librerie animation pesanti nella base madre",
    "slider/carousel obbligatori",
    "tracking script inseriti di default",
    "immagini remote non configurate",
    "componenti che richiedono JavaScript per contenuto statico",
  ],
} as const;
