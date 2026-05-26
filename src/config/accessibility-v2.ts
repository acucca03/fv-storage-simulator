export const accessibilityV2 = {
  goal:
    "La base madre 2.0.0 deve essere navigabile, leggibile e robusta anche per utenti con tecnologie assistive.",
  principles: [
    "Usare HTML semantico prima di aggiungere attributi ARIA.",
    "Mantenere focus visibile e navigazione da tastiera.",
    "Garantire contrasto leggibile tra testo e sfondo.",
    "Evitare animazioni obbligatorie e rispettare prefers-reduced-motion.",
    "Scrivere testi chiari per link, bottoni e call to action.",
    "Usare struttura heading coerente.",
    "Non affidare informazioni essenziali solo al colore.",
  ],
  checks: [
    {
      name: "Lingua documento",
      target: "html lang='it'",
      reason: "Aiuta screen reader e browser a interpretare correttamente il contenuto.",
    },
    {
      name: "Skip link",
      target: "Link per saltare al contenuto principale",
      reason: "Migliora la navigazione da tastiera.",
    },
    {
      name: "Reduced motion",
      target: "prefers-reduced-motion",
      reason: "Rispetta utenti sensibili ad animazioni e transizioni.",
    },
    {
      name: "Focus",
      target: "focus-visible",
      reason: "Rende chiaro quale elemento è selezionato via tastiera.",
    },
    {
      name: "Semantica",
      target: "main, header, footer, section, nav",
      reason: "Crea una struttura leggibile da browser e tecnologie assistive.",
    },
    {
      name: "Contenuti",
      target: "Testi descrittivi",
      reason: "Rende il sito più chiaro, accessibile e professionale.",
    },
  ],
  finalStandards: [
    "pnpm check deve passare.",
    "pnpm build deve passare.",
    "pnpm verify:structure deve passare.",
    "pnpm verify:performance deve passare.",
    "pnpm verify:security deve passare.",
    "pnpm verify:accessibility deve passare.",
    "pnpm verify:release deve passare.",
    "pnpm check:full deve passare.",
  ],
} as const;
