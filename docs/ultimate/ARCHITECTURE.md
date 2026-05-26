# Ultimate Architecture

La Base Madre Ultimate usa una struttura modulare leggera, chiara e controllabile.

L'obiettivo non è creare tante cartelle, ma separare correttamente responsabilità diverse.

## Layer principali

### app

Contiene routing Next.js, layout applicativo, pagine e file speciali.

Può importare:
- components;
- config;
- content;
- lib;
- types.

Non deve contenere logica business pesante.

### components/layout

Contiene componenti strutturali come header, footer e layout principali.

Può importare:
- components/layout;
- components/ui;
- config;
- lib;
- types.

Non deve contenere sezioni business specifiche.

### components/sections

Contiene sezioni di pagina riutilizzabili.

Può importare:
- components/ui;
- config;
- content;
- lib;
- types.

Non deve contenere configurazioni globali hardcoded se possono vivere in config o content.

### components/seo

Contiene componenti collegati a SEO e dati strutturati.

Può importare:
- config;
- lib;
- types.

### components/ui

Contiene componenti UI atomici e riutilizzabili.

Può importare:
- components/ui;
- lib;
- types.

Non deve importare sezioni, layout, contenuti business o configurazioni specifiche di progetto.

### config

Contiene configurazioni tecniche e di progetto.

Può importare:
- config;
- types.

Non deve importare componenti React.

### content

Contiene contenuti testuali e strutture informative modificabili per progetto.

Può importare:
- content;
- config;
- types.

Non deve importare componenti React.

### lib

Contiene utility pure, helper, validazioni e funzioni riutilizzabili.

Può importare:
- lib;
- config;
- types.

Non deve importare componenti React.

### types

Contiene tipi TypeScript condivisi.

Non deve importare componenti, configurazioni o logica applicativa.

## Regole

1. Gli import interni devono usare alias `@/`.
2. I componenti UI devono restare generici.
3. Le sezioni devono comporre UI e dati, non definire il sistema base.
4. Le configurazioni devono restare fuori dai componenti quando possibile.
5. I tipi condivisi devono stare in `src/types`.
6. La struttura deve poter essere riutilizzata per più siti reali.
7. Ogni nuovo layer deve avere un motivo forte per esistere.

## Configuration facade

La Base Madre Ultimate espone configurazioni con nomi stabili e non legati alla versione interna.

I componenti applicativi devono importare da facade definitivi, per esempio:

- `@/config/foundation`
- `@/config/business-modules`
- `@/config/design-system`
- `@/config/accessibility`
- `@/config/performance`
- `@/config/security`
- `@/config/seo`

I file storici con suffisso di versione possono rimanere come implementazione interna temporanea, ma non devono diventare il punto di accesso principale dei componenti.

Questo permette di evolvere la foundation senza obbligare tutti i componenti a conoscere la versione interna delle configurazioni.

## Project profile

La Base Madre Ultimate usa `src/config/project.ts` come punto centrale per descrivere il progetto.

Il project profile non sostituisce tutte le configurazioni specifiche, ma le collega in un unico punto stabile.

I componenti globali come layout, metadata, manifest, sitemap e structured data devono preferire il project profile quando usano informazioni generali del sito.

Questo riduce accoppiamento e rende più semplice derivare nuovi progetti reali dalla foundation.
