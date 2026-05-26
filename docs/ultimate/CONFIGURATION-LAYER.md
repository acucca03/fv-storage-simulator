# Configuration Layer

La Base Madre Ultimate usa un configuration layer centrale per rendere il progetto adattabile senza riscrivere componenti.

## File principale

Il punto di accesso principale è:

`src/config/project.ts`

Questo file espone `projectProfile`, che centralizza:

- identità del sito;
- stato della release;
- posizionamento;
- verticali business supportate;
- azioni principali;
- collegamento alle configurazioni tecniche;
- SEO;
- tema;
- sicurezza;
- performance;
- accessibilità;
- moduli business.

## Obiettivo

Un progetto reale derivato dalla foundation deve poter modificare:

- nome sito;
- descrizione;
- verticale business;
- CTA principali;
- dati SEO;
- contatti;
- contenuti;
- tema;

senza dover riscrivere i componenti principali.

## Regola

I componenti di alto livello devono preferire `projectProfile` quando hanno bisogno di informazioni globali del progetto.

I componenti più specifici possono continuare a usare configurazioni dedicate quando lavorano su un singolo dominio, per esempio:

- `@/config/business-modules`;
- `@/config/design-system`;
- `@/config/performance`;
- `@/config/security`;
- `@/config/accessibility`.

## Beneficio

Questa struttura permette di usare la stessa foundation per:

- hotel e B&B;
- ristoranti;
- liberi professionisti;
- attività locali;

mantenendo una base tecnica comune e controllabile.

## Project presets

La foundation include preset verticali in:

`src/config/project-presets.ts`

I preset disponibili sono:

- hotel;
- restaurant;
- professional;
- local-business.

Ogni preset definisce:

- verticale business;
- tipo business per SEO e dati strutturati;
- headline;
- descrizione;
- azione primaria;
- azione secondaria;
- sezioni consigliate;
- focus SEO;
- obiettivi di conversione.

## Active vertical

Il verticale attivo si imposta tramite:

`activeProjectVertical`

Questo permette di cambiare direzione del progetto senza modificare componenti, layout, metadata o logica SEO principale.

## Verifica automatica

Il configuration layer è controllato da:

`pnpm verify:configuration`

Il controllo viene eseguito anche dentro:

`pnpm check:full`
