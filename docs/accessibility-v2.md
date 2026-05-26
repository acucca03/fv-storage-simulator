# Accessibilità v2

La base madre 2.0.0 include una fondazione accessibile per siti professionali.

## Obiettivi

- Navigazione da tastiera.
- Skip link verso il contenuto principale.
- Lingua del documento dichiarata.
- Rispetto di prefers-reduced-motion.
- Struttura semantica.
- Focus visibile.
- Contrasto leggibile.
- Testi chiari per azioni e sezioni.

## File principali

- src/app/layout.tsx
- src/app/globals.css
- src/components/ui/SkipLink.tsx
- src/components/layout/MainLayout.tsx
- src/config/accessibility-v2.ts
- src/components/sections/AccessibilitySection.tsx
- scripts/vessibility.mjs

## Verifica

Comando:

pnpm verify:accessibility

Verifica completa:

pnpm check:full

## Nota

Questa verifica non sostituisce test manuali con tastiera, screen reader e Lighthouse, ma impedisce che manchino le fondamenta accessibili principali.
