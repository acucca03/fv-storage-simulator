# Project Structure

## Obiettivo

Questo documento descrive la struttura di Site Foundation.

La base deve restare ordinata, leggibile e facile da riutilizzare per creare siti professionali futuri.

## Struttura principale

site-foundation/
  docs/
  public/
  src/
    app/
    components/
    config/
    content/
    lib/

## Root del progetto

### README.md

Punto di ingresso del progetto.

Spiega identita, obiettivi, comandi principali e regole base.

### package.json

Contiene script e dipendenze.

Script principali:

- pnpm dev
- pnpm lint
- pnpm build
- pnpm check

### next.config.ts

Contiene configurazioni Next.js e security headers base.

### .env.example

Esempio delle variabili ambiente previste.

Non deve contenere segreti reali.

### .gitignore

Protegge da commit accidentali di file locali, build, dipendenze e segreti.

## Cartella docs

Contiene la memoria tecnica del progetto.

File principali:

- project-brief.md
- architecture.md
- decisions.md
- roadmap.md
- tasks.md
- scalability.md
- quality-standards.md
- security.md
- accessibility.md
- environment.md
- configuration.md
- content-structure.md
- error-handling.md
- forms.md
- git-hygiene.md
- maintenance.md
- pre-project-checklist.md
- pre-deploy-checklist.md
- reuse-guide.md
- ui-components.md

Regola:

Ogni decisione importante deve essere documentata.

## Cartella src/app

Contiene la struttura Next.js App Router.

File principali:

- layout.tsx
- page.tsx
- not-found.tsx
- error.tsx
- robots.ts
- globals.css

Regola:

src/app deve gestire routing, layout globale, pagine speciali e file globali.

Non deve diventare una cartella piena di logica riutilizzabile.

## Cartella src/components

Contiene componenti React riutilizzabili.

### src/components/ui

Componenti piccoli, generici e riutilizzabili.

Esempi:

- Button
- LinkButton
- Container
- Section
- SectionHeading
- Card
- Badge
- Input
- Textarea
- Label
- Field
- FormMessage
- SkipLink

Regola:

Un componente UI non deve conoscere il settore del sito.

Deve funzionare per hotel, ristoranti, professionisti, aziende e altri progetti.

### src/components/layout

Componenti strutturali.

Esempi:

- Header
- Footer
- MainLayout

Regola:

I componenti layout devono usare configurazioni centrali dove possibile.

### src/components/sections

Sezioni riutilizzabili ma non specifiche di settore.

Questa cartella puo restare vuota o contenere sezioni generiche.

Regola:

Non inserire sezioni specifiche tipo camere hotel, menu ristorante o listini cliente dentro Site Foundation.

Quelle vanno nei progetti derivati.

## Cartella src/config

Contiene configurazioni centrali.

File principali:

- site.ts
- navigation.ts
- theme.ts
- metadata.ts

Regola:

Se un valore deve essere modificato in quasi ogni progetto derivato, probabilmente deve stare qui.

## Cartella src/content

Contiene contenuti strutturati.

File principali:

- foundation.ts

Regola:

Usare content per testi, liste e dati mostrati nelle pagine.

Non usare content per segreti, funzioni server o logica complessa.

## Cartella src/lib

Contiene utility generiche.

File principali:

- utils.ts

Regola:

Le utility devono essere piccole, pure e riutilizzabili.

## Cosa appartiene alla base

- componenti comuni
- layout comuni
- configurazioni centrali
- documentazione
- checklist
- gestione errori base
- sicurezza base
- accessibilita base
- utility generiche

## Cosa NON appartiene alla base

- testi cliente
- sezioni hotel
- menu ristorante
- dashboard specifiche
- logica business specifica
- API specifiche
- database specifici
- segreti
- deploy pubblico

## Regola finale

Se una cosa serve solo a un progetto specifico, non deve entrare in Site Foundation.
