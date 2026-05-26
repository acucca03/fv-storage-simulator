# Quality Standards

## Obiettivo

Site Foundation deve essere una base professionale, affidabile e mantenibile.

Ogni modifica deve migliorare la solidita del progetto, non solo aggiungere codice.

## Standard minimi

Ogni modifica deve rispettare questi controlli:

- pnpm lint
- pnpm build
- git status pulito
- commit chiaro
- nessuna complessita inutile
- nessun contenuto specifico di settore dentro la base

## Principi di codice

- Componenti piccoli
- Nomi chiari
- File ordinati
- Responsabilita separate
- Configurazioni centralizzate
- Poche dipendenze
- Niente codice duplicato se puo diventare componente
- Niente funzioni specifiche di settore nella base madre

## Criteri per aggiungere qualcosa alla base

Prima di aggiungere un nuovo componente o file, chiedersi:

1. Serve in quasi tutti i siti futuri?
2. E generico?
3. E stabile?
4. E facile da modificare?
5. Rende la base piu forte?
6. Evita ripetizioni future?
7. Non appesantisce inutilmente il progetto?

Se la risposta non e chiara, non va aggiunto alla base.

## Performance budget iniziale

La base deve tendere a:

- HTML semplice
- CSS controllato
- JavaScript client minimo
- immagini ottimizzate nei progetti reali
- font gestiti con attenzione
- componenti non pesanti
- layout responsive senza hack fragili

## Responsive

Ogni componente base deve funzionare bene su:

- smartphone
- tablet
- desktop
- schermi grandi

Il mobile non deve essere un'aggiunta finale: deve essere considerato dall'inizio.

## Accessibilita

Ogni componente deve rispettare principi base:

- elementi semantici corretti
- link riconoscibili
- focus visibile
- contrasto leggibile
- label nei form
- navigazione da tastiera
- struttura titoli coerente

## Manutenibilita

La base deve essere comprensibile anche dopo mesi.

Un componente e buono se puo essere modificato senza dover capire tutto il progetto.
