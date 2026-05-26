# Operations — Base Madre Ultimate

Questo documento raccoglie le operazioni principali per usare, controllare e mantenere la Base Madre Ultimate.

## Stato progetto

Prima di iniziare qualunque modifica:

    git status
    git branch --show-current

Il branch di lavoro per la release Ultimate è:

    foundation-v3

## Controllo rapido

    pnpm health

## Controllo completo

    pnpm check:full

## Comandi principali

Sviluppo:

    pnpm dev

Build:

    pnpm build

Lint e build:

    pnpm check

Verifica release:

    pnpm release:check

## Regola operativa

Non iniziare un nuovo blocco se il working tree non è pulito.

Non fare commit se i controlli automatici non passano.

Non fare push se il commit contiene modifiche non coerenti con il blocco.
