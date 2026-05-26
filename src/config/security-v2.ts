export const securityV2 = {
  goal:
    "La base madre 2.0.0 deve partire con impostazioni difensive, gestione dati prudente e controlli automatici.",
  principles: [
    "Privacy by design: raccogliere solo i dati necessari.",
    "Security by default: ogni sito derivato parte con header e controlli di base.",
    "Nessun segreto nel codice o nel repository.",
    "Validare sempre input, form e configurazioni.",
    "Limitare script esterni, iframe e integrazioni non essenziali.",
    "Documentare cosa viene raccolto, perché viene raccolto e per quanto tempo.",
    "Usare provider esterni affidabili per pagamenti e dati sensibili.",
  ],
  headers: [
    {
      name: "X-Content-Type-Options",
      value: "nosniff",
      purpose: "Riduce il rischio di interpretazione errata dei contenuti.",
    },
    {
      name: "X-Frame-Options",
      value: "SAMEORIGIN",
      purpose: "Riduce il rischio di clickjacking.",
    },
    {
      name: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
      purpose: "Limita la quantità di informazioni inviate come referrer.",
    },
    {
      name: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
      purpose: "Disattiva permessi sensibili non necessari nella base.",
    },
    {
      name: "Content-Security-Policy",
      value: "baseline compatible",
      purpose: "Riduce la superficie d'attacco verso script, frame e risorse esterne.",
    },
  ],
  dataRules: [
    {
      title: "Form contatto",
      rule: "Raccogliere solo nome, contatto e messaggio quando necessario.",
    },
    {
      title: "Prenotazioni",
      rule: "Evitare dati sensibili e usare provider dedicati se il flusso diventa complesso.",
    },
    {
      title: "Pagamenti",
      rule: "Non trattare direttamente dati carta. Usare provider certificati.",
    },
    {
      title: "Analytics",
      rule: "Non inserire tracking di default. Attivarlo solo con consenso e configurazione reale.",
    },
    {
      title: "Log",
      rule: "Non salvare dati personali inutili nei log applicativi.",
    },
    {
      title: "Ambiente",
      rule: "Usare variabili ambiente per URL, chiavi pubbliche e configurazioni.",
    },
  ],
  checks: [
    {
      name: "Security headers",
      command: "pnpm verify:security",
      expected: "Gli header principali devono essere presenti in next.config.ts.",
    },
    {
      name: "Env hygiene",
      command: "pnpm verify:security",
      expected: "Il repository deve ignorare file .env locali e documentare .env.example.",
    },
    {
      name: "Input foundation",
      command: "pnpm verify:security",
      expected: "Devono esistere utility di validazione base.",
    },
    {
      name: "Full check",
      command: "pnpm check:full",
      expected: "Build, struttura, performance e sicurezza devono passare insieme.",
    },
  ],
  forbiddenDefaults: [
    "tracking script attivi di default",
    "pixel marketing senza consenso",
    "segreti dentro componenti o config pubbliche",
    "pagamenti gestiti direttamente dal sito",
    "iframe esterni non documentati",
    "form senza validazione",
  ],
} as const;
