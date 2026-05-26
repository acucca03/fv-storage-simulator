# Sicurezza e privacy v2

La base madre 2.0.0 include una fondazione tecnica per sicurezza e privacy.

## Obiettivi

- Applicare header di sicurezza di base.
- Ridurre la superficie d'attacco.
- Evitare segreti nel codice.
- Predisporre validazioni per form.
- Documentare le regole di gestione dati.
- Evitare tracking e script esterni di default.
- Mantenere la base statica e veloce quando possibile.

## Header previsti

- X-DNS-Prefetch-Control
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Content-Security-Policy
- Cross-Origin-Opener-Policy
- X-Permitted-Cross-Domain-Policies
- Origin-Agent-Cluster

## Validazione

Il file src/lib/validation.ts contiene utility base per:

- email;
- nome;
- messaggio;
- limiti di lunghezza;
- testo semplice.

## Regole privacy

La base non deve raccogliere dati personali inutili.

Per ogni sito derivato bisogna configurare:

- privacy policy reale;
- cookie policy reale;
- eventuale gestione consenso;
- finalità dei form;
- tempi di conservazione;
- strumenti terzi usati;
- responsabili esterni, se presenti.

## Pagamenti

La base non deve gestire direttamente dati di carta.

Per pagamenti futuri bisogna usare provider esterni affidabili e non salvare dati sensibili nel sito.

## Verifica

Comando:

pnpm verify:security

Verifica completa:

pnpm check:full
