# Architecture

## Struttura prevista

site-foundation/
  docs/
  public/
  src/
    app/
      layout.tsx
      page.tsx
      globals.css

    components/
      layout/
      sections/
      ui/

    config/
      site.ts
      navigation.ts
      theme.ts

    lib/
      utils.ts

    content/

## Regole architetturali

- src/app contiene routing, layout globale e pagine Next.js
- src/components/ui contiene componenti piccoli e generici
- src/components/layout contiene componenti strutturali come Header e Footer
- src/components/sections contiene sezioni riutilizzabili ma non specifiche di settore
- src/config contiene configurazioni centrali
- src/lib contiene funzioni utility
- src/content contiene contenuti modificabili o dati testuali
- docs contiene la memoria tecnica del progetto

## Filosofia

La base deve essere modulare.

Ogni parte deve poter essere sostituita o adattata senza rompere il resto del progetto.

## Componenti UI iniziali previsti

- Button
- Container
- Section
- SectionHeading
- Card
- Badge
- Input
- Textarea
- Label

## Layout iniziali previsti

- Header
- Footer
- MainLayout

## Configurazioni previste

- site config
- navigation config
- theme config
- metadata config

## Regola

Niente codice duplicato quando puo diventare un componente utile e generico.
