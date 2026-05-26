# Quality Gates

La Base Madre Ultimate deve superare controlli automatici prima di ogni avanzamento importante.

## Gate obbligatori

### Check generale

pnpm check

Verifica lint, TypeScript e controlli base.

### Build

pnpm build

Verifica che il progetto possa essere compilato correttamente.

### Check completo

pnpm check:full

Verifica completa della foundation.

## Gate specialistici

Quando il blocco tocca aree specifiche, devono passare anche i relativi controlli:

pnpm verify:performance
pnpm verify:security
pnpm verify:accessibility
pnpm verify:release

## Regola

Se un gate fallisce, il blocco non è completato.

Non si committa codice rotto.
