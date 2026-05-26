# Environment

## Obiettivo

Questo documento definisce come gestire le variabili ambiente nei progetti derivati da Site Foundation.

Site Foundation deve contenere solo esempi, mai segreti reali.

## File previsti

- `.env.example`
- `.env.local`

## Regola principale

Il file `.env.example` puo essere committato.

Il file `.env.local` non deve contenere valori pubblici e non deve essere committato.

## Variabili iniziali

### NEXT_PUBLIC_SITE_URL

Indica l'URL pubblico del progetto.

Esempio locale:

NEXT_PUBLIC_SITE_URL=http://localhost:3000

Esempio progetto reale:

NEXT_PUBLIC_SITE_URL=https://www.nome-sito.it

## Regole sicurezza

- Non inserire API key reali nel codice
- Non committare segreti
- Non mostrare variabili server-side nel client
- Usare prefisso NEXT_PUBLIC solo per dati davvero pubblici
- Documentare ogni nuova variabile in questo file

## Progetti derivati

Ogni progetto reale dovra aggiornare `.env.example` con le proprie variabili previste, ma senza valori sensibili reali.
