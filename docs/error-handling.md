# Error Handling

## Obiettivo

Site Foundation deve includere una gestione base degli errori, per evitare pagine rotte o messaggi tecnici non controllati.

## File creati

- src/app/not-found.tsx
- src/app/error.tsx

## Pagina 404

La pagina not-found gestisce percorsi inesistenti.

Nei progetti derivati dovra essere personalizzata in base al tono del sito reale, ma la struttura base deve gia essere presente.

## Pagina errore

La pagina error gestisce errori runtime dentro App Router.

Regole:

- non mostrare dettagli sensibili all'utente finale
- mostrare un messaggio chiaro
- permettere un tentativo di reset
- nei progetti reali collegare monitoraggio errori se necessario

## Sicurezza

Non mostrare stack trace o dati tecnici sensibili nelle pagine pubbliche.

## Progetti reali

Nei siti derivati valutare:

- logging errori
- monitoraggio errori
- alert in caso di problemi gravi
- pagina manutenzione se necessaria
