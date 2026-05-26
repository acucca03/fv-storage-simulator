# Accessibility

## Obiettivo

Site Foundation deve partire con una base accessibile.

L'accessibilita non e un dettaglio finale: deve essere considerata fin dall'inizio per creare siti professionali, usabili e solidi.

## Regole base

- Usare elementi HTML semantici
- Mantenere una struttura titoli coerente
- Rendere i link riconoscibili
- Garantire focus visibile
- Usare label nei form
- Evitare contrasti troppo deboli
- Permettere navigazione da tastiera
- Non affidare informazioni importanti solo al colore
- Non nascondere contenuti essenziali su mobile

## Skip link

La base include uno SkipLink.

Serve agli utenti che navigano da tastiera o screen reader per saltare direttamente al contenuto principale.

File:

src/components/ui/SkipLink.tsx

## Main content

Il contenuto principale deve essere identificabile.

MainLayout assegna:

- id="main-content"
- tabIndex={-1}

Questo permette allo skip link di portare il focus al contenuto principale.

## Navigazione

Header e Footer devono avere aria-label chiari:

- Navigazione principale
- Navigazione footer

## Form

Ogni progetto derivato dovra garantire:

- Label associata a ogni campo importante
- Messaggi di errore chiari
- Validazione lato client e lato server
- Focus visibile
- Test da tastiera

## Progetti derivati

Ogni sito reale dovra essere controllato almeno su:

- mobile
- desktop
- navigazione da tastiera
- contrasto testi
- struttura titoli
- link principali
- form se presenti
