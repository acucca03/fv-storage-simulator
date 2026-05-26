# Performance e stabilità — Base Madre Ultimate

La Base Madre Ultimate deve restare veloce, stabile e leggera anche mentre cresce.

## Strategia

La foundation segue questi principi:

- static-first;
- server components by default;
- client JavaScript minimo;
- nessuna libreria pesante non necessaria;
- immagini ottimizzate;
- layout stabile;
- controlli automatici prima di ogni avanzamento.

## Performance profile

Il profilo performance è definito in:

`src/config/performance-profile.ts`

Contiene:

- budget dimensione sorgente;
- budget cartella public;
- limite file sorgente;
- client component consentiti;
- dipendenze vietate;
- pattern browser/client vietati nei server component.

## Verifica automatica

Il controllo principale è:

`pnpm verify:performance`

Il controllo viene eseguito anche dentro:

`pnpm check:full`

## Regola

Una base madre professionale non deve diventare pesante per sembrare premium.

La qualità deve crescere senza perdere velocità, stabilità e semplicità.
