# Performance budget

La base madre 2.0.0 deve essere progettata per essere ultra veloce, soprattutto su mobile.

## Principi

- Preferire pagine statiche quando possibile.
- Evitare dipendenze non necessarie.
- Limitare il JavaScript client.
- Ottimizzare immagini e font.
- Evitare layout shift.
- Caricare prima il contenuto essenziale.
- Rimandare tutto ciò che non serve al primo rendering.
- Non inserire tracking, slider, animazioni pesanti o librerie UI complesse nella base madre.

## Target

| Metrica | Target minimo | Target interno |
| --- | --- | --- |
| LCP | ≤ 2.5s | ≤ 1.8s |
| INP | ≤ 200ms | ≤ 100ms |
| CLS | ≤ 0.1 | ≤ 0.05 |
| JS iniziale | minimo indispensabile | nessun client JS non necessario |
| Rendering | statico dove possibile | homepage prerenderizzata |
| Lighthouse Performance | 90+ | 95+ |

## Controlli

Eseguire questi comandi:

- pnpm check
- pnpm build
- pnpm verify:performance
- pnpm check:full

## Regola

Se una funzionalità rende la base più pesante senza un vantaggio chiaro, non entra nella 2.0.0.
