# Security

## Obiettivo

Site Foundation deve partire con una mentalita security-first.

La sicurezza completa dipendera dai progetti reali, ma la base deve evitare cattive abitudini.

## Regole base

- Non inserire segreti nel codice
- Non committare file .env con valori reali
- Non esporre chiavi private
- Non creare deploy pubblico di questa base
- Non aggiungere pacchetti non necessari
- Non fidarsi mai dei dati inseriti dagli utenti nei progetti futuri

## Security headers

La base include una configurazione iniziale in `next.config.ts` con header di sicurezza:

- X-DNS-Prefetch-Control
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Questi header non sostituiscono una revisione completa di sicurezza nei progetti reali, ma danno una base migliore rispetto alla configurazione vuota.

## Variabili ambiente

I progetti reali dovranno usare file come:

- .env.local
- .env.example

Il file .env.example puo mostrare i nomi delle variabili, ma mai valori segreti reali.

## Form e input utenti

Quando verranno creati form nei progetti reali, serviranno:

- validazione lato client
- validazione lato server
- protezione spam
- rate limiting
- messaggi errore chiari
- sanitizzazione dove necessaria

## API future

Le API dei progetti reali dovranno avere:

- validazione input
- gestione errori
- rate limiting
- logging
- controllo permessi se necessario
- nessuna informazione sensibile nei messaggi di errore pubblici

## Dipendenze

Prima di aggiungere una libreria chiedersi:

- serve davvero?
- e mantenuta?
- e pesante?
- introduce rischi inutili?
- si puo fare con codice semplice?

## Repository

Il repository site-foundation deve restare privato.

I progetti reali potranno avere repository separati, pubblici o privati in base al caso.
