# Verifica finale

Prima di considerare pronta la base madre 2.0.0, devono passare tutti i controlli.

## Comando principale

pnpm check:full

## Controlli inclusi

- pnpm check
- pnpm verify:structure
- pnpm verify:performance
- pnpm verify:security
- pnpm verify:accessibility
- pnpm verify:release

## Build

Eseguire anche:

pnpm build

La homepage deve restare prerenderizzata come contenuto statico.

## Git

Dopo la verifica:

git status

Il working tree deve essere pulito dopo il commit.

## Stato atteso

La base 2.0.0 è pronta solo se:

- build passa;
- lint passa;
- TypeScript passa;
- struttura passa;
- performance passa;
- sicurezza passa;
- accessibilità passa;
- release passa;
- GitHub è aggiornato.
