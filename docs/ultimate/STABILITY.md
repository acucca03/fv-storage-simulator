# Stabilità — Base Madre Ultimate

La Base Madre Ultimate deve restare stabile mentre cresce e mentre viene adattata a progetti reali.

## Obiettivi

- homepage static-first;
- error boundary presente;
- not-found presente;
- layout principale controllato;
- metadata collegati alla configurazione;
- dati strutturati collegati al layout;
- sitemap, robots e manifest presenti;
- nessun rendering dinamico forzato senza motivo.

## Stability profile

Il profilo stabilità è definito in:

`src/config/stability-profile.ts`

Contiene:

- file runtime obbligatori;
- feature foundation richieste;
- pattern runtime vietati;
- regole di stabilità.

## Verifica automatica

Il controllo principale è:

`pnpm verify:stability`

Viene eseguito anche dentro:

`pnpm check:full`.

## Regola

Ogni nuova funzionalità deve poter essere aggiunta senza rendere fragile la base madre.
