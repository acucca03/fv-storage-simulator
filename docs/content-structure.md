# Content Structure

## Obiettivo

Site Foundation deve separare struttura, configurazione e contenuti.

Questo rende la base piu facile da adattare quando verra copiata per creare un progetto reale.

## Cartella content

La cartella prevista e:

src/content/

Serve per dati testuali o contenuti strutturati usati dalle pagine.

## File iniziale

src/content/foundation.ts

Contiene i contenuti della homepage interna della base madre.

## Regola generale

I contenuti devono stare in `src/content` quando:

- sono liste
- sono testi ripetuti
- devono essere modificati spesso
- non sono logica applicativa
- servono a popolare componenti o sezioni

## Cosa NON mettere in content

Non mettere in `src/content`:

- funzioni complesse
- segreti
- API key
- logica server
- configurazioni tecniche globali
- dati specifici di un cliente dentro Site Foundation

## Differenza tra config e content

### config

Usare `src/config` per:

- nome sito
- URL
- navigazione
- tema
- metadata
- impostazioni globali

### content

Usare `src/content` per:

- testi delle sezioni
- liste di vantaggi
- FAQ
- contenuti descrittivi
- dati visualizzati nelle pagine

## Progetti derivati

In un progetto reale derivato da Site Foundation, la cartella `src/content` potra contenere dati specifici del sito.

Esempi:

- contenuti hotel
- contenuti ristorante
- contenuti professionista
- contenuti landing page

Questi contenuti non devono essere aggiunti alla base madre.
